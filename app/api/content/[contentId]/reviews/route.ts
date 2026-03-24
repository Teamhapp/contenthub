import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Content from "@/models/Content";
import Purchase from "@/models/Purchase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { contentId: string } }) {
  try {
    await dbConnect();
    const reviews = await Review.find({ content: params.contentId })
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { contentId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    // Must have purchased to review
    const purchase = await Purchase.findOne({
      buyer: session.user.id,
      content: params.contentId,
    });
    if (!purchase) {
      return NextResponse.json({ error: "You must purchase this content to review it" }, { status: 403 });
    }

    // Check for existing review
    const existing = await Review.findOne({
      user: session.user.id,
      content: params.contentId,
    });
    if (existing) {
      return NextResponse.json({ error: "You already reviewed this content" }, { status: 400 });
    }

    const { rating, comment } = await req.json();
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const review = await Review.create({
      content: params.contentId,
      user: session.user.id,
      rating,
      comment,
    });

    // Update content average rating
    const allReviews = await Review.find({ content: params.contentId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Content.findByIdAndUpdate(params.contentId, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    const populated = await Review.findById(review._id).populate("user", "name image");
    return NextResponse.json(populated, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
