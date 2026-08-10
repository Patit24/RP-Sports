"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glassmorphic border-t border-white/40 z-[100] px-6 py-4 pb-8">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"}`}
            >
              <div className={`p-2 rounded-[16px] transition-all duration-300 ${isActive ? 'neumorphic-inset text-foreground' : 'text-foreground/60'}`}>
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-bold tracking-widest uppercase mt-1 ${isActive ? 'text-foreground' : 'text-foreground/60'}`}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
