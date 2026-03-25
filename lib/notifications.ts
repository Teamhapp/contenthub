import dbConnect from "./db";
import Notification from "@/models/Notification";

type NotificationType = "new_sale" | "new_follower" | "content_approved" | "content_rejected" | "new_review";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export async function createNotification({ userId, type, title, message, link }: CreateNotificationParams) {
  await dbConnect();
  return Notification.create({ user: userId, type, title, message, link });
}

export async function notifyNewSale(creatorId: string, contentTitle: string, amount: number) {
  return createNotification({
    userId: creatorId,
    type: "new_sale",
    title: "New Sale!",
    message: `Someone purchased "${contentTitle}" for $${(amount / 100).toFixed(2)}`,
    link: "/creator/earnings",
  });
}

export async function notifyNewFollower(creatorId: string, followerName: string) {
  return createNotification({
    userId: creatorId,
    type: "new_follower",
    title: "New Follower",
    message: `${followerName} started following you`,
    link: "/creator",
  });
}

export async function notifyContentApproved(creatorId: string, contentTitle: string) {
  return createNotification({
    userId: creatorId,
    type: "content_approved",
    title: "Content Approved",
    message: `"${contentTitle}" has been approved and is now live`,
    link: "/creator/content",
  });
}

export async function notifyContentRejected(creatorId: string, contentTitle: string, reason?: string) {
  return createNotification({
    userId: creatorId,
    type: "content_rejected",
    title: "Content Rejected",
    message: `"${contentTitle}" was rejected${reason ? `: ${reason}` : ""}`,
    link: "/creator/content",
  });
}

export async function notifyNewReview(creatorId: string, contentTitle: string, rating: number) {
  return createNotification({
    userId: creatorId,
    type: "new_review",
    title: "New Review",
    message: `Someone left a ${rating}-star review on "${contentTitle}"`,
    link: "/creator/content",
  });
}
