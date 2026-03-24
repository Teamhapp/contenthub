import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPurchase extends Document {
  _id: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  content: mongoose.Types.ObjectId;
  transaction: mongoose.Types.ObjectId;
  price: number;
  createdAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: Schema.Types.ObjectId, ref: "Content", required: true },
    transaction: { type: Schema.Types.ObjectId, ref: "Transaction", required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

PurchaseSchema.index({ buyer: 1 });
PurchaseSchema.index({ buyer: 1, content: 1 }, { unique: true });

const Purchase: Model<IPurchase> =
  mongoose.models.Purchase || mongoose.model<IPurchase>("Purchase", PurchaseSchema);
export default Purchase;
