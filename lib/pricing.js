export function calculateTierPrice(product, quantity) {
  if (!product.priceTiers?.length) return product.basePrice;

  const applicableTier = product.priceTiers
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find((tier) => quantity >= tier.minQuantity);

  // If no tier is found (quantity is less than smallest tier), use basePrice
  return applicableTier ? applicableTier.pricePerUnit : product.basePrice;
}

export function calculateSavingsPercentage(basePrice, tierPrice) {
  return Math.round(((basePrice - tierPrice) / basePrice) * 100);
}

export function getNextTierQuantity(product, currentQuantity) {
  if (!product.priceTiers?.length) return null;

  const nextTier = product.priceTiers
    .sort((a, b) => a.minQuantity - b.minQuantity)
    .find((tier) => tier.minQuantity > currentQuantity);

  return nextTier?.minQuantity;
}

export function calculateOrderTotal(items, products) {
  return items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);

    // Check minimum order quantity
    if (item.quantity < product.minOrderQuantity) {
      throw new Error(
        `Minimum order quantity for ${product.name} is ${product.minOrderQuantity}`
      );
    }

    // Check stock availability
    if (item.quantity > product.stockQuantity) {
      throw new Error(
        `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`
      );
    }

    const pricePerUnit = calculateTierPrice(product, item.quantity);
    return total + pricePerUnit * item.quantity;
  }, 0);
}
