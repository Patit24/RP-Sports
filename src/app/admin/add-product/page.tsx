"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { BRANDS, CATEGORIES } from "@/lib/mockData";
import { 
  PlusCircle, Image as ImageIcon, CheckCircle, Package, 
  IndianRupee, Tag, ShieldCheck, ListChecks, Sparkles, Plus, Trash2,
  UploadCloud, X, Star, Camera, Footprints, Shirt, Glasses, Trophy, Flame
} from "lucide-react";

interface CustomSpecRow {
  key: string;
  value: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct, currentUser, categories, setCategories, showToast } = useStore();
  const activeCategories = categories && categories.length > 0 ? categories : CATEGORIES;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Brands State
  const [brandsList, setBrandsList] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("rp_custom_brands");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return Array.from(new Set([...BRANDS, ...parsed]));
          }
        }
      } catch (e) {
        console.warn("Could not load custom brands:", e);
      }
    }
    return BRANDS;
  });

  // Modal Dialog States for on-the-fly creation
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySubcategories, setNewCategorySubcategories] = useState("");

  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  // Subcategory Template Types
  const [productType, setProductType] = useState<"bats" | "jerseys" | "shoes" | "trackpants" | "sunglasses" | "caps" | "trophies">("bats");

  const [formData, setFormData] = useState({
    name: "",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    sportsType: "Cricket",
    willowType: "",
    willowGrade: "",
    handleSize: "",
    playerLevel: "",
    mrp: "",
    price: "",
    stock: "",
    deliveryDays: "3",
    description: "",
    shortDescription: "",
    highlightsInput: "",
    weight: "",
    dimensions: "",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum Metro Gate 2, Kolkata – 700028",
    badge: "New Arrival",
    featured: false,
    customizable: false,
    enableJerseyCustomization: false,
    customizationFee: "150",
    colors: "",
    sizes: "",
  });

  // Uploaded Photos (Data URLs from Desktop or Live Camera Capture)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [customSpecs, setCustomSpecs] = useState<CustomSpecRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return null;
  }

  // Helper to detect Product Type based on Category or Subcategory
  const detectProductType = (cat: string, subcat: string): "bats" | "jerseys" | "shoes" | "trackpants" | "sunglasses" | "caps" | "trophies" => {
    const c = (cat || "").toLowerCase();
    const s = (subcat || "").toLowerCase();

    if (c === "footwear" || s.includes("shoe") || s.includes("spike") || s.includes("boot") || s.includes("cleat") || s.includes("footwear")) {
      return "shoes";
    }
    if (s.includes("track") || s.includes("pant") || s.includes("trouser") || s.includes("bottom")) {
      return "trackpants";
    }
    if (s.includes("glass") || s.includes("sunglass") || s.includes("goggle") || s.includes("eyewear")) {
      return "sunglasses";
    }
    if (s.includes("cap") || s.includes("visor") || s.includes("hat")) {
      return "caps";
    }
    if (c === "custom-trophies" || s.includes("trophy") || s.includes("award") || s.includes("cup") || s.includes("shield") || s.includes("plaque")) {
      return "trophies";
    }
    if (c === "apparel" || s.includes("jersey") || s.includes("shirt") || s.includes("tee") || s.includes("kit")) {
      return "jerseys";
    }
    return "bats";
  };

  // Handler: Create Brand on the fly
  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBrand = newBrandName.trim();
    if (!cleanBrand) {
      showToast("Please enter a valid brand name", "error");
      return;
    }

    if (!brandsList.includes(cleanBrand)) {
      const updated = [...brandsList, cleanBrand];
      setBrandsList(updated);
      try {
        localStorage.setItem("rp_custom_brands", JSON.stringify(updated));
      } catch (err) {
        console.warn("localStorage note:", err);
      }
    }

    setFormData(prev => ({ ...prev, brand: cleanBrand }));
    setNewBrandName("");
    setIsBrandModalOpen(false);
    showToast(`Brand "${cleanBrand}" created & selected!`, "success");
  };

  // Handler: Create Category on the fly
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCatName = newCategoryName.trim();
    if (!cleanCatName) {
      showToast("Please enter a category name", "error");
      return;
    }

    const slug = cleanCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const subs = newCategorySubcategories
      .split(",")
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const newCategory: any = {
      id: slug,
      name: cleanCatName,
      image: "/category_cricket_1783225297200.jpg",
      subcategories: subs.length > 0 ? subs : ["general"],
      featured: true,
      description: `Premium ${cleanCatName} collection at RP Sports Kolkata.`
    };

    try {
      const { saveCategory } = await import("@/lib/firestoreService");
      await saveCategory(newCategory);
    } catch (err) {
      console.warn("Firestore saveCategory note:", err);
    }

    const updatedCategories = [...activeCategories.filter(c => c.id !== slug), newCategory];
    setCategories(updatedCategories);

    setFormData(prev => ({
      ...prev,
      category: slug,
      subcategory: newCategory.subcategories[0] || "",
      sportsType: cleanCatName
    }));

    const detected = detectProductType(slug, newCategory.subcategories[0] || "");
    setProductType(detected);

    setNewCategoryName("");
    setNewCategorySubcategories("");
    setIsCategoryModalOpen(false);
    showToast(`Category "${cleanCatName}" created & selected!`, "success");
  };

  // Handler: Create Subcategory on the fly
  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSub = newSubcategoryName.trim().toLowerCase();
    if (!cleanSub) {
      showToast("Please enter a subcategory name", "error");
      return;
    }

    const currentCat = activeCategories.find(c => c.id === formData.category);
    if (!currentCat) {
      showToast("Please select a main category first", "error");
      return;
    }

    const currentSubs = currentCat.subcategories || [];
    if (!currentSubs.includes(cleanSub)) {
      const updatedSubs = [...currentSubs, cleanSub];
      const updatedCat = { ...currentCat, subcategories: updatedSubs };

      try {
        const { saveCategory } = await import("@/lib/firestoreService");
        await saveCategory(updatedCat);
      } catch (err) {
        console.warn("Firestore saveCategory note:", err);
      }

      const updatedCategories = activeCategories.map(c => c.id === currentCat.id ? updatedCat : c);
      setCategories(updatedCategories);
    }

    setFormData(prev => ({ ...prev, subcategory: cleanSub }));
    const detected = detectProductType(formData.category, cleanSub);
    setProductType(detected);

    setNewSubcategoryName("");
    setIsSubcategoryModalOpen(false);
    showToast(`Subcategory "${cleanSub}" added & selected!`, "success");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "category") {
      const selectedCat = activeCategories.find(c => c.id === value);
      const defaultSub = selectedCat && selectedCat.subcategories && selectedCat.subcategories.length > 0
        ? selectedCat.subcategories[0]
        : "";
      setFormData(prev => ({
        ...prev,
        category: value,
        subcategory: defaultSub
      }));
      const detected = detectProductType(value, defaultSub);
      setProductType(detected);
    } else if (name === "subcategory") {
      const detected = detectProductType(formData.category, value);
      setFormData(prev => ({ ...prev, subcategory: value }));
      setProductType(detected);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Dynamic labels helper based on current active productType
  const getSpecLabels = (type: string) => {
    switch (type) {
      case "shoes":
        return {
          header: "TECHNICAL SPECIFICATIONS (FOOTWEAR & SPIKES)",
          label1: "Outsole & Spike Soleplate Type",
          placeholder1: "e.g. TPU Plate with 11 Steel Spikes / Rubber Turf Studs",
          label2: "Upper Material & Cushioning",
          placeholder2: "e.g. Synthetic Leather & High Bounce EVA",
          label3: "Ankle Cut & Support Style",
          placeholder3: "e.g. Low Cut Padded Collar / Mid Ankle Shield"
        };
      case "jerseys":
        return {
          header: "TECHNICAL SPECIFICATIONS (MATCH JERSEYS)",
          label1: "Fabric Mesh Material",
          placeholder1: "e.g. 100% Micro-Polyester Dri-Fit Mesh",
          label2: "Fit Type & Sublimation",
          placeholder2: "e.g. Athletic Slim Fit / HD Sublimation",
          label3: "Neck Collar & Sleeve Style",
          placeholder3: "e.g. Polo Collar / Half Sleeve"
        };
      case "trackpants":
        return {
          header: "TECHNICAL SPECIFICATIONS (TRACK PANTS)",
          label1: "Stretch Fabric Blend",
          placeholder1: "e.g. 92% Polyester, 8% Elastane Stretch",
          label2: "Pocket Style",
          placeholder2: "e.g. 2 Deep YKK Zipper Pockets",
          label3: "Waistband & Ankle Cuff",
          placeholder3: "e.g. Elastic Waistband + Zippered Ankle"
        };
      case "sunglasses":
        return {
          header: "TECHNICAL SPECIFICATIONS (SUNGLASSES)",
          label1: "Lens Tech & UV Protection",
          placeholder1: "e.g. Polarized REVO Mirror UV400",
          label2: "Frame Polymer Material",
          placeholder2: "e.g. TR90 Flexible Polymer",
          label3: "Nose Pad & Frame Style",
          placeholder3: "e.g. Adjustable Hydrophilic Rubber"
        };
      case "caps":
        return {
          header: "TECHNICAL SPECIFICATIONS (CAPS & VISORS)",
          label1: "Visor Brim Style",
          placeholder1: "e.g. Curved Pre-Formed Visor",
          label2: "Sweatband Technology",
          placeholder2: "e.g. Moisture-Wicking Terry Cloth",
          label3: "Adjustment Back Strap",
          placeholder3: "e.g. Velcro Strap with Rubber Tab"
        };
      case "trophies":
        return {
          header: "TECHNICAL SPECIFICATIONS (TROPHIES & AWARDS)",
          label1: "Plating Finish Material",
          placeholder1: "e.g. 24K Gold Electroplated Brass",
          label2: "Pedestal Base Material",
          placeholder2: "e.g. Solid Dark Walnut Wood",
          label3: "Laser Engraving Plaque",
          placeholder3: "e.g. Custom Laser Etched Brass"
        };
      case "bats":
      default:
        return {
          header: "TECHNICAL SPECIFICATIONS (CRICKET BATS)",
          label1: "Willow / Wood Type",
          placeholder1: "e.g. Grade A+ Kashmir Willow / Grade 1 English Willow",
          label2: "Willow Grade Standard",
          placeholder2: "e.g. Grade A+, Grade 1 Pro",
          label3: "Handle Size & Cane Grip",
          placeholder3: "e.g. Short Handle (SH), 9-Piece Cane Rubber Grip"
        };
    }
  };

  const specLabels = getSpecLabels(productType);

  // Process Photos Picked from File Explorer / Desktop
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newImages: string[] = [];
    let processed = 0;

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        processed++;
        if (processed === fileList.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // Process Live Photo Captured with Device Camera
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImages((prev) => [event.target?.result as string, ...prev]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetMainImage = (indexToMakeMain: number) => {
    setUploadedImages(prev => {
      const updated = [...prev];
      const selected = updated.splice(indexToMakeMain, 1)[0];
      return [selected, ...updated];
    });
  };

  const handleAddSpecRow = () => {
    setCustomSpecs(prev => [...prev, { key: "", value: "" }]);
  };

  const handleSpecRowChange = (index: number, field: "key" | "value", val: string) => {
    setCustomSpecs(prev => {
      const updated = [...prev];
      updated[index][field] = val;
      return updated;
    });
  };

  const handleRemoveSpecRow = (index: number) => {
    setCustomSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.mrp) {
      alert("Please fill in required product fields (Product Title, MRP, Sale Price).");
      return;
    }

    if (uploadedImages.length === 0) {
      alert("Please upload or capture at least 1 product photo.");
      return;
    }

    setIsSubmitting(true);

    const highlights = formData.highlightsInput
      .split("\n")
      .map(h => h.trim())
      .filter(Boolean);

    const colors = formData.colors.split(",").map(c => c.trim()).filter(Boolean);
    const sizes = formData.sizes.split(",").map(s => s.trim()).filter(Boolean);

    const specificationsObj: Record<string, string> = {
      "Brand": formData.brand,
      [specLabels.label1]: formData.willowType || "Standard Material",
      [specLabels.label2]: formData.willowGrade || "Standard Grade",
      [specLabels.label3]: formData.handleSize || "Standard Fit",
      "Weight": formData.weight || "Standard Weight",
      "Dimensions": formData.dimensions || "Standard Dimensions",
      "Country of Origin": formData.countryOfOrigin || "India",
      "Manufacturer": formData.manufacturerDetails || "RP Sports Works, Dumdum, Kolkata",
    };

    customSpecs.forEach(row => {
      if (row.key.trim() && row.value.trim()) {
        specificationsObj[row.key.trim()] = row.value.trim();
      }
    });

    const newProduct = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      subcategory: formData.subcategory,
      image: uploadedImages[0],
      images: uploadedImages,
      gallery: uploadedImages,
      mrp: Number(formData.mrp),
      originalPrice: Number(formData.mrp),
      price: Number(formData.price),
      rating: 5.0,
      reviewCount: 1,
      reviewsCount: 1,
      deliveryDays: Number(formData.deliveryDays) || 3,
      stock: Number(formData.stock) || 10,
      description: formData.description,
      shortDescription: formData.shortDescription,
      highlights: highlights.length > 0 ? highlights : ["Premium RP Sports Construction", "Handcrafted Quality"],
      specs: specificationsObj,
      specifications: specificationsObj,
      colors,
      sizes,
      sportsType: formData.sportsType,
      weight: formData.weight,
      dimensions: formData.dimensions,
      badge: formData.badge ? formData.badge : undefined,
      featured: Boolean(formData.featured),
      customizable: Boolean(formData.customizable),
      enableJerseyCustomization: Boolean(formData.enableJerseyCustomization),
      customizationFee: Number(formData.customizationFee) || 150,
      willowType: formData.willowType,
      willowGrade: formData.willowGrade,
      handleSize: formData.handleSize,
      playerLevel: formData.playerLevel,
      countryOfOrigin: formData.countryOfOrigin || "India",
      manufacturerDetails: formData.manufacturerDetails || "RP Sports Works, Dumdum, Kolkata – 700028"
    };

    addProduct(newProduct);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/shop");
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto pb-16">
      
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-xs font-display font-bold uppercase tracking-widest text-[#CC0000]">
          RP Admin Equipment Manager
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-[#111111] tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Add & Upload Product to Catalog
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Fill in product details, upload high-resolution equipment photography, and set technical specifications for the storefront.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Package className="w-5 h-5 text-[#CC0000]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              1. Basic Product Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Product Title / Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. RP Pro Carbon Match Jersey 2026"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700">
                  Brand Name
                </label>
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(true)}
                  className="text-xs font-bold text-[#CC0000] hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> <span>+ Create Brand</span>
                </button>
              </div>
              <select
                name="brand"
                value={formData.brand}
                onChange={(e) => {
                  if (e.target.value === "__add_new__") {
                    setIsBrandModalOpen(true);
                  } else {
                    handleChange(e);
                  }
                }}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] bg-white focus:outline-none focus:border-[#CC0000] cursor-pointer"
              >
                {brandsList.map((b: string) => (
                  <option key={b} value={b}>{b}</option>
                ))}
                <option value="__add_new__" className="font-bold text-[#CC0000]">+ Create New Brand...</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700">
                  Main Category
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-[11px] font-bold text-[#CC0000] hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> <span>+ New Category</span>
                </button>
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  if (e.target.value === "__add_new__") {
                    setIsCategoryModalOpen(true);
                  } else {
                    handleChange(e);
                  }
                }}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] bg-white focus:outline-none focus:border-[#CC0000] cursor-pointer"
              >
                {activeCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
                <option value="__add_new__" className="font-bold text-[#CC0000]">+ Create New Category...</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700">
                  Subcategory Tag
                </label>
                <button
                  type="button"
                  onClick={() => setIsSubcategoryModalOpen(true)}
                  className="text-[11px] font-bold text-[#CC0000] hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> <span>+ New Subcategory</span>
                </button>
              </div>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={(e) => {
                  if (e.target.value === "__add_new__") {
                    setIsSubcategoryModalOpen(true);
                  } else {
                    handleChange(e);
                  }
                }}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] bg-white focus:outline-none focus:border-[#CC0000] cursor-pointer"
              >
                {activeCategories.find(c => c.id === formData.category)?.subcategories?.map((sub) => (
                  <option key={sub} value={sub}>{sub.charAt(0).toUpperCase() + sub.slice(1)}</option>
                ))}
                <option value="__add_new__" className="font-bold text-[#CC0000]">+ Create New Subcategory...</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Badge Tag Highlight
              </label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] bg-white focus:outline-none focus:border-[#CC0000]"
              >
                <option value="Bestseller">Bestseller</option>
                <option value="New Arrival">New Arrival</option>
                <option value="Trending">Trending</option>
                <option value="Special Sale">Special Sale</option>
                <option value="Pro Edition">Pro Edition</option>
                <option value="Limited Edition">Limited Edition</option>
                <option value="Customizable">Customizable</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-[#CC0000] accent-[#CC0000]"
              />
              Show on Homepage Featured Carousel
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="customizable"
                checked={formData.customizable}
                onChange={handleChange}
                className="w-4 h-4 text-[#CC0000] accent-[#CC0000]"
              />
              Enable Custom Name/Number Customizer (Jerseys/Trophies)
            </label>
          </div>

        </div>

        {/* Section 2: Dynamic Category Specifications */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#CC0000]" />
              <h2 className="text-lg font-display font-bold uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                2. {specLabels.header}
              </h2>
            </div>
            <span className="text-xs font-bold bg-red-50 text-[#CC0000] px-3 py-1 rounded-full uppercase tracking-wider">
              {productType.toUpperCase()} MODE ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                {specLabels.label1}
              </label>
              <input
                type="text"
                name="willowType"
                value={formData.willowType}
                onChange={handleChange}
                placeholder={specLabels.placeholder1}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                {specLabels.label2}
              </label>
              <input
                type="text"
                name="willowGrade"
                value={formData.willowGrade}
                onChange={handleChange}
                placeholder={specLabels.placeholder2}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                {specLabels.label3}
              </label>
              <input
                type="text"
                name="handleSize"
                value={formData.handleSize}
                onChange={handleChange}
                placeholder={specLabels.placeholder3}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Weight
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 750 grams"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Dimensions / Sizing
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="e.g. 32cm x 20cm x 12cm"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Country of Origin
              </label>
              <input
                type="text"
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Target Sports / Player Level
              </label>
              <input
                type="text"
                name="playerLevel"
                value={formData.playerLevel}
                onChange={handleChange}
                placeholder="e.g. Cricket / Football / Athletics"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Manufacturer & Workshop Address
            </label>
            <input
              type="text"
              name="manufacturerDetails"
              value={formData.manufacturerDetails}
              onChange={handleChange}
              placeholder="e.g. RP Sports Works, Dumdum Metro Gate 2, Kolkata – 700028"
              className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
            />
          </div>

        </div>

        {/* Section 3: Pricing, Inventory & Sizes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <IndianRupee className="w-5 h-5 text-[#CC0000]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              3. Pricing, Inventory & Available Sizes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Original MRP (₹) *
              </label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                placeholder="4999"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="3499"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Initial Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Est. Delivery (Days)
              </label>
              <input
                type="number"
                name="deliveryDays"
                value={formData.deliveryDays}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Available Sizes (Comma-Separated)
              </label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                placeholder="e.g. UK 7, UK 8, UK 9, UK 10, UK 11 or S, M, L, XL"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Available Colors (Comma-Separated)
              </label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                placeholder="e.g. White / Crimson Red, Black / Gold"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                name="customizable"
                checked={formData.customizable}
                onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                className="w-4 h-4 rounded text-[#CC0000] focus:ring-[#CC0000]"
              />
              <span>Allow General Customization / Knocking</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#CC0000] bg-red-50 px-3.5 py-2 rounded-xl border border-red-200">
              <input
                type="checkbox"
                name="enableJerseyCustomization"
                checked={formData.enableJerseyCustomization}
                onChange={(e) => setFormData({ ...formData, enableJerseyCustomization: e.target.checked })}
                className="w-4 h-4 rounded text-[#CC0000] focus:ring-[#CC0000]"
              />
              <span>Enable Jersey Name & Number Customization</span>
            </label>
          </div>

          {formData.enableJerseyCustomization && (
            <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200 space-y-2 mt-4">
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-800">
                Custom Printing Extra Fee (₹)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  name="customizationFee"
                  value={formData.customizationFee}
                  onChange={handleChange}
                  className="w-40 h-10 px-3 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] bg-white focus:outline-none focus:border-[#CC0000]"
                  placeholder="150"
                />
                <span className="text-xs text-gray-500 font-medium">
                  Additional fee charged when customer selects custom name & number printing (e.g. ₹150). Set 0 for free custom printing.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Descriptions & Bullet Highlights */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <ListChecks className="w-5 h-5 text-[#CC0000]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              4. Descriptions & Key Bullet Highlights
            </h2>
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Short Summary Description (Shown in Quick Views & Search Cards)
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Summary phrase..."
              className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-medium text-[#111111] focus:outline-none focus:border-[#CC0000]"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Detailed Product Description (Shown on Main Product Page)
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Write detailed craftsmanship & performance information..."
              className="w-full p-4 border border-gray-300 rounded-xl text-sm font-medium text-[#111111] focus:outline-none focus:border-[#CC0000]"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Bullet Highlights (One key feature per line)
            </label>
            <textarea
              name="highlightsInput"
              rows={4}
              value={formData.highlightsInput}
              onChange={handleChange}
              placeholder="Key feature 1&#10;Key feature 2&#10;Key feature 3"
              className="w-full p-4 border border-gray-300 rounded-xl text-xs font-mono text-[#111111] focus:outline-none focus:border-[#CC0000]"
            />
          </div>

        </div>

        {/* Section 5: Custom Specs Editor Table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#CC0000]" />
              <h2 className="text-lg font-display font-bold uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                5. Custom Specifications Table Editor
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddSpecRow}
              className="text-xs font-bold text-[#CC0000] hover:text-[#990000] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Specification Row
            </button>
          </div>

          <div className="space-y-3">
            {customSpecs.map((row, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Feature Name (e.g. Outsole / Spike Type)"
                  value={row.key}
                  onChange={(e) => handleSpecRowChange(index, "key", e.target.value)}
                  className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-xs font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                />
                <input
                  type="text"
                  placeholder="Specification Value (e.g. TPU Plate with 11 Steel Spikes)"
                  value={row.value}
                  onChange={(e) => handleSpecRowChange(index, "value", e.target.value)}
                  className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-xs font-medium text-[#111111] focus:outline-none focus:border-[#CC0000]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecRow(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Image Upload & Live Camera Capture */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#CC0000]" />
              <h2 className="text-lg font-display font-bold uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                6. Product Photos (Desktop Upload & Live Camera Snap)
              </h2>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {uploadedImages.length} Image{uploadedImages.length !== 1 ? 's' : ''} Uploaded
            </span>
          </div>

          {/* Hidden Device File Picker Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />

          {/* Hidden Live Camera Capture Input */}
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleCameraCapture}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* Upload & Camera Buttons Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Desktop / Gallery File Picker */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-[#CC0000] bg-gray-50 hover:bg-red-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-[#CC0000] transition-transform">
                <UploadCloud className="w-6 h-6 text-[#CC0000]" />
              </div>
              <h3 className="font-display font-bold text-sm uppercase text-[#111111] mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Upload Saved Photos from Desktop
              </h3>
              <p className="text-[11px] text-gray-500 font-medium mb-3">
                Select stored images from Mac/PC desktop or photo gallery (JPG, PNG, WEBP).
              </p>
              <span className="bg-[#111111] group-hover:bg-[#CC0000] text-white text-[11px] font-bold uppercase px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Select Files from Computer
              </span>
            </div>

            {/* Live Camera Snap Trigger */}
            <div 
              onClick={() => cameraInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-black bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-black transition-transform">
                <Camera className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-display font-bold text-sm uppercase text-[#111111] mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Take Live Photo Now with Camera
              </h3>
              <p className="text-[11px] text-gray-500 font-medium mb-3">
                Use your webcam or phone camera to snap a new photo of your product right now.
              </p>
              <span className="bg-black text-white text-[11px] font-bold uppercase px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Snap Photo with Camera
              </span>
            </div>

          </div>

          {/* Uploaded Photos Live Grid */}
          {uploadedImages.length > 0 && (
            <div>
              <span className="block text-xs font-display font-bold uppercase tracking-wider text-gray-500 mb-3">
                Product Photos Preview:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {uploadedImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`relative aspect-square rounded-2xl border-2 overflow-hidden bg-gray-50 group shadow-sm transition-all ${
                      idx === 0 ? "border-[#CC0000] ring-2 ring-[#CC0000]/20" : "border-gray-200"
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Product Photo ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />

                    {/* Main Cover Badge */}
                    {idx === 0 ? (
                      <span className="absolute top-2 left-2 bg-[#CC0000] text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow">
                        Main Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(idx)}
                        className="absolute top-2 left-2 bg-black/70 hover:bg-[#CC0000] text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1"
                      >
                        <Star className="w-2.5 h-2.5" /> Make Main
                      </button>
                    )}

                    {/* Delete Photo Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
                      title="Remove Photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Submit Actions Footer */}
        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3.5 border border-gray-300 rounded-xl text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-8 py-3.5 rounded-xl font-display font-bold uppercase tracking-widest text-sm flex items-center gap-2 shadow-lg shadow-[#CC0000]/30 cursor-pointer"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            {isSubmitting ? (
              <span>Publishing to Catalog...</span>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Publish Product to Storefront
              </>
            )}
          </button>
        </div>

      </form>

      {/* ── CREATE BRAND MODAL ── */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#CC0000] flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase tracking-wide text-gray-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Create New Brand
                  </h3>
                  <p className="text-xs text-gray-500">Add an equipment or apparel brand to the store</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsBrandModalOpen(false); setNewBrandName(""); }}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g. Puma, Yonex, Kookaburra, Nike, Asics"
                  className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-[#CC0000]"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsBrandModalOpen(false); setNewBrandName(""); }}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-red-600/30 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add & Select Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE CATEGORY MODAL ── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#CC0000] flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase tracking-wide text-gray-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Create New Category
                  </h3>
                  <p className="text-xs text-gray-500">Add a new sports category to catalog</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsCategoryModalOpen(false); setNewCategoryName(""); setNewCategorySubcategories(""); }}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Badminton, Tennis, Fitness & Gym, Swimming"
                  className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-[#CC0000]"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Initial Subcategories (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCategorySubcategories}
                  onChange={(e) => setNewCategorySubcategories(e.target.value)}
                  placeholder="e.g. Rackets, Shuttlecocks, Shoes, Grips, Strings, Bags"
                  className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#CC0000]"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Separate subcategories with commas</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsCategoryModalOpen(false); setNewCategoryName(""); setNewCategorySubcategories(""); }}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-red-600/30 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE SUBCATEGORY MODAL ── */}
      {isSubcategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#CC0000] flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase tracking-wide text-gray-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Add Subcategory Tag
                  </h3>
                  <p className="text-xs text-gray-500">
                    Adding to Category: <strong className="text-[#CC0000] uppercase">{activeCategories.find(c => c.id === formData.category)?.name || formData.category}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsSubcategoryModalOpen(false); setNewSubcategoryName(""); }}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubcategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  placeholder="e.g. Wristbands, Grips, Stringing, Spikes, Ankle Weights"
                  className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-[#CC0000]"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsSubcategoryModalOpen(false); setNewSubcategoryName(""); }}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#CC0000] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-red-600/30 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
