import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bundle from "@/models/Bundle";

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
