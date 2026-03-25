import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBundle extends Document {
  creator: mongoose.Types.ObjectId;
  title: string;
  description: string;
  contents: mongoose.Types.ObjectId[];
  price: number;
  originalPrice: number;
  status: "active" | "inactive";
  totalSales: number;
  createdAt: Date;
  updatedAt: Date;
}

const BundleSchema = new Schema<IBundle>(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    contents: [{ type: Schema.Types.ObjectId, ref: "Content" }],
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    totalSales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BundleSchema.index({ creator: 1 });
BundleSchema.index({ status: 1 });

const Bundle: Model<IBundle> = mongoose.models.Bundle || mongoose.model<IBundle>("Bundle", BundleSchema);
export default Bundle;
