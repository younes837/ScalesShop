import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const orderData = await request.json();
    const message = formatWhatsAppMessage(orderData);
    const whatsappUrl = `https://wa.me/${
      process.env.BUSINESS_PHONE
    }?text=${encodeURIComponent(message)}`;

    return NextResponse.json({ success: true, whatsappUrl });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}

function formatWhatsAppMessage(orderData) {
  const { cart, shippingInfo, subtotal, delivery, tax, discount, total } =
    orderData;

  const itemsList = cart
    .map(
      (item) =>
        `• ${item.name} (Size: ${item.size}) x${item.quantity} - MAD${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join("\n");

  return `🛍️ *New Order*\n
*Customer Details:*
Name: ${shippingInfo.firstName} ${shippingInfo.lastName}
Email: ${shippingInfo.email}
Phone: ${shippingInfo.phone}
Address: ${shippingInfo.address}${
    shippingInfo.apt ? `, ${shippingInfo.apt}` : ""
  }
${shippingInfo.city}, ${shippingInfo.country} ${shippingInfo.postalCode}

*Order Summary:*
${itemsList}

*Total Details:*
Subtotal: MAD${subtotal.toFixed(2)}
Delivery: MAD${delivery.toFixed(2)}
Tax: MAD${tax.toFixed(2)}
${discount > 0 ? `Discount: -MAD${discount.toFixed(2)}\n` : ""}
*Total Amount: MAD${total.toFixed(2)}*`;
}
