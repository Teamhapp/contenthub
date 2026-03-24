import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Purchase from "@/models/Purchase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const purchases = await Purchase.find({ buyer: session.user.id })
      .populate({
        path: "content",
        select: "title type thumbnailUrl slug creator",
        populate: { path: "creator", select: "name" },
      })
      .populate("transaction", "mockPaymentId totalAmount createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json(purchases);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
