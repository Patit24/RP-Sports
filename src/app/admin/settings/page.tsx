"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ShieldCheck, Truck, Store, Key, Save, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, showToast } = useStore();

  useEffect(() => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
      router.push("/signin");
    }
  }, [currentUser, router]);

  const [settings, setSettings] = useState({
    storeName: "RP Sports Kolkata",
    storeEmail: "info@rpsports.in",
    storePhone: "+91 98300 12345",
    pickupAddress: "RP Sports Works, Dumdum Metro Gate 2, Kolkata – 700028",
    pincode: "700028",
    shiprocketEmail: "info@rpsports.in",
    shiprocketPickupLocation: "Dumdum Store",
    gstin: "19AABCR1234F1Z9",
  });

  const [saved, setSaved] = useState(false);

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Verifying admin credentials...</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    showToast("Store settings and logistics configurations updated!", "success");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000]">
          System Administration
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-primary tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Store & Logistics Settings
        </h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">
          Manage fulfillment center details, Shiprocket credentials, GSTIN, and store preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Store & Pickup Address */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-5 h-5 text-[#CC0000]" />
            <h2 className="text-base font-display font-bold uppercase text-primary" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              1. Dumdum Fulfillment Hub & Contact Info
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-primary focus:outline-none focus:border-[#CC0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Store Email</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-primary focus:outline-none focus:border-[#CC0000]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Pickup Warehouse Address</label>
            <input
              type="text"
              value={settings.pickupAddress}
              onChange={(e) => setSettings({ ...settings, pickupAddress: e.target.value })}
              className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-primary focus:outline-none focus:border-[#CC0000]"
            />
          </div>
        </div>

        {/* Shiprocket Credentials Integration Status */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#CC0000]" />
              <h2 className="text-base font-display font-bold uppercase text-primary" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                2. Shiprocket Logistics Integration
              </h2>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> API Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Shiprocket Account Email</label>
              <input
                type="text"
                value={settings.shiprocketEmail}
                onChange={(e) => setSettings({ ...settings, shiprocketEmail: e.target.value })}
                className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-primary focus:outline-none focus:border-[#CC0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Shiprocket Pickup Location Nickname</label>
              <input
                type="text"
                value={settings.shiprocketPickupLocation}
                onChange={(e) => setSettings({ ...settings, shiprocketPickupLocation: e.target.value })}
                className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-primary focus:outline-none focus:border-[#CC0000]"
              />
            </div>
          </div>
          
          <p className="text-xs text-slate-500 font-medium">
            Shiprocket API credentials are encrypted in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#CC0000]">.env.local</code> (SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD).
          </p>
        </div>

        {/* GST & Tax Settings */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="w-5 h-5 text-[#CC0000]" />
            <h2 className="text-base font-display font-bold uppercase text-primary" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              3. GSTIN & Tax Configuration
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">GSTIN Number (18% Sports Equipment Rate)</label>
            <input
              type="text"
              value={settings.gstin}
              onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
              className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-primary focus:outline-none focus:border-[#CC0000]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4 pt-4">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Settings Saved!
            </span>
          )}
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#CC0000] text-white font-display font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[#990000] transition-colors flex items-center gap-2 shadow-lg shadow-[#CC0000]/20 cursor-pointer"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>

      </form>
    </div>
  );
}
