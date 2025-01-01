import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function getImageUrl(path) {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function serializeProduct(product) {
  return {
    ...product,
    basePrice: product.basePrice.toNumber(),
    priceTiers: product.priceTiers?.map((tier) => ({
      ...tier,
      pricePerUnit: tier.pricePerUnit.toNumber(),
    })),
  };
}

export function serializeProducts(products) {
  return products.map(serializeProduct);
}
