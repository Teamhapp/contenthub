import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWishlistItem extends Document {
  user: mongoose.Types.ObjectId;
  content: mongoose.Types.ObjectId;
  createdAt: Date;
}

const WishlistSchema = new Schema<IWishlistItem>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: Schema.Types.ObjectId, ref: "Content", required: true },
  },
  { timestamps: true }
);

WishlistSchema.index({ user: 1, content: 1 }, { unique: true });
WishlistSchema.index({ user: 1 });

const WishlistItem: Model<IWishlistItem> =
  mongoose.models.WishlistItem || mongoose.model<IWishlistItem>("WishlistItem", WishlistSchema);
export default WishlistItem;
