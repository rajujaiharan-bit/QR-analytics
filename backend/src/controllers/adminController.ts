import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import QRCode from '../models/QRCode';
import Scan from '../models/Scan';
import Campaign from '../models/Campaign';

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQRs = await QRCode.countDocuments();
    const totalScans = await Scan.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();

    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const mostActiveUsers = await QRCode.aggregate([
      { $group: { _id: '$creator', qrCount: { $sum: 1 }, totalScans: { $sum: '$totalScans' } } },
      { $sort: { totalScans: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0 } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalQRs,
        totalScans,
        totalCampaigns,
        storageUsedMB: (totalScans * 0.002 + totalQRs * 0.01 + totalUsers * 0.05).toFixed(2)
      },
      users,
      mostActiveUsers
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error compiling admin statistics', error: error.message });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { role }, { new: true }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User role updated', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};
