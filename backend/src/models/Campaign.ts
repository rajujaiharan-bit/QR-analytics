import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  creator: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  description?: string;
  category: string; // e.g. Bottle Print, Packaging, Flyer, Billboard, Social
  budget: number;
  totalCost: number;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'paused';
  targetAudience?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Product Packaging' },
    budget: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
    targetAudience: { type: String, default: 'General Consumers' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
