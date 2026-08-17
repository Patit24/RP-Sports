"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore, Product } from "@/lib/store";
import { Award, ShieldCheck, CheckCircle2, ShoppingBag, Sparkles, Trophy } from "lucide-react";

export default function TrophyCustomizerPage() {
  const { addToCart, showToast } = useStore();

  const [trophyType, setTrophyType] = useState("Cricket Championship Cup");
  const [material, setMaterial] = useState("Gold Plated Brass");
  const [trophySize, setTrophySize] = useState("18 Inches (Standard)");
  const [engravingText, setEngravingText] = useState("KOLKATA PREMIER LEAGUE 2026 - CHAMPIONS");
  const [quantity, setQuantity] = useState(1);

  const materialColors: Record<string, string[]> = {
    "Gold Plated Brass": ["#FFD700", "#B8860B"],
    "Silver Nickel Finish": ["#C0C0C0", "#A9A9A9"],
    "Crystal Glass & Gold": ["#E0F7FA", "#FFD700"],
    "Bronze Vintage": ["#CD7F32", "#8B4513"],
  };

  const activeColors = materialColors[material] || materialColors["Gold Plated Brass"];

  // Mock product mapping for custom order item
  const mockTrophyProduct: Product = {
    id: "custom-trophy",
    name: `Customized ${trophyType} (${material})`,
    slug: "customized-trophy",
    sku: "RP-CUST-TRPH",
    brand: "RP Trophies",
    category: "custom-trophies",
    subcategory: "Trophies",
    image: "/generated_trophy_1783192099951.jpg",
    images: ["/generated_trophy_1783192099951.jpg"],
    gallery: ["/generated_trophy_1783192099951.jpg"],
    mrp: 14999,
    originalPrice: 14999,
    price: 9999,
    rating: 5.0,
    reviewCount: 1,
    reviewsCount: 1,
    deliveryDays: "5 Days",
    stock: 50,
    description: `Personalized Award Trophy. Shape: ${trophyType}, Material: ${material}, Text: ${engravingText}`,
    shortDescription: "Personalized awards and corporate gifts with customized metal plaque engraving.",
    highlights: ["Hand-polished marble pedestal", "Custom engraved text", "High strength plated finish"],
    specs: {
      Material: material,
      Size: trophySize,
      Engraving: engravingText,
    },
    specifications: {
      Material: material,
      Size: trophySize,
    },
    colors: [material],
    sizes: [trophySize],
    sportsType: "Trophies",
    weight: "2.40 kg",
    dimensions: "18 x 18 x 45 cm",
    customizable: true,
  };

  const handleAddToCart = () => {
    addToCart({
      product: mockTrophyProduct,
      quantity,
      selectedColor: material,
      selectedSize: trophySize,
      customTrophy: {
        material,
        size: trophySize,
        engravingText,
      },
    });
    showToast("Custom Trophy added to cart!", "success");
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-20 md:pt-28 pb-28 md:pb-10 px-4 px-4 sm:px-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-[#CC0000]/10 border border-[#CC0000]/30 px-3.5 py-1 rounded-full mb-3">
          <Trophy className="w-4 h-4 text-[#CC0000]" />
          <span className="text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            RP Custom Awards Studio
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-black uppercase text-[#111111] tracking-tight mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Design Your Tournament Trophy
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto font-medium">
          Create heavyweight tournament cups, player of the match awards, and corporate sports honors with custom brass plate engraving.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: 3D Visualizer Mockup */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-gray-100 text-xs font-mono font-bold px-3 py-1 rounded-full text-gray-700">
            3D Studio Preview
          </div>

          <div className="w-full max-w-sm h-80 relative flex items-center justify-center my-6">
            <img
              src="/generated_trophy_1783192099951.jpg"
              alt="RP Custom Trophy"
              className="max-h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Engraving Plate Live Preview */}
          <div className="w-full bg-[#111111] text-amber-300 p-4 rounded-2xl border-2 border-amber-500/50 text-center font-mono shadow-inner">
            <span className="text-[10px] text-amber-500 uppercase tracking-widest block font-bold mb-1">
              Laser Engraved Brass Plate
            </span>
            <p className="font-bold text-sm tracking-wider uppercase text-amber-200">
              "{engravingText || "YOUR TOURNAMENT TEXT HERE"}"
            </p>
          </div>
        </div>

        {/* Right: Customizer Form */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-6">
          
          {/* Trophy Type */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
              Select Award Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Cricket Championship Cup", "Player of the Match Shield", "Victory Star Trophy", "Corporate Honor Plaque"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTrophyType(type)}
                  className={`p-3 text-xs font-bold rounded-xl border text-left transition-all ${
                    trophyType === type
                      ? "border-[#CC0000] bg-red-50 text-[#CC0000]"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Material Finish */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
              Metallic Finish & Plating
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-sm font-bold bg-white text-[#111111] focus:outline-none focus:border-[#CC0000]"
            >
              <option value="Gold Plated Brass">Gold Plated Brass (Heavyweight)</option>
              <option value="Silver Nickel Finish">Silver Nickel Finish</option>
              <option value="Crystal Glass & Gold">Crystal Glass & Gold</option>
              <option value="Bronze Vintage">Bronze Vintage</option>
            </select>
          </div>

          {/* Trophy Height */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
              Trophy Height
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["14 Inches (Junior)", "18 Inches (Standard)", "24 Inches (Grand Championship)"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTrophySize(size)}
                  className={`p-3 text-xs font-bold rounded-xl border text-center transition-all ${
                    trophySize === size
                      ? "border-[#CC0000] bg-red-50 text-[#CC0000]"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {size.split(" ")[0]} {size.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Engraving Input */}
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
              Custom Brass Plate Engraving (Included Free)
            </label>
            <input
              type="text"
              value={engravingText}
              onChange={(e) => setEngravingText(e.target.value)}
              placeholder="e.g. KOLKATA CRICKET TROPHY 2026 - WINNERS"
              maxLength={60}
              className="w-full h-12 px-4 border border-gray-300 rounded-xl text-sm font-mono font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
            />
            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              Max 60 characters. Laser etched into polished solid brass.
            </p>
          </div>

          {/* Price & Add to Cart */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-gray-400 font-mono block">CUSTOM ORDER TOTAL</span>
              <span className="font-display font-black text-3xl text-[#CC0000]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                ₹9,999
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary py-3.5 px-8 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-[#CC0000]/30 cursor-pointer"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <ShoppingBag className="w-4 h-4" /> Add Custom Trophy to Cart
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
