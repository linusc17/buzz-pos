"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import SignOutModal from "@/components/SignOutModal";
import { LayoutDashboard, ShoppingCart, Plus, Package } from "lucide-react";
import Image from "next/image";

export default function MainNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "All Orders",
      href: "/orders",
      icon: ShoppingCart,
    },
    {
      label: "New Order",
      href: "/orders/new",
      icon: Plus,
    },
    {
      label: "Products",
      href: "/products",
      icon: Package,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/orders") {
      return pathname === "/orders";
    }
    return pathname === href;
  };

  return (
    <div className="bg-buzz-cream dark:bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/textlogo.png"
              alt="Buzz Coffee"
              width={120}
              height={32}
              className="h-8 w-auto dark:invert dark:sepia dark:saturate-[0.2] dark:hue-rotate-[15deg] dark:brightness-[1.1]"
            />
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutModal variant="outline" />
          </div>
        </div>
      </div>
    </div>
  );
}
