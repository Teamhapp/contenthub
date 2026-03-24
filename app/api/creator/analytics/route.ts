import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Content from "@/models/Content";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "creator" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const creatorId = new mongoose.Types.ObjectId(session.user.id);

    const contentStats = await Content.aggregate([
      { $match: { creator: creatorId } },
      {
        $group: {
          _id: null,
          totalContent: { $sum: 1 },
          publishedContent: { $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] } },
          totalSales: { $sum: "$totalSales" },
          totalRevenue: { $sum: "$totalRevenue" },
          totalViews: { $sum: "$viewCount" },
        },
      },
    ]);

    const recentSales = await Transaction.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "contents",
          localField: "items.content",
          foreignField: "_id",
          as: "contentInfo",
        },
      },
      { $unwind: "$contentInfo" },
      { $match: { "contentInfo.creator": creatorId, status: "completed" } },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $project: {
          contentTitle: "$contentInfo.title",
          price: "$items.price",
          creatorShare: "$items.creatorShare",
          date: "$createdAt",
        },
      },
    ]);

    const topContent = await Content.find({ creator: session.user.id })
      .sort({ totalSales: -1 })
      .limit(5)
      .select("title totalSales totalRevenue type");

    const stats = contentStats[0] || {
      totalContent: 0,
      publishedContent: 0,
      totalSales: 0,
      totalRevenue: 0,
      totalViews: 0,
    };

    return NextResponse.json({ stats, recentSales, topContent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
