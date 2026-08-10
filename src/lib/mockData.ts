export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  images: string[];
  mrp: number;
  price: number;
  rating: number;
  reviewsCount: number;
  deliveryDays: number;
  stock: number;
  description: string;
  shortDescription: string;
  highlights: string[];
  specifications: Record<string, string>;
  colors: string[];
  sizes: string[];
  sportsType: string;
  weight: string;
  dimensions: string;
  badge?: "Sale" | "New" | "Limited" | "Out of Stock";
  featured?: boolean;
  willowType?: string;
  willowGrade?: string;
  handleSize?: string;
  playerLevel?: string;
  countryOfOrigin?: string;
  manufacturerDetails?: string;
}


export const CATEGORIES = [
  { id: "cricket", name: "Cricket", icon: "🏏", banner: "/products/rp_screenshot_7.png" },
  { id: "football", name: "Football", icon: "⚽", banner: "/products/generated_football.jpg" },
  { id: "badminton", name: "Badminton", icon: "🏸", banner: "/products/generated_racket.jpg" },
  { id: "jerseys", name: "Jerseys", icon: "👕", banner: "/products/rp_screenshot_1.png" },
  { id: "shoes", name: "Sports Shoes", icon: "👟", banner: "/products/rp_screenshot_2.png" },
  { id: "fitness", name: "Fitness & Caps", icon: "🧢", banner: "/products/rp_screenshot_4.png" },
  { id: "awards", name: "Trophies & Awards", icon: "🏆", banner: "/products/generated_trophy.jpg" }
];

