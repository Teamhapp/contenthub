import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Content from "@/models/Content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Content detail (preview only for non-owners)
export async function GET(req: NextRequest, { params }: { params: { contentId: string } }) {
  try {
    await dbConnect();
    const content = await Content.findById(params.contentId)
      .populate("creator", "name image bio")
      .populate("category", "name slug");

    if (!content) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Increment view count
    content.viewCount += 1;
    await content.save();

    // Don't expose full body/fileUrl in detail view - that's behind /access
    const obj = content.toObject();
    delete obj.body;
    delete obj.fileUrl;

    return NextResponse.json(obj);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - Update content (creator owner or admin)
export async function PATCH(req: NextRequest, { params }: { params: { contentId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const content = await Content.findById(params.contentId);
    if (!content) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (content.creator.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates = await req.json();
    // Reset to pending if content is being edited and was published
    if (content.status === "published" && session.user.role !== "admin") {
      updates.status = "pending";
    }

    const updated = await Content.findByIdAndUpdate(params.contentId, updates, { new: true });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: { params: { contentId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const content = await Content.findById(params.contentId);
    if (!content) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (content.creator.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Content.findByIdAndDelete(params.contentId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
