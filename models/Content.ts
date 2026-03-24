import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContent extends Document {
  _id: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  body?: string;
  type: "article" | "video" | "file";
  fileUrl?: string;
  thumbnailUrl?: string;
  previewContent?: string;
  price: number;
  category?: mongoose.Types.ObjectId;
  tags: string[];
  status: "draft" | "pending" | "published" | "rejected";
  rejectionReason?: string;
  totalSales: number;
  totalRevenue: number;
  viewCount: number;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true, maxlength: 500 },
    body: { type: String },
    type: { type: String, enum: ["article", "video", "file"], required: true },
    fileUrl: { type: String },
    thumbnailUrl: { type: String },
    previewContent: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ["draft", "pending", "published", "rejected"], default: "draft" },
    rejectionReason: { type: String },
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ContentSchema.index({ title: "text", description: "text", tags: "text" });
ContentSchema.index({ creator: 1 });
ContentSchema.index({ category: 1 });
ContentSchema.index({ status: 1 });
ContentSchema.index({ slug: 1 });

ContentSchema.pre("save", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);
  }
});

const Content: Model<IContent> =
  mongoose.models.Content || mongoose.model<IContent>("Content", ContentSchema);
export default Content;
