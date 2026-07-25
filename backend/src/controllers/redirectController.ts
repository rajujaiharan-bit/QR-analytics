import { Request, Response } from 'express';
import QRCode from '../models/QRCode';
import Scan from '../models/Scan';
import Campaign from '../models/Campaign';
import LandingPage from '../models/LandingPage';
import Notification from '../models/Notification';
import { extractScanMetadata } from '../utils/geoLookup';
import { emitScanEvent } from '../sockets/scanSocket';
import crypto from 'crypto';

export const handleQRRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const isJsonRequest = req.headers['accept']?.includes('application/json') || req.query.json === 'true';

    const qr = await QRCode.findOne({ shortCode }).populate('landingPage');
    if (!qr) {
      if (isJsonRequest) {
        res.status(404).json({ message: 'QR Code not found' });
        return;
      }
      res.status(404).send('<h1>404 - QR Code Not Found</h1><p>The requested QR code does not exist or has been deleted.</p>');
      return;
    }

    // Check status
    if (qr.status === 'paused') {
      if (isJsonRequest) {
        res.status(403).json({ message: 'This QR code campaign is currently paused.' });
        return;
      }
      res.status(403).send('<h1>Campaign Paused</h1><p>This QR Code campaign is temporarily paused by the advertiser.</p>');
      return;
    }

    // Check expiration
    if (qr.expiryDate && new Date() > new Date(qr.expiryDate)) {
      qr.status = 'expired';
      await qr.save();
      if (isJsonRequest) {
        res.status(410).json({ message: 'This QR code has expired.' });
        return;
      }
      res.status(410).send('<h1>QR Code Expired</h1><p>This advertisement campaign expired on ' + new Date(qr.expiryDate).toLocaleDateString() + '</p>');
      return;
    }

    // Check Max Scan Limit
    if (qr.maxScanLimit && qr.maxScanLimit > 0 && qr.totalScans >= qr.maxScanLimit) {
      qr.status = 'expired';
      await qr.save();
      if (isJsonRequest) {
        res.status(410).json({ message: 'Maximum scan limit reached for this QR code.' });
        return;
      }
      res.status(410).send('<h1>Scan Limit Reached</h1><p>This promotional QR code has reached its maximum scan threshold.</p>');
      return;
    }

    // Capture visitor details
    const clientIp = req.headers['x-forwarded-for']
      ? (req.headers['x-forwarded-for'] as string).split(',')[0].trim()
      : req.socket.remoteAddress || '127.0.0.1';
    
    const userAgent = req.headers['user-agent'] || '';
    const referrer = (req.headers['referer'] || req.headers['referrer'] || 'Direct') as string;
    const metadata = extractScanMetadata(clientIp, userAgent);

    // Visitor unique fingerprint hash
    const rawFingerprint = `${clientIp}-${userAgent}-${req.headers['accept-language'] || ''}`;
    const visitorId = crypto.createHash('md5').update(rawFingerprint).digest('hex');

    // Check if unique visitor
    const existingScan = await Scan.findOne({ qrCode: qr._id, visitorId });
    const isUnique = !existingScan;

    // Create Scan document
    const scan = await Scan.create({
      qrCode: qr._id,
      campaign: qr.campaign || undefined,
      visitorId,
      ip: clientIp,
      country: metadata.country,
      state: metadata.state,
      city: metadata.city,
      device: metadata.device,
      browser: metadata.browser,
      os: metadata.os,
      referrer: referrer,
      screenResolution: req.query.res as string || '390x844',
      language: (req.headers['accept-language'] || 'en-US').split(',')[0],
      latitude: metadata.latitude,
      longitude: metadata.longitude,
      timestamp: new Date()
    });

    // Update QRCode counters
    qr.totalScans += 1;
    if (isUnique) {
      qr.uniqueVisitors += 1;
    }
    await qr.save();

    // Check milestones (e.g., 50, 100, 500, 1000 scans)
    if ([10, 50, 100, 500, 1000, 5000].includes(qr.totalScans)) {
      await Notification.create({
        user: qr.creator,
        title: '🎉 Scan Milestone Reached!',
        message: `Your QR Code "${qr.name}" has reached ${qr.totalScans} total scans!`,
        type: 'milestone',
        link: `/qr/${qr._id}`
      });
    }

    // Broadcast WebSocket event
    emitScanEvent({
      qrId: qr._id.toString(),
      qrName: qr.name,
      brandName: qr.brandName,
      totalScans: qr.totalScans,
      city: metadata.city,
      country: metadata.country,
      device: metadata.device,
      timestamp: new Date()
    });

    // Handle redirection or Landing Page rendering
    if (qr.destinationType === 'landing_page') {
      if (isJsonRequest) {
        res.json({
          type: 'landing_page',
          qrName: qr.name,
          landingPage: qr.landingPage
        });
        return;
      }
      // Redirect to frontend landing page view route
      const clientBase = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientBase}/p/${shortCode}`);
      return;
    }

    // Direct URL redirection
    let targetUrl = qr.destinationUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    if (isJsonRequest) {
      res.json({ type: 'website', destinationUrl: targetUrl });
      return;
    }

    res.redirect(302, targetUrl);
  } catch (error: any) {
    res.status(500).json({ message: 'Error processing dynamic QR redirect', error: error.message });
  }
};
