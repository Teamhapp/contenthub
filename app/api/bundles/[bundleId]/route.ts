import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bundle from "@/models/Bundle";
import Content from "@/models/Content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { bundleId: string } }) {
  try {
    await dbConnect();
    const bundle = await Bundle.findById(params.bundleId)
      .populate("creator", "name image")
      .populate("contents", "title description type price thumbnailUrl averageRating");

    if (!bundle) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(bundle);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { bundleId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "creator" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const bundle = await Bundle.findById(params.bundleId);
    if (!bundle) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (bundle.creator.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    // If updating contents, verify ownership and recalculate originalPrice
    if (body.contentIds) {
      const contents = await Content.find({ _id: { $in: body.contentIds }, creator: session.user.id });
      if (contents.length !== body.contentIds.length) {
        return NextResponse.json({ error: "Invalid content selection" }, { status: 400 });
      }
      bundle.contents = body.contentIds;
      bundle.originalPrice = contents.reduce((sum: number, c: any) => sum + c.price, 0);
    }

    if (body.title !== undefined) bundle.title = body.title;
    if (body.description !== undefined) bundle.description = body.description;
    if (body.price !== undefined) bundle.price = Math.round(body.price * 100);
    if (body.status !== undefined) bundle.status = body.status;

    await bundle.save();

    const updated = await Bundle.findById(bundle._id)
      .populate("creator", "name image")
      .populate("contents", "title type price thumbnailUrl");

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { bundleId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "creator" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const bundle = await Bundle.findById(params.bundleId);
    if (!bundle) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (bundle.creator.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await bundle.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
