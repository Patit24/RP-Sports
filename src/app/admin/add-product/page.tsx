"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { CATEGORIES, BRANDS } from "@/lib/mockData";
import { Save, Image as ImageIcon, X } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const addProduct = useStore((state) => state.addProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    brand: BRANDS[0],
    category: CATEGORIES[0].id,
    subcategory: "",
    mrp: "",
    price: "",
    stock: "",
    deliveryDays: "3",
    description: "",
    shortDescription: "",
    badge: "",
    colors: "",
    sizes: "",
    image1: "",
    image2: "",
    image3: "",
    sportsType: "",
    weight: "1140-1200 Gms",
    dimensions: "",
    featured: true,
    willowType: "English Willow",
    willowGrade: "Grade 1 Pro",
    handleSize: "Short Handle",
    playerLevel: "Professional",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Gear Ltd, Dumdum, Kolkata – 700028",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const images = [formData.image1, formData.image2, formData.image3].filter(Boolean);
    if (images.length === 0) {
      images.push("/products/shoe_running.jpg"); // Fallback mock image
    }

    const colors = formData.colors.split(",").map(c => c.trim()).filter(Boolean);
    const sizes = formData.sizes.split(",").map(s => s.trim()).filter(Boolean);

    const newProduct = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      subcategory: formData.subcategory,
      images,
      mrp: Number(formData.mrp),
      price: Number(formData.price),
      rating: 5.0, // New products start with 5 star rating
      reviewsCount: 0,
      deliveryDays: Number(formData.deliveryDays),
      stock: Number(formData.stock),
      description: formData.description,
      shortDescription: formData.shortDescription,
      highlights: [],
      specifications: {
        "Brand": formData.brand,
        "Willow Type": formData.willowType || "English Willow",
        "Willow Grade": formData.willowGrade || "Grade 1",
        "Weight": formData.weight || "1140-1200 Gms",
        "Handle Size": formData.handleSize || "Short Handle",
        "Level": formData.playerLevel || "Professional",
        "Country of Origin": formData.countryOfOrigin || "India",
        "Manufactured By": formData.manufacturerDetails || "RP Sports Gear Ltd, Dumdum, Kolkata – 700028"
      },
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
      router.push("/shop"); // Redirect to shop to see the new product
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase text-primary tracking-tight">Add New Product</h1>
        <p className="text-slate-500 mt-2 font-medium">Create a new product listing. Automatically appears on the Home Page!</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
        
        {/* Basic Info */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-4 border-b border-slate-100 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-primary mb-2">Product Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. Nike Zoom Structure Plus Men's Running Shoes" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Category *</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all cursor-pointer">
                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                <option value="shoes">Sports Shoes</option>
                <option value="trending">Trending Items</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Subcategory / Tag *</label>
              <input required type="text" name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. Running Shoes, Cricket Spikes, Turf Shoes" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Brand *</label>
              <select required name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all cursor-pointer">
                {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Puma">Puma</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Badge</label>
              <select name="badge" value={formData.badge} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all cursor-pointer">
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Sale">Sale (-10%)</option>
                <option value="Limited">Limited</option>
              </select>
            </div>
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-primary block">Show on Home Page Showcase?</label>
                <p className="text-xs text-slate-500">Automatically highlights this item in the home page showcase section.</p>
              </div>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 accent-[#CC0000] cursor-pointer"
              />
            </div>
          </div>
        </section>


        {/* Pricing & Inventory */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-4 border-b border-slate-100 pb-2">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-primary mb-2">MRP (₹) *</label>
              <input required type="number" min="0" name="mrp" value={formData.mrp} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. 9999" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Selling Price (₹) *</label>
              <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. 7499" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Stock Quantity *</label>
              <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. 50" />
            </div>
          </div>
        </section>

        {/* Descriptions */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-4 border-b border-slate-100 pb-2">Product Description</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Short Description *</label>
              <textarea required name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all resize-none" placeholder="A brief summary for the product card..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Detailed Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="Full product description..."></textarea>
            </div>
          </div>
        </section>

        {/* Images */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-4 border-b border-slate-100 pb-2">Product Images (URLs)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Image 1 (Main) *</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input required type="text" name="image1" value={formData.image1} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all text-sm" placeholder="/products/img.jpg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Image 2</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" name="image2" value={formData.image2} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all text-sm" placeholder="/products/img.jpg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Image 3</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" name="image3" value={formData.image3} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all text-sm" placeholder="/products/img.jpg" />
              </div>
            </div>
          </div>
        </section>

        {/* Variants & Detailed Specifications */}
        <section>
          <h2 className="text-lg font-bold text-primary mb-4 border-b border-slate-100 pb-2">Detailed Specifications & Product Attributes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Willow / Material Type</label>
              <input type="text" name="willowType" value={formData.willowType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. English Willow, Kashmir Willow, Polycarbonate" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Willow Grade / Product Quality</label>
              <input type="text" name="willowGrade" value={formData.willowGrade} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. Grade 1 Pro, Grade 2, Premium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Weight Range</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. 1140-1200 Gms" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Handle Size / Fit</label>
              <input type="text" name="handleSize" value={formData.handleSize} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. Short Handle, Long Handle" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Player Level</label>
              <input type="text" name="playerLevel" value={formData.playerLevel} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. Beginner, Intermediate, Professional Ranji" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Country of Origin</label>
              <input type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. India" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-primary mb-2">Manufactured by / Imported by</label>
              <input type="text" name="manufacturerDetails" value={formData.manufacturerDetails} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. RP Sports Gear Ltd, Dumdum, Kolkata – 700028" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Available Colors (Comma separated)</label>
              <input type="text" name="colors" value={formData.colors} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. Red, Blue, Black" />
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-2">Available Sizes (Comma separated)</label>
              <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. S, M, L, XL" />
            </div>
          </div>
        </section>


        {/* Submit Actions */}
        <div className="pt-6 border-t border-slate-100 flex gap-4 justify-end">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-accent transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
            {isSubmitting ? "Saving..." : <><Save className="w-4 h-4" /> Save Product</>}
          </button>
        </div>
      </form>
    </div>
  );
}
