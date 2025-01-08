import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { cart, shippingInfo, paymentMethod } = await request.json();

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: request.user?.id, // If you have authentication
        items: cart,
        shippingInfo,
        paymentMethod,
        status: "pending",
        // Add other relevant fields
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
