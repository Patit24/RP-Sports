"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { auth } from "@/lib/firebase";
import { listenToCoupons, type DBCoupon } from "@/lib/firestoreService";
import { 
  Tag, 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  Loader2, 
  X, 
  Percent, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Clock,
  Sparkles
} from "lucide-react";

export default function AdminCouponsPage() {
  const { products, currentUser, showToast } = useStore();
  
  const [coupons, setCoupons] = useState<DBCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "expired">("all");

  // Modal / Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DBCoupon | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form Fields
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<string>("10");
  const [appliesTo, setAppliesTo] = useState<"all" | "specific">("all");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [minimumOrderValue, setMinimumOrderValue] = useState<string>("0");
  const [maximumDiscount, setMaximumDiscount] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [usageLimit, setUsageLimit] = useState<string>("");
  const [usagePerCustomer, setUsagePerCustomer] = useState<string>("1");
  const [isActive, setIsActive] = useState<boolean>(true);

  // Product selector inside modal
  const [productSearch, setProductSearch] = useState("");

  // Check admin authorization
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return null;
  }

  // Subscribe to live coupons collection in Firestore
  useEffect(() => {
    const unsub = listenToCoupons((data) => {
      setCoupons(data);
      setLoading(false);
    });

    // Fallback fetch in case listener is slow
    const fetchCoupons = async () => {
      try {
        let idToken = "mock_admin_bypass_token";
        if (auth.currentUser) {
          idToken = await auth.currentUser.getIdToken();
        }
        const res = await fetch("/api/admin/coupons", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const d = await res.json();
        if (d.success && Array.isArray(d.coupons)) {
          setCoupons(d.coupons);
        }
      } catch (err) {
        console.warn("Fetch coupons fallback error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();

    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode("");
    setDescription("");
    setDiscountType("percentage");
    setDiscountValue("10");
    setAppliesTo("all");
    setSelectedProductIds([]);
    setMinimumOrderValue("0");
    setMaximumDiscount("");
    setStartDate("");
    setExpiryDate("");
    setUsageLimit("");
    setUsagePerCustomer("1");
    setIsActive(true);
    setFormError(null);
    setProductSearch("");
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: DBCoupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description || "");
    setDiscountType(coupon.discountType || "percentage");
    setDiscountValue(String(coupon.discountValue || 0));
    setAppliesTo(coupon.appliesTo || "all");
    setSelectedProductIds(coupon.productIds || []);
    setMinimumOrderValue(String(coupon.minimumOrderValue || 0));
    setMaximumDiscount(coupon.maximumDiscount ? String(coupon.maximumDiscount) : "");
    setStartDate(coupon.startDate ? coupon.startDate.split("T")[0] : "");
    setExpiryDate(coupon.expiryDate ? coupon.expiryDate.split("T")[0] : "");
    setUsageLimit(coupon.usageLimit ? String(coupon.usageLimit) : "");
    setUsagePerCustomer(String(coupon.usagePerCustomer || 1));
    setIsActive(coupon.active !== false);
    setFormError(null);
    setProductSearch("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    showToast(`Copied code '${couponCode}' to clipboard!`, "info");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerateRandomCode = () => {
    const prefixes = ["RP", "SUPER", "SAVE", "DEAL", "SUMMER", "GOLD", "PRO"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const val = discountValue || "15";
    setCode(`${prefix}${val}`);
  };

  const toggleProductSelection = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const handleToggleStatus = async (coupon: DBCoupon) => {
    try {
      let idToken = "mock_admin_bypass_token";
      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken();
      }

      const nextStatus = !coupon.active;
      const res = await fetch("/api/admin/coupons/toggle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ id: coupon.id, active: nextStatus }),
      });

      const d = await res.json();
      if (!res.ok || !d.success) {
        throw new Error(d.message || "Failed to update coupon status.");
      }

      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, active: nextStatus } : c))
      );
      showToast(`Coupon '${coupon.code}' ${nextStatus ? "enabled" : "disabled"}.`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const handleDeleteCoupon = async (coupon: DBCoupon) => {
    if (!confirm(`Are you sure you want to delete coupon '${coupon.code}'?`)) return;

    try {
      let idToken = "mock_admin_bypass_token";
      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken();
      }

      const res = await fetch(`/api/admin/coupons?id=${encodeURIComponent(coupon.id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const d = await res.json();
      if (!res.ok || !d.success) {
        throw new Error(d.message || "Failed to delete coupon.");
      }

      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
      showToast(`Coupon '${coupon.code}' deleted.`, "info");
    } catch (err: any) {
      showToast(err.message || "Failed to delete coupon", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const normCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!normCode || normCode.length < 2) {
      setFormError("Coupon code must be at least 2 alphanumeric characters.");
      return;
    }

    const numVal = Number(discountValue);
    if (isNaN(numVal) || numVal <= 0) {
      setFormError("Please enter a valid positive discount amount.");
      return;
    }

    if (discountType === "percentage" && numVal > 100) {
      setFormError("Percentage discount cannot exceed 100%.");
      return;
    }

    if (appliesTo === "specific" && selectedProductIds.length === 0) {
      setFormError("Please select at least one product for specific product coupons.");
      return;
    }

    if (startDate && expiryDate && new Date(startDate) > new Date(expiryDate)) {
      setFormError("Expiry date must be after the start date.");
      return;
    }

    try {
      setIsSaving(true);
      let idToken = "mock_admin_bypass_token";
      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken();
      }

      const payload = {
        id: editingCoupon ? editingCoupon.id : normCode,
        code: normCode,
        description: description.trim() || `${numVal}${discountType === "percentage" ? "%" : " ₹"} OFF on ${appliesTo === "all" ? "store gear" : `${selectedProductIds.length} products`}`,
        discountType,
        discountValue: numVal,
        appliesTo,
        productIds: appliesTo === "specific" ? selectedProductIds : [],
        minimumOrderValue: Number(minimumOrderValue) || 0,
        maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
        startDate: startDate || null,
        expiryDate: expiryDate || null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        usagePerCustomer: Number(usagePerCustomer) || 1,
        active: isActive,
      };

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (!res.ok || !d.success) {
        throw new Error(d.message || "Failed to save coupon.");
      }

      showToast(d.message || "Coupon saved successfully!", "success");
      closeModal();
    } catch (err: any) {
      setFormError(err.message || "Error saving coupon.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter products for modal
  const filteredModalProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filter coupons table
  const now = new Date();
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const isExpired = c.expiryDate ? new Date(c.expiryDate) < now : false;

    if (filterStatus === "active") return c.active && !isExpired;
    if (filterStatus === "inactive") return !c.active;
    if (filterStatus === "expired") return isExpired;
    return true;
  });

  const totalCouponsCount = coupons.length;
  const activeCouponsCount = coupons.filter((c) => c.active && (!c.expiryDate || new Date(c.expiryDate) >= now)).length;
  const totalRedemptions = coupons.reduce((acc, c) => acc + (c.usageCount || 0), 0);
  const expiredCouponsCount = coupons.filter((c) => c.expiryDate && new Date(c.expiryDate) < now).length;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000]">
            Discounts & Marketing
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-primary tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Coupons & Promotional Codes
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Create store-wide or product-specific discounts with automated limits and expiry dates.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-6 py-3 bg-[#CC0000] text-white font-display font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[#990000] transition-colors flex items-center gap-2 shadow-lg shadow-[#CC0000]/20 whitespace-nowrap cursor-pointer"
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          <PlusCircle className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Coupons</span>
            <Tag className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalCouponsCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{activeCouponsCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Redemptions</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-600">{totalRedemptions}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Expired</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{expiredCouponsCount}</p>
        </div>
      </div>

      {/* Coupons Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search coupon code or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#CC0000] text-sm font-medium bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {(["all", "active", "inactive", "expired"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer capitalize ${
                  filterStatus === tab
                    ? "bg-[#111111] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Applies To</th>
                <th className="p-4">Redemptions</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Expiry</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center p-12 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#CC0000]" />
                    <p className="font-bold">Loading promotional coupons...</p>
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-12 text-slate-500 font-bold">
                    No coupons found. Click "+ Create Coupon" to add your first promotional code.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => {
                  const isExpired = c.expiryDate ? new Date(c.expiryDate) < now : false;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      
                      {/* Code */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-900 tracking-wider">
                            {c.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(c.code)}
                            className="text-slate-400 hover:text-[#CC0000] p-1 transition-colors cursor-pointer"
                            title="Copy code"
                          >
                            {copiedCode === c.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xs">{c.description}</p>
                      </td>

                      {/* Discount */}
                      <td className="p-4">
                        <span className="font-black text-slate-900">
                          {c.discountType === "fixed" ? `₹${c.discountValue}` : `${c.discountValue}%`} OFF
                        </span>
                        {c.maximumDiscount && c.discountType === "percentage" && (
                          <span className="block text-[11px] text-slate-400 font-bold">Max ₹{c.maximumDiscount}</span>
                        )}
                      </td>

                      {/* Applies To */}
                      <td className="p-4">
                        {c.appliesTo === "specific" ? (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-md">
                            {c.productIds?.length || 0} Products
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                            Entire Store
                          </span>
                        )}
                      </td>

                      {/* Redemptions / Limit */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-800">
                          {c.usageCount || 0}
                          {c.usageLimit ? ` / ${c.usageLimit}` : " (Unlimited)"}
                        </span>
                      </td>

                      {/* Min Order */}
                      <td className="p-4">
                        {c.minimumOrderValue && c.minimumOrderValue > 0 ? (
                          <span className="text-slate-700 font-bold">₹{c.minimumOrderValue.toLocaleString("en-IN")}</span>
                        ) : (
                          <span className="text-slate-400 text-xs font-bold">None</span>
                        )}
                      </td>

                      {/* Expiry */}
                      <td className="p-4">
                        {c.expiryDate ? (
                          <span className={`text-xs font-bold ${isExpired ? "text-red-600 font-black" : "text-slate-600"}`}>
                            {new Date(c.expiryDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                            {isExpired && " (Expired)"}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">Never</span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(c)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                            !c.active
                              ? "bg-slate-100 text-slate-500 border border-slate-200"
                              : isExpired
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {!c.active ? "Disabled" : isExpired ? "Expired" : "Active"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(c)}
                            className="p-1.5 text-slate-500 hover:text-[#CC0000] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit coupon"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCoupon(c)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE / EDIT COUPON MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-scaleUp max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#CC0000]/20 border border-[#CC0000]/40 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-[#CC0000]" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase tracking-wider text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {editingCoupon ? "Edit Promotional Coupon" : "Create New Coupon"}
                  </h3>
                  <p className="text-xs text-slate-400">Configure discount value, product applicability, and usage limits.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-grow custom-scrollbar">
              
              {/* Form Error Notice */}
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs font-bold text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Coupon Code & Generate Button */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Coupon Code <span className="text-[#CC0000]">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SAVE20 or KOLKATA15"
                    className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-black text-slate-900 focus:outline-none focus:border-[#CC0000] uppercase tracking-wider"
                    disabled={isSaving || !!editingCoupon}
                    required
                  />
                  {!editingCoupon && (
                    <button
                      type="button"
                      onClick={handleGenerateRandomCode}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#CC0000]" /> Random
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Customer Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 20% OFF on all Kashmir & English Willow Cricket Bats"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#CC0000]"
                  disabled={isSaving}
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Discount Type <span className="text-[#CC0000]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDiscountType("percentage")}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        discountType === "percentage"
                          ? "bg-red-50 border-[#CC0000] text-[#CC0000] shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Percent className="w-4 h-4" /> Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType("fixed")}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        discountType === "fixed"
                          ? "bg-red-50 border-[#CC0000] text-[#CC0000] shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" /> Fixed (₹)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Discount Amount ({discountType === "percentage" ? "%" : "₹"}) <span className="text-[#CC0000]">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={discountType === "percentage" ? "100" : "50000"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 500"}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-[#CC0000]"
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>

              {/* Product Applicability (Store-wide vs Specific) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Applies To <span className="text-[#CC0000]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    appliesTo === "all" ? "bg-red-50 border-[#CC0000] text-slate-900 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}>
                    <input
                      type="radio"
                      name="appliesTo"
                      checked={appliesTo === "all"}
                      onChange={() => setAppliesTo("all")}
                      className="accent-[#CC0000]"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase block">Entire Store</span>
                      <span className="text-[11px] text-slate-500">Applies to all products in customer cart</span>
                    </div>
                  </label>

                  <label className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    appliesTo === "specific" ? "bg-red-50 border-[#CC0000] text-slate-900 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}>
                    <input
                      type="radio"
                      name="appliesTo"
                      checked={appliesTo === "specific"}
                      onChange={() => setAppliesTo("specific")}
                      className="accent-[#CC0000]"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase block">Specific Products</span>
                      <span className="text-[11px] text-slate-500">Only discounts select products</span>
                    </div>
                  </label>
                </div>

                {/* Specific Product Selector */}
                {appliesTo === "specific" && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Selected Products ({selectedProductIds.length})
                      </span>
                      {selectedProductIds.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedProductIds([])}
                          className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    {/* Selected Tags */}
                    {selectedProductIds.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                        {selectedProductIds.map((id) => {
                          const prod = products.find((p) => p.id === id);
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs"
                            >
                              <span className="truncate max-w-[150px]">{prod?.name || id}</span>
                              <button
                                type="button"
                                onClick={() => toggleProductSelection(id)}
                                className="text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Search & Pick Products */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search products by title or category..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#CC0000]"
                        />
                      </div>

                      <div className="max-h-44 overflow-y-auto divide-y divide-slate-200 bg-white border border-slate-200 rounded-lg">
                        {filteredModalProducts.map((p) => {
                          const isSelected = selectedProductIds.includes(p.id);
                          return (
                            <div
                              key={p.id}
                              onClick={() => toggleProductSelection(p.id)}
                              className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                                isSelected ? "bg-red-50/50" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="accent-[#CC0000] rounded"
                                />
                                <img
                                  src={p.image || p.images?.[0] || "/cricket_bat_studio.jpg"}
                                  alt={p.name}
                                  className="w-8 h-8 object-cover rounded border border-slate-200 shrink-0"
                                />
                                <div className="truncate">
                                  <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                                  <p className="text-[10px] text-slate-400 capitalize">{p.category} • ₹{p.price}</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-slate-700 shrink-0">
                                ₹{p.price}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Thresholds & Limits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Minimum Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minimumOrderValue}
                    onChange={(e) => setMinimumOrderValue(e.target.value)}
                    placeholder="e.g. 500 (0 for no minimum)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                    disabled={isSaving}
                  />
                </div>

                {discountType === "percentage" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Maximum Discount Cap (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={maximumDiscount}
                      onChange={(e) => setMaximumDiscount(e.target.value)}
                      placeholder="e.g. 1000 (blank for no cap)"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                      disabled={isSaving}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="e.g. 100 (blank for unlimited)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Usage Limit Per Customer
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usagePerCustomer}
                    onChange={(e) => setUsagePerCustomer(e.target.value)}
                    placeholder="Default: 1 per customer"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Start Date & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                    Coupon Status
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isActive ? "Coupon is active and redeemable by customers" : "Coupon is disabled"}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 accent-[#CC0000] rounded cursor-pointer"
                  disabled={isSaving}
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#CC0000] hover:bg-[#990000] disabled:bg-slate-300 text-white font-display font-bold uppercase tracking-wider text-sm rounded-xl transition-all shadow-md shadow-[#CC0000]/20 flex items-center gap-2 cursor-pointer"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Coupon...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> {editingCoupon ? "Save Changes" : "Create Coupon"}
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
