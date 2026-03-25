import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Follow from "@/models/Follow";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const followers = await Follow.find({ following: params.userId })
      .populate("follower", "name image")
      .sort({ createdAt: -1 })
      .limit(limit);

    const count = await Follow.countDocuments({ following: params.userId });
    return NextResponse.json({ followers, count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
