"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { calculateTierPrice } from "@/lib/pricing";
import { calculateSavingsPercentage } from "@/lib/pricing";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";

const PRESET_QUANTITIES = [5, 10, 20, 30, 50, 100];

export function ProductDetails({ product }) {
  const { addItem } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);
  const [quantity, setQuantity] = useState(product.minOrderQuantity);
  const [inputValue, setInputValue] = useState(
    product.minOrderQuantity.toString()
  );
  const currentPrice = calculateTierPrice(product, quantity);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuantitySelect = (value) => {
    const newQuantity = Math.min(value, product.stockQuantity);
    setQuantity(newQuantity);
    setInputValue(newQuantity.toString());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const parsed = parseInt(value);
    if (!isNaN(parsed)) {
      const newQuantity = Math.min(
        Math.max(parsed, product.minOrderQuantity),
        product.stockQuantity
      );
      setQuantity(newQuantity);
    }
  };

  const handleInputBlur = () => {
    if (!inputValue || isNaN(parseInt(inputValue))) {
      setInputValue(quantity.toString());
    }
  };

  const handleAddToCart = () => {
    try {
      setIsAdding(true);
      const cartItem = {
        id: product.id,
        name: product.name,
        basePrice: product.basePrice,
        minOrderQuantity: product.minOrderQuantity || 1,
        images: product.images || [],
        priceTiers: Array.isArray(product.priceTiers) ? product.priceTiers : [],
      };

      addItem(cartItem, quantity);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTimeout(() => {
        setIsAdding(false);
      }, 200);
    }
  };

  const handleAddToWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-xl font-bold mb-1">{product.name}</h1>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">
            {[1, 2, 3, 4].map((star) => (
              <Star
                key={star}
                className="w-3.5 h-3.5 fill-primary text-primary"
              />
            ))}
            <Star className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">669 reviews</span>
        </div>
      </div>

      {/* Price */}
      <div>
        <span className="text-xl font-bold">{formatPrice(currentPrice)}</span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      {/* Shipping Info */}
      <div className="flex items-center gap-2 text-xs">
        <Truck className="w-3.5 h-3.5" />
        <span>Free shipping and 30 days return</span>
      </div>

      {/* Availability */}
      <div className="py-1">
        <div className="text-xs font-medium">Availability</div>
        <div className="text-xs text-green-600">
          {product.stockQuantity} units in stock
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <label className="text-xs font-medium mb-2 block">Quantity</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
          {PRESET_QUANTITIES.map((preset) => (
            <button
              key={preset}
              onClick={() => handleQuantitySelect(preset)}
              className={cn(
                "h-8 rounded-md border text-xs font-medium transition-colors",
                quantity === preset
                  ? "bg-primary text-primary-foreground"
                  : "hover:border-primary"
              )}
              disabled={preset > product.stockQuantity}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex gap-2 pt-3">
        <Button
          variant="outline"
          size="lg"
          onClick={handleAddToWishlist}
          className={cn(
            "flex-none",
            isWishlisted && "text-destructive hover:text-destructive"
          )}
        >
          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
        </Button>
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
          className={cn("flex-1 transition-transform", isAdding && "scale-95")}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to cart
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Minimum order: {product.minOrderQuantity} units
      </div>

      {/* Additional Info */}
      <div className="pt-2">
        <Accordion type="single" collapsible>
          <AccordionItem value="pricing">
            <AccordionTrigger className="text-sm py-3">
              Volume Pricing
            </AccordionTrigger>
            <AccordionContent>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-3 py-2 text-left text-xs font-medium">
                        Quantity
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium">
                        Price per Unit
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium">
                        Savings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-b">
                      <td className="px-3 py-2">
                        1-{product.priceTiers[0].minQuantity - 1}
                      </td>
                      <td className="px-3 py-2">
                        {formatPrice(product.basePrice)}
                      </td>
                      <td className="px-3 py-2">-</td>
                    </tr>
                    {product.priceTiers.map((tier, index) => (
                      <tr
                        key={tier.id}
                        className={cn("border-b", {
                          "border-b-0": index === product.priceTiers.length - 1,
                        })}
                      >
                        <td className="px-3 py-2">
                          {tier.minQuantity}
                          {index === product.priceTiers.length - 1
                            ? "+"
                            : `-${
                                product.priceTiers[index + 1].minQuantity - 1
                              }`}
                        </td>
                        <td className="px-3 py-2">
                          {formatPrice(tier.pricePerUnit)}
                        </td>
                        <td className="px-3 py-2 text-green-600">
                          {calculateSavingsPercentage(
                            product.basePrice,
                            tier.pricePerUnit
                          )}
                          % off
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger className="text-sm py-3">
              Shipping & Returns
            </AccordionTrigger>
            <AccordionContent className="text-xs">
              <ul className="space-y-2 text-muted-foreground">
                <li>Free standard shipping on all orders</li>
                <li>30-day return policy</li>
                <li>Estimated delivery: 3-5 business days</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="specs">
            <AccordionTrigger className="text-sm py-3">
              Specifications
            </AccordionTrigger>
            <AccordionContent className="text-xs">
              <div className="space-y-2 text-muted-foreground">
                <p>SKU: {product.sku}</p>
                <p>Category: {product.category.name}</p>
                <p>{product.description}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
