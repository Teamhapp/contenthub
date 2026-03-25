import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDownload extends Document {
  user: mongoose.Types.ObjectId;
  content: mongoose.Types.ObjectId;
  createdAt: Date;
}

const DownloadSchema = new Schema<IDownload>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: Schema.Types.ObjectId, ref: "Content", required: true },
  },
  { timestamps: true }
);

DownloadSchema.index({ content: 1 });
DownloadSchema.index({ user: 1 });

const Download: Model<IDownload> =
  mongoose.models.Download || mongoose.model<IDownload>("Download", DownloadSchema);
export default Download;
