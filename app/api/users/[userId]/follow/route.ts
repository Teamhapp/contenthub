import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Follow from "@/models/Follow";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyNewFollower } from "@/lib/notifications";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.id === params.userId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

    await dbConnect();
    const existing = await Follow.findOne({ follower: session.user.id, following: params.userId });
    if (existing) return NextResponse.json({ error: "Already following" }, { status: 400 });

    await Follow.create({ follower: session.user.id, following: params.userId });

    const follower = await User.findById(session.user.id);
    if (follower) await notifyNewFollower(params.userId, follower.name);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    await Follow.findOneAndDelete({ follower: session.user.id, following: params.userId });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();

    const followerCount = await Follow.countDocuments({ following: params.userId });
    const isFollowing = session ? !!(await Follow.findOne({ follower: session.user.id, following: params.userId })) : false;

    return NextResponse.json({ followerCount, isFollowing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
