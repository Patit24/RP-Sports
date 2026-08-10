"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Users, Search, Phone, Mail, MapPin, ShoppingBag, IndianRupee, ShieldCheck } from "lucide-react";

export default function AdminCustomersPage() {
  const router = useRouter();
  const { orders, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
      router.push("/admin/login");
    }
  }, [currentUser, router]);

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Verifying admin credentials...</p>
      </div>
    );
  }

  // Aggregate unique customer profiles from orders and active state
  const customerMap: Record<string, {
    name: string;
    phone: string;
    email: string;
    city: string;
    pincode: string;
    ordersCount: number;
    totalSpent: number;
  }> = {};

  orders.forEach((o) => {
    const key = o.shippingAddress.phone || o.shippingAddress.fullName;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: o.shippingAddress.fullName,
        phone: o.shippingAddress.phone,
        email: `${o.shippingAddress.phone.replace(/\D/g, "")}@rpsports.in`,
        city: `${o.shippingAddress.city}, ${o.shippingAddress.state}`,
        pincode: o.shippingAddress.pincode,
        ordersCount: 1,
        totalSpent: o.total,
      };
    } else {
      customerMap[key].ordersCount += 1;
      customerMap[key].totalSpent += o.total;
    }
  });

  const customerList = Object.values(customerMap);

  const filteredCustomers = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000]">
            Customer Management
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-[#111111] tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Store Customer Directory
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            View profiles, addresses, order counts, and lifetime spending for RP Sports shoppers.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, phone, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs font-medium text-[#111111] focus:outline-none focus:border-[#CC0000]"
          />
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:block">
          {filteredCustomers.length} Customer Profiles
        </span>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 font-bold uppercase tracking-wider">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Primary Delivery Location</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4 text-right">Account Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-10 text-gray-500 font-bold">
                    No customer accounts found matching search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    
                    <td className="p-4">
                      <strong className="block text-sm font-bold text-[#111111]">{c.name}</strong>
                      <span className="text-[11px] text-gray-400 font-mono">{c.email}</span>
                    </td>

                    <td className="p-4 font-mono font-bold text-gray-700">
                      {c.phone}
                    </td>

                    <td className="p-4">
                      <span className="block font-bold text-gray-800">{c.city}</span>
                      <span className="text-[11px] text-gray-400 font-mono">PIN: {c.pincode}</span>
                    </td>

                    <td className="p-4 font-bold text-gray-800">
                      <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-md">
                        {c.ordersCount} Order{c.ordersCount !== 1 ? 's' : ''}
                      </span>
                    </td>

                    <td className="p-4 font-black text-sm text-[#CC0000]">
                      ₹{c.totalSpent.toLocaleString("en-IN")}
                    </td>

                    <td className="p-4 text-right">
                      <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Verified Customer
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
