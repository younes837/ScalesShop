import { WHATSAPP_CONFIG } from "../config/whatsapp";

export const formatOrderForWhatsApp = (orderData) => {
  const { cart, shippingInfo, subtotal, delivery, tax, discount, total } =
    orderData;

  const orderDetails = cart
    .map(
      (item) =>
        `• ${item.name} (${item.size}) x${item.quantity} - MAD${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join("\n");

  const message = `${WHATSAPP_CONFIG.MESSAGE_TEMPLATE.ORDER_HEADER}\n
${WHATSAPP_CONFIG.MESSAGE_TEMPLATE.CUSTOMER_SECTION}
Name: ${shippingInfo.firstName} ${shippingInfo.lastName}
Email: ${shippingInfo.email}
Phone: ${shippingInfo.phone}
Address: ${shippingInfo.address}${
    shippingInfo.apt ? `, ${shippingInfo.apt}` : ""
  }
${shippingInfo.city}, ${shippingInfo.country} ${shippingInfo.postalCode}

${WHATSAPP_CONFIG.MESSAGE_TEMPLATE.ORDER_SECTION}
${orderDetails}

${WHATSAPP_CONFIG.MESSAGE_TEMPLATE.TOTAL_SECTION}
Subtotal: MAD${subtotal.toFixed(2)}
Delivery: MAD${delivery.toFixed(2)}
Tax: MAD${tax.toFixed(2)}
${discount > 0 ? `Discount: -MAD${discount.toFixed(2)}\n` : ""}
*Total Amount: $${total.toFixed(2)}*`;

  return encodeURIComponent(message);
};

export const sendToWhatsApp = (message) => {
  const url = `https://wa.me/${WHATSAPP_CONFIG.BUSINESS_PHONE}?text=${message}`;
  window.open(url, "_blank");
};
