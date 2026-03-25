import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  usageLimit: number;
  usedCount: number;
  expiresAt?: Date;
  creator?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
export default Coupon;
