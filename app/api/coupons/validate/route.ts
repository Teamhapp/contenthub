import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { code, totalAmount } = await req.json();

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.round(totalAmount * (coupon.value / 100));
    } else {
      discount = Math.min(coupon.value, totalAmount);
    }

    return NextResponse.json({
      valid: true,
      discount,
      couponId: coupon._id,
      type: coupon.type,
      value: coupon.value,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
