export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  image: string;
  images: string[];
  gallery: string[];
  mrp: number;
  originalPrice: number;
  price: number;
  rating: number;
  reviewCount: number;
  reviewsCount: number;
  deliveryDays: string | number;
  stock: number;
  description: string;
  shortDescription: string;
  highlights: string[];
  specs: Record<string, string>;
  specifications: Record<string, string>;
  colors: string[];
  sizes: string[];
  sportsType: string;
  weight: string;
  dimensions: string;
  badge?: string;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  customizable?: boolean;
  willowType?: string;
  willowGrade?: string;
  handleSize?: string;
  playerLevel?: string;
  countryOfOrigin?: string;
  manufacturerDetails?: string;
}

export const CATEGORIES = [
  { id: "cricket", name: "Cricket", icon: "🏏", banner: "/category_cricket_1783225297200.jpg", subcategories: ["bats", "balls", "gloves", "pads", "helmets", "kits"] },
  { id: "football", name: "Football", icon: "⚽", banner: "/category_football_1783225306612.jpg", subcategories: ["balls", "boots", "guards", "accessories"] },
  { id: "badminton", name: "Badminton", icon: "🏸", banner: "/category_badminton_1783225318763.jpg", subcategories: ["rackets", "shuttlecocks", "grips", "accessories"] },
  { id: "jerseys", name: "Jerseys", icon: "👕", banner: "/jerseys_category_rp_1785961757107.jpg", subcategories: ["custom-jersey", "team-kits", "caps", "shorts"] },
  { id: "trophies", name: "Trophies", icon: "🏆", banner: "/generated_trophy_1783192099951.jpg", subcategories: ["trophies", "medals", "awards", "plaques"] },
];

export const BRANDS = ["RP Sports", "RP Custom Apparel", "RP Trophies", "SS", "SG", "DSC", "MRF"];

