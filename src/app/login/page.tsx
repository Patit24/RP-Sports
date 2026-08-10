"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ShieldCheck, User, Box, Layers } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();

  const handleLogin = (
    email: string,
    name: string,
    role: "customer" | "admin" | "super_admin",
    permissions: string[] = []
  ) => {
    login(email, name, role, permissions);
    if (role === "customer") {
      router.push("/dashboard");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 lg:py-24 flex items-center justify-center">
      <div className="max-w-4xl w-full px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">
            PORTAL ACCESS
          </h1>
          <p className="text-warm-gray text-sm mt-2 font-medium">
            Select an identity profile to securely access the RP Sports platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Customer Profile */}
          <div className="p-8 neumorphic rounded-[24px] space-y-6 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 neumorphic-inset rounded-full flex items-center justify-center mx-auto text-electric-blue">
              <User className="w-8 h-8" />
            </div>
            <div className="text-center flex-grow">
              <h3 className="font-black text-foreground uppercase tracking-widest text-sm mb-2">Customer Profile</h3>
              <p className="text-xs text-warm-gray font-medium">Standard shopper access. Manage orders, wishlist, and shipping addresses.</p>
            </div>
            <button
              onClick={() => handleLogin("athlete@rpsports.com", "Pro Athlete", "customer")}
              className="w-full btn-luxury"
            >
              Log In as Customer
            </button>
          </div>

          {/* Super Admin Profile */}
          <div className="p-8 neumorphic border-2 border-electric-blue/30 rounded-[24px] space-y-6 flex flex-col hover:-translate-y-2 transition-transform duration-300 relative">
            <div className="absolute top-0 right-0 bg-electric-blue text-background text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl rounded-tr-[22px] tracking-widest">
              Full Access
            </div>
            <div className="w-16 h-16 neumorphic-inset rounded-full flex items-center justify-center mx-auto text-electric-blue">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="text-center flex-grow">
              <h3 className="font-black text-foreground uppercase tracking-widest text-sm mb-2">Super Admin</h3>
              <p className="text-xs text-warm-gray font-medium">Unrestricted enterprise access. View and modify all systems.</p>
            </div>
            <button
              onClick={() => handleLogin("admin@rpsports.com", "Master Chief", "super_admin")}
              className="w-full btn-luxury bg-foreground text-background hover:bg-electric-blue hover:text-background"
            >
              Log In as Super Admin
            </button>
          </div>

          {/* Product Manager Profile */}
          <div className="p-8 neumorphic rounded-[24px] space-y-6 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 neumorphic-inset rounded-full flex items-center justify-center mx-auto text-foreground">
              <Box className="w-8 h-8" />
            </div>
            <div className="text-center flex-grow">
              <h3 className="font-black text-foreground uppercase tracking-widest text-sm mb-2">Product Manager</h3>
              <p className="text-xs text-warm-gray font-medium">Restricted Admin: Can add, edit, and delete products from the catalog.</p>
            </div>
            <button
              onClick={() => handleLogin("catalog@rpsports.com", "Catalog Manager", "admin", ["product_add", "product_edit", "product_delete"])}
              className="w-full py-3 neumorphic-inset text-xs font-bold uppercase tracking-widest hover:text-electric-blue transition-colors rounded-lg"
            >
              Log In as PM
            </button>
          </div>

          {/* Inventory Manager Profile */}
          <div className="p-8 neumorphic rounded-[24px] space-y-6 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 neumorphic-inset rounded-full flex items-center justify-center mx-auto text-foreground">
              <Layers className="w-8 h-8" />
            </div>
            <div className="text-center flex-grow">
              <h3 className="font-black text-foreground uppercase tracking-widest text-sm mb-2">Inventory Manager</h3>
              <p className="text-xs text-warm-gray font-medium">Restricted Admin: Can only adjust warehouse stock levels and view tracking.</p>
            </div>
            <button
              onClick={() => handleLogin("warehouse@rpsports.com", "Logistics Chief", "admin", ["inventory_management"])}
              className="w-full py-3 neumorphic-inset text-xs font-bold uppercase tracking-widest hover:text-electric-blue transition-colors rounded-lg"
            >
              Log In as Logistics
            </button>
          </div>

        </div>
        
        <div className="mt-12 text-center">
          <Link href="/" className="text-xs font-bold text-warm-gray uppercase tracking-widest hover:text-foreground transition-colors">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
