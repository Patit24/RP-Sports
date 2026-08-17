"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User, ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cart = useStore((state) => state.cart) || [];
  const wishlist = useStore((state) => state.wishlist) || [];
  const currentUser = useStore((state) => state.currentUser);

  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalWishlistCount = wishlist.length;

  // Hide on checkout, admin, or full-screen builder if applicable
  if (pathname?.startsWith("/checkout") || pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { 
      name: "Wishlist", 
      href: "/dashboard?tab=wishlist", 
      icon: Heart,
      badge: totalWishlistCount > 0 ? totalWishlistCount : undefined,
    },
    { 
      name: "Cart", 
      href: "/cart", 
      icon: ShoppingCart,
      badge: totalCartCount > 0 ? totalCartCount : undefined,
    },
    { 
      name: currentUser ? "Account" : "Sign In", 
      href: currentUser ? "/dashboard" : "/signin", 
      icon: User 
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111111]/95 text-white backdrop-blur-lg border-t border-white/10 z-50 px-2 py-2 shadow-[0_-5px_25px_rgba(0,0,0,0.3)]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive ? "text-[#CC0000]" : "text-slate-400 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 text-[#CC0000]" : "text-slate-400"}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#CC0000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight font-bold mt-1 ${isActive ? "text-[#CC0000]" : "text-slate-400"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
