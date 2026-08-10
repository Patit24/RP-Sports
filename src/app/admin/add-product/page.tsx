"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { BRANDS } from "@/lib/mockData";
import { 
  PlusCircle, Image as ImageIcon, CheckCircle, Package, 
  IndianRupee, Tag, ShieldCheck, ListChecks, Sparkles, Plus, Trash2,
  UploadCloud, X, Star
} from "lucide-react";

interface CustomSpecRow {
  key: string;
  value: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    sportsType: "Cricket",
    willowType: "Kashmir Willow",
    willowGrade: "Grade A+",
    handleSize: "Short Handle (SH)",
    playerLevel: "Tournament & Club Player",
    mrp: "4999",
    price: "3499",
    stock: "25",
    deliveryDays: "3",
    description: "Handcrafted in Kolkata from premium hand-selected Kashmir Willow. Curved blade design with massive 40mm edges and mid-to-low sweet spot engineered for powerful strokeplay on Indian subcontinent pitches.",
    shortDescription: "Grade A+ Kashmir Willow with 40mm thick edges and 9-piece cane handle.",
    highlightsInput: "Handcrafted Grade A+ Kashmir Willow\nMassive 40mm Edges & Curved Blade\nSingapore Cane 9-Piece Full Rubber Handle\nPre-Knocked (5,000 Machine Strikes)",
    weight: "1180 - 1220 grams",
    dimensions: "85cm x 11cm x 6cm",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum Metro Gate 2, Kolkata – 700028",
    badge: "Bestseller",
    featured: true,
    customizable: false,
    colors: "Natural Wood Finish",
    sizes: "Short Handle (SH), Harrow, Size 6",
  });

  // Local File Uploaded Images (Base64 Data URLs from Desktop / Phone Gallery)
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "/cricket_bat_studio.jpg",
    "/cricket_bat_lineup.jpg",
    "/cricket_action_batsman.jpg"
  ]);

  const [customSpecs, setCustomSpecs] = useState<CustomSpecRow[]>([
    { key: "Willow Type", value: "Grade A+ Kashmir Willow" },
    { key: "Edge Profile", value: "40mm Thick Edges" },
    { key: "Handle", value: "Singapore Cane 9-Piece Full Rubber Grip" },
    { key: "Sweet Spot", value: "Mid to Low" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle Desktop / Phone Gallery File Pick
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

    // Reset input so same file can be selected again if needed
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
      alert("Please upload at least 1 image from your desktop or gallery.");
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
      "Willow Type": formData.willowType || "Kashmir Willow",
      "Willow Grade": formData.willowGrade || "Grade A+",
      "Weight": formData.weight || "1180 - 1220 grams",
      "Handle Size": formData.handleSize || "Short Handle (SH)",
      "Player Level": formData.playerLevel || "Tournament Player",
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-display font-bold uppercase tracking-widest text-[#CC0000]">
            RP Admin Product Catalog Engine
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-[#111111] tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Add New Product to Storefront
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Upload product photos directly from your Desktop / Phone Gallery and configure complete specifications.
          </p>
        </div>
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
                placeholder="e.g. RP Elite Player Edition Kashmir Willow Cricket Bat"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Brand Name
              </label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] bg-white focus:outline-none focus:border-[#CC0000]"
              >
                {BRANDS.map((b: string) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Main Store Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] bg-white focus:outline-none focus:border-[#CC0000]"
              >
                <option value="cricket">Cricket Equipment</option>
                <option value="apparel">Apparel & Match Jerseys</option>
                <option value="footwear">Footwear & Spikes</option>
                <option value="badminton">Badminton Rackets & Gear</option>
                <option value="football">Football & Accessories</option>
                <option value="custom-trophies">Custom Trophies & Awards</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Subcategory Tag
              </label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="e.g. bats, spikes, jerseys, rackets"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
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

        {/* Section 2: Technical Specs & Equipment Properties */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <ShieldCheck className="w-5 h-5 text-[#CC0000]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              2. Technical Specs & Equipment Properties
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Willow / Material Type
              </label>
              <select
                name="willowType"
                value={formData.willowType}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] bg-white focus:outline-none focus:border-[#CC0000]"
              >
                <option value="Kashmir Willow">Grade A+ Kashmir Willow</option>
                <option value="English Willow">Grade 1 English Willow</option>
                <option value="Poly Mesh Dry-Fit">Poly Mesh Dry-Fit</option>
                <option value="TPU Leather">TPU Synthetic Leather</option>
                <option value="Carbon Graphite">Full High Modulus Carbon Graphite</option>
                <option value="Metal Plated Brass">Gold Plated Metal Alloy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Grade Level
              </label>
              <input
                type="text"
                name="willowGrade"
                value={formData.willowGrade}
                onChange={handleChange}
                placeholder="e.g. Grade A+, Grade 1 Pro, International"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Handle Size / Type
              </label>
              <input
                type="text"
                name="handleSize"
                value={formData.handleSize}
                onChange={handleChange}
                placeholder="e.g. Short Handle (SH), Long Handle"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Weight (g / kg)
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 1180 - 1220 grams"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="e.g. 85cm x 11cm x 6cm"
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
                Target Player Level
              </label>
              <input
                type="text"
                name="playerLevel"
                value={formData.playerLevel}
                onChange={handleChange}
                placeholder="e.g. Tournament Player"
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

        {/* Section 3: Pricing, Inventory & Shipping */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <IndianRupee className="w-5 h-5 text-[#CC0000]" />
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              3. Pricing, Inventory & Delivery Estimate
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
                placeholder="e.g. Short Handle (SH), Harrow, Size 6"
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
                placeholder="e.g. Natural Wood Finish, Navy Blue / Gold"
                className="w-full h-11 px-4 border border-gray-300 rounded-xl text-sm font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Product Description & Highlights */}
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
              placeholder="e.g. Grade A+ Kashmir Willow with 40mm thick edges and cane handle."
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
              placeholder="Write detailed craftsmanship information..."
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
              placeholder="Handcrafted Grade A+ Kashmir Willow&#10;Massive 40mm Edges & Curved Blade&#10;Singapore Cane 9-Piece Full Rubber Handle"
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
                  placeholder="Feature Name (e.g. Edge Profile)"
                  value={row.key}
                  onChange={(e) => handleSpecRowChange(index, "key", e.target.value)}
                  className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-xs font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
                />
                <input
                  type="text"
                  placeholder="Specification Value (e.g. 40mm Thick Edges)"
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

        {/* Section 6: Device & Phone Gallery Direct Image Upload (No Links Needed) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#CC0000]" />
              <h2 className="text-lg font-display font-bold uppercase tracking-wider text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                6. Product Photos (Upload from Desktop / Phone Gallery)
              </h2>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {uploadedImages.length} Image{uploadedImages.length !== 1 ? 's' : ''} Selected
            </span>
          </div>

          {/* Hidden HTML File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />

          {/* Dropzone & Device Upload Trigger Button */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-[#CC0000] bg-gray-50 hover:bg-red-50/40 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-[#CC0000] transition-transform">
              <UploadCloud className="w-8 h-8 text-[#CC0000]" />
            </div>

            <h3 className="font-display font-bold text-base uppercase text-[#111111] mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Click to Upload Product Photos from Device / Gallery
            </h3>
            <p className="text-xs text-gray-500 font-medium max-w-md mx-auto mb-4">
              Select high-resolution product photos from your computer or phone library. Multiple files supported (JPG, PNG, WEBP).
            </p>

            <button
              type="button"
              className="bg-[#111111] group-hover:bg-[#CC0000] text-white text-xs font-display font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <Plus className="w-4 h-4" /> Browse Desktop / Gallery Files
            </button>
          </div>

          {/* Live Thumbnails Preview Grid with Delete & Set Cover */}
          {uploadedImages.length > 0 && (
            <div>
              <span className="block text-xs font-display font-bold uppercase tracking-wider text-gray-500 mb-3">
                Uploaded Product Photos:
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
    </div>
  );
}
