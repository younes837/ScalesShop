import { calculateTierPrice } from "./pricing";

// Cart structure in localStorage:
// {
//   items: [{ productId, quantity }],
//   updatedAt: timestamp
// }

export function getCart() {
  if (typeof window === "undefined") return { items: [] };

  const cart = localStorage.getItem("cart");
  if (!cart) return { items: [] };

  try {
    return JSON.parse(cart);
  } catch (error) {
    console.error("Failed to parse cart:", error);
    return { items: [] };
  }
}

export function addToCart(product, quantity) {
  const cart = getCart();
  const existingItem = cart.items.find((item) => item.productId === product.id);

  // Validate minimum order quantity
  if (quantity < product.minOrderQuantity) {
    throw new Error(`Minimum order quantity is ${product.minOrderQuantity}`);
  }

  // Validate stock availability
  if (quantity > product.stockQuantity) {
    throw new Error(`Only ${product.stockQuantity} items available`);
  }

  if (existingItem) {
    existingItem.quantity = quantity;
  } else {
    cart.items.push({
      productId: product.id,
      quantity: quantity,
    });
  }

  cart.updatedAt = new Date().toISOString();
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart();
  cart.items = cart.items.filter((item) => item.productId !== productId);
  cart.updatedAt = new Date().toISOString();
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
}

export function updateCartItemQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.items.find((item) => item.productId === productId);

  if (item) {
    item.quantity = quantity;
    cart.updatedAt = new Date().toISOString();
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  return cart;
}

export function clearCart() {
  localStorage.removeItem("cart");
  return { items: [] };
}

export async function getCartWithProducts() {
  const cart = getCart();

  // Fetch all products in cart
  const productIds = cart.items.map((item) => item.productId);
  if (productIds.length === 0) return { items: [], total: 0 };

  const response = await fetch(
    "/api/products?" +
      new URLSearchParams({
        ids: productIds.join(","),
      })
  );

  const products = await response.json();

  // Map products to cart items and calculate prices
  const items = cart.items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;

      const pricePerUnit = calculateTierPrice(product, item.quantity);
      return {
        ...item,
        product,
        pricePerUnit,
        subtotal: pricePerUnit * item.quantity,
      };
    })
    .filter(Boolean);

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    items,
    total,
    updatedAt: cart.updatedAt,
  };
}
