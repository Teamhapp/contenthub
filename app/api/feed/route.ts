import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Follow from "@/models/Follow";
import Content from "@/models/Content";
import Purchase from "@/models/Purchase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    // Get followed creators
    const following = await Follow.find({ follower: session.user.id }).select("following");
    const followedIds = following.map((f) => f.following);

    // Content from followed creators
    const fromFollowing = followedIds.length > 0
      ? await Content.find({ creator: { $in: followedIds }, status: "published" })
          .populate("creator", "name image")
          .populate("category", "name")
          .sort({ createdAt: -1 })
          .limit(12)
          .select("-body -fileUrl")
      : [];

    // Recommendations based on purchased content categories
    const purchases = await Purchase.find({ buyer: session.user.id }).populate("content", "category");
    const purchasedIds = purchases.map((p) => p.content._id.toString());
    const categoryIds = [...new Set(purchases.map((p: any) => p.content?.category?.toString()).filter(Boolean))];

    const recommended = categoryIds.length > 0
      ? await Content.find({
          category: { $in: categoryIds },
          status: "published",
          _id: { $nin: purchasedIds },
        })
          .populate("creator", "name image")
          .populate("category", "name")
          .sort({ totalSales: -1 })
          .limit(6)
          .select("-body -fileUrl")
      : await Content.find({ status: "published" })
          .populate("creator", "name image")
          .sort({ totalSales: -1 })
          .limit(6)
          .select("-body -fileUrl");

    return NextResponse.json({ fromFollowing, recommended });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
