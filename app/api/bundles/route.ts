import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bundle from "@/models/Bundle";
import Content from "@/models/Content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const bundles = await Bundle.find({ status: "active" })
      .populate("creator", "name image")
      .populate("contents", "title type price thumbnailUrl")
      .sort({ createdAt: -1 });

    return NextResponse.json(bundles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "creator" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const { title, description, contentIds, price } = await req.json();

    // Verify all content belongs to this creator
    const contents = await Content.find({ _id: { $in: contentIds }, creator: session.user.id });
    if (contents.length !== contentIds.length) {
      return NextResponse.json({ error: "Invalid content selection" }, { status: 400 });
    }

    const originalPrice = contents.reduce((sum, c) => sum + c.price, 0);

    const bundle = await Bundle.create({
      creator: session.user.id,
      title,
      description,
      contents: contentIds,
      price: Math.round(price * 100),
      originalPrice,
    });

    return NextResponse.json(bundle, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
