import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import WishlistItem from "@/models/Wishlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const items = await WishlistItem.find({ user: session.user.id })
      .populate({
        path: "content",
        select: "title description type price thumbnailUrl averageRating totalSales creator",
        populate: { path: "creator", select: "name image" },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { contentId } = await req.json();

    const existing = await WishlistItem.findOne({ user: session.user.id, content: contentId });
    if (existing) {
      await WishlistItem.findByIdAndDelete(existing._id);
      return NextResponse.json({ wishlisted: false });
    }

    await WishlistItem.create({ user: session.user.id, content: contentId });
    return NextResponse.json({ wishlisted: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
