import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: "new_sale" | "new_follower" | "content_approved" | "content_rejected" | "new_review";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["new_sale", "new_follower", "content_approved", "content_rejected", "new_review"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
