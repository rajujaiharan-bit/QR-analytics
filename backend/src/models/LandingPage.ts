import mongoose, { Schema, Document } from 'mongoose';

export interface ILandingPage extends Document {
  creator: mongoose.Types.ObjectId;
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
  socialLinks: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    linkedin?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LandingPageSchema: Schema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    brandName: { type: String, required: true },
    brandLogo: { type: String, default: '' },
    heading: { type: String, required: true },
    subheading: { type: String, default: '' },
    description: { type: String, default: '' },
    primaryButtonText: { type: String, default: 'Visit Main Offer' },
    primaryButtonLink: { type: String, required: true },
    secondaryButtonText: { type: String, default: '' },
    secondaryButtonLink: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    backgroundColor: { type: String, default: '#0F172A' },
    textColor: { type: String, default: '#F8FAFC' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    location: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

export default mongoose.model<ILandingPage>('LandingPage', LandingPageSchema);
