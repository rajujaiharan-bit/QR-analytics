import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Campaign from '../models/Campaign';
import QRCode from '../models/QRCode';
import Scan from '../models/Scan';

export const createCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, brand, description, category, budget, totalCost, startDate, endDate, targetAudience, notes } = req.body;

    if (!name || !brand) {
      res.status(400).json({ message: 'Campaign Name and Brand are required' });
      return;
    }

    const campaign = await Campaign.create({
      creator: req.user._id,
      name,
      brand,
      description: description || '',
      category: category || 'Bottle Print',
      budget: budget ? parseFloat(budget) : 0,
      totalCost: totalCost ? parseFloat(totalCost) : budget ? parseFloat(budget) : 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      targetAudience: targetAudience || 'General Audience',
      notes: notes || ''
    });

    res.status(201).json({ message: 'Campaign created successfully', campaign });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating campaign', error: error.message });
  }
};

export const getCampaigns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaigns = await Campaign.find({ creator: req.user._id }).sort({ createdAt: -1 });

    // Aggregate ROI metrics for each campaign
    const enrichedCampaigns = await Promise.all(
      campaigns.map(async (c) => {
        const qrs = await QRCode.find({ campaign: c._id });
        const qrIds = qrs.map((q) => q._id);
        const scans = await Scan.find({ campaign: c._id });

        const totalScans = scans.length;
        const uniqueVisitorsSet = new Set(scans.map((s) => s.visitorId));
        const uniqueVisitors = uniqueVisitorsSet.size;

        const manualConversions = qrs.reduce((acc, q) => acc + (q.manualConversions || 0), 0);
        const conversionRate = totalScans > 0 ? ((manualConversions / totalScans) * 100).toFixed(1) : '0.0';

        const costPerScan = totalScans > 0 ? (c.totalCost / totalScans).toFixed(2) : c.totalCost.toFixed(2);
        const costPerUniqueVisitor = uniqueVisitors > 0 ? (c.totalCost / uniqueVisitors).toFixed(2) : '0.00';

        // Campaign performance score (0-100)
        let performanceScore = 60;
        if (totalScans > 100) performanceScore += 15;
        if (uniqueVisitors > 50) performanceScore += 10;
        if (parseFloat(conversionRate) > 5) performanceScore += 15;
        performanceScore = Math.min(100, performanceScore);

        return {
          ...c.toObject(),
          totalQRs: qrs.length,
          totalScans,
          uniqueVisitors,
          manualConversions,
          conversionRate: parseFloat(conversionRate),
          costPerScan: parseFloat(costPerScan),
          costPerUniqueVisitor: parseFloat(costPerUniqueVisitor),
          performanceScore
        };
      })
    );

    res.json({ campaigns: enrichedCampaigns });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
  }
};

export const getCampaignROIComparative = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaigns = await Campaign.find({ creator: req.user._id });
    
    const comparison = await Promise.all(
      campaigns.map(async (c) => {
        const qrs = await QRCode.find({ campaign: c._id });
        const scans = await Scan.find({ campaign: c._id });

        const totalScans = scans.length;
        const uniqueVisitors = new Set(scans.map((s) => s.visitorId)).size;
        const manualConversions = qrs.reduce((acc, q) => acc + (q.manualConversions || 0), 0);
        const conversionRate = totalScans > 0 ? (manualConversions / totalScans) * 100 : 0;
        const costPerScan = totalScans > 0 ? c.totalCost / totalScans : c.totalCost;

        // Reach rating calculation
        let reachRating = 'Moderate';
        if (totalScans > 500) reachRating = 'Exceptional';
        else if (totalScans > 200) reachRating = 'High';

        return {
          id: c._id,
          name: c.name,
          brand: c.brand,
          category: c.category,
          budget: c.budget,
          totalCost: c.totalCost,
          qrCount: qrs.length,
          totalScans,
          uniqueVisitors,
          manualConversions,
          conversionRate: parseFloat(conversionRate.toFixed(2)),
          costPerScan: parseFloat(costPerScan.toFixed(2)),
          reachRating
        };
      })
    );

    // Identify Best & Worst performing campaigns
    const sorted = [...comparison].sort((a, b) => b.totalScans - a.totalScans);
    const bestCampaign = sorted.length > 0 ? sorted[0] : null;
    const worstCampaign = sorted.length > 1 ? sorted[sorted.length - 1] : null;

    res.json({
      comparison,
      bestCampaign,
      worstCampaign,
      totalCampaigns: comparison.length
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error generating campaign ROI comparison', error: error.message });
  }
};

export const updateCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      req.body,
      { new: true }
    );
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }
    res.json({ message: 'Campaign updated', campaign });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating campaign', error: error.message });
  }
};

export const deleteCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, creator: req.user._id });
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting campaign', error: error.message });
  }
};
