"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { 
  getStoreSettings, 
  saveStoreSettings, 
  StoreSettings,
  saveCategory,
  deleteCategory,
  saveTestimonial,
  deleteTestimonial,
  Category,
  TestimonialVideo
} from "@/lib/firestoreService";
import { 
  ShieldCheck, Truck, Store, Key, Save, CheckCircle, AlertCircle, 
  RefreshCw, XCircle, Tag, Star, Plus, Trash2, Video, PlusCircle, ExternalLink 
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, showToast, categories, testimonials } = useStore();

  const [activeTab, setActiveTab] = useState<"general" | "taxonomy" | "testimonials">("general");

  // General Settings State
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "RP Sports Kolkata",
    storeEmail: "info@rpsports.in",
    storePhone: "+91 98300 12345",
    pickupAddress: "RP Sports Works, Dumdum Metro Gate 2, Kolkata – 700028",
    pincode: "700028",
    shiprocketEmail: "info@rpsports.in",
    shiprocketPickupLocation: "Dumdum Store",
    gstin: "19AABCR1234F1Z9",
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Shiprocket Diagnostics State
  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "failed">("checking");
  const [connectionError, setConnectionError] = useState("");
  const [lastConnected, setLastConnected] = useState("");
  const [checkingConnection, setCheckingConnection] = useState(false);

  // New Category Form State
  const [newCatId, setNewCatId] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("");
  const [newCatBanner, setNewCatBanner] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  // Inline Subcategory Input State per Category (key is category ID, value is text)
  const [newSubnames, setNewSubnames] = useState<Record<string, string>>({});

  // New Testimonial Form State
  const [newTestTitle, setNewTestTitle] = useState("");
  const [newTestAuthor, setNewTestAuthor] = useState("");
  const [newTestRole, setNewTestRole] = useState("");
  const [newTestLocation, setNewTestLocation] = useState("");
  const [newTestRating, setNewTestRating] = useState(5);
  const [newTestDuration, setNewTestDuration] = useState("03:00");
  const [newTestThumbnail, setNewTestThumbnail] = useState("");
  const [newTestVideoUrl, setNewTestVideoUrl] = useState("");
  const [newTestQuote, setNewTestQuote] = useState("");
  const [newTestProductName, setNewTestProductName] = useState("");
  const [newTestProductPrice, setNewTestProductPrice] = useState("");
  const [newTestDate, setNewTestDate] = useState("Aug 2026");
  const [addingTestimonial, setAddingTestimonial] = useState(false);

  // Load settings on mount
  useEffect(() => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
      return;
    }
    
    async function load() {
      const data = await getStoreSettings();
      if (data) {
        setSettings(data);
      }
    }
    load();
    verifyShiprocket();
  }, [currentUser]);

  // Verify Connection Method
  const verifyShiprocket = async () => {
    setCheckingConnection(true);
    try {
      const res = await fetch("/api/shiprocket/test-connection");
      const data = await res.json();
      if (data.connected) {
        setConnectionStatus("connected");
        setPickupLocations(data.pickupLocations || []);
        setLastConnected(data.lastConnected || new Date().toLocaleString());
        setConnectionError("");
      } else {
        setConnectionStatus("failed");
        setConnectionError(data.error || "Shiprocket authentication failed");
        setPickupLocations([]);
      }
    } catch (err: any) {
      setConnectionStatus("failed");
      setConnectionError(err.message || "Failed to verify connection.");
      setPickupLocations([]);
    } finally {
      setCheckingConnection(false);
    }
  };

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Verifying admin credentials...</p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveStoreSettings(settings);
      setSaved(true);
      showToast("Store settings and logistics configurations updated!", "success");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      showToast("Failed to save store settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Taxonomy Handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatId || !newCatName) {
      showToast("ID and Name are required", "error");
      return;
    }
    setAddingCategory(true);
    try {
      const categoryId = newCatId.trim().toLowerCase().replace(/[^a-z0-9\-]+/g, "-");
      const categoryData: Category = {
        id: categoryId,
        name: newCatName.trim(),
        icon: newCatIcon.trim() || "📦",
        banner: newCatBanner.trim() || "/category_cricket_1783225297200.jpg",
        subcategories: []
      };
      await saveCategory(categoryData);
      showToast(`Category "${newCatName}" created successfully!`, "success");
      setNewCatId("");
      setNewCatName("");
      setNewCatIcon("");
      setNewCatBanner("");
    } catch (err: any) {
      showToast(err.message || "Failed to add category", "error");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"? All subcategory links will be removed.`)) {
      return;
    }
    try {
      await deleteCategory(catId);
      showToast(`Category "${catName}" removed from database`, "info");
    } catch (err: any) {
      showToast(err.message || "Failed to delete category", "error");
    }
  };

  const handleAddSubcategory = async (category: Category) => {
    const text = newSubnames[category.id] || "";
    if (!text.trim()) return;

    const subName = text.trim().toLowerCase();
    if (category.subcategories.includes(subName)) {
      showToast("Subcategory already exists in this category", "info");
      return;
    }

    try {
      const updatedCategory: Category = {
        ...category,
        subcategories: [...category.subcategories, subName]
      };
      await saveCategory(updatedCategory);
      setNewSubnames({ ...newSubnames, [category.id]: "" });
      showToast(`Added subcategory "${subName}" to ${category.name}`, "success");
    } catch (err: any) {
      showToast("Failed to add subcategory", "error");
    }
  };

  const handleDeleteSubcategory = async (category: Category, subName: string) => {
    if (!confirm(`Remove subcategory "${subName}" from "${category.name}"?`)) {
      return;
    }
    try {
      const updatedCategory: Category = {
        ...category,
        subcategories: category.subcategories.filter(s => s !== subName)
      };
      await saveCategory(updatedCategory);
      showToast(`Subcategory "${subName}" removed`, "info");
    } catch (err: any) {
      showToast("Failed to remove subcategory", "error");
    }
  };

  // Testimonials Handlers
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle || !newTestAuthor || !newTestQuote) {
      showToast("Title, Author, and Review Quote are required", "error");
      return;
    }
    setAddingTestimonial(true);
    try {
      const testimonialId = "v" + Date.now().toString().slice(-4);
      const testimonialData: TestimonialVideo = {
        id: testimonialId,
        title: newTestTitle.trim(),
        author: newTestAuthor.trim(),
        role: newTestRole.trim() || "Local Cricket Fan",
        location: newTestLocation.trim() || "Kolkata, West Bengal",
        rating: Number(newTestRating),
        duration: newTestDuration.trim() || "03:15",
        thumbnail: newTestThumbnail.trim() || "/products/cricket_locker_room.jpg",
        quote: newTestQuote.trim(),
        productName: newTestProductName.trim() || "RP Sports Equipment",
        productPrice: newTestProductPrice.trim() || "₹2,500",
        date: newTestDate.trim() || "Aug 2026",
        videoUrl: newTestVideoUrl.trim() || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      };
      await saveTestimonial(testimonialData);
      showToast(`Video review by "${newTestAuthor}" added successfully!`, "success");
      setNewTestTitle("");
      setNewTestAuthor("");
      setNewTestRole("");
      setNewTestLocation("");
      setNewTestRating(5);
      setNewTestDuration("03:00");
      setNewTestThumbnail("");
      setNewTestVideoUrl("");
      setNewTestQuote("");
      setNewTestProductName("");
      setNewTestProductPrice("");
    } catch (err: any) {
      showToast("Failed to save testimonial", "error");
    } finally {
      setAddingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (testId: string, authorName: string) => {
    if (!confirm(`Are you sure you want to delete the testimonial video review from ${authorName}?`)) {
      return;
    }
    try {
      await deleteTestimonial(testId);
      showToast(`Testimonial by "${authorName}" deleted`, "info");
    } catch (err: any) {
      showToast("Failed to delete testimonial", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000]">
            System Administration
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-primary tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Store Configuration & Lookups
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Manage logistics parameters, store taxonomy metadata, and dynamic customer reviews.
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-display font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "general"
              ? "border-[#CC0000] text-[#CC0000]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          <Store className="w-4 h-4" /> Logistics & Settings
        </button>
        <button
          onClick={() => setActiveTab("taxonomy")}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-display font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "taxonomy"
              ? "border-[#CC0000] text-[#CC0000]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          <Tag className="w-4 h-4" /> Product Taxonomy
        </button>
        <button
          onClick={() => setActiveTab("testimonials")}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-display font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "testimonials"
              ? "border-[#CC0000] text-[#CC0000]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          <Video className="w-4 h-4" /> Customer Testimonials
        </button>
      </div>

      {/* GENERAL TAB */}
      {activeTab === "general" && (
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Store Phone</label>
                <input
                  type="text"
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-primary focus:outline-none focus:border-[#CC0000]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Fulfillment Pincode</label>
                <input
                  type="text"
                  value={settings.pincode}
                  onChange={(e) => setSettings({ ...settings, pincode: e.target.value })}
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
              <div className="flex items-center gap-2">
                {connectionStatus === "checking" && (
                  <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...
                  </span>
                )}
                {connectionStatus === "connected" && (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Connected
                  </span>
                )}
                {connectionStatus === "failed" && (
                  <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Not Connected
                  </span>
                )}
                <button
                  type="button"
                  onClick={verifyShiprocket}
                  disabled={checkingConnection}
                  className="p-1 text-slate-400 hover:text-[#CC0000] rounded transition-colors cursor-pointer"
                  title="Verify Connection"
                >
                  <RefreshCw className={`w-4 h-4 ${checkingConnection ? 'animate-spin' : ''}`} />
                </button>
              </div>
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
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Shiprocket Pickup Location</label>
                {connectionStatus === "connected" && pickupLocations.length > 0 ? (
                  <select
                    value={settings.shiprocketPickupLocation}
                    onChange={(e) => setSettings({ ...settings, shiprocketPickupLocation: e.target.value })}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-primary focus:outline-none focus:border-[#CC0000] bg-white cursor-pointer"
                  >
                    {pickupLocations.map((loc, idx) => (
                      <option key={idx} value={loc.pickup_location}>
                        {loc.pickup_location} ({loc.city}, {loc.pin_code})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={settings.shiprocketPickupLocation}
                    onChange={(e) => setSettings({ ...settings, shiprocketPickupLocation: e.target.value })}
                    placeholder="e.g. Dumdum Store"
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-primary focus:outline-none focus:border-[#CC0000]"
                  />
                )}
              </div>
            </div>

            {/* Connection Error Banner */}
            {connectionStatus === "failed" && connectionError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs font-bold text-red-800">Connection Error</strong>
                  <p className="text-[11px] text-red-700 font-semibold">{connectionError}</p>
                </div>
              </div>
            )}

            {/* Connection Success Specs */}
            {connectionStatus === "connected" && (
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-1.5 text-[11px] text-emerald-800 font-semibold">
                <div className="flex justify-between">
                  <span>Last Connected:</span>
                  <span className="font-mono">{lastConnected}</span>
                </div>
                <div className="flex justify-between">
                  <span>API Gateway Status:</span>
                  <span className="uppercase tracking-wider">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup Locations Available:</span>
                  <span>{pickupLocations.length} locations</span>
                </div>
              </div>
            )}
            
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
              disabled={loading}
              className="px-8 py-3.5 bg-[#CC0000] text-white font-display font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[#990000] transition-colors flex items-center gap-2 shadow-lg shadow-[#CC0000]/20 cursor-pointer disabled:opacity-50"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Configuration"}
            </button>
          </div>

        </form>
      )}

      {/* TAXONOMY TAB */}
      {activeTab === "taxonomy" && (
        <div className="space-y-8">
          
          {/* Create Category Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <PlusCircle className="w-5 h-5 text-[#CC0000]" />
              <h2 className="text-base font-display font-bold uppercase text-primary" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Create New Store Category
              </h2>
            </div>
            
            <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Category Slug/ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cricket"
                  value={newCatId}
                  onChange={(e) => setNewCatId(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cricket Equipment"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Emoji Icon</label>
                <input
                  type="text"
                  placeholder="e.g. 🏏"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                />
              </div>
              <button
                type="submit"
                disabled={addingCategory}
                className="w-full h-11 bg-[#CC0000] text-white font-display font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-[#990000] transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#CC0000]/10 cursor-pointer disabled:opacity-50"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                <Plus className="w-4 h-4" /> {addingCategory ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>

          {/* Categories Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Header info */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm text-[#111111] flex items-center gap-2">
                        {cat.name}
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-bold uppercase">{cat.id}</span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-bold uppercase">{cat.subcategories?.length || 0} Subcategories Registered</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Subcategories tag management */}
                <div className="p-6 bg-slate-50/50 flex-grow space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Registered Subcategories:</span>
                    {(!cat.subcategories || cat.subcategories.length === 0) ? (
                      <p className="text-xs text-slate-400 italic">No subcategories defined inside this category.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {cat.subcategories.map((sub) => (
                          <span 
                            key={sub}
                            className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 font-mono shadow-sm"
                          >
                            {sub}
                            <button
                              type="button"
                              onClick={() => handleDeleteSubcategory(cat, sub)}
                              className="text-slate-400 hover:text-red-500 font-bold hover:bg-slate-100 rounded px-0.5 transition-colors cursor-pointer"
                              title="Delete subcategory"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add subcategory tag form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add subcategory tag..."
                      value={newSubnames[cat.id] || ""}
                      onChange={(e) => setNewSubnames({ ...newSubnames, [cat.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSubcategory(cat);
                        }
                      }}
                      className="flex-grow h-9 px-3 border border-slate-300 bg-white rounded-lg text-xs font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSubcategory(cat)}
                      className="h-9 px-3 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TESTIMONIALS TAB */}
      {activeTab === "testimonials" && (
        <div className="space-y-8">
          
          {/* Create Testimonial Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <PlusCircle className="w-5 h-5 text-[#CC0000]" />
              <h2 className="text-base font-display font-bold uppercase text-primary" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Add New Customer Video Review
              </h2>
            </div>
            
            <form onSubmit={handleAddTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Video Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unboxing & Net practice test"
                    value={newTestTitle}
                    onChange={(e) => setNewTestTitle(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Customer Author Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajiv Mukherjee"
                    value={newTestAuthor}
                    onChange={(e) => setNewTestAuthor(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Customer Title/Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Dumdum League Batsman"
                    value={newTestRole}
                    onChange={(e) => setNewTestRole(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Location Details</label>
                  <input
                    type="text"
                    placeholder="e.g. Bought at Dumdum Store"
                    value={newTestLocation}
                    onChange={(e) => setNewTestLocation(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Rating (Out of 5 Stars)</label>
                  <select
                    value={newTestRating}
                    onChange={(e) => setNewTestRating(Number(e.target.value))}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] bg-white focus:outline-none focus:border-[#CC0000]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Video Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 04:12"
                    value={newTestDuration}
                    onChange={(e) => setNewTestDuration(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Review Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Aug 2026"
                    value={newTestDate}
                    onChange={(e) => setNewTestDate(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">YouTube Video Link / URL</label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    value={newTestVideoUrl}
                    onChange={(e) => setNewTestVideoUrl(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Custom Thumbnail Image URL (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. /images/rp_customer_video_1.jpg"
                    value={newTestThumbnail}
                    onChange={(e) => setNewTestThumbnail(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Purchased Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. RP Elite English Willow Bat"
                    value={newTestProductName}
                    onChange={(e) => setNewTestProductName(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Product Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹18,999"
                    value={newTestProductPrice}
                    onChange={(e) => setNewTestProductPrice(e.target.value)}
                    className="w-full h-11 px-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Review Quote Summary</label>
                <textarea
                  required
                  placeholder="Tell us what the customer said..."
                  value={newTestQuote}
                  onChange={(e) => setNewTestQuote(e.target.value)}
                  rows={3}
                  className="w-full p-4 border border-slate-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={addingTestimonial}
                  className="px-8 py-3 bg-[#CC0000] text-white font-display font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[#990000] transition-colors flex items-center gap-2 shadow-lg shadow-[#CC0000]/10 cursor-pointer disabled:opacity-50"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  <Video className="w-4 h-4" /> {addingTestimonial ? "Saving Review..." : "Publish Customer Video"}
                </button>
              </div>
            </form>
          </div>

          {/* Testimonial List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div 
                key={test.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video w-full bg-slate-900 relative overflow-hidden group">
                    <img 
                      src={test.thumbnail || "/products/cricket_locker_room.jpg"} 
                      alt="review thumbnail" 
                      className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center text-white font-bold text-xs uppercase tracking-widest font-mono">
                        {test.duration}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-sm text-[#111111] line-clamp-2">{test.title}</h3>
                      <button
                        onClick={() => handleDeleteTestimonial(test.id, test.author)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all shrink-0 cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.round(test.rating) }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ))}
                      <span className="text-[10px] font-mono text-slate-400 ml-1">({test.rating.toFixed(1)})</span>
                    </div>

                    <p className="text-xs text-slate-500 italic line-clamp-3 leading-relaxed">
                      "{test.quote}"
                    </p>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  <div>
                    <span className="text-[#111111] block font-bold">{test.author}</span>
                    <span className="text-slate-400 font-medium block truncate max-w-[120px]">{test.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#CC0000] block">{test.productName}</span>
                    <span className="text-slate-400 font-medium block">{test.productPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
