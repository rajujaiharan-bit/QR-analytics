import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import LandingPage from '../models/LandingPage';

export const createLandingPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, brandName, brandLogo, heading, subheading, description, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, bannerImage, backgroundColor, textColor, phoneNumber, email, location, socialLinks } = req.body;

    if (!title || !brandName || !heading || !primaryButtonLink) {
      res.status(400).json({ message: 'Title, Brand Name, Heading, and Primary Button Link are required.' });
      return;
    }

    const page = await LandingPage.create({
      creator: req.user._id,
      title,
      brandName,
      brandLogo: brandLogo || '',
      heading,
      subheading: subheading || '',
      description: description || '',
      primaryButtonText: primaryButtonText || 'Claim Offer',
      primaryButtonLink,
      secondaryButtonText: secondaryButtonText || '',
      secondaryButtonLink: secondaryButtonLink || '',
      bannerImage: bannerImage || '',
      backgroundColor: backgroundColor || '#0F172A',
      textColor: textColor || '#F8FAFC',
      phoneNumber: phoneNumber || '',
      email: email || '',
      location: location || '',
      socialLinks: socialLinks || {}
    });

    res.status(201).json({ message: 'Landing page created successfully', landingPage: page });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating landing page', error: error.message });
  }
};

export const getLandingPages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pages = await LandingPage.find({ creator: req.user._id }).sort({ createdAt: -1 });
    res.json({ landingPages: pages });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching landing pages', error: error.message });
  }
};

export const getLandingPageById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = await LandingPage.findById(req.params.id);
    if (!page) {
      res.status(404).json({ message: 'Landing page not found' });
      return;
    }
    res.json({ landingPage: page });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching landing page', error: error.message });
  }
};

export const updateLandingPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = await LandingPage.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      req.body,
      { new: true }
    );
    if (!page) {
      res.status(404).json({ message: 'Landing page not found' });
      return;
    }
    res.json({ message: 'Landing page updated', landingPage: page });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating landing page', error: error.message });
  }
};

export const deleteLandingPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = await LandingPage.findOneAndDelete({ _id: req.params.id, creator: req.user._id });
    if (!page) {
      res.status(404).json({ message: 'Landing page not found' });
      return;
    }
    res.json({ message: 'Landing page deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting landing page', error: error.message });
  }
};
