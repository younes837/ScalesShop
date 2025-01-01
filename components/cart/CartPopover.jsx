"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { CartItem } from "./CartItem";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartPopover() {
  // Initialize with empty values to prevent hydration issues
  const [mounted, setMounted] = useState(false);
  const cartStore = useCartStore();
  const [open, setOpen] = useState(false);

  // Wait for component to mount to access localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative"
        aria-label="Shopping Cart"
      >
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  const itemsCount = cartStore.getProductCount();
  const total = cartStore.getTotal();
  const items = cartStore.items;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemsCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {itemsCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        align="end"
        sideOffset={8}
        onInteractOutside={(e) => {
          // Prevent closing when clicking inside the popover
          if (e.target.closest('[role="dialog"]')) {
            e.preventDefault();
          }
        }}
      >
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Shopping Cart</h4>
            <span className="text-sm text-muted-foreground">
              {itemsCount} items
            </span>
          </div>
          {items.length > 0 ? (
            <>
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid gap-4">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-sm font-medium">
                  {formatPrice(total)}
                </span>
              </div>
              <Button asChild className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <span className="text-sm text-muted-foreground">
                Your cart is empty
              </span>
              <Button asChild variant="link" className="text-sm">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
