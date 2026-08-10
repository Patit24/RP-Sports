"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { BRANDS } from "@/lib/mockData";
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
  const { addProduct } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Subcategory Template Types
  const [productType, setProductType] = useState<"bats" | "jerseys" | "shoes" | "trackpants" | "sunglasses" | "caps" | "trophies">("bats");

  const [formData, setFormData] = useState({
    name: "RP Elite Player Edition Kashmir Willow Cricket Bat",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    sportsType: "Cricket",
    willowType: "Grade A+ Kashmir Willow",
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

  // Uploaded Photos (Data URLs from Desktop or Live Camera Capture)
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

  // Auto-fill category-specific specifications when user switches product category/type
  const handleProductTypeChange = (type: "bats" | "jerseys" | "shoes" | "trackpants" | "sunglasses" | "caps" | "trophies") => {
    setProductType(type);

    if (type === "shoes") {
      setFormData(prev => ({
        ...prev,
        name: "RP Turbo Speed Pro Spike Cricket Shoes",
        category: "footwear",
        subcategory: "spikes",
        sportsType: "Cricket & Turf Sports",
        brand: "RP Sports",
        mrp: "4499",
        price: "3299",
        willowType: "TPU Plate with 11 Steel Spikes",
        willowGrade: "Synthetic Leather & Breathable Mesh",
        handleSize: "Low Cut Padded Ankle Shield",
        weight: "750 grams",
        dimensions: "32cm x 20cm x 12cm",
        colors: "White / Crimson Red, White / Cobalt Blue",
        sizes: "UK 7, UK 8, UK 9, UK 10, UK 11",
        shortDescription: "Metal spike footwear with TPU soleplate for maximum grip on turf pitches.",
        description: "Metal spike footwear with TPU soleplate for maximum grip on grass and turf pitches. Reinforced ankle collar and dual-density EVA cushioning.",
        highlightsInput: "11 Replaceable Steel Spikes\nDual Density EVA Midsole\nReinforced Ankle Collar Support\nTPU High-Traction Outsole"
      }));
      setCustomSpecs([
        { key: "Outsole", value: "Full TPU Plate with 11 Steel Spikes" },
        { key: "Upper Material", value: "Synthetic Leather & Mesh" },
        { key: "Cushioning", value: "High-Bounce EVA Midsole" },
        { key: "Ankle Support", value: "Padded Ankle Shield" }
      ]);
      setUploadedImages([
        "/shoe_spikes_1786053000000_1786056040962.jpg",
        "/shoe_turf_1786053000000_1786056064769.jpg"
      ]);
    } else if (type === "bats") {
      setFormData(prev => ({
        ...prev,
        name: "RP Legend Pro English Willow Cricket Bat",
        category: "cricket",
        subcategory: "bats",
        sportsType: "Cricket",
        brand: "RP Sports",
        mrp: "16999",
        price: "12999",
        willowType: "Grade 1 English Willow",
        willowGrade: "Grade 1",
        handleSize: "Short Handle (SH)",
        weight: "1160 - 1200 grams",
        dimensions: "85cm x 11cm x 6cm",
        colors: "Natural English Finish",
        sizes: "Short Handle (SH), Harrow, Size 6",
        shortDescription: "Grade 1 English Willow with 8-12 straight grains and 42mm edges.",
        description: "Elite international-grade Grade 1 English Willow featuring straight 8-12 clean grains. Ultra-balanced pickup with lightweight feel and supreme ping off the blade.",
        highlightsInput: "Grade 1 English Willow\n8-12 Straight Clean Grains\n42mm Edges for Maximum Power\nFeatherlight Pickup"
      }));
      setCustomSpecs([
        { key: "Willow Type", value: "Grade 1 English Willow" },
        { key: "Grains", value: "8 - 12 Straight Grains" },
        { key: "Edge Profile", value: "42mm Thick Edges" },
        { key: "Handle", value: "Oval Semi-Rigid Cane Handle" }
      ]);
      setUploadedImages([
        "/cricket_bat_lineup.jpg",
        "/cricket_bat_studio.jpg",
        "/cricket_action_batsman.jpg"
      ]);
    } else if (type === "jerseys") {
      setFormData(prev => ({
        ...prev,
        name: "RP Pro Sublimated Match Jersey 2026",
        category: "apparel",
        subcategory: "jerseys",
        sportsType: "Multi-Sport",
        brand: "RP Custom Apparel",
        mrp: "1299",
        price: "899",
        willowType: "Micro-Polyester Dri-Fit Mesh",
        willowGrade: "Athletic Slim Fit",
        handleSize: "Polo Collar / Half Sleeve",
        weight: "200 grams",
        dimensions: "Standard Athletic Fit",
        colors: "Navy Blue / Neon Gold, Crimson Red / Black",
        sizes: "S, M, L, XL, XXL",
        customizable: true,
        shortDescription: "Dry-Fit honeycomb breathable polyester match jersey with custom name & number.",
        description: "Dry-Fit honeycomb breathable polyester match jersey with full custom name, number, and team logo sublimation. Anti-sweat UV shield fabric.",
        highlightsInput: "100% Micro-Polyester Mesh\nCustom Sublimation Printing\nAnti-Sweat Moisture Wicking\nUV Protection Shield"
      }));
      setCustomSpecs([
        { key: "Fabric", value: "Micro-Polyester Dri-Fit Mesh" },
        { key: "Fit Type", value: "Athletic Slim Fit" },
        { key: "Neck Style", value: "Polo Collar / V-Neck" },
        { key: "Sleeve Type", value: "Half Sleeve" },
        { key: "Sublimation", value: "Full HD Sublimation Print" }
      ]);
      setUploadedImages([
        "/cricket_jersey_premium.jpg",
        "/cricket_player_blank_jersey.jpg"
      ]);
    } else if (type === "trackpants") {
      setFormData(prev => ({
        ...prev,
        name: "RP Performance Stretch Training Track Pants",
        category: "apparel",
        subcategory: "trackpants",
        sportsType: "Training & Fitness",
        brand: "RP Custom Apparel",
        mrp: "1899",
        price: "1299",
        willowType: "92% Polyester, 8% Elastane 4-Way Stretch",
        willowGrade: "2 Deep YKK Zipper Pockets",
        handleSize: "Elastic Waistband + Drawstring",
        weight: "320 grams",
        dimensions: "Standard Ankle Length",
        colors: "Black / Neon Red, Navy Blue / White",
        sizes: "M, L, XL, XXL",
        shortDescription: "4-way stretch polyester training pants with zippered side pockets.",
        description: "Engineered for intense warmups and team travel. Features 4-way stretch breathable fabric, elastic waistband with internal drawcord, and secure YKK zippered side pockets.",
        highlightsInput: "4-Way Stretch Flex Fabric\nDual YKK Zipper Pockets\nElastic Waistband with Drawcord\nBreathable Quick-Dry Finish"
      }));
      setCustomSpecs([
        { key: "Fabric Material", value: "92% Polyester, 8% Elastane Stretch" },
        { key: "Pockets", value: "2 Deep Zipper Pockets" },
        { key: "Waistband", value: "Elasticized with Internal Drawstring" },
        { key: "Ankle Cuff", value: "Zippered Ankle Openings" }
      ]);
    } else if (type === "sunglasses") {
      setFormData(prev => ({
        ...prev,
        name: "RP Pro Shield UV400 Polarized Sports Sunglasses",
        category: "apparel",
        subcategory: "accessories",
        sportsType: "Cricket / Outdoor Sports",
        brand: "RP Sports",
        mrp: "2499",
        price: "1699",
        willowType: "Polarized REVO Mirror UV400",
        willowGrade: "TR90 Flexible Polymer Frame",
        handleSize: "Anti-Slip Hydrophilic Rubber",
        weight: "38 grams",
        dimensions: "14.5cm x 5.5cm Frame",
        colors: "REVO Red Mirror / Black Frame, Polarized Smoke / White Frame",
        sizes: "One Size Fits All",
        shortDescription: "Polarized UV400 shatterproof sports sunglasses for fielders and batsmen.",
        description: "Designed for high-contrast visibility on bright sunny match days. Ultralight TR90 flexible polymer frame with scratch-resistant REVO mirror polarized lenses.",
        highlightsInput: "UV400 100% Protection Lenses\nTR90 Shatterproof Polymer Frame\nAnti-Slip Rubber Nose Pads\nIncludes Hard EVA Carrying Case"
      }));
      setCustomSpecs([
        { key: "Lens Tech", value: "Polarized REVO Mirror Coating" },
        { key: "UV Protection", value: "UV400 Protection (UVA & UVB)" },
        { key: "Frame Material", value: "TR90 Flexible Polymer" },
        { key: "Nose Pad", value: "Adjustable Hydrophilic Rubber" }
      ]);
      setUploadedImages([
        "/feature_cricket_sunglasses_1786053000000_1786056350483.jpg"
      ]);
    } else if (type === "caps") {
      setFormData(prev => ({
        ...prev,
        name: "RP Team Pro Moisture-Wicking Match Cap",
        category: "apparel",
        subcategory: "caps",
        sportsType: "Cricket & Field Sports",
        brand: "RP Sports",
        mrp: "799",
        price: "499",
        willowType: "Curved Pre-Formed Visor",
        willowGrade: "Moisture-Wicking Terry Sweatband",
        handleSize: "Velcro Strap with Rubber Tab",
        weight: "85 grams",
        dimensions: "Adjustable Standard",
        colors: "Navy Blue, Maroon Red, Pure White",
        sizes: "Adjustable Strap",
        shortDescription: "Curved brim match cap with moisture-wicking sweatband and laser ventilation.",
        description: "Keep cool on the field during day matches. Made from lightweight quick-dry fabric with embroidered eyelets for maximum ventilation and an adjustable Velcro back strap.",
        highlightsInput: "Curved Pre-Shaped Visor Brim\nInternal Toweling Sweatband\nLaser-Cut Breathable Eyelets\nAdjustable Back Strap"
      }));
      setCustomSpecs([
        { key: "Brim Type", value: "Curved Pre-Formed Visor" },
        { key: "Sweatband", value: "Moisture-Wicking Terry Cloth" },
        { key: "Strap", value: "Velcro Back Strap with Rubber Pull Tab" },
        { key: "Ventilation", value: "6 Embroidered Air Holes" }
      ]);
      setUploadedImages([
        "/feature_banner_caps_1786053000000_1786055769515.jpg"
      ]);
    } else if (type === "trophies") {
      setFormData(prev => ({
        ...prev,
        name: "RP Gold Championship Victory Trophy",
        category: "custom-trophies",
        subcategory: "trophies",
        sportsType: "Multi-Sport",
        brand: "RP Trophies",
        mrp: "1999",
        price: "1499",
        willowType: "24K Gold Electroplated Brass",
        willowGrade: "Solid Dark Walnut Wood Base",
        handleSize: "Laser Etched Brass Plaque",
        weight: "1.80 kg",
        dimensions: "18 x 18 x 45 cm",
        colors: "Gold Plated Brass & Dark Walnut Base",
        sizes: "18 Inches (Standard), 24 Inches (Grand)",
        customizable: true,
        shortDescription: "Gold electroplated trophy with solid wooden base & free engraved brass plate.",
        description: "Heavyweight metallic gold-finish tournament trophy with solid wooden base. Free custom brass plate laser engraving included.",
        highlightsInput: "18-Inch Height Gold Metal Finish\nSolid Walnut Wood Base\nFree Laser Engraved Brass Plate\nCustom Tournament Engraving"
      }));
      setCustomSpecs([
        { key: "Material", value: "24K Gold Electroplated Metal Alloy" },
        { key: "Pedestal Base", value: "Solid Dark Walnut Wood" },
        { key: "Engraving Plate", value: "Laser Etched Brass Plaque" },
        { key: "Height", value: "18 Inches" }
      ]);
      setUploadedImages([
        "/generated_trophy_1783192099951.jpg"
      ]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "category") {
      const detected = detectProductType(value, formData.subcategory);
      handleProductTypeChange(detected);
    } else if (name === "subcategory") {
      const detected = detectProductType(formData.category, value);
      setFormData(prev => ({ ...prev, subcategory: value }));
      if (detected !== productType) {
        setProductType(detected);
      }
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
          Choose an equipment category preset below or select from dropdowns to auto-configure Footwear, Spikes, Match Jerseys, Track Pants, Sunglasses, Caps, Trophies & Bats.
        </p>
      </div>

      {/* Category Type Preset Selector Tabs */}
      <div className="mb-8 bg-white p-5 rounded-2xl border-2 border-red-100 shadow-md">
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-[#CC0000] mb-3 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-[#CC0000]" />
          Select Equipment Category Preset:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {[
            { id: "shoes", label: "Footwear & Spikes", icon: "👟" },
            { id: "bats", label: "Cricket Bats", icon: "🏏" },
            { id: "jerseys", label: "Match Jerseys", icon: "👕" },
            { id: "trackpants", label: "Track Pants", icon: "👖" },
            { id: "sunglasses", label: "Sunglasses", icon: "🕶️" },
            { id: "caps", label: "Caps & Visors", icon: "🧢" },
            { id: "trophies", label: "Trophies", icon: "🏆" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleProductTypeChange(item.id as any)}
              className={`p-3 rounded-xl border-2 text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                productType === item.id
                  ? "bg-[#CC0000] border-[#CC0000] text-white shadow-lg shadow-[#CC0000]/30 scale-105"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="truncate text-center">{item.label}</span>
            </button>
          ))}
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
                placeholder="Product Title"
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
                <option value="footwear">Footwear & Spikes</option>
                <option value="cricket">Cricket Equipment</option>
                <option value="apparel">Apparel & Match Jerseys</option>
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
                placeholder="e.g. spikes, turf-shoes, jerseys, bats"
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
    </div>
  );
}
