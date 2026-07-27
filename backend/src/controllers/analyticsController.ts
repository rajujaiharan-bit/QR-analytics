import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import QRCode from '../models/QRCode';
import Scan from '../models/Scan';
import Notification from '../models/Notification';
import { generateAIInsights } from '../utils/aiInsights';
import mongoose from 'mongoose';

const resolveCreatorId = (user: any): mongoose.Types.ObjectId => {
  const candidate = user?._id || user?.id;
  if (candidate && mongoose.Types.ObjectId.isValid(candidate)) {
    return new mongoose.Types.ObjectId(candidate);
  }
  return new mongoose.Types.ObjectId('6a64ba3a3c2264e6611f297e');
};

export const getDashboardAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const creatorId = resolveCreatorId(req.user);

    const userQRs = await QRCode.find({}).sort({ createdAt: -1 });
    const qrIds = userQRs.map((q) => q._id);

    const scans = await Scan.find({}).sort({ timestamp: -1 });

    const totalQRs = userQRs.length;
    const activeQRs = userQRs.filter((q) => q.status === 'active').length;
    const totalScans = scans.length;

    // Time ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayScans = scans.filter((s) => new Date(s.timestamp) >= startOfToday).length;
    const weekScans = scans.filter((s) => new Date(s.timestamp) >= startOfWeek).length;
    const monthScans = scans.filter((s) => new Date(s.timestamp) >= startOfMonth).length;

    // Daily Scan Graph (Last 7 Days)
    const dailyScansMap: { [date: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      dailyScansMap[dateKey] = 0;
    }

    scans.forEach((s) => {
      const dateKey = new Date(s.timestamp).toISOString().split('T')[0];
      if (dailyScansMap[dateKey] !== undefined) {
        dailyScansMap[dateKey] += 1;
      }
    });

    const dailyScanGraph = Object.keys(dailyScansMap).map((date) => ({
      date,
      label: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      scans: dailyScansMap[date]
    }));

    // Device Distribution
    const deviceMap: { [device: string]: number } = {};
    const browserMap: { [browser: string]: number } = {};
    const osMap: { [os: string]: number } = {};

    scans.forEach((s) => {
      const dev = s.device || 'Mobile';
      deviceMap[dev] = (deviceMap[dev] || 0) + 1;

      const br = s.browser || 'Chrome';
      browserMap[br] = (browserMap[br] || 0) + 1;

      const os = s.os || 'iOS';
      osMap[os] = (osMap[os] || 0) + 1;
    });

    const deviceDistribution = Object.entries(deviceMap).length > 0
      ? Object.entries(deviceMap).map(([name, count]) => ({ name, count }))
      : [
          { name: 'Mobile (iOS & Android)', count: Math.max(1, Math.floor(totalScans * 0.75)) },
          { name: 'Desktop & Tablet', count: Math.max(0, Math.floor(totalScans * 0.25)) }
        ];

    const browserDistribution = Object.entries(browserMap).map(([name, count]) => ({ name, count }));
    const osDistribution = Object.entries(osMap).map(([name, count]) => ({ name, count }));

    // Recent Scans
    const recentScans = await Scan.find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('qrCode', 'name brandName destinationUrl');

    // AI Insights
    const aiInsights = generateAIInsights(scans, userQRs);

    // Notifications
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(10);

    res.json({
      summary: {
        totalQRs,
        activeQRs,
        totalScans,
        todayScans,
        weekScans,
        monthScans
      },
      dailyScanGraph,
      deviceDistribution,
      browserDistribution,
      osDistribution,
      topQRCodes: [...userQRs].sort((a, b) => b.totalScans - a.totalScans).slice(0, 5),
      recentScans,
      aiInsights,
      notifications
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error compiling dashboard analytics', error: error.message });
  }
};

export const getSingleQRAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let qr = await QRCode.findById(id).populate('campaign').populate('landingPage');

    if (!qr) {
      res.status(404).json({ message: 'QR Code not found' });
      return;
    }

    const scans = await Scan.find({ qrCode: qr._id }).sort({ timestamp: -1 });

    const totalScans = scans.length;
    const uniqueVisitorsSet = new Set(scans.map((s) => s.visitorId));
    const uniqueVisitors = uniqueVisitorsSet.size;
    const returningVisitors = Math.max(0, totalScans - uniqueVisitors);

    // Hourly Distribution (0-23)
    const hourlyMap: { [hour: number]: number } = {};
    for (let h = 0; h < 24; h++) hourlyMap[h] = 0;
    scans.forEach((s) => {
      const hour = new Date(s.timestamp).getHours();
      hourlyMap[hour] += 1;
    });

    const hourlyGraph = Object.keys(hourlyMap).map((h) => ({
      hour: `${h}:00`,
      scans: hourlyMap[parseInt(h, 10)]
    }));

    // City & Country aggregations
    const cityMap: { [city: string]: number } = {};
    const countryMap: { [country: string]: number } = {};

    scans.forEach((s) => {
      const city = s.city || 'Unknown';
      cityMap[city] = (cityMap[city] || 0) + 1;

      const country = s.country || 'Unknown';
      countryMap[country] = (countryMap[country] || 0) + 1;
    });

    const topCities = Object.entries(cityMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topCountries = Object.entries(countryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // First and Last scan timestamps
    const firstScan = scans.length > 0 ? scans[scans.length - 1].timestamp : null;
    const lastScan = scans.length > 0 ? scans[0].timestamp : null;

    res.json({
      qr,
      metrics: {
        totalScans,
        uniqueVisitors,
        returningVisitors,
        firstScan,
        lastScan,
        avgDailyScans: totalScans > 0 ? (totalScans / 7).toFixed(1) : '0'
      },
      hourlyGraph,
      topCities,
      topCountries,
      scansTable: scans.slice(0, 50)
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching detailed QR analytics', error: error.message });
  }
};
