import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/authController';
import {
  createQRCode,
  bulkCreateQRCodes,
  getUserQRCodes,
  getQRCodeById,
  updateQRCode,
  duplicateQRCode,
  deleteQRCode,
  recordDownload
} from '../controllers/qrController';
import {
  createCampaign,
  getCampaigns,
  getCampaignROIComparative,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController';
import {
  createLandingPage,
  getLandingPages,
  getLandingPageById,
  updateLandingPage,
  deleteLandingPage
} from '../controllers/landingPageController';
import { getDashboardAnalytics, getSingleQRAnalytics } from '../controllers/analyticsController';
import { getAdminStats, updateUserRole } from '../controllers/adminController';
import { exportScansCSV } from '../controllers/exportController';
import { handleQRRedirect } from '../controllers/redirectController';
import { authenticateJWT, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Dynamic QR Redirection Endpoint
router.get('/r/:shortCode', handleQRRedirect);

// Auth Routes
router.post('/api/auth/register', registerUser);
router.post('/api/auth/login', loginUser);
router.get('/api/auth/profile', authenticateJWT, getProfile);
router.put('/api/auth/profile', authenticateJWT, updateProfile);

// QR Routes
router.post('/api/qr', authenticateJWT, createQRCode);
router.post('/api/qr/bulk', authenticateJWT, bulkCreateQRCodes);
router.get('/api/qr', authenticateJWT, getUserQRCodes);
router.get('/api/qr/:id', authenticateJWT, getQRCodeById);
router.put('/api/qr/:id', authenticateJWT, updateQRCode);
router.post('/api/qr/:id/duplicate', authenticateJWT, duplicateQRCode);
router.delete('/api/qr/:id', authenticateJWT, deleteQRCode);
router.post('/api/qr/:id/download', authenticateJWT, recordDownload);

// Campaign Routes
router.post('/api/campaigns', authenticateJWT, createCampaign);
router.get('/api/campaigns', authenticateJWT, getCampaigns);
router.get('/api/campaigns/roi-comparison', authenticateJWT, getCampaignROIComparative);
router.put('/api/campaigns/:id', authenticateJWT, updateCampaign);
router.delete('/api/campaigns/:id', authenticateJWT, deleteCampaign);

// Landing Page Routes
router.post('/api/landing-pages', authenticateJWT, createLandingPage);
router.get('/api/landing-pages', authenticateJWT, getLandingPages);
router.get('/api/landing-pages/:id', getLandingPageById);
router.put('/api/landing-pages/:id', authenticateJWT, updateLandingPage);
router.delete('/api/landing-pages/:id', authenticateJWT, deleteLandingPage);

// Analytics Routes
router.get('/api/analytics/dashboard', authenticateJWT, getDashboardAnalytics);
router.get('/api/analytics/qr/:id', authenticateJWT, getSingleQRAnalytics);

// Admin Routes
router.get('/api/admin/stats', authenticateJWT, requireAdmin, getAdminStats);
router.put('/api/admin/user/:userId/role', authenticateJWT, requireAdmin, updateUserRole);

// Export Routes
router.get('/api/export/scans/csv', authenticateJWT, exportScansCSV);

export default router;
