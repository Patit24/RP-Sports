"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { BRANDS } from "@/lib/mockData";
import { PlusCircle, Image as ImageIcon, CheckCircle, Package, IndianRupee } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct } = useStore();

  const [formData, setFormData] = useState({
    name: "",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    sportsType: "Cricket",
    willowType: "Kashmir Willow",
    willowGrade: "Grade A+",
    handleSize: "Short Handle",
    playerLevel: "Intermediate & Advanced",
    mrp: "",
    price: "",
    stock: "20",
    deliveryDays: "3",
    description: "",
    shortDescription: "",
    weight: "1180g",
    dimensions: "85 x 11 x 6 cm",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum Metro Gate 2, Kolkata – 700028",
    badge: "New",
    featured: true,
    colors: "Natural Wood Finish",
    sizes: "Short Handle (SH), Harrow, Size 6",
    imageUrls: "/cricket_bat_studio.jpg\n/cricket_bat_lineup.jpg"
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.mrp) {
      alert("Please fill in required product fields (Name, MRP, Sale Price).");
      return;
    }

    setIsSubmitting(true);

    const images = formData.imageUrls
      .split("\n")
      .map(url => url.trim())
      .filter(Boolean);

    if (images.length === 0) {
      images.push("/cricket_bat_studio.jpg");
    }

    const colors = formData.colors.split(",").map(c => c.trim()).filter(Boolean);
    const sizes = formData.sizes.split(",").map(s => s.trim()).filter(Boolean);

    const specifications = {
      "Brand": formData.brand,
      "Willow Type": formData.willowType || "English Willow",
      "Willow Grade": formData.willowGrade || "Grade 1",
      "Weight": formData.weight || "1140-1200 Gms",
      "Handle Size": formData.handleSize || "Short Handle",
      "Level": formData.playerLevel || "Professional",
      "Country of Origin": formData.countryOfOrigin || "India",
      "Manufactured By": formData.manufacturerDetails || "RP Sports Gear Ltd, Dumdum, Kolkata – 700028"
    };

    const newProduct = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      subcategory: formData.subcategory,
      image: images[0],
      images,
      gallery: images,
      mrp: Number(formData.mrp),
      originalPrice: Number(formData.mrp),
      price: Number(formData.price),
      rating: 5.0,
      reviewCount: 0,
      reviewsCount: 0,
      deliveryDays: Number(formData.deliveryDays) || 3,
      stock: Number(formData.stock) || 10,
      description: formData.description,
      shortDescription: formData.shortDescription,
      highlights: [
        `Handcrafted ${formData.willowType || 'Willow'} Bat`,
        `40mm Edges & Power Spine`,
        `Pre-Knocked for Immediate Match Play`
      ],
      specs: specifications,
      specifications,
      colors,
      sizes,
      sportsType: formData.sportsType,
      weight: formData.weight,
      dimensions: formData.dimensions,
      badge: formData.badge ? (formData.badge as "Sale" | "New" | "Limited") : undefined,
      featured: Boolean(formData.featured),
      willowType: formData.willowType,
      willowGrade: formData.willowGrade,
      handleSize: formData.handleSize,
      playerLevel: formData.playerLevel,
      countryOfOrigin: formData.countryOfOrigin || "India",
      manufacturerDetails: formData.manufacturerDetails || "RP Sports Gear Ltd, Dumdum, Kolkata – 700028"
    };

    addProduct(newProduct);
    
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/shop");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase text-primary tracking-tight">Add New Product</h1>
        <p className="text-slate-500 font-medium">Add new cricket equipment, match jerseys, or customized trophies to RP Sports catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-slate-100 pb-3">
            <Package className="w-5 h-5 text-accent" /> Basic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. RP Legend Pro English Willow Bat"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Brand Name</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent bg-white"
              >
                {BRANDS.map((b: string) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent bg-white"
              >
                <option value="cricket">Cricket</option>
                <option value="apparel">Apparel & Jerseys</option>
                <option value="footwear">Footwear & Spikes</option>
                <option value="badminton">Badminton</option>
                <option value="football">Football</option>
                <option value="custom-trophies">Custom Trophies</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Subcategory</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="e.g. bats, spikes, accessories"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Badge Tag</label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent bg-white"
              >
                <option value="New">New Arrival</option>
                <option value="Sale">Special Sale</option>
                <option value="Limited">Limited Edition</option>
                <option value="Bestseller">Bestseller</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-slate-100 pb-3">
            <IndianRupee className="w-5 h-5 text-accent" /> Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">MRP Price (₹) *</label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                placeholder="4999"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="3499"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Available Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Est. Delivery (Days)</label>
              <input
                type="number"
                name="deliveryDays"
                value={formData.deliveryDays}
                onChange={handleChange}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Images & Media */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-slate-100 pb-3">
            <ImageIcon className="w-5 h-5 text-accent" /> Product Image URLs
          </h2>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Image Paths (One relative or full URL per line)
            </label>
            <textarea
              name="imageUrls"
              rows={3}
              value={formData.imageUrls}
              onChange={handleChange}
              placeholder="/cricket_bat_studio.jpg"
              className="w-full p-4 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 shadow-lg shadow-accent/20 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Saving Product...</span>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Publish Product Listing
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
