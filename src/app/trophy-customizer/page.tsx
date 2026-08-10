"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Product } from "@/lib/mockData";
import { Trophy, Shield, ShoppingCart, RefreshCw, Sparkles, Award } from "lucide-react";

export default function TrophyCustomizerPage() {
  const router = useRouter();
  const { addToCart } = useStore();

  // Configurator states
  const [trophyType, setTrophyType] = useState("Championship Cup");
  const [material, setMaterial] = useState("Gold Plated Brass");
  const [engravingText, setEngravingText] = useState("CHAMPIONS 2026");
  const [trophySize, setTrophySize] = useState("Large (45cm)");
  const [quantity, setQuantity] = useState(1);

  // Material color values mapping for SVG fill
  const materialColors: Record<string, { primary: string; secondary: string; highlight: string }> = {
    "Gold Plated Brass": { primary: "#d4af37", secondary: "#aa8412", highlight: "#fff3cc" },
    "Silver Plated Steel": { primary: "#c0c0c0", secondary: "#8c8c8c", highlight: "#f2f2f2" },
    "Crystal Glass": { primary: "rgba(0, 229, 255, 0.4)", secondary: "rgba(0, 229, 255, 0.2)", highlight: "#ffffff" }
  };

  const activeColors = materialColors[material] || materialColors["Gold Plated Brass"];

  // Mock product mapping for custom order item
  const mockTrophyProduct: Product = {
    id: "custom-trophy",
    name: `Customized ${trophyType} (${material})`,
    slug: "customized-trophy",
    sku: "RP-CUST-TRPH",
    brand: "Pinnacle",
    category: "awards",
    subcategory: "Gold",
    images: ["https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800"],
    mrp: 14999,
    price: 9999,
    rating: 5.0,
    reviewsCount: 1,
    deliveryDays: 5,
    stock: 50,
    description: `Personalized Award Trophy. Shape: ${trophyType}, Material: ${material}, Text: ${engravingText}`,
    shortDescription: "Personalized awards and corporate gifts with customized metal plaque engraving.",
    highlights: ["Hand-polished marble pedestal", "Custom engraved text", "High strength plated finish"],
    specifications: {},
    colors: [material],
    sizes: [trophySize],
    sportsType: "Trophies",
    weight: "2.40 kg",
    dimensions: "18 x 18 x 45 cm"
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
        engravingText
      }
    });
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="mb-12">
          <span className="text-lime-accent font-mono text-xs tracking-wider font-bold">LIVE AWARD ENGRAVING LAB</span>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase mt-2">
            TROPHY CUSTOMIZER
          </h1>
          <p className="text-zinc-500 text-sm mt-3 max-w-[50ch]">
            Personalize high-end trophies, medals, and glass awards with custom brass plaque engravings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: CONTROLS CONFIGURATOR */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 border border-zinc-900 bg-zinc-950/60 rounded-2xl space-y-6">
              
              <h3 className="font-display font-bold text-lg uppercase text-white flex items-center gap-2 pb-4 border-b border-zinc-900">
                <Trophy className="w-5 h-5 text-cyan-accent" /> CUSTOMIZER CONTROLS
              </h3>

              {/* Trophy Type selection */}
              <div>
                <label className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-2">
                  TROPHY SILHOUETTE
                </label>
                <select
                  value={trophyType}
                  onChange={(e) => setTrophyType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-accent cursor-pointer"
                >
                  <option value="Championship Cup">CHAMPIONSHIP CLASSIC CUP</option>
                  <option value="Star Award">STAR ACHIEVEMENT PLAQUE</option>
                  <option value="Victory Medal">VICTORY MEDALLION</option>
                </select>
              </div>

              {/* Material selection */}
              <div>
                <label className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-2">
                  FINISH MATERIAL
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Gold Plated Brass", "Silver Plated Steel", "Crystal Glass"].map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setMaterial(mat)}
                      className={`px-2 py-3 rounded-xl text-[10px] font-mono font-bold border text-center transition-colors cursor-pointer ${
                        material === mat 
                          ? "bg-zinc-800 border-cyan-accent text-white" 
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {mat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Engraving plaque text editor */}
              <div>
                <label className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-2">
                  METAL PLAQUE ENGRAVING
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                  placeholder="CHAMPIONS 2026"
                  className="w-full bg-zinc-900 border border-zinc-800 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-accent"
                />
                <span className="text-[10px] text-zinc-600 font-mono mt-1 block">Max 25 characters, uppercase sublimated print.</span>
              </div>

              {/* Trophy Size Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-2">
                    TROPHY SIZE
                  </label>
                  <select
                    value={trophySize}
                    onChange={(e) => setTrophySize(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-3 rounded-xl focus:outline-none focus:border-cyan-accent cursor-pointer"
                  >
                    <option value="Small (30cm)">SMALL (30cm)</option>
                    <option value="Medium (40cm)">MEDIUM (40cm)</option>
                    <option value="Large (45cm)">LARGE (45cm)</option>
                    <option value="Championship (55cm)">CHAMPIONSHIP (55cm)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-2">
                    QUANTITY
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs px-3 py-3 rounded-xl text-center focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>

              {/* Checkout actions */}
              <div className="pt-6 border-t border-zinc-900">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-gradient-to-r from-cyan-accent to-lime-accent text-black font-extrabold text-xs rounded-full flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.15)] cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" /> ADD DESIGN TO CART
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT: LIVE INTERACTIVE PREVIEW PANEL */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24">
            
            <div className="p-8 border border-zinc-900 bg-zinc-950/40 rounded-3xl flex flex-col items-center justify-between min-h-[480px] relative overflow-hidden">
              <div className="absolute top-4 right-4 text-zinc-700 font-mono text-[9px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-lime-accent animate-pulse" /> RENDER_60_FPS
              </div>

              {/* Render dynamic SVG trophy depending on custom colors and choice */}
              <div className="relative w-72 h-[340px] flex items-center justify-center my-4">
                {trophyType === "Championship Cup" && (
                  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                    {/* Pedestal base (black marble) */}
                    <rect x="25" y="90" width="50" height="20" rx="3" fill="#121216" stroke="#2c2c35" strokeWidth="0.8" />
                    
                    {/* Metal plaque */}
                    <rect x="32" y="96" width="36" height="8" rx="1" fill="#c5a059" />

                    {/* Chalice Stem */}
                    <path d="M 46 65 L 46 90 L 54 90 L 54 65 Z" fill={activeColors.secondary} />
                    <ellipse cx="50" cy="65" rx="10" ry="4" fill={activeColors.primary} />
                    
                    {/* Cup Body */}
                    <path d="M 30 20 L 70 20 L 68 55 C 68 65 32 65 32 55 Z" fill={activeColors.primary} />
                    <ellipse cx="50" cy="20" rx="20" ry="5" fill={activeColors.highlight} />
                    
                    {/* Handles */}
                    <path d="M 30 25 C 20 25 20 45 31 50" fill="none" stroke={activeColors.secondary} strokeWidth="3" strokeLinecap="round" />
                    <path d="M 70 25 C 80 25 80 45 69 50" fill="none" stroke={activeColors.secondary} strokeWidth="3" strokeLinecap="round" />
                  </svg>
                )}

                {trophyType === "Star Award" && (
                  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                    {/* Pedestal base */}
                    <rect x="25" y="95" width="50" height="15" rx="2" fill="#121216" stroke="#2c2c35" strokeWidth="0.8" />
                    <rect x="32" y="99" width="36" height="7" rx="1" fill="#c5a059" />

                    {/* Star stem */}
                    <path d="M 48 70 L 48 95 L 52 95 L 52 70 Z" fill={activeColors.secondary} />

                    {/* Glass/Metal Star */}
                    <path d="M 50 15 L 59 38 L 84 38 L 64 53 L 71 78 L 50 63 L 29 78 L 36 53 L 16 38 L 41 38 Z" fill={activeColors.primary} stroke={activeColors.highlight} strokeWidth="1" />
                  </svg>
                )}

                {trophyType === "Victory Medal" && (
                  <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                    {/* Ribbon */}
                    <path d="M 40 10 L 50 45 L 60 10 Z" fill="#00e5ff" />
                    <path d="M 46 10 L 50 45 L 54 10 Z" fill="#39ff14" />

                    {/* Medallion circle */}
                    <circle cx="50" cy="65" r="22" fill={activeColors.primary} stroke={activeColors.highlight} strokeWidth="1.5" />
                    <circle cx="50" cy="65" r="17" fill="none" stroke={activeColors.secondary} strokeWidth="1" strokeDasharray="2,2" />
                    
                    {/* Star icon inside medallion */}
                    <path d="M 50 56 L 53 62 L 60 62 L 55 66 L 57 73 L 50 69 L 43 73 L 45 66 L 40 62 L 47 62 Z" fill={activeColors.highlight} />
                  </svg>
                )}

                {/* Engraving text render projection overlay on pedestal base */}
                {trophyType !== "Victory Medal" && (
                  <div className="absolute bottom-[23px] text-black font-mono font-bold text-[7px] tracking-wider uppercase text-center w-28 line-clamp-1 pointer-events-none select-none">
                    {engravingText}
                  </div>
                )}
              </div>

              {/* Status details */}
              <div className="text-[10px] font-mono text-zinc-500 uppercase flex gap-4">
                <span>MATERIAL: {material}</span>
                <span>SIZE: {trophySize}</span>
                <span>ENGRAVING: INCLUDED</span>
              </div>

            </div>

            <div className="flex gap-3 p-4 bg-zinc-950/60 border border-zinc-900 rounded-xl text-xs text-zinc-500">
              <Sparkles className="w-4 h-4 text-cyan-accent shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Trophies are custom polished and diamond-tip engraved. Standard custom orders take **4-5 business days** of build calibration before final shipping.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