export const BRANDS = ["RP Sports", "RP Elite", "7070", "AA", "KD"];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "RP Prime Edition Kashmir Willow Cricket Bat",
    slug: "rp-prime-edition-kashmir-willow-cricket-bat",
    sku: "RP-CRIC-BAT-001",
    brand: "RP Elite",
    category: "cricket",
    subcategory: "Bats",
    images: [
      "/products/generated_bat.jpg"
    ],
    mrp: 9999,
    price: 7499,
    rating: 4.9,
    reviewsCount: 245,
    deliveryDays: 3,
    stock: 25,
    description: "Handcrafted from selected Grade-1 Kashmir Willow, the RP Prime features thick edges (38-40mm) and a full profile with lightweight pickup. It displays natural wood grains and comes pre-knocked with a double textured rubber grip.",
    shortDescription: "Grade-1 Kashmir Willow Prime Edition bat with thick edges and light pick-up. Optimized for leather ball matches.",
    highlights: [
      "Individually hand-crafted from chosen Kashmir Willow",
      "Thick power edges (38mm - 40mm)",
      "Naturally air-dried willow density",
      "Full cane Sarawak handle for shock absorption",
      "Fitted with double wrap grips"
    ],
    specifications: {
      "Willow Type": "Premium Kashmir Willow",
      "Handle Type": "Sarawak cane spring",
      "Sweet Spot": "Mid to Low Profile",
      "Edge Size": "39mm",
      "Weight": "1180 - 1220 grams",
      "Size": "Full Size (SH)"
    },
    colors: ["Natural Wood / Yellow Grip"],
    sizes: ["SH", "Harrow"],
    sportsType: "Cricket",
    weight: "1.20 kg",
    dimensions: "85 x 10.8 x 5.8 cm",
    badge: "Limited",
    featured: true
  },
  {
    id: "2",
    name: "RP Elite English Willow Cricket Bat",
    slug: "rp-elite-english-willow-cricket-bat",
    sku: "RP-CRIC-BAT-002",
    brand: "RP Elite",
    category: "cricket",
    subcategory: "Bats",
    images: [
      "/products/generated_bat.jpg"
    ],
    mrp: 24999,
    price: 18999,
    rating: 5.0,
    reviewsCount: 88,
    deliveryDays: 4,
    stock: 12,
    description: "Professional grade English Willow cricket bat with clean, straight grains (7-9 grains). Custom pressed to offer explosive rebounds, a massive mid-blade sweet spot, and an ergonomic Sarawak handle bound in carbon-fiber thread.",
    shortDescription: "Grade-1 English Willow pro series bat. 7-9 straight grains, massive power rebound profile.",
    highlights: [
      "Imported English Willow (Grade-1 Pro)",
      "7-9 straight grains visible on face",
      "Unmatched ping performance and spring response",
      "Semi-oval handle for supreme wrist control",
      "Used by first-class Ranji players"
    ],
    specifications: {
      "Willow Type": "Grade-1 English Willow",
      "Handle Type": "Semi-oval Sarawak Cane",
      "Sweet Spot": "Mid Sweet Spot",
      "Edge Size": "41mm",
      "Weight": "1160 - 1190 grams",
      "Grains": "7 - 9 Grains"
    },
    colors: ["Natural Wood / White Grip"],
    sizes: ["SH", "LH"],
    sportsType: "Cricket",
    weight: "1.17 kg",
    dimensions: "85 x 10.8 x 6.0 cm",
    badge: "New",
    featured: true
  },
  {
    id: "new-1",
    name: "Rp Premium Bat",
    slug: "rp-premium-bat",
    sku: "RP-CRIC-BAT-NEW1",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "Bats",
    images: ["/products/RP Prime Edition.jpeg"],
    mrp: 5000,
    price: 3500,
    rating: 5.0,
    reviewsCount: 12,
    deliveryDays: 3,
    stock: 50,
    description: "Premium grade cricket bat offering excellent balance and ping.",
    shortDescription: "Premium grade cricket bat.",
    highlights: ["Premium quality", "Handcrafted"],
    specifications: {
      "Willow Type": "Kashmir Willow",
      "Handle Type": "Full Cane",
      "Size": "Full Size (SH)"
    },
    colors: ["Natural Wood"],
    sizes: ["SH"],
    sportsType: "Cricket",
    weight: "1.2 kg",
    dimensions: "85 x 10.8 x 6.0 cm",
    badge: "New",
    featured: true
  },
  {
    id: "new-2",
    name: "Rp Limited Edition",
    slug: "rp-limited-edition",
    sku: "RP-CRIC-BAT-NEW2",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "Bats",
    images: ["/products/RP Beyond Limits.jpeg"],
    mrp: 6000,
    price: 4000,
    rating: 5.0,
    reviewsCount: 8,
    deliveryDays: 3,
    stock: 20,
    description: "Limited edition professional bat with premium willow.",
    shortDescription: "Limited Edition bat.",
    highlights: ["Limited availability", "Pro Balance"],
    specifications: {
      "Willow Type": "Premium English Willow",
      "Handle Type": "Oval Cane",
      "Size": "Full Size (SH)"
    },
    colors: ["Natural Wood"],
    sizes: ["SH"],
    sportsType: "Cricket",
    weight: "1.18 kg",
    dimensions: "85 x 10.8 x 6.0 cm",
    badge: "New",
    featured: true
  },
  {
    id: "new-3",
    name: "7070 Bat",
    slug: "7070-bat",
    sku: "7070-CRIC-BAT-NEW3",
    brand: "7070",
    category: "cricket",
    subcategory: "Bats",
    images: ["/products/7T7T.jpeg"],
    mrp: 7500,
    price: 5500,
    rating: 4.8,
    reviewsCount: 15,
    deliveryDays: 3,
    stock: 30,
    description: "7070 series cricket bat. Built for aggressive play.",
    shortDescription: "7070 series cricket bat.",
    highlights: ["High performance", "Power edges"],
    specifications: {
      "Willow Type": "Selected Willow",
      "Handle Type": "Cane",
      "Size": "Full Size (SH)"
    },
    colors: ["Natural Wood"],
    sizes: ["SH"],
    sportsType: "Cricket",
    weight: "1.2 kg",
    dimensions: "85 x 10.8 x 6.0 cm",
    badge: "New",
    featured: true
  },
  {
    id: "new-4",
    name: "AA Boom",
    slug: "aa-boom",
    sku: "AA-CRIC-BAT-NEW4",
    brand: "AA",
    category: "cricket",
    subcategory: "Bats",
    images: ["/products/AA Boom.jpeg"],
    mrp: 7500,
    price: 5500,
    rating: 4.9,
    reviewsCount: 22,
    deliveryDays: 3,
    stock: 40,
    description: "Exceptional power and ping. Designed to clear the boundary with ease.",
    shortDescription: "AA Boom cricket bat.",
    highlights: ["Explosive power", "Massive sweet spot"],
    specifications: {
      "Willow Type": "Grade-1 Kashmir Willow",
      "Handle Type": "Full Cane Spring Handle",
      "Size": "Full Size (SH)"
    },
    colors: ["Natural Wood"],
    sizes: ["SH"],
    sportsType: "Cricket",
    weight: "1.22 kg",
    dimensions: "85 x 10.8 x 6.0 cm",
    badge: "New",
    featured: true
  },
  {
    id: "new-5",
    name: "AA Katar",
    slug: "aa-katar",
    sku: "AA-CRIC-BAT-NEW5",
    brand: "AA",
    category: "cricket",
    subcategory: "Bats",
    images: ["/products/AA Katar Edition.jpeg"],
    mrp: 8000,
    price: 6000,
    rating: 4.9,
    reviewsCount: 18,
    deliveryDays: 3,
    stock: 25,
    description: "Designed for sharp cuts and pulls. Exquisite balance.",
    shortDescription: "AA Katar cricket bat.",
    highlights: ["Great balance", "Precision pickup"],
    specifications: {
      "Willow Type": "Pro Selected Willow",
      "Handle Type": "Cane Handle",
      "Size": "Full Size (SH)"
    },
    colors: ["Natural Wood"],
    sizes: ["SH"],
    sportsType: "Cricket",
    weight: "1.19 kg",
    dimensions: "85 x 10.8 x 6.0 cm",
    badge: "New",
    featured: true
  },
  {
    id: "new-6",
    name: "AA Player Edition",
    slug: "aa-player-edition",
    sku: "AA-CRIC-BAT-NEW6",
    brand: "AA",
    category: "cricket",
    subcategory: "Bats",
    images: ["/products/AA.jpeg"],
    mrp: 9000,
    price: 7000,
    rating: 5.0,
    reviewsCount: 30,
    deliveryDays: 3,
    stock: 15,
    description: "Used by top tier players. Hand-selected willow.",
    shortDescription: "AA Player Edition bat.",
    highlights: ["Player grade willow", "Clean straight grains"],
    specifications: {
      "Willow Type": "Player Grade Willow",
      "Handle Type": "Multi-piece Cane",
      "Size": "Full Size (SH)"
    },
    colors: ["Natural Wood"],
    sizes: ["SH"],
    sportsType: "Cricket",
    weight: "1.17 kg",
    dimensions: "85 x 10.8 x 6.0 cm",
    badge: "New",
    featured: true
  },
  {
    id: "new-7",
    name: "KD Limited Edition",
    slug: "kd-limited-edition",
    sku: "KD-CRIC-BAT-NEW7",
    brand: "KD",
    category: "cricket",
    subcategory: "Bats",
    images: ["/products/KD Premium Edition.jpeg"],
    mrp: 6000,
    price: 4000,
    rating: 4.8,
    reviewsCount: 10,
    deliveryDays: 3,
    stock: 20,
    description: "KD Limited Edition bat offering extreme value and performance.",
    shortDescription: "KD Limited Edition bat.",
    highlights: ["Limited edition", "Lightweight pickup"],
    specifications: {
      "Willow Type": "Premium Grade Willow",
      "Handle Type": "Cane Handle",
      "Size": "Full Size (SH)"
    },
    colors: ["Natural Wood"],
    sizes: ["SH"],
    sportsType: "Cricket",
    weight: "1.2 kg",
    dimensions: "85 x 10.8 x 6.0 cm",
    badge: "New",
    featured: true
  },
  {
    id: "shoe-1",
    name: "Nike Zoom Structure Plus Men's Running Shoes",
    slug: "nike-zoom-structure-plus-mens-running-shoes",
    sku: "NK-SHOE-RUN-001",
    brand: "Nike",
    category: "shoes",
    subcategory: "Running Shoes",
    images: ["/products/shoe_running.jpg"],
    mrp: 14995,
    price: 13495,
    rating: 4.9,
    reviewsCount: 142,
    deliveryDays: 2,
    stock: 25,
    description: "Responsive Zoom Air cushioning combined with breathable engineered mesh uppers for maximum stability and speed.",
    shortDescription: "High-performance Zoom Air running shoes for marathon training.",
    highlights: ["Zoom Air cushioning", "Engineered breathable mesh", "Durable rubber outsole"],
    specifications: { "Cushioning": "Zoom Air", "Surface": "Road / Track", "Weight": "285g" },
    colors: ["Neon Green / Purple", "Bright White / Gold"],
    sizes: ["7 UK", "8 UK", "9 UK", "10 UK"],
    sportsType: "Running",
    weight: "0.28 kg",
    dimensions: "32 x 20 x 12 cm",
    badge: "Sale",
    featured: true
  },
  {
    id: "shoe-2",
    name: "RP Spark Pro Cricket Spike Shoes",
    slug: "rp-spark-pro-cricket-spike-shoes",
    sku: "RP-SHOE-[#111111]-002",
    brand: "RP Sports",
    category: "shoes",
    subcategory: "Cricket Spikes",
    images: ["/products/shoe_spikes.jpg"],
    mrp: 6999,
    price: 5499,
    rating: 5.0,
    reviewsCount: 94,
    deliveryDays: 3,
    stock: 30,
    description: "Handcrafted professional cricket spike shoes with removable stainless steel studs, reinforced toe protection, and EVA shock absorption mid-sole.",
    shortDescription: "Professional cricket spikes with metal studs and ankle support.",
    highlights: ["Removable metal spikes", "Padded ankle support collar", "Tough PU upper"],
    specifications: { "Stud Type": "Metal Spikes", "Upper": "Synthetic PU + Mesh", "Fit": "Ergonomic Pro Fit" },
    colors: ["White / RP Red", "Black / Gold"],
    sizes: ["7 UK", "8 UK", "9 UK", "10 UK", "11 UK"],
    sportsType: "Cricket",
    weight: "0.42 kg",
    dimensions: "34 x 22 x 13 cm",
    badge: "New",
    featured: true
  },
  {
    id: "shoe-3",
    name: "Nike Turf Dynamics Training Shoes",
    slug: "nike-turf-dynamics-training-shoes",
    sku: "NK-SHOE-[#111111]-003",
    brand: "Nike",
    category: "shoes",
    subcategory: "Turf Shoes",
    images: ["/products/shoe_turf.jpg"],
    mrp: 11895,
    price: 10705,
    rating: 4.8,
    reviewsCount: 76,
    deliveryDays: 2,
    stock: 18,
    description: "Multidirectional rubber stud outsole for supreme grip on artificial turf and hard ground training pitches.",
    shortDescription: "Turf training shoes for indoor and outdoor sports.",
    highlights: ["Multidirectional rubber studs", "Low-profile cushioning", "Flexible toe box"],
    specifications: { "Outsole": "Rubber Turf Cleats", "Upper": "Knit Mesh", "Weight": "310g" },
    colors: ["Teal Blue / Black", "Charcoal / Volt"],
    sizes: ["8 UK", "9 UK", "10 UK"],
    sportsType: "Football / Turf",
    weight: "0.31 kg",
    dimensions: "32 x 20 x 12 cm",
    badge: "Sale",
    featured: true
  },
  {
    id: "shoe-4",
    name: "Nike Vomero 18 Women's Running Shoes",
    slug: "nike-vomero-18-womens-running-shoes",
    sku: "NK-SHOE-RUN-004",
    brand: "Nike",
    category: "shoes",
    subcategory: "Running Shoes",
    images: ["/products/generated_shoes.jpg"],
    mrp: 13295,
    price: 11965,
    rating: 4.9,
    reviewsCount: 63,
    deliveryDays: 3,
    stock: 14,
    description: "Ultra-plush foam cushioning for maximum comfort over long distances. High-traction waffle tread for all-weather grip.",
    shortDescription: "Ultra-plush long distance running shoes.",
    highlights: ["Plush foam mid-sole", "Breathable upper", "Waffle outsole"],
    specifications: { "Category": "Road Running", "Drop": "10mm", "Weight": "250g" },
    colors: ["Beige / Soft Pink", "Off-White / Silver"],
    sizes: ["5 UK", "6 UK", "7 UK", "8 UK"],
    sportsType: "Running",
    weight: "0.25 kg",
    dimensions: "30 x 18 x 11 cm",
    badge: "Sale",
    featured: true
  }
];


