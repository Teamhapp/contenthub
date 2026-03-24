import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Cart from "@/models/Cart";
import Purchase from "@/models/Purchase";
import Content from "@/models/Content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const cart = await Cart.findOne({ user: session.user.id }).populate({
      path: "items.content",
      select: "title description type price thumbnailUrl creator status",
      populate: { path: "creator", select: "name" },
    });

    return NextResponse.json(cart || { items: [] });
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

    // Check content exists and is published
    const content = await Content.findById(contentId);
    if (!content || content.status !== "published") {
      return NextResponse.json({ error: "Content not available" }, { status: 400 });
    }

    // Check not already purchased
    const existing = await Purchase.findOne({ buyer: session.user.id, content: contentId });
    if (existing) {
      return NextResponse.json({ error: "Already purchased" }, { status: 400 });
    }

    // Add to cart (upsert)
    let cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      cart = new Cart({ user: session.user.id, items: [] });
    }

    // Check not already in cart
    const inCart = cart.items.some((item: any) => item.content.toString() === contentId);
    if (inCart) {
      return NextResponse.json({ error: "Already in cart" }, { status: 400 });
    }

    cart.items.push({ content: contentId, addedAt: new Date() });
    await cart.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
