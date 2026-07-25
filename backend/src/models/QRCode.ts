import mongoose, { Schema, Document } from 'mongoose';

export interface IQRCode extends Document {
  creator: mongoose.Types.ObjectId;
  campaign?: mongoose.Types.ObjectId;
  landingPage?: mongoose.Types.ObjectId;
  name: string;
  brandName: string;
  description?: string;
  shortCode: string; // Unique ID for short URL /r/:shortCode
  destinationType: 'website' | 'landing_page' | 'pdf' | 'video' | 'google_form' | 'contact_card' | 'whatsapp' | 'instagram' | 'facebook' | 'linkedin';
  destinationUrl: string;
  status: 'active' | 'paused' | 'expired';
  isFavorite: boolean;
  tags: string[];
  category: string;
  notes?: string;
  
  // Expiry & Constraints
  expiryDate?: Date;
  maxScanLimit?: number;
  passwordProtection?: string;
  
  // Customization & Branding
  fgColor: string;
  bgColor: string;
  frameStyle: 'square' | 'dots' | 'rounded' | 'gradient' | 'bordered';
  logoUrl?: string;
  qrSize: number;
  
  // Aggregated Counters
  totalScans: number;
  uniqueVisitors: number;
  manualConversions: number; // for conversion rate tracking
  downloadCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const QRCodeSchema: Schema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    landingPage: { type: Schema.Types.ObjectId, ref: 'LandingPage' },
    name: { type: String, required: true },
    brandName: { type: String, required: true },
    description: { type: String, default: '' },
    shortCode: { type: String, required: true, unique: true, index: true },
    destinationType: {
      type: String,
      enum: ['website', 'landing_page', 'pdf', 'video', 'google_form', 'contact_card', 'whatsapp', 'instagram', 'facebook', 'linkedin'],
      default: 'website'
    },
    destinationUrl: { type: String, required: true },
    status: { type: String, enum: ['active', 'paused', 'expired'], default: 'active' },
    isFavorite: { type: Boolean, default: false },
    tags: [{ type: String }],
    category: { type: String, default: 'General' },
    notes: { type: String, default: '' },

    expiryDate: { type: Date },
    maxScanLimit: { type: Number, default: 0 },
    passwordProtection: { type: String, default: '' },

    fgColor: { type: String, default: '#000000' },
    bgColor: { type: String, default: '#FFFFFF' },
    frameStyle: { type: String, enum: ['square', 'dots', 'rounded', 'gradient', 'bordered'], default: 'square' },
    logoUrl: { type: String, default: '' },
    qrSize: { type: Number, default: 300 },

    totalScans: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    manualConversions: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model<IQRCode>('QRCode', QRCodeSchema);
