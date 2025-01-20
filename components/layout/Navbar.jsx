"use client";

import Link from "next/link";
import { CartPopover } from "@/components/cart/CartPopover";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WishlistPopover } from "../wishlist/WishlistPopover";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslations } from "next-intl";

const navLinks = [
  { href: "/", label: "home" },
  { href: "#about", label: "about" },
  { href: "/products", label: "products" },
  { href: "/checkout", label: "checkout" },
  { href: "#contact", label: "contact" },
];

export function Navbar() {
  const t = useTranslations("Navigation");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-background/75 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "font-semibold text-lg transition-colors duration-300 hover:text-primary",
              scrolled ? "text-foreground" : "text-foreground/90"
            )}
          >
            {t("brand")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-300 hover:text-primary relative group cursor-pointer",
                scrolled ? "text-foreground" : "text-foreground/90"
              )}
            >
              {t(`links.${link.label}`)}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <WishlistPopover />
          <CartPopover />
          <LanguageSwitcher />

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <span className="font-semibold text-lg transition-colors duration-300 hover:text-primary">
                    {t("brand")}
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    // onClick={() => scrollToSection(link.href)}
                    className="text-sm font-medium transition-colors hover:text-primary text-left py-2"
                  >
                    {t(`links.${link.label}`)}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
