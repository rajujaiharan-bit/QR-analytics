import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import QRCode from '../models/QRCode';
import Campaign from '../models/Campaign';
import Notification from '../models/Notification';
import { v4 as uuidv4 } from 'uuid';
import qrcodeLib from 'qrcode';

const generateUniqueShortCode = (): string => {
  return uuidv4().substring(0, 8);
};

export const createQRCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      brandName,
      description,
      campaignId,
      landingPageId,
      destinationType,
      destinationUrl,
      expiryDate,
      maxScanLimit,
      passwordProtection,
      fgColor,
      bgColor,
      frameStyle,
      logoUrl,
      qrSize,
      category,
      tags
    } = req.body;

    if (!name || !brandName || !destinationUrl) {
      res.status(400).json({ message: 'Name, Brand Name, and Destination URL are required.' });
      return;
    }

    const shortCode = generateUniqueShortCode();

    const newQR = await QRCode.create({
      creator: req.user._id,
      campaign: campaignId || undefined,
      landingPage: landingPageId || undefined,
      name,
      brandName,
      description: description || '',
      shortCode,
      destinationType: destinationType || 'website',
      destinationUrl,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      maxScanLimit: maxScanLimit ? parseInt(maxScanLimit, 10) : 0,
      passwordProtection: passwordProtection || '',
      fgColor: fgColor || '#000000',
      bgColor: bgColor || '#FFFFFF',
      frameStyle: frameStyle || 'square',
      logoUrl: logoUrl || '',
      qrSize: qrSize ? parseInt(qrSize, 10) : 300,
      category: category || 'General Packaging',
      tags: tags || []
    });

    await Notification.create({
      user: req.user._id,
      title: '✨ QR Code Generated',
      message: `Dynamic QR Code "${newQR.name}" created for brand ${newQR.brandName}.`,
      type: 'qr_created',
      link: `/qr/${newQR._id}`
    });

    res.status(201).json({ message: 'QR Code generated successfully', qr: newQR });
  } catch (error: any) {
    res.status(500).json({ message: 'Error generating QR Code', error: error.message });
  }
};

export const bulkCreateQRCodes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items } = req.body; // Array of QR objects
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Items array is required for bulk generation' });
      return;
    }

    const createdList = [];
    for (const item of items) {
      const shortCode = generateUniqueShortCode();
      const qr = await QRCode.create({
        creator: req.user._id,
        name: item.name || 'Bulk QR',
        brandName: item.brandName || 'Brand',
        destinationUrl: item.destinationUrl || 'https://example.com',
        shortCode,
        category: item.category || 'Bulk Upload',
        fgColor: item.fgColor || '#000000',
        bgColor: item.bgColor || '#FFFFFF'
      });
      createdList.push(qr);
    }

    res.status(201).json({ message: `Successfully generated ${createdList.length} QR codes`, qrs: createdList });
  } catch (error: any) {
    res.status(500).json({ message: 'Error performing bulk QR creation', error: error.message });
  }
};

export const getUserQRCodes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, category, status, campaignId, isFavorite } = req.query;

    const query: any = { creator: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brandName: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;
    if (campaignId) query.campaign = campaignId;
    if (isFavorite === 'true') query.isFavorite = true;

    const qrs = await QRCode.find(query).sort({ createdAt: -1 }).populate('campaign', 'name brand');
    res.json({ qrs, total: qrs.length });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching QR codes', error: error.message });
  }
};

export const getQRCodeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const qr = await QRCode.findOne({ _id: req.params.id, creator: req.user._id })
      .populate('campaign')
      .populate('landingPage');

    if (!qr) {
      res.status(404).json({ message: 'QR Code not found' });
      return;
    }

    res.json({ qr });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching QR Code details', error: error.message });
  }
};

export const updateQRCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const qr = await QRCode.findOne({ _id: req.params.id, creator: req.user._id });
    if (!qr) {
      res.status(404).json({ message: 'QR Code not found' });
      return;
    }

    const fieldsToUpdate = [
      'name',
      'brandName',
      'description',
      'destinationType',
      'destinationUrl',
      'status',
      'isFavorite',
      'tags',
      'category',
      'notes',
      'expiryDate',
      'maxScanLimit',
      'fgColor',
      'bgColor',
      'frameStyle',
      'logoUrl',
      'qrSize',
      'campaign',
      'landingPage',
      'manualConversions'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        (qr as any)[field] = req.body[field];
      }
    });

    await qr.save();
    res.json({ message: 'Dynamic QR updated successfully', qr });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating QR code', error: error.message });
  }
};

export const duplicateQRCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const originalQR = await QRCode.findOne({ _id: req.params.id, creator: req.user._id });
    if (!originalQR) {
      res.status(404).json({ message: 'Original QR Code not found' });
      return;
    }

    const shortCode = generateUniqueShortCode();
    const duplicated = await QRCode.create({
      creator: req.user._id,
      campaign: originalQR.campaign,
      landingPage: originalQR.landingPage,
      name: `${originalQR.name} (Copy)`,
      brandName: originalQR.brandName,
      description: originalQR.description,
      shortCode,
      destinationType: originalQR.destinationType,
      destinationUrl: originalQR.destinationUrl,
      fgColor: originalQR.fgColor,
      bgColor: originalQR.bgColor,
      frameStyle: originalQR.frameStyle,
      logoUrl: originalQR.logoUrl,
      category: originalQR.category,
      tags: originalQR.tags
    });

    res.status(201).json({ message: 'QR Code duplicated successfully', qr: duplicated });
  } catch (error: any) {
    res.status(500).json({ message: 'Error duplicating QR Code', error: error.message });
  }
};

export const deleteQRCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const qr = await QRCode.findOneAndDelete({ _id: req.params.id, creator: req.user._id });
    if (!qr) {
      res.status(404).json({ message: 'QR Code not found' });
      return;
    }

    await Notification.create({
      user: req.user._id,
      title: '🗑️ QR Code Removed',
      message: `QR Code "${qr.name}" has been deleted.`,
      type: 'qr_deleted'
    });

    res.json({ message: 'QR Code deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting QR Code', error: error.message });
  }
};

export const recordDownload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const qr = await QRCode.findOne({ _id: req.params.id, creator: req.user._id });
    if (qr) {
      qr.downloadCount += 1;
      await qr.save();
    }
    res.json({ success: true, downloadCount: qr ? qr.downloadCount : 0 });
  } catch (error: any) {
    res.status(500).json({ message: 'Error recording download stats' });
  }
};