export const MOCK_BLOGS = [
  {
    id: "blog-1",
    title: "How to Choose the Perfect English Willow Cricket Bat in 2026",
    slug: "how-to-choose-english-willow-cricket-bat",
    excerpt: "Understand wood grains, moisture levels, handle types, and pickup weights to pick a run-scoring bat suitable for your style.",
    content: "Selecting a cricket bat is a deeply personal ritual for any batsman. In this article, we dive deep into the grades of English Willow (from Grade 1+ to Grade 4), what grain counts mean for durability and rebound, how sweet-spot placements affect backfoot vs frontfoot players, and how carbon-fiber composites are changing the pickup game...",
    image: "/products/rp_screenshot_7.png",
    date: "June 28, 2026",
    author: "Coach RP Sharma",
    readTime: "6 min read"
  },
  {
    id: "blog-2",
    title: "Understanding Kashmir Willow vs English Willow bats",
    slug: "kashmir-vs-english-willow-cricket-bats",
    excerpt: "Differentiating density, ping response, and durability to select the right willow for your leather training sessions.",
    content: "Kashmir Willow is known for its durability and darker, reddish wood tone. It is denser than English willow, making it slightly heavier but exceptionally robust against hard leather balls. We analyze the bounce coefficient and grain variations to guide your purchase decision...",
    image: "/products/rp_screenshot_3.png",
    date: "July 01, 2026",
    author: "Coach RP Sharma",
    readTime: "7 min read"
  }
];
