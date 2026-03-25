import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Follow from "@/models/Follow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const following = await Follow.find({ follower: session.user.id })
      .populate("following", "name image bio")
      .sort({ createdAt: -1 });

    return NextResponse.json(following);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