export const MOCK_BLOGS = [
  {
    id: "blog-1",
    slug: "how-to-choose-kashmir-willow-bat",
    title: "How to Choose the Perfect Kashmir Willow Bat in Kolkata",
    date: "August 2026",
    image: "/cricket_bat_studio.jpg",
    excerpt: "Comprehensive guide for selecting grain alignment, sweet spot position, and bat weight for Indian pitches.",
    content: "Selecting the ideal cricket bat requires understanding wood density, edge thickness, and pickup...",
    author: "RP Sports Master Craftsman",
    readTime: "4 min read",
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "rp-001",
    name: "RP Elite Player Edition Kashmir Willow Cricket Bat",
    slug: "rp-elite-player-edition-kashmir-willow",
    sku: "RP-BAT-KW01",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    image: "/cricket_bat_studio.jpg",
    images: [
      "/cricket_bat_studio.jpg",
      "/cricket_bat_lineup.jpg",
      "/cricket_action_batsman.jpg"
    ],
    gallery: [
      "/cricket_bat_studio.jpg",
      "/cricket_bat_lineup.jpg",
      "/cricket_action_batsman.jpg"
    ],
    mrp: 4999,
    originalPrice: 4999,
    price: 3499,
    rating: 4.9,
    reviewCount: 142,
    reviewsCount: 142,
    deliveryDays: "2 - 4 Days",
    stock: 25,
    description:
      "Handcrafted in Kolkata from premium hand-selected Kashmir Willow. Curved blade design with massive 40mm edges and mid-to-low sweet spot engineered for powerful strokeplay on Indian subcontinent pitches.",
    shortDescription: "Grade A+ Kashmir Willow with 40mm thick edges and cane handle.",
    highlights: [
      "Handcrafted Grade A+ Kashmir Willow",
      "Massive 40mm Edges & Curved Blade",
      "Singapore Cane 9-Piece Full Rubber Handle",
      "Pre-Knocked (5,000 Machine Strikes)"
    ],
    specs: {
      "Willow Type": "Grade A+ Kashmir Willow",
      Weight: "1180 - 1220 grams",
      Handle: "Singapore Cane 9-Piece Full Rubber Grip",
      "Edge Profile": "40mm Thick Edges",
      "Sweet Spot": "Mid to Low",
      Knocking: "Pre-knocked (5,000 Machine Strikes)"
    },
    specifications: {
      "Willow Type": "Grade A+ Kashmir Willow",
      Weight: "1180 - 1220 grams",
      Handle: "Singapore Cane 9-Piece Full Rubber Grip",
      "Edge Profile": "40mm Thick Edges"
    },
    colors: ["Natural Wood Finish"],
    sizes: ["Short Handle (SH)", "Harrow", "Size 6"],
    sportsType: "Cricket",
    weight: "1200g",
    dimensions: "85cm x 11cm x 6cm",
    badge: "Bestseller",
    featured: true,
    isNew: true,
    isBestSeller: true,
    customizable: false,
    willowType: "Kashmir Willow",
    willowGrade: "Grade A+",
    handleSize: "Short Handle",
    playerLevel: "Advanced & Tournament Player",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum Metro Gate 2, Kolkata - 700028"
  },
  {
    id: "rp-002",
    name: "RP Legend Pro English Willow Cricket Bat",
    slug: "rp-legend-pro-english-willow",
    sku: "RP-BAT-EW02",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    image: "/cricket_bat_lineup.jpg",
    images: [
      "/cricket_bat_lineup.jpg",
      "/cricket_bat_studio.jpg",
      "/cricket_action_batsman.jpg"
    ],
    gallery: [
      "/cricket_bat_lineup.jpg",
      "/cricket_bat_studio.jpg",
      "/cricket_action_batsman.jpg"
    ],
    mrp: 16999,
    originalPrice: 16999,
    price: 12999,
    rating: 5.0,
    reviewCount: 88,
    reviewsCount: 88,
    deliveryDays: "2 - 4 Days",
    stock: 12,
    description:
      "Elite international-grade Grade 1 English Willow featuring straight 8-12 clean grains. Ultra-balanced pickup with lightweight feel and supreme ping off the blade.",
    shortDescription: "Grade 1 English Willow with 8-12 straight grains.",
    highlights: [
      "Grade 1 English Willow",
      "8-12 Straight Clean Grains",
      "42mm Edges for Maximum Power",
      "Featherlight Pickup"
    ],
    specs: {
      "Willow Type": "Grade 1 English Willow",
      Weight: "1160 - 1200 grams",
      Handle: "Oval Semi-Rigid Cane Handle",
      "Edge Profile": "42mm Thick Edges",
      "Sweet Spot": "Mid Sweet Spot"
    },
    specifications: {
      "Willow Type": "Grade 1 English Willow",
      Weight: "1160 - 1200 grams",
      Handle: "Oval Semi-Rigid Cane Handle"
    },
    colors: ["Natural English Finish"],
    sizes: ["Short Handle (SH)"],
    sportsType: "Cricket",
    weight: "1180g",
    dimensions: "85cm x 11cm x 6cm",
    badge: "Pro Edition",
    featured: true,
    isBestSeller: true,
    willowType: "English Willow",
    willowGrade: "Grade 1",
    handleSize: "Short Handle",
    playerLevel: "Professional",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-003",
    name: "RP Custom Sublimated Match Jersey 2026",
    slug: "rp-custom-sublimated-match-jersey",
    sku: "RP-JER-001",
    brand: "RP Custom Apparel",
    category: "apparel",
    subcategory: "jerseys",
    image: "/cricket_jersey_premium.jpg",
    images: ["/cricket_jersey_premium.jpg", "/cricket_player_blank_jersey.jpg"],
    gallery: ["/cricket_jersey_premium.jpg", "/cricket_player_blank_jersey.jpg"],
    mrp: 1299,
    originalPrice: 1299,
    price: 899,
    rating: 4.8,
    reviewCount: 215,
    reviewsCount: 215,
    deliveryDays: "3 - 5 Days",
    stock: 150,
    description:
      "Dry-Fit honeycomb breathable polyester match jersey with full custom name, number, and team logo sublimation. Anti-sweat UV shield fabric.",
    shortDescription: "Custom Sublimated Dry-Fit Polyester Match Jersey.",
    highlights: ["Custom Name & Number Sublimation", "Micro-Polyester Dri-Fit Mesh", "Anti-Bacterial UV Fabric"],
    specs: {
      Fabric: "100% Micro-Polyester Mesh",
      Fit: "Athletic Slim Fit",
      Technology: "Dri-Cool Moisture Wicking"
    },
    specifications: {
      Fabric: "100% Micro-Polyester Mesh",
      Fit: "Athletic Slim Fit"
    },
    colors: ["Navy Blue / Neon Gold", "Crimson Red / Black", "Royal White / Cyan"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Multi-Sport",
    weight: "200g",
    dimensions: "Custom Fit",
    badge: "Customizable",
    featured: true,
    isNew: true,
    customizable: true,
    countryOfOrigin: "India"
  },
  {
    id: "rp-004",
    name: "RP Turbo Speed Pro Spike Cricket Shoes",
    slug: "rp-turbo-speed-pro-spike-shoes",
    sku: "RP-SH-001",
    brand: "RP Sports",
    category: "footwear",
    subcategory: "spikes",
    image: "/shoe_spikes_1786053000000_1786056040962.jpg",
    images: ["/shoe_spikes_1786053000000_1786056040962.jpg", "/shoe_turf_1786053000000_1786056064769.jpg"],
    gallery: ["/shoe_spikes_1786053000000_1786056040962.jpg", "/shoe_turf_1786053000000_1786056064769.jpg"],
    mrp: 4499,
    originalPrice: 4499,
    price: 3299,
    rating: 4.7,
    reviewCount: 64,
    reviewsCount: 64,
    deliveryDays: "2 - 4 Days",
    stock: 30,
    description:
      "Metal spike footwear with TPU soleplate for maximum grip on grass and turf pitches. Reinforced ankle collar and dual-density EVA cushioning.",
    shortDescription: "TPU Soleplate Spike Shoes for Bowlers & Batsmen.",
    highlights: ["11 Replaceable Steel Spikes", "Dual Density EVA Cushioning", "Reinforced Ankle Collar"],
    specs: {
      Sole: "Full TPU Plate with 11 Steel Spikes",
      Upper: "Synthetic Leather with Breathable Mesh"
    },
    specifications: {
      Sole: "Full TPU Plate with 11 Steel Spikes"
    },
    colors: ["White / Crimson Red", "White / Cobalt Blue"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    sportsType: "Cricket",
    weight: "750g",
    dimensions: "32cm x 20cm x 12cm",
    countryOfOrigin: "India"
  },
  {
    id: "rp-005",
    name: "RP Gold Championship Victory Trophy",
    slug: "rp-gold-championship-victory-trophy",
    sku: "RP-TRP-001",
    brand: "RP Trophies",
    category: "custom-trophies",
    subcategory: "trophies",
    image: "/generated_trophy_1783192099951.jpg",
    images: ["/generated_trophy_1783192099951.jpg"],
    gallery: ["/generated_trophy_1783192099951.jpg"],
    mrp: 1999,
    originalPrice: 1999,
    price: 1499,
    rating: 4.9,
    reviewCount: 94,
    reviewsCount: 94,
    deliveryDays: "3 - 5 Days",
    stock: 45,
    description:
      "Heavyweight metallic gold-finish tournament trophy with solid wooden base. Free custom brass plate laser engraving included.",
    shortDescription: "Gold electroplated trophy with wooden base.",
    highlights: ["18-Inch Height Gold Metal Finish", "Solid Walnut Wood Base", "Free Laser Engraved Plate"],
    specs: {
      Material: "Gold Electroplated Metal Alloy",
      Height: "18 Inches",
      Base: "Solid Dark Walnut Wood"
    },
    specifications: {
      Material: "Gold Electroplated Metal Alloy",
      Height: "18 Inches"
    },
    colors: ["Gold & Mahogany"],
    sizes: ["18 Inches", "22 Inches", "26 Inches"],
    sportsType: "Multi-Sport",
    weight: "1.8 kg",
    dimensions: "45cm x 15cm x 15cm",
    customizable: true,
    countryOfOrigin: "India"
  },
  {
    id: "rp-006",
    name: "RP Pro Series Smashing Badminton Racket",
    slug: "rp-pro-series-smashing-badminton-racket",
    sku: "RP-BAD-001",
    brand: "RP Sports",
    category: "badminton",
    subcategory: "rackets",
    image: "/generated_racket_1783192009617.jpg",
    images: ["/generated_racket_1783192009617.jpg"],
    gallery: ["/generated_racket_1783192009617.jpg"],
    mrp: 3299,
    originalPrice: 3299,
    price: 2499,
    rating: 4.8,
    reviewCount: 112,
    reviewsCount: 112,
    deliveryDays: "2 - 4 Days",
    stock: 20,
    description:
      "Full Graphite High-Modulus badminton racket with head-heavy balance (300mm) for lethal jump smashes. Strung at 28 lbs high tension.",
    shortDescription: "4U High-Modulus Carbon Graphite Badminton Racket.",
    highlights: ["Full High Modulus Carbon Graphite", "300mm Head-Heavy Balance", "Supports Up to 30 lbs String Tension"],
    specs: {
      Material: "Full High Modulus Carbon Graphite",
      Weight: "4U (83±2 grams)",
      Balance: "Head Heavy (300mm)"
    },
    specifications: {
      Material: "Full High Modulus Carbon Graphite",
      Weight: "4U (83±2 grams)"
    },
    colors: ["Matte Black / Neon Orange"],
    sizes: ["4U - G5"],
    sportsType: "Badminton",
    weight: "83g",
    dimensions: "67cm x 20cm",
    featured: true,
    countryOfOrigin: "India"
  }
];

export const mockProducts = MOCK_PRODUCTS;
