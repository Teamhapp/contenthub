import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Content from "@/models/Content";
import Purchase from "@/models/Purchase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { contentId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const content = await Content.findById(params.contentId)
      .populate("creator", "name image");

    if (!content) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Creator can access their own content
    if (content.creator._id.toString() === session.user.id || session.user.role === "admin") {
      return NextResponse.json(content);
    }

    // Check if user has purchased
    const purchase = await Purchase.findOne({
      buyer: session.user.id,
      content: params.contentId,
    });

    if (!purchase) {
      return NextResponse.json({ error: "Not purchased" }, { status: 403 });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
