import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "creator" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const coupons = await Coupon.find({ creator: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
