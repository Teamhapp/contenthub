import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlatformSettings extends Document {
  commissionRate: number;
  minContentPrice: number;
  maxContentPrice: number;
  updatedAt: Date;
}

const PlatformSettingsSchema = new Schema<IPlatformSettings>(
  {
    commissionRate: { type: Number, default: 15 },
    minContentPrice: { type: Number, default: 100 },
    maxContentPrice: { type: Number, default: 100000 },
  },
  { timestamps: true }
);

const PlatformSettings: Model<IPlatformSettings> =
  mongoose.models.PlatformSettings ||
  mongoose.model<IPlatformSettings>("PlatformSettings", PlatformSettingsSchema);
export default PlatformSettings;

export async function getSettings(): Promise<IPlatformSettings> {
  let settings = await PlatformSettings.findOne();
  if (!settings) {
    settings = await PlatformSettings.create({});
  }
  return settings;
}
