"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { 
  Trash2, PlusCircle, Search, Layers, X, Loader2, CheckCircle2, 
  AlertCircle, Edit3, Image as ImageIcon, UploadCloud, Plus, Sparkles, 
  Tag, IndianRupee, Package, Shirt, Eye, Star
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { CATEGORIES, BRANDS, type Product } from "@/lib/mockData";

interface CustomSpecRow {
  key: string;
  value: string;
}

export default function ManageProductsPage() {
  const { products, deleteProduct, updateProduct, updateInventoryStock, showToast, currentUser, categories } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const activeCategories = categories && categories.length > 0 ? categories : CATEGORIES;
  
  // Quick Stock Edit Modal State
  const [selectedStockProduct, setSelectedStockProduct] = useState<Product | null>(null);
  const [stockInput, setStockInput] = useState<string>("");
  const [stockReason, setStockReason] = useState<string>("");
  const [isUpdatingStock, setIsUpdatingStock] = useState<boolean>(false);
  const [stockError, setStockError] = useState<string | null>(null);

  // Full Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTab, setEditTab] = useState<"details" | "images" | "specs" | "descriptions">("details");
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Product Form State
  const [formData, setFormData] = useState({
    name: "",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "",
    sportsType: "",
    price: "",
    originalPrice: "",
    stock: "",
    deliveryDays: "3",
    badge: "None",
    featured: false,
    customizable: false,
    enableJerseyCustomization: false,
    image: "",
    shortDescription: "",
    description: "",
    highlightsInput: "",
    willowType: "",
    willowGrade: "",
    handleSize: "",
    playerLevel: "",
    weight: "",
    dimensions: "",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata – 700028",
    colors: "",
    sizes: "",
    sku: "",
  });

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [customSpecs, setCustomSpecs] = useState<CustomSpecRow[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return null;
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── STOCK MODAL HANDLERS ──
  const openStockModal = (product: Product) => {
    setSelectedStockProduct(product);
    setStockInput(String(product.stock ?? 0));
    setStockReason("");
    setStockError(null);
  };

  const closeStockModal = () => {
    if (isUpdatingStock) return;
    setSelectedStockProduct(null);
    setStockInput("");
    setStockReason("");
    setStockError(null);
  };

  const handleQuickDelta = (delta: number) => {
    const current = Number(stockInput) || 0;
    const nextVal = Math.max(0, current + delta);
    setStockInput(String(nextVal));
    setStockError(null);
  };

  const handleStockUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockProduct) return;

    const trimmed = stockInput.trim();
    if (trimmed === "" || isNaN(Number(trimmed))) {
      setStockError("Please enter a valid numeric stock quantity.");
      return;
    }

    const newQty = Number(trimmed);
    if (!Number.isInteger(newQty)) {
      setStockError("Stock must be a whole number.");
      return;
    }

    if (newQty < 0) {
      setStockError("Stock quantity cannot be negative.");
      return;
    }

    if (newQty > 100000) {
      setStockError("Stock quantity cannot exceed 100,000 units.");
      return;
    }

    try {
      setIsUpdatingStock(true);
      setStockError(null);

      let idToken = "mock_admin_bypass_token";
      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken();
      }

      const res = await fetch("/api/admin/products/update-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          productId: selectedStockProduct.id,
          stock: newQty,
          reason: stockReason.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update product stock.");
      }

      updateInventoryStock(selectedStockProduct.id, newQty);
      showToast(`Stock for '${selectedStockProduct.name}' updated to ${newQty} units.`, "success");
      closeStockModal();
    } catch (err: any) {
      setStockError(err.message || "Failed to update stock. Please try again.");
    } finally {
      setIsUpdatingStock(false);
    }
  };

  // ── FULL PRODUCT EDIT HANDLERS ──
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditTab("details");
    setEditError(null);

    // Populate form data
    setFormData({
      name: product.name || "",
      brand: product.brand || "RP Sports",
      category: product.category || "cricket",
      subcategory: product.subcategory || "",
      sportsType: product.sportsType || "",
      price: String(product.price ?? ""),
      originalPrice: String(product.originalPrice ?? product.mrp ?? product.price ?? ""),
      stock: String(product.stock ?? 0),
      deliveryDays: String(product.deliveryDays ?? 3),
      badge: product.badge || "None",
      featured: Boolean(product.featured),
      customizable: Boolean(product.customizable),
      enableJerseyCustomization: Boolean(product.enableJerseyCustomization || (product.category === "jerseys" && product.customizable)),
      image: product.image || (product.images?.[0] ?? ""),
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      highlightsInput: Array.isArray(product.highlights) ? product.highlights.join("\n") : (product.highlights || ""),
      willowType: product.willowType || (product.specs?.["Willow Type"] as string) || (product.specs?.["Blade Material"] as string) || "",
      willowGrade: product.willowGrade || (product.specs?.["Grade"] as string) || "",
      handleSize: product.handleSize || (product.specs?.["Handle"] as string) || "",
      playerLevel: product.playerLevel || (product.specs?.["Player Level"] as string) || "",
      weight: product.weight || (product.specs?.["Weight"] as string) || "",
      dimensions: product.dimensions || (product.specs?.["Dimensions"] as string) || "",
      countryOfOrigin: product.countryOfOrigin || "India",
      manufacturerDetails: product.manufacturerDetails || "RP Sports Works, Dumdum, Kolkata – 700028",
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : (product.colors || ""),
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : (product.sizes || ""),
      sku: product.sku || product.id,
    });

    // Populate gallery images
    const initialImages = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : product.image 
        ? [product.image] 
        : [];
    setGalleryImages(initialImages);

    // Populate custom specs
    const initialSpecs: CustomSpecRow[] = [];
    if (product.specs && typeof product.specs === "object") {
      Object.entries(product.specs).forEach(([k, v]) => {
        if (v && typeof v === "string" && !["Willow Type", "Grade", "Handle", "Weight", "Dimensions", "Player Level"].includes(k)) {
          initialSpecs.push({ key: k, value: v });
        }
      });
    }
    setCustomSpecs(initialSpecs);
  };

  const closeEditModal = () => {
    if (isSavingProduct) return;
    setEditingProduct(null);
    setEditError(null);
  };

  // Image Management
  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (!galleryImages.includes(trimmed)) {
      const nextImages = [...galleryImages, trimmed];
      setGalleryImages(nextImages);
      if (!formData.image) {
        setFormData(prev => ({ ...prev, image: trimmed }));
      }
    }
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const nextImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(nextImages);
    if (formData.image === galleryImages[index]) {
      setFormData(prev => ({ ...prev, image: nextImages[0] || "" }));
    }
  };

  const handleSetPrimaryImage = (imgUrl: string) => {
    setFormData(prev => ({ ...prev, image: imgUrl }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result && !galleryImages.includes(result)) {
          setGalleryImages(prev => {
            const updated = [...prev, result];
            if (!formData.image) {
              setFormData(f => ({ ...f, image: result }));
            }
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Custom Specs Management
  const handleAddSpecRow = () => {
    setCustomSpecs(prev => [...prev, { key: "", value: "" }]);
  };

  const handleUpdateSpecRow = (index: number, field: "key" | "value", text: string) => {
    setCustomSpecs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: text };
      return updated;
    });
  };

  const handleRemoveSpecRow = (index: number) => {
    setCustomSpecs(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Full Product Edit
  const handleProductUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!formData.name.trim()) {
      setEditError("Product name is required.");
      setEditTab("details");
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setEditError("A valid selling price (>= 0) is required.");
      setEditTab("details");
      return;
    }

    const stockNum = Number(formData.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      setEditError("Stock quantity must be a non-negative number.");
      setEditTab("details");
      return;
    }

    try {
      setIsSavingProduct(true);
      setEditError(null);

      // Build specs map
      const specsMap: Record<string, string> = {};
      if (formData.willowType) specsMap["Willow Type"] = formData.willowType;
      if (formData.willowGrade) specsMap["Grade"] = formData.willowGrade;
      if (formData.handleSize) specsMap["Handle"] = formData.handleSize;
      if (formData.weight) specsMap["Weight"] = formData.weight;
      if (formData.dimensions) specsMap["Dimensions"] = formData.dimensions;
      if (formData.playerLevel) specsMap["Player Level"] = formData.playerLevel;
      customSpecs.forEach(s => {
        if (s.key.trim() && s.value.trim()) {
          specsMap[s.key.trim()] = s.value.trim();
        }
      });

      // Split comma separated arrays
      const colorsArr = formData.colors.split(",").map(s => s.trim()).filter(Boolean);
      const sizesArr = formData.sizes.split(",").map(s => s.trim()).filter(Boolean);
      const highlightsArr = formData.highlightsInput.split("\n").map(s => s.trim()).filter(Boolean);

      const primaryImg = formData.image || galleryImages[0] || editingProduct.image || "/cricket_bat_studio.jpg";
      const finalImages = galleryImages.length > 0 ? galleryImages : [primaryImg];

      const payload = {
        id: editingProduct.id,
        name: formData.name.trim(),
        brand: formData.brand.trim() || "RP Sports",
        category: formData.category.trim(),
        subcategory: formData.subcategory.trim(),
        sportsType: formData.sportsType.trim(),
        price: priceNum,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : priceNum,
        stock: stockNum,
        deliveryDays: Number(formData.deliveryDays) || 3,
        image: primaryImg,
        images: finalImages,
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        highlights: highlightsArr,
        willowType: formData.willowType.trim(),
        willowGrade: formData.willowGrade.trim(),
        handleSize: formData.handleSize.trim(),
        playerLevel: formData.playerLevel.trim(),
        weight: formData.weight.trim(),
        dimensions: formData.dimensions.trim(),
        countryOfOrigin: formData.countryOfOrigin.trim(),
        manufacturerDetails: formData.manufacturerDetails.trim(),
        badge: formData.badge === "None" ? "" : formData.badge,
        featured: formData.featured,
        customizable: formData.customizable,
        enableJerseyCustomization: formData.enableJerseyCustomization,
        colors: colorsArr,
        sizes: sizesArr,
        specifications: specsMap,
        specs: specsMap,
        sku: formData.sku.trim() || editingProduct.sku || editingProduct.id,
      };

      let idToken = "mock_admin_bypass_token";
      if (auth.currentUser) {
        idToken = await auth.currentUser.getIdToken();
      }

      const res = await fetch("/api/admin/products/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save product changes.");
      }

      // Update in Zustand Store
      const updatedProductObj: Product = {
        ...editingProduct,
        ...payload,
      };
      updateProduct(updatedProductObj);

      showToast(`Product '${formData.name}' saved successfully!`, "success");
      closeEditModal();
    } catch (err: any) {
      setEditError(err.message || "An error occurred while saving product.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000]">
            Catalog & Inventory Management
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-primary tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Manage Store Products
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Search, edit full specifications, adjust live stock, or add new sports gear to the catalog.
          </p>
        </div>
        <Link 
          href="/admin/add-product" 
          className="px-6 py-3 bg-[#CC0000] text-white font-display font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[#990000] transition-colors flex items-center gap-2 shadow-lg shadow-[#CC0000]/20 whitespace-nowrap cursor-pointer"
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
        >
          <PlusCircle className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products by title, category, brand or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#CC0000] text-sm font-medium"
            />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:block">
            {filteredProducts.length} Items Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Product Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-slate-500 font-bold">
                    No products found matching "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img 
                        src={p.image || p.images?.[0] || "/cricket_bat_studio.jpg"} 
                        alt={p.name} 
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-primary">{p.name}</p>
                          {p.badge && (
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-100 text-[#CC0000]">
                              {p.badge}
                            </span>
                          )}
                          {p.featured && (
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono">SKU: {p.sku || p.id} • Brand: {p.brand || "RP Sports"}</p>
                      </div>
                    </td>
                    <td className="p-4 capitalize">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-primary">
                      <div>
                        <span>₹{p.price.toLocaleString("en-IN")}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs text-slate-400 line-through ml-1.5 font-normal">
                            ₹{p.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        p.stock > 10 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : p.stock > 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* FULL EDIT PRODUCT BUTTON */}
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="px-3 py-1.5 bg-[#111111] hover:bg-[#CC0000] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                          title="Edit full product details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Product</span>
                        </button>

                        {/* QUICK STOCK BUTTON */}
                        <button
                          type="button"
                          onClick={() => openStockModal(p)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                          title="Quick update stock quantity"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#CC0000]" />
                          <span>Stock</span>
                        </button>
                        
                        {/* DELETE BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete product "${p.name}" from store catalog?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FULL PRODUCT EDIT MODAL / DRAWER ── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#111111] to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#CC0000] flex items-center justify-center shadow-md">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl uppercase tracking-wider text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Edit Product: {editingProduct.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Product ID: {editingProduct.id} • SKU: {formData.sku || editingProduct.sku}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                disabled={isSavingProduct}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-5 shrink-0 overflow-x-auto">
              {[
                { id: "details", label: "Basic & Pricing" },
                { id: "images", label: `Images (${galleryImages.length})` },
                { id: "specs", label: "Specs & Sizing" },
                { id: "descriptions", label: "Descriptions & Highlights" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEditTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    editTab === tab.id
                      ? "border-[#CC0000] text-[#CC0000] bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Body */}
            <form onSubmit={handleProductUpdateSubmit} className="flex flex-col overflow-hidden flex-grow">
              <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                
                {editError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                {/* TAB 1: BASIC & PRICING */}
                {editTab === "details" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Product Name / Title *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="e.g. RP 7070 Club Select Cricket Bat"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Brand
                        </label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="e.g. RP Sports"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          SKU Code
                        </label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="e.g. RP-BAT-7070"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Primary Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#CC0000] capitalize"
                        >
                          {activeCategories.map((c) => (
                            <option key={c.id || c.name} value={c.id || c.name.toLowerCase()}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Subcategory
                        </label>
                        <input
                          type="text"
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="e.g. English Willow, Kashmir Willow, Spikes, Jerseys"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Selling Price (₹) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-[#CC0000] focus:outline-none focus:border-[#CC0000]"
                          placeholder="5500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          MRP / Original Price (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="6999"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Current Stock (Units) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          required
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="15"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Delivery Estimate (Days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={formData.deliveryDays}
                          onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="3"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Promotional Badge
                        </label>
                        <select
                          value={formData.badge}
                          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                        >
                          <option value="None">None</option>
                          <option value="New Arrival">New Arrival</option>
                          <option value="Best Seller">Best Seller</option>
                          <option value="Limited Edition">Limited Edition</option>
                          <option value="Hot Deal">Hot Deal</option>
                          <option value="Pro Grade">Pro Grade</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-6 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                          <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-4 h-4 rounded text-[#CC0000] focus:ring-[#CC0000]"
                          />
                          <span>Featured Product</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                          <input
                            type="checkbox"
                            checked={formData.customizable}
                            onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                            className="w-4 h-4 rounded text-[#CC0000] focus:ring-[#CC0000]"
                          />
                          <span>Allow Knocking / Customization</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#CC0000] bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                          <input
                            type="checkbox"
                            checked={formData.enableJerseyCustomization}
                            onChange={(e) => setFormData({ ...formData, enableJerseyCustomization: e.target.checked })}
                            className="w-4 h-4 rounded text-[#CC0000] focus:ring-[#CC0000]"
                          />
                          <span>Enable Jersey Name & Number Customization</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: IMAGES & GALLERY */}
                {editTab === "images" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Add Image via URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://example.com/cricket-bat.jpg or /cricket_bat_studio.jpg"
                          className="flex-grow px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#CC0000]"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-5 py-2.5 bg-[#111111] hover:bg-[#CC0000] text-white font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Or Upload Images from Computer
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-6 border-2 border-dashed border-slate-300 hover:border-[#CC0000] rounded-xl flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-red-50/20 transition-colors cursor-pointer"
                      >
                        <UploadCloud className="w-8 h-8 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">Click to Browse and Upload Product Photos</span>
                        <span className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP files</span>
                      </button>
                    </div>

                    {/* Gallery Grid */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                        Product Gallery Images ({galleryImages.length})
                      </label>
                      {galleryImages.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No images attached yet.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {galleryImages.map((img, idx) => (
                            <div key={idx} className="relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-100 aspect-square">
                              <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                              
                              {/* Primary Badge */}
                              {formData.image === img ? (
                                <span className="absolute top-2 left-2 bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                                  Primary
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(img)}
                                  className="absolute top-2 left-2 bg-black/60 hover:bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  Set Primary
                                </button>
                              )}

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Remove photo"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: SPECS & SIZING */}
                {editTab === "specs" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Willow Type / Material
                        </label>
                        <input
                          type="text"
                          value={formData.willowType}
                          onChange={(e) => setFormData({ ...formData, willowType: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="e.g. Grade 1 English Willow / Kashmir Willow / TPU"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Willow Grade
                        </label>
                        <input
                          type="text"
                          value={formData.willowGrade}
                          onChange={(e) => setFormData({ ...formData, willowGrade: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="e.g. Grade 1+, Grade 2, Club Select"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Handle Type & Size
                        </label>
                        <input
                          type="text"
                          value={formData.handleSize}
                          onChange={(e) => setFormData({ ...formData, handleSize: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="e.g. Short Handle (SH), Semi-Oval 12-Piece Cane"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Weight Range
                        </label>
                        <input
                          type="text"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="e.g. 1160 - 1200 grams (2lb 9oz - 2lb 10oz)"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Available Sizes (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={formData.sizes}
                          onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="e.g. Short Handle (SH), Harrow, Size 6, Size 5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Available Colors (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={formData.colors}
                          onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#CC0000]"
                          placeholder="e.g. Natural Grain, White / Red, Midnight Black"
                        />
                      </div>
                    </div>

                    {/* Custom Specs Table */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Additional Technical Specifications
                        </label>
                        <button
                          type="button"
                          onClick={handleAddSpecRow}
                          className="text-xs text-[#CC0000] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Custom Spec
                        </button>
                      </div>

                      {customSpecs.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No custom technical specs added.</p>
                      ) : (
                        <div className="space-y-2">
                          {customSpecs.map((row, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Spec Name (e.g. Edge Thickness)"
                                value={row.key}
                                onChange={(e) => handleUpdateSpecRow(idx, "key", e.target.value)}
                                className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-[#CC0000]"
                              />
                              <input
                                type="text"
                                placeholder="Spec Value (e.g. 40mm - 42mm)"
                                value={row.value}
                                onChange={(e) => handleUpdateSpecRow(idx, "value", e.target.value)}
                                className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#CC0000]"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecRow(idx)}
                                className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: DESCRIPTIONS & HIGHLIGHTS */}
                {editTab === "descriptions" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Short Summary Description
                      </label>
                      <textarea
                        rows={2}
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#CC0000]"
                        placeholder="Brief 1-2 sentence product overview for catalog cards..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Detailed Description
                      </label>
                      <textarea
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#CC0000]"
                        placeholder="Comprehensive product details, willow selection, knocking guidelines, performance attributes..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Feature Bullet Highlights (One bullet point per line)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.highlightsInput}
                        onChange={(e) => setFormData({ ...formData, highlightsInput: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-[#CC0000]"
                        placeholder={"Handcrafted Grade 1 Willow\n40mm Massive Edges with Duckbill Toe\nUltra Balanced Featherlight Pickup\nFree Laser Knocking & Oiling Included"}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="text-xs text-slate-500 font-medium">
                  {formData.originalPrice && Number(formData.originalPrice) > Number(formData.price) && (
                    <span className="text-emerald-600 font-bold">
                      Discount: {Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)}% OFF
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={isSavingProduct}
                    className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="px-6 py-2.5 bg-[#CC0000] hover:bg-[#990000] disabled:bg-slate-300 text-white font-display font-bold text-sm uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-[#CC0000]/20 cursor-pointer"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {isSavingProduct ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── QUICK EDIT STOCK MODAL ── */}
      {selectedStockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#CC0000]/20 border border-[#CC0000]/40 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-[#CC0000]" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase tracking-wider text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Edit Product Stock
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">SKU: {selectedStockProduct.sku || selectedStockProduct.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeStockModal}
                disabled={isUpdatingStock}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleStockUpdateSubmit} className="p-6 space-y-5">
              
              {/* Product Banner */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <img
                  src={selectedStockProduct.image || selectedStockProduct.images?.[0] || "/cricket_bat_studio.jpg"}
                  alt={selectedStockProduct.name}
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{selectedStockProduct.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span className="capitalize">{selectedStockProduct.category}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-700">₹{selectedStockProduct.price.toLocaleString("en-IN")}</span>
                    <span>•</span>
                    <span className="font-bold text-[#CC0000]">Current: {selectedStockProduct.stock ?? 0} units</span>
                  </div>
                </div>
              </div>

              {/* Error Notice */}
              {stockError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{stockError}</span>
                </div>
              )}

              {/* New Stock Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  New Stock Quantity (Units)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    step="1"
                    value={stockInput}
                    onChange={(e) => {
                      setStockInput(e.target.value);
                      setStockError(null);
                    }}
                    disabled={isUpdatingStock}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-display font-black text-xl text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white transition-all font-mono"
                    placeholder="0"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Units
                  </div>
                </div>
              </div>

              {/* Quick Increment Deltas */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Quick Adjust:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "+5", delta: 5, bg: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" },
                    { label: "+10", delta: 10, bg: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" },
                    { label: "+25", delta: 25, bg: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" },
                    { label: "+50", delta: 50, bg: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" },
                    { label: "-5", delta: -5, bg: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200" },
                    { label: "-10", delta: -10, bg: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200" },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      disabled={isUpdatingStock}
                      onClick={() => handleQuickDelta(btn.delta)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${btn.bg}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={isUpdatingStock}
                    onClick={() => setStockInput("0")}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer ml-auto"
                  >
                    Set to 0
                  </button>
                </div>
              </div>

              {/* Adjustment Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Adjustment Reason / Audit Note <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  disabled={isUpdatingStock}
                  placeholder="e.g. Received new stock batch, Damaged in warehouse, Returned order"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#CC0000] focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeStockModal}
                  disabled={isUpdatingStock}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStock}
                  className="px-6 py-2.5 bg-[#CC0000] hover:bg-[#990000] disabled:bg-slate-300 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-[#CC0000]/20 cursor-pointer"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                >
                  {isUpdatingStock ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save Stock</span>
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
