import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import QRCode from '../models/QRCode';
import Scan from '../models/Scan';

export const exportScansCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userQRs = await QRCode.find({ creator: req.user._id });
    const qrIds = userQRs.map((q) => q._id);

    const scans = await Scan.find({ qrCode: { $in: qrIds } })
      .populate('qrCode', 'name brandName destinationUrl')
      .sort({ timestamp: -1 });

    let csvContent = 'Scan ID,QR Name,Brand Name,Timestamp,IP,Country,City,Device,Browser,OS,Referrer\n';

    scans.forEach((s: any) => {
      const qrName = s.qrCode ? `"${s.qrCode.name}"` : 'Unknown';
      const brand = s.qrCode ? `"${s.qrCode.brandName}"` : 'Unknown';
      csvContent += `${s._id},${qrName},${brand},${s.timestamp.toISOString()},${s.ip},${s.country},${s.city},${s.device},${s.browser},${s.os},${s.referrer}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="qr_scans_report.csv"');
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ message: 'Error exporting CSV report', error: error.message });
  }
};
