import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransactionItem {
  content: mongoose.Types.ObjectId;
  price: number;
  creatorShare: number;
  platformFee: number;
}

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  items: ITransactionItem[];
  totalAmount: number;
  totalPlatformFee: number;
  status: "pending" | "completed" | "failed" | "refunded";
  mockPaymentId: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        content: { type: Schema.Types.ObjectId, ref: "Content", required: true },
        price: { type: Number, required: true },
        creatorShare: { type: Number, required: true },
        platformFee: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    totalPlatformFee: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    mockPaymentId: { type: String },
  },
  { timestamps: true }
);

TransactionSchema.index({ buyer: 1 });
TransactionSchema.index({ status: 1 });

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
