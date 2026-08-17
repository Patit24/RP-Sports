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
  weight?: string;
  dimensions?: string;
  badge?: string;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  customizable?: boolean;
  enableJerseyCustomization?: boolean;
  customizationFee?: number;
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
    id: "rp-premium-bat",
    name: "RP Premium Kashmir Willow Cricket Bat",
    slug: "rp-premium-kashmir-willow",
    sku: "RP-BAT-KW03",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    image: "/products/RP Prime Edition.jpeg",
    images: [
      "/products/RP Prime Edition.jpeg",
      "/products/RP Prime Edition-.jpeg",
      "/products/RP Prime Edition-1.jpeg"
    ],
    gallery: [
      "/products/RP Prime Edition.jpeg",
      "/products/RP Prime Edition-.jpeg",
      "/products/RP Prime Edition-1.jpeg"
    ],
    mrp: 4999,
    originalPrice: 4999,
    price: 3500,
    rating: 4.8,
    reviewCount: 94,
    reviewsCount: 94,
    deliveryDays: "2 - 4 Days",
    stock: 22,
    description: "RP Premium Edition Kashmir Willow Cricket Bat. Individually selected for balanced pickup and high-quality performance. Hand-pressed with curved face and thick edges.",
    shortDescription: "Selected Kashmir Willow with thick edges and Singapore cane handle.",
    highlights: [
      "Handcrafted selected Kashmir Willow",
      "Thick edges with full profile",
      "Singapore cane handle with grip",
      "Pre-knocked"
    ],
    specs: {
      "Willow Type": "Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Singapore Cane",
      "Edge Profile": "40mm Edges",
      "Sweet Spot": "Mid Sweet Spot"
    },
    specifications: {
      "Willow Type": "Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Singapore Cane"
    },
    colors: ["Natural Wood Finish"],
    sizes: ["Short Handle (SH)", "Size 6"],
    sportsType: "Cricket",
    weight: "980g",
    dimensions: "85cm x 11cm x 6cm",
    badge: "Bestseller",
    featured: true,
    isBestSeller: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum Metro Gate 2, Kolkata – 700028"
  },
  {
    id: "rp-limited-edition",
    name: "RP Limited Edition Kashmir Willow Cricket Bat",
    slug: "rp-limited-edition-kashmir-willow",
    sku: "RP-BAT-KW04",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    image: "/products/RP Beyond Limits.jpeg",
    images: [
      "/products/RP Beyond Limits.jpeg",
      "/products/RP Beyond Limits-.jpeg"
    ],
    gallery: [
      "/products/RP Beyond Limits.jpeg",
      "/products/RP Beyond Limits-.jpeg"
    ],
    mrp: 5999,
    originalPrice: 5999,
    price: 4000,
    rating: 4.9,
    reviewCount: 76,
    reviewsCount: 76,
    deliveryDays: "2 - 4 Days",
    stock: 15,
    description: "RP Limited Edition Kashmir Willow Cricket Bat. Engineered for performance and maximum power. High-sweet spot for fast pick-up and hard-hitting bounds.",
    shortDescription: "Premium Kashmir Willow bat with high sweet spot and massive edge.",
    highlights: [
      "Grade A+ Kashmir Willow",
      "High sweet-spot for fast pickup",
      "Massive 42mm edges",
      "Singapore cane handle"
    ],
    specs: {
      "Willow Type": "Grade A+ Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Singapore Cane",
      "Edge Profile": "42mm Edges",
      "Sweet Spot": "Mid-to-High Sweet Spot"
    },
    specifications: {
      "Willow Type": "Grade A+ Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Singapore Cane"
    },
    colors: ["Natural Wood Finish"],
    sizes: ["Short Handle (SH)"],
    sportsType: "Cricket",
    weight: "980g",
    dimensions: "85cm x 11cm x 6cm",
    badge: "Limited Edition",
    featured: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-7070-bat",
    name: "RP 7070 Club Select Cricket Bat",
    slug: "rp-7070-club-select",
    sku: "RP-BAT-7070",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    image: "/products/7T7T.jpeg",
    images: ["/products/7T7T.jpeg"],
    gallery: ["/products/7T7T.jpeg"],
    mrp: 7999,
    originalPrice: 7999,
    price: 5500,
    rating: 4.7,
    reviewCount: 110,
    reviewsCount: 110,
    deliveryDays: "2 - 4 Days",
    stock: 18,
    description: "RP 7070 Club Select Kashmir Willow Cricket Bat. Pre-knocked and ready for match play. Offers massive edges and extra control for league players.",
    shortDescription: "7070 Grade Kashmir Willow bat with low sweet spot.",
    highlights: [
      "Selected Club Grade Kashmir Willow",
      "Pre-knocked and oiled",
      "Low sweet spot for drive control",
      "Full cane handle"
    ],
    specs: {
      "Willow Type": "Selected Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Full Cane",
      "Edge Profile": "40mm Edges",
      "Sweet Spot": "Low Sweet Spot"
    },
    specifications: {
      "Willow Type": "Selected Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Full Cane"
    },
    colors: ["Natural Finish"],
    sizes: ["Short Handle (SH)", "Size 6"],
    sportsType: "Cricket",
    weight: "980g",
    dimensions: "85cm x 11cm x 6cm",
    badge: "Trending",
    featured: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-aa-boom",
    name: "AA Boom Power Cricket Bat",
    slug: "rp-aa-boom",
    sku: "RP-BAT-AABOOM",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    image: "/products/AA Boom.jpeg",
    images: ["/products/AA Boom.jpeg"],
    gallery: ["/products/AA Boom.jpeg"],
    mrp: 7999,
    originalPrice: 7999,
    price: 5500,
    rating: 4.8,
    reviewCount: 85,
    reviewsCount: 85,
    deliveryDays: "2 - 4 Days",
    stock: 12,
    description: "AA Boom Kashmir Willow Cricket Bat. Perfect for aggressive heavy-hitters. Extra thick spine and massive sweet spot profile.",
    shortDescription: "Aggressive profile Kashmir Willow bat with thick spine.",
    highlights: [
      "Premium Selected Kashmir Willow",
      "Extra thick spine profile",
      "Designed for big boundaries",
      "Full cane handle"
    ],
    specs: {
      "Willow Type": "Premium Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Cane Handle",
      "Edge Profile": "40mm Edges",
      "Sweet Spot": "Low-to-Mid"
    },
    specifications: {
      "Willow Type": "Premium Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Cane Handle"
    },
    colors: ["Natural Finish"],
    sizes: ["Short Handle (SH)"],
    sportsType: "Cricket",
    weight: "980g",
    dimensions: "85cm x 11cm x 6cm",
    badge: "New Arrival",
    featured: true,
    isNew: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-aa-katar",
    name: "AA Katar Special Edition Cricket Bat",
    slug: "rp-aa-katar-edition",
    sku: "RP-BAT-AAKATAR",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    image: "/products/AA Katar Edition.jpeg",
    images: ["/products/AA Katar Edition.jpeg"],
    gallery: ["/products/AA Katar Edition.jpeg"],
    mrp: 8499,
    originalPrice: 8499,
    price: 6000,
    rating: 4.9,
    reviewCount: 64,
    reviewsCount: 64,
    deliveryDays: "2 - 4 Days",
    stock: 10,
    description: "AA Katar Special Edition Kashmir Willow Cricket Bat. Designed for quick-fire T20 batting. Superb ping and feather-light pickup.",
    shortDescription: "Special Edition Kashmir Willow bat optimized for T20 strokeplay.",
    highlights: [
      "Grade A Kashmir Willow",
      "Lightweight pickup and balance",
      "Superb ping rebound",
      "Singapore cane handle"
    ],
    specs: {
      "Willow Type": "Grade A Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Singapore Cane",
      "Edge Profile": "41mm Edges",
      "Sweet Spot": "Mid Sweet Spot"
    },
    specifications: {
      "Willow Type": "Grade A Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Singapore Cane"
    },
    colors: ["Natural Finish"],
    sizes: ["Short Handle (SH)"],
    sportsType: "Cricket",
    weight: "980g",
    dimensions: "85cm x 11cm x 6cm",
    badge: "Pro Edition",
    featured: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-aa-player-edition",
    name: "AA Player Edition English Willow Cricket Bat",
    slug: "rp-aa-player-edition",
    sku: "RP-BAT-AAPLAYER",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    image: "/products/AA.jpeg",
    images: ["/products/AA.jpeg"],
    gallery: ["/products/AA.jpeg"],
    mrp: 9999,
    originalPrice: 9999,
    price: 7000,
    rating: 5.0,
    reviewCount: 140,
    reviewsCount: 140,
    deliveryDays: "2 - 4 Days",
    stock: 8,
    description: "AA Player Edition English Willow Cricket Bat. Handcrafted from top-grade English Willow. Straight grains and superb balance for professional run-scorers.",
    shortDescription: "Grade 2 English Willow bat with straight grains and pro balance.",
    highlights: [
      "Grade 2 English Willow",
      "8-11 Straight clean grains",
      "Massive 42mm edges",
      "Premium cane handle"
    ],
    specs: {
      "Willow Type": "Grade 2 English Willow",
      Weight: "1160 - 1190 grams",
      Handle: "Oval Cane",
      "Edge Profile": "42mm Edges",
      "Sweet Spot": "Mid Sweet Spot"
    },
    specifications: {
      "Willow Type": "Grade 2 English Willow",
      Weight: "1160 - 1190 grams",
      Handle: "Oval Cane"
    },
    colors: ["Natural English Finish"],
    sizes: ["Short Handle (SH)"],
    sportsType: "Cricket",
    weight: "980g",
    dimensions: "85cm x 11cm x 6cm",
    badge: "Bestseller",
    featured: true,
    isBestSeller: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-kd-limited-edition",
    name: "KD Limited Edition Cricket Bat",
    slug: "rp-kd-limited-edition",
    sku: "RP-BAT-KDLIMITED",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "bats",
    image: "/products/KD Premium Edition.jpeg",
    images: ["/products/KD Premium Edition.jpeg"],
    gallery: ["/products/KD Premium Edition.jpeg"],
    mrp: 5999,
    originalPrice: 5999,
    price: 4000,
    rating: 4.8,
    reviewCount: 52,
    reviewsCount: 52,
    deliveryDays: "2 - 4 Days",
    stock: 14,
    description: "KD Limited Edition Kashmir Willow Cricket Bat. Highly balanced with a traditional profile for classical stroke-makers.",
    shortDescription: "Kashmir Willow bat with traditional profile and balance.",
    highlights: [
      "Grade A Kashmir Willow",
      "Traditional flat face profile",
      "Highly balanced drive control",
      "Singapore cane handle"
    ],
    specs: {
      "Willow Type": "Grade A Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Singapore Cane",
      "Edge Profile": "39mm Edges",
      "Sweet Spot": "Mid Sweet Spot"
    },
    specifications: {
      "Willow Type": "Grade A Kashmir Willow",
      Weight: "950 - 980 grams",
      Handle: "Singapore Cane"
    },
    colors: ["Natural Wood Finish"],
    sizes: ["Short Handle (SH)"],
    sportsType: "Cricket",
    weight: "980g",
    dimensions: "85cm x 11cm x 6cm",
    badge: "Limited Edition",
    featured: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-003",
    name: "RP Custom Sublimated Match Jersey 2026",
    slug: "rp-custom-jersey-2026",
    sku: "RP-JSY-003",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "custom-jersey",
    image: "/products/generated_jersey.jpg",
    images: [
      "/products/generated_jersey.jpg",
      "/products/cricket_jersey_premium.jpg",
      "/products/cricket_player_blank_jersey.jpg"
    ],
    gallery: [
      "/products/generated_jersey.jpg",
      "/products/cricket_jersey_premium.jpg",
      "/products/cricket_player_blank_jersey.jpg"
    ],
    mrp: 999,
    originalPrice: 999,
    price: 699,
    rating: 4.8,
    reviewCount: 310,
    reviewsCount: 310,
    deliveryDays: "4 - 7 Days",
    stock: 500,
    description: "Premium moisture-wicking dry-fit team match jersey. Fully sublimated custom designs, infinite sponsors, numbers and player name options.",
    shortDescription: "Dry-fit team match jersey with fully customizable sublimation design.",
    highlights: ["100% Moisture-Wicking Dry-Fit Polyester", "Fully Custom Sublimation Designs", "No Extra Cost for Numbers & Names"],
    specs: {
      Material: "100% Dry-Fit Polyester",
      Weight: "160 GSM",
      Printing: "High Definition Sublimation"
    },
    specifications: {
      Material: "100% Dry-Fit Polyester",
      Weight: "160 GSM"
    },
    colors: ["Blue / Gold", "Red / White", "Green / Black", "Custom Colors"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Multi-Sport",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India"
  },
  {
    id: "rp-jsy-india",
    name: "Team India Match Edition Pro Cricket Jersey 2026",
    slug: "team-india-match-jersey-2026",
    sku: "RP-JSY-IND26",
    brand: "RP Sports",
    category: "jerseys",
    subcategory: "custom-jersey",
    image: "/products/cricket_jersey_premium.jpg",
    images: [
      "/products/cricket_jersey_premium.jpg",
      "/products/generated_jersey.jpg"
    ],
    gallery: [
      "/products/cricket_jersey_premium.jpg",
      "/products/generated_jersey.jpg"
    ],
    mrp: 1499,
    originalPrice: 1499,
    price: 899,
    rating: 4.9,
    reviewCount: 420,
    reviewsCount: 420,
    deliveryDays: "3 - 5 Days",
    stock: 250,
    description: "Official match edition India fan & player jersey. Ultra-lightweight moisture wicking breathable honeycomb fabric with custom player name & number printing.",
    shortDescription: "Official Match Edition Team India jersey with free custom player name & number.",
    highlights: ["Honeycomb Breathable Micro-Polyester", "Official Blue & Saffron Accents", "Laser Sublimation Custom Name & Number"],
    specs: {
      Material: "100% Micro Honeycomb Polyester",
      Weight: "155 GSM",
      Printing: "High Definition Laser Sublimation"
    },
    specifications: {
      Material: "100% Micro Honeycomb Polyester",
      Weight: "155 GSM"
    },
    colors: ["India Royal Blue / Saffron", "T20 Dark Blue"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Cricket",
    customizable: true,
    enableJerseyCustomization: true,
    badge: "Bestseller",
    featured: true,
    countryOfOrigin: "India"
  },
  {
    id: "rp-jsy-kolkata",
    name: "RP Kolkata Knight Match Edition Fan Jersey 2026",
    slug: "rp-kolkata-knight-match-jersey",
    sku: "RP-JSY-KKR26",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "custom-jersey",
    image: "/products/cricket_player_blank_jersey.jpg",
    images: [
      "/products/cricket_player_blank_jersey.jpg",
      "/products/generated_jersey.jpg"
    ],
    gallery: [
      "/products/cricket_player_blank_jersey.jpg",
      "/products/generated_jersey.jpg"
    ],
    mrp: 1299,
    originalPrice: 1299,
    price: 799,
    rating: 4.8,
    reviewCount: 185,
    reviewsCount: 185,
    deliveryDays: "3 - 5 Days",
    stock: 180,
    description: "Purple & Gold match jersey inspired by the spirit of Kolkata cricket. Tailored for comfort and matchday intensity with personalized name and number printing.",
    shortDescription: "Kolkata match jersey with personalized player name and number.",
    highlights: ["Purple & Gold Athletic Pattern", "Anti-Bacterial Dry-Fit Fabric", "Complimentary Name & Number Sublimation"],
    specs: {
      Material: "Dry-Fit Polyester",
      Weight: "160 GSM"
    },
    specifications: {
      Material: "Dry-Fit Polyester",
      Weight: "160 GSM"
    },
    colors: ["Purple / Gold"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Cricket",
    customizable: true,
    enableJerseyCustomization: true,
    badge: "Trending",
    featured: true,
    countryOfOrigin: "India"
  },
  {
    id: "rp-004",
    name: "RP Turbo Speed Pro Spike Cricket Shoes",
    slug: "rp-turbo-speed-pro-spikes",
    sku: "RP-SHO-004",
    brand: "RP Sports",
    category: "shoes",
    subcategory: "shoes",
    image: "/products/shoe_spikes.jpg",
    images: [
      "/products/shoe_spikes.jpg",
      "/products/shoe_turf.jpg",
      "/products/shoe_running.jpg"
    ],
    gallery: [
      "/products/shoe_spikes.jpg",
      "/products/shoe_turf.jpg",
      "/products/shoe_running.jpg"
    ],
    mrp: 3499,
    originalPrice: 3499,
    price: 2499,
    rating: 4.7,
    reviewCount: 198,
    reviewsCount: 198,
    deliveryDays: "2 - 4 Days",
    stock: 45,
    description: "Engineered with 11 metal spikes for premium traction. Lightweight breathable mesh upper with high-impact compression midsole.",
    shortDescription: "Spike cricket shoes with breathable mesh and 11 metal spikes.",
    highlights: ["11 Strategically Positioned Metal Spikes", "Cushioned Phylon Midsole", "Breathable Lightweight Upper Mesh"],
    specs: {
      Type: "Full Spike Cricket Shoes",
      Spikes: "11 Removable Metal Spikes",
      Sole: "Durable TPU Outsole"
    },
    specifications: {
      Type: "Full Spike Cricket Shoes",
      Spikes: "11 Removable Metal Spikes"
    },
    colors: ["White / Metallic Red"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    sportsType: "Cricket",
    badge: "New",
    featured: true,
    isNew: true,
    countryOfOrigin: "India"
  },
  {
    id: "rp-005",
    name: "RP Gold Championship Victory Trophy",
    slug: "rp-gold-victory-trophy",
    sku: "RP-TRP-005",
    brand: "RP Trophies",
    category: "trophies",
    subcategory: "trophies",
    image: "/products/generated_trophy.jpg",
    images: ["/products/generated_trophy.jpg"],
    gallery: ["/products/generated_trophy.jpg"],
    mrp: 1499,
    originalPrice: 1499,
    price: 999,
    rating: 4.9,
    reviewCount: 78,
    reviewsCount: 78,
    deliveryDays: "3 - 5 Days",
    stock: 85,
    description: "Premium gold-plated championship victory cup trophy mounted on a dark solid walnut wood base. Free customized laser engraved nameplate.",
    shortDescription: "Gold-plated cup trophy on dark walnut wood base. Customized plate.",
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
    image: "/products/generated_racket.jpg",
    images: ["/products/generated_racket.jpg"],
    gallery: ["/products/generated_racket.jpg"],
    mrp: 3299,
    originalPrice: 3299,
    price: 2499,
    rating: 4.8,
    reviewCount: 112,
    reviewsCount: 112,
    deliveryDays: "2 - 4 Days",
    stock: 20,
    description: "Full Graphite High-Modulus badminton racket with head-heavy balance (300mm) for lethal jump smashes. Strung at 28 lbs high tension.",
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
