import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Content from "@/models/Content";
import Purchase from "@/models/Purchase";
import Transaction from "@/models/Transaction";
import Cart from "@/models/Cart";
import User from "@/models/User";
import { getSettings } from "@/models/PlatformSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateMockPaymentId } from "@/lib/utils";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const dbSession = await mongoose.startSession();

  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { contentIds } = await req.json();

    let itemIds: string[] = contentIds || [];

    // If no contentIds provided, use cart
    if (!itemIds.length) {
      const cart = await Cart.findOne({ user: session.user.id });
      if (!cart || cart.items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }
      itemIds = cart.items.map((item: any) => item.content.toString());
    }

    const settings = await getSettings();

    dbSession.startTransaction();

    // Validate all items
    const contents = await Content.find({
      _id: { $in: itemIds },
      status: "published",
    });

    if (contents.length !== itemIds.length) {
      await dbSession.abortTransaction();
      return NextResponse.json({ error: "Some content is no longer available" }, { status: 400 });
    }

    // Check none already purchased
    const existingPurchases = await Purchase.find({
      buyer: session.user.id,
      content: { $in: itemIds },
    });

    if (existingPurchases.length > 0) {
      await dbSession.abortTransaction();
      return NextResponse.json({ error: "Some content already purchased" }, { status: 400 });
    }

    // Calculate totals
    const commissionRate = settings.commissionRate / 100;
    const items = contents.map((c) => {
      const platformFee = Math.round(c.price * commissionRate);
      return {
        content: c._id,
        price: c.price,
        creatorShare: c.price - platformFee,
        platformFee,
      };
    });

    const totalAmount = items.reduce((sum, i) => sum + i.price, 0);
    const totalPlatformFee = items.reduce((sum, i) => sum + i.platformFee, 0);

    // Create transaction
    const transaction = await Transaction.create(
      [
        {
          buyer: session.user.id,
          items,
          totalAmount,
          totalPlatformFee,
          status: "completed",
          mockPaymentId: generateMockPaymentId(),
        },
      ],
      { session: dbSession }
    );

    // Create purchase records
    const purchases = items.map((item) => ({
      buyer: session.user.id,
      content: item.content,
      transaction: transaction[0]._id,
      price: item.price,
    }));

    await Purchase.create(purchases, { session: dbSession });

    // Update content stats and creator balances
    for (const item of items) {
      await Content.findByIdAndUpdate(
        item.content,
        { $inc: { totalSales: 1, totalRevenue: item.creatorShare } },
        { session: dbSession }
      );

      const content = contents.find((c) => c._id.toString() === item.content.toString());
      if (content) {
        await User.findByIdAndUpdate(
          content.creator,
          { $inc: { balance: item.creatorShare } },
          { session: dbSession }
        );
      }
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: session.user.id },
      { $set: { items: [] } },
      { session: dbSession }
    );

    await dbSession.commitTransaction();

    return NextResponse.json({
      success: true,
      transactionId: transaction[0]._id,
      totalAmount,
    });
  } catch (error: any) {
    await dbSession.abortTransaction();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    dbSession.endSession();
  }
}
