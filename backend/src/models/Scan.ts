import mongoose, { Schema, Document } from 'mongoose';

export interface IScan extends Document {
  qrCode: mongoose.Types.ObjectId;
  campaign?: mongoose.Types.ObjectId;
  visitorId: string; // Hash or Cookie string for Unique Visitor detection
  ip: string;
  country: string;
  state: string;
  city: string;
  device: string; // Mobile, Tablet, Desktop
  browser: string;
  os: string;
  referrer: string;
  screenResolution: string;
  language: string;
  connectionType?: string;
  latitude?: number;
  longitude?: number;
  timestamp: Date;
}

const ScanSchema: Schema = new Schema(
  {
    qrCode: { type: Schema.Types.ObjectId, ref: 'QRCode', required: true, index: true },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', index: true },
    visitorId: { type: String, required: true },
    ip: { type: String, default: '127.0.0.1' },
    country: { type: String, default: 'United States' },
    state: { type: String, default: 'California' },
    city: { type: String, default: 'San Francisco' },
    device: { type: String, default: 'Mobile' },
    browser: { type: String, default: 'Chrome' },
    os: { type: String, default: 'iOS' },
    referrer: { type: String, default: 'Direct' },
    screenResolution: { type: String, default: '390x844' },
    language: { type: String, default: 'en-US' },
    connectionType: { type: String, default: '4G' },
    latitude: { type: Number, default: 37.7749 },
    longitude: { type: Number, default: -122.4194 },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IScan>('Scan', ScanSchema);
