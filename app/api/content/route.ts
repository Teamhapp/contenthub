import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Content from "@/models/Content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Browse published content (public)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "";
    const sort = searchParams.get("sort") || "newest";

    const status = searchParams.get("status") || "";
    const creator = searchParams.get("creator") || "";
    const admin = searchParams.get("admin") || "";

    // Admin can see all statuses, public only sees published
    const session = admin ? await getServerSession(authOptions) : null;
    const isAdmin = session?.user?.role === "admin";

    const query: any = {};
    if (isAdmin && status) {
      query.status = status;
    } else if (!isAdmin) {
      query.status = "published";
    }

    if (q) {
      query.$text = { $search: q };
    }
    if (category) query.category = category;
    if (type) query.type = type;
    if (creator) query.creator = creator;

    let sortOption: any = { createdAt: -1 };
    if (sort === "price_low") sortOption = { price: 1 };
    else if (sort === "price_high") sortOption = { price: -1 };
    else if (sort === "popular") sortOption = { totalSales: -1 };
    else if (sort === "rating") sortOption = { averageRating: -1 };

    if (q) {
      sortOption = { score: { $meta: "textScore" }, ...sortOption };
    }

    const total = await Content.countDocuments(query);
    const contents = await Content.find(
      query,
      q ? { score: { $meta: "textScore" } } : undefined
    )
      .populate("creator", "name image")
      .populate("category", "name slug")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-body -fileUrl");

    return NextResponse.json({ contents, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create content (creator only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "creator" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const data = await req.json();

    const content = await Content.create({
      ...data,
      creator: session.user.id,
      status: "pending",
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
