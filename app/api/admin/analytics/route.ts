import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Content from "@/models/Content";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const [totalUsers, totalCreators, totalCustomers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "creator" }),
      User.countDocuments({ role: "customer" }),
    ]);

    const [totalContent, publishedContent, pendingContent] = await Promise.all([
      Content.countDocuments(),
      Content.countDocuments({ status: "published" }),
      Content.countDocuments({ status: "pending" }),
    ]);

    const revenueData = await Transaction.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalPlatformFee: { $sum: "$totalPlatformFee" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    const topCreators = await Content.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: "$creator",
          totalSales: { $sum: "$totalSales" },
          totalRevenue: { $sum: "$totalRevenue" },
          contentCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $unwind: "$creator" },
      {
        $project: {
          name: "$creator.name",
          email: "$creator.email",
          totalSales: 1,
          totalRevenue: 1,
          contentCount: 1,
        },
      },
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, totalPlatformFee: 0, totalTransactions: 0 };

    return NextResponse.json({
      users: { total: totalUsers, creators: totalCreators, customers: totalCustomers },
      content: { total: totalContent, published: publishedContent, pending: pendingContent },
      revenue,
      topCreators,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
