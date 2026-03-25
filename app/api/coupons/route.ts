import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "creator" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const { code, type, value, usageLimit, expiresAt } = await req.json();

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      value: type === "fixed" ? Math.round(value * 100) : value,
      usageLimit: usageLimit || 0,
      expiresAt: expiresAt || undefined,
      creator: session.user.id,
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
