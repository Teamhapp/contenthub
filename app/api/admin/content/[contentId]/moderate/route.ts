import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Content from "@/models/Content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { contentId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const { status, rejectionReason } = await req.json();

    if (!["published", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const update: any = { status };
    if (status === "rejected" && rejectionReason) {
      update.rejectionReason = rejectionReason;
    }

    const content = await Content.findByIdAndUpdate(params.contentId, update, { new: true });
    if (!content) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
