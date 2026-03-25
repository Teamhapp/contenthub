import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Content from "@/models/Content";
import Purchase from "@/models/Purchase";
import Transaction from "@/models/Transaction";
import Cart from "@/models/Cart";
import User from "@/models/User";
import { getSettings } from "@/models/PlatformSettings";
import { requireAuthNotBanned } from "@/lib/api-handler";
import { generateMockPaymentId } from "@/lib/utils";
import mongoose from "mongoose";

/**
 * Safe currency split: ensures platformFee + creatorShare === price exactly.
 * Uses floor for platform fee so the creator always gets the benefit of rounding.
 */
function splitRevenue(priceInCents: number, commissionRate: number) {
  const platformFee = Math.floor(priceInCents * commissionRate);
  const creatorShare = priceInCents - platformFee;
  return { platformFee, creatorShare };
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const dbSession = await mongoose.startSession();

  try {
    // Auth + banned check
    const authResult = await requireAuthNotBanned();
    if (authResult instanceof NextResponse) return authResult;
    const { session } = authResult;

    const { contentIds, couponCode } = await req.json();

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

    // Calculate totals using integer math to avoid penny-off errors
    const commissionRate = settings.commissionRate / 100;
    const items = contents.map((c) => {
      // Convert price to cents, split, convert back
      const priceInCents = Math.round(c.price * 100);
      const { platformFee: feeCents, creatorShare: shareCents } = splitRevenue(priceInCents, commissionRate);
      return {
        content: c._id,
        price: c.price,
        creatorShare: shareCents / 100,
        platformFee: feeCents / 100,
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

    // Batch update content stats using bulkWrite instead of individual updates in a loop
    const contentOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.content },
        update: { $inc: { totalSales: 1, totalRevenue: item.creatorShare } },
      },
    }));
    await Content.bulkWrite(contentOps, { session: dbSession });

    // Batch update creator balances — group by creator to minimize writes
    const creatorBalances = new Map<string, number>();
    for (const item of items) {
      const content = contents.find((c) => c._id.toString() === item.content.toString());
      if (content) {
        const creatorId = content.creator.toString();
        creatorBalances.set(creatorId, (creatorBalances.get(creatorId) || 0) + item.creatorShare);
      }
    }
    const userOps = Array.from(creatorBalances.entries()).map(([creatorId, amount]) => ({
      updateOne: {
        filter: { _id: creatorId },
        update: { $inc: { balance: amount } },
      },
    }));
    if (userOps.length > 0) {
      await User.bulkWrite(userOps, { session: dbSession });
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
