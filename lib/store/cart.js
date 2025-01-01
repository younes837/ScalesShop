import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = product.minOrderQuantity || 1) => {
        console.log("Cart store - Adding item:", { product, quantity });
        if (!product.id || !product.name || !product.basePrice) {
          throw new Error("Invalid product data");
        }

        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        const getPrice = (qty) => {
          const basePrice = Number(product.basePrice);
          if (isNaN(basePrice)) {
            console.error("Invalid base price:", product.basePrice);
            return 0;
          }

          const tier = (product.priceTiers || [])
            .slice()
            .sort((a, b) => a.minQuantity - b.minQuantity)
            .find((tier) => qty >= tier.minQuantity);

          console.log(
            "Finding tier for quantity:",
            qty,
            "Available tiers:",
            product.priceTiers
          );

          let price;
          if (tier) {
            price = Number(tier.pricePerUnit);
            console.log("Using tier price:", { tier, price });
          } else {
            price = basePrice;
            console.log("Using base price:", basePrice);
          }

          if (isNaN(price)) {
            console.error("Invalid price calculation:", { tier, basePrice });
            return basePrice;
          }
          console.log("Calculated price:", { qty, price, tier });
          return price;
        };

        if (existingItem) {
          console.log("Updating existing item");
          const newQuantity = existingItem.quantity + quantity;
          const price = getPrice(newQuantity);
          const updatedItems = items.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: newQuantity,
                  price,
                  basePrice: Number(product.basePrice),
                  priceTiers: product.priceTiers || [],
                }
              : item
          );
          set({ items: updatedItems });
        } else {
          console.log("Adding new item");
          const price = getPrice(quantity);
          const cartItem = {
            id: product.id,
            name: product.name,
            price,
            basePrice: Number(product.basePrice),
            minOrderQuantity: product.minOrderQuantity || 1,
            images: product.images || [],
            priceTiers: product.priceTiers || [],
            quantity,
          };
          set({ items: [...items, cartItem] });
        }
        console.log("Current cart:", get().items);
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === productId);

        if (item) {
          const basePrice = Number(item.basePrice);
          if (isNaN(basePrice)) {
            console.error("Invalid base price:", item.basePrice);
            return;
          }

          const tier = (item.priceTiers || [])
            .slice()
            .sort((a, b) => a.minQuantity - b.minQuantity)
            .find((tier) => quantity >= tier.minQuantity);

          console.log(
            "Finding tier for quantity:",
            quantity,
            "Available tiers:",
            item.priceTiers
          );

          let price;
          if (tier) {
            price = Number(tier.pricePerUnit);
            console.log("Using tier price:", { tier, price });
          } else {
            price = basePrice;
            console.log("Using base price:", basePrice);
          }

          if (isNaN(price)) {
            console.error("Invalid price in updateQuantity:", {
              tier,
              basePrice,
              quantity,
              priceTiers: item.priceTiers,
            });
            return;
          }

          console.log("Updating price:", { quantity, price, tier });

          set({
            items: items.map((i) =>
              i.id === productId
                ? {
                    ...i,
                    quantity,
                    price,
                    priceTiers: item.priceTiers,
                    basePrice,
                  }
                : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      getItemsCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
      getProductCount: () => get().items.length,
    }),
    {
      name: "cart-storage",
    }
  )
);
