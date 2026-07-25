export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  company?: string;
  phone?: string;
  businessType?: string;
  profilePhoto?: string;
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due';
  };
}

export interface Campaign {
  _id: string;
  name: string;
  brand: string;
  description?: string;
  category: string;
  budget: number;
  totalCost: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused';
  targetAudience?: string;
  notes?: string;
  totalQRs?: number;
  totalScans?: number;
  uniqueVisitors?: number;
  manualConversions?: number;
  conversionRate?: number;
  costPerScan?: number;
  costPerUniqueVisitor?: number;
  performanceScore?: number;
}

export interface LandingPage {
  _id: string;
  title: string;
  brandName: string;
  brandLogo?: string;
  heading: string;
  subheading?: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  bannerImage?: string;
  backgroundColor: string;
  textColor: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface QRCodeItem {
  _id: string;
  name: string;
  brandName: string;
  description?: string;
  shortCode: string;
  destinationType: 'website' | 'landing_page' | 'pdf' | 'video' | 'google_form' | 'contact_card' | 'whatsapp' | 'instagram' | 'facebook' | 'linkedin';
  destinationUrl: string;
  status: 'active' | 'paused' | 'expired';
  isFavorite: boolean;
  tags: string[];
  category: string;
  notes?: string;
  expiryDate?: string;
  maxScanLimit?: number;
  fgColor: string;
  bgColor: string;
  frameStyle: 'square' | 'dots' | 'rounded' | 'gradient' | 'bordered';
  logoUrl?: string;
  qrSize: number;
  totalScans: number;
  uniqueVisitors: number;
  manualConversions: number;
  downloadCount: number;
  campaign?: Campaign;
  landingPage?: LandingPage;
  createdAt: string;
  updatedAt: string;
}

export interface ScanRecord {
  _id: string;
  qrCode: string | { _id: string; name: string; brandName: string; destinationUrl: string };
  ip: string;
  country: string;
  state: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  referrer: string;
  screenResolution: string;
  language: string;
  timestamp: string;
}

export interface AIInsightItem {
  id: string;
  type: 'peak_time' | 'device_trend' | 'location_spike' | 'growth' | 'roi_tip';
  title: string;
  message: string;
  impactScore: number;
  metric: string;
}

export interface ROIComparisonItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  budget: number;
  totalCost: number;
  qrCount: number;
  totalScans: number;
  uniqueVisitors: number;
  manualConversions: number;
  conversionRate: number;
  costPerScan: number;
  reachRating: string;
}
