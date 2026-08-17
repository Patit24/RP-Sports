import { Product } from "./mockData";

export const NEW_CATALOG_PRODUCTS: Product[] = [
  // =========================================================================
  // 1. SPORTS SUNGLASSES (6 items - ALL STOCK = 0)
  // =========================================================================
  {
    id: "rp-sg-001",
    name: "RP AeroShield Polarized Cricket & Sports Sunglasses",
    slug: "rp-aeroshield-polarized-cricket-sunglasses",
    sku: "RP-SG-001",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "sunglasses",
    image: "/products/sunglasses_aeroshield.jpg",
    images: [
      "/products/sunglasses_aeroshield.jpg",
      "/products/sunglasses_vortex.jpg"
    ],
    gallery: [
      "/products/sunglasses_aeroshield.jpg",
      "/products/sunglasses_vortex.jpg"
    ],
    mrp: 1999,
    originalPrice: 1999,
    price: 1299,
    rating: 4.8,
    reviewCount: 42,
    reviewsCount: 42,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP AeroShield Polarized Cricket & Sports Sunglasses. Designed for cricket fielders, runners, and outdoor athletes requiring maximum glare reduction under intense sunlight. Built with an ultra-lightweight TR90 flexible frame and TAC polarized UV400 lenses.",
    shortDescription: "Aerodynamic wrap-around UV400 polarized shades with anti-slip rubber nose pad.",
    highlights: [
      "100% UV400 Protection & Polarized TAC Lenses",
      "Ultralight TR90 Flexible Frame (26 grams)",
      "Hydrophobic Anti-Fog Lens Coating",
      "Anti-Slip Ergonomic Rubber Nose Grips"
    ],
    specs: {
      "Frame Material": "TR90 Grilamid Polymer",
      "Lens Type": "Polarized Triacetate Cellulose (TAC)",
      "UV Rating": "UV400 (100% UVA/UVB Block)",
      "Weight": "26 grams",
      "Lens Width": "142mm Shield"
    },
    specifications: {
      "Frame Material": "TR90 Grilamid Polymer",
      "Lens Type": "Polarized TAC Lens",
      "UV Rating": "UV400 Protection",
      "Weight": "26g"
    },
    colors: ["Matte Black / Crimson Red", "Gloss White / Smoke Gray"],
    sizes: ["Standard Adult Fit"],
    sportsType: "Cricket & Multi-Sport",
    weight: "26g",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Optics Division, Dumdum, Kolkata – 700028"
  },
  {
    id: "rp-sg-002",
    name: "RP Vortex Velocity Mirrored Sports Sunglasses",
    slug: "rp-vortex-velocity-mirrored-sports-sunglasses",
    sku: "RP-SG-002",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "sunglasses",
    image: "/products/sunglasses_vortex.jpg",
    images: [
      "/products/sunglasses_vortex.jpg",
      "/products/sunglasses_aeroshield.jpg"
    ],
    gallery: [
      "/products/sunglasses_vortex.jpg",
      "/products/sunglasses_aeroshield.jpg"
    ],
    mrp: 2299,
    originalPrice: 2299,
    price: 1499,
    rating: 4.9,
    reviewCount: 36,
    reviewsCount: 36,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Vortex Velocity Mirrored Sports Sunglasses. Engineered with a semi-rimless panoramic shield lens offering an unobstructed peripheral vision field. Revo iridescent multi-layer coating cuts glare on water, turf, and cricket pitch decks.",
    shortDescription: "Semi-rimless Revo iridescent mirrored sports eyewear with panoramic field of view.",
    highlights: [
      "Revo Iridescent Multi-Layer Mirror Coating",
      "Semi-Rimless Panoramic Field of View",
      "Impact-Resistant Polycarbonate Lens",
      "Ventilated Anti-Sweat Brow Channel"
    ],
    specs: {
      "Frame Material": "Semi-Rimless TR90",
      "Lens Type": "Revo Iridescent Mirrored Polycarbonate",
      "UV Rating": "UV400 Cat. 3",
      "Weight": "28 grams"
    },
    specifications: {
      "Frame Material": "Semi-Rimless TR90",
      "Lens Type": "Revo Mirrored Lens",
      "Weight": "28g"
    },
    colors: ["Iridescent Blue Mirror", "Emerald Green Mirror"],
    sizes: ["Standard Adult Fit"],
    sportsType: "Multi-Sport & Cycling",
    weight: "28g",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-sg-003",
    name: "RP Carbon Edge Tactical Sports Sunglasses",
    slug: "rp-carbon-edge-tactical-sports-sunglasses",
    sku: "RP-SG-003",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "sunglasses",
    image: "/products/sunglasses_carbon.jpg",
    images: [
      "/products/sunglasses_carbon.jpg",
      "/products/sunglasses_stealth.jpg"
    ],
    gallery: [
      "/products/sunglasses_carbon.jpg",
      "/products/sunglasses_stealth.jpg"
    ],
    mrp: 1799,
    originalPrice: 1799,
    price: 1199,
    rating: 4.7,
    reviewCount: 29,
    reviewsCount: 29,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Carbon Edge Tactical Sports Sunglasses. Features a textured carbon-pattern frame with high-contrast amber tint lenses specifically tuned to enhance ball visibility against overcast skies and green outfield grass.",
    shortDescription: "High-contrast amber tint sports sunglasses with carbon texture finish frame.",
    highlights: [
      "High-Contrast Amber Tint Optics",
      "Enhanced Ball Tracking Against Green Outfields",
      "Carbon Fiber Texture Finish",
      "Flexible Comfort-Fit Temples"
    ],
    specs: {
      "Frame Material": "Carbon Fiber Texture TR90",
      "Lens Type": "High-Contrast Amber TAC Polarized",
      "UV Rating": "UV400 Protection",
      "Weight": "24 grams"
    },
    specifications: {
      "Frame Material": "Carbon Finish TR90",
      "Lens Type": "Amber Contrast Lens",
      "Weight": "24g"
    },
    colors: ["Carbon Fiber Black", "Stealth Gray"],
    sizes: ["Standard Adult Fit"],
    sportsType: "Cricket & Field Sports",
    weight: "24g",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-sg-004",
    name: "RP Stealth Pro Polarized Field Sunglasses",
    slug: "rp-stealth-pro-polarized-field-sunglasses",
    sku: "RP-SG-004",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "sunglasses",
    image: "/products/sunglasses_stealth.jpg",
    images: [
      "/products/sunglasses_stealth.jpg",
      "/products/sunglasses_aeroshield.jpg"
    ],
    gallery: [
      "/products/sunglasses_stealth.jpg",
      "/products/sunglasses_aeroshield.jpg"
    ],
    mrp: 2499,
    originalPrice: 2499,
    price: 1599,
    rating: 4.8,
    reviewCount: 38,
    reviewsCount: 38,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Stealth Pro Polarized Field Sunglasses. Finished in non-reflective matte pitch black. The polarized optics eliminate harsh glare while maintaining natural color fidelity during outdoor sports and training sessions.",
    shortDescription: "Matte black ultralight sports sunglasses with dark polarized anti-reflective lenses.",
    highlights: [
      "Dark Polarized Anti-Glare Lenses",
      "Non-Reflective Matte Black Finish",
      "Ergonomic Wrap Fit for Helmet Compatibility",
      "Anti-Scratch Lens Hard Coating"
    ],
    specs: {
      "Frame Material": "Ultra-Flexible TR90",
      "Lens Type": "HD Dark Smoke Polarized TAC",
      "UV Rating": "UV400 Protection",
      "Weight": "25 grams"
    },
    specifications: {
      "Frame Material": "Ultra-Flexible TR90",
      "Lens Type": "Polarized Dark Smoke",
      "Weight": "25g"
    },
    colors: ["Pitch Matte Black", "Deep Obsidian"],
    sizes: ["Standard Adult Fit"],
    sportsType: "Cricket, Running, Athletics",
    weight: "25g",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-sg-005",
    name: "RP Blaze Horizon UV400 Athletic Sunglasses",
    slug: "rp-blaze-horizon-uv400-athletic-sunglasses",
    sku: "RP-SG-005",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "sunglasses",
    image: "/products/sunglasses_blaze.jpg",
    images: [
      "/products/sunglasses_blaze.jpg",
      "/products/sunglasses_apex.jpg"
    ],
    gallery: [
      "/products/sunglasses_blaze.jpg",
      "/products/sunglasses_apex.jpg"
    ],
    mrp: 1999,
    originalPrice: 1999,
    price: 1349,
    rating: 4.7,
    reviewCount: 24,
    reviewsCount: 24,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Blaze Horizon Athletic Sunglasses. Features red iridium mirror lens technology designed for intense midday sun exposure. Dual temple venting slots prevent moisture condensation during strenuous workouts.",
    shortDescription: "Red iridium mirror lens wrap-around athletic sunglasses with dual anti-fog temple vents.",
    highlights: [
      "Red Iridium Reflective Mirror Optics",
      "Dual Airflow Temple Ventilation Slots",
      "Impact-Resistant Shatterproof Frame",
      "Hypoallergenic Silicone Nose Bridge"
    ],
    specs: {
      "Frame Material": "High-Impact Polymer",
      "Lens Type": "Red Iridium Polycarbonate",
      "UV Rating": "UV400 Cat. 3",
      "Weight": "27 grams"
    },
    specifications: {
      "Frame Material": "High-Impact Polymer",
      "Lens Type": "Red Iridium Mirror",
      "Weight": "27g"
    },
    colors: ["Flame Red / Fire Mirror", "Neon Yellow / Silver Mirror"],
    sizes: ["Standard Adult Fit"],
    sportsType: "Multi-Sport & Athletics",
    weight: "27g",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-sg-006",
    name: "RP Apex Shield Performance Sports Sunglasses",
    slug: "rp-apex-shield-performance-sports-sunglasses",
    sku: "RP-SG-006",
    brand: "RP Sports",
    category: "cricket",
    subcategory: "sunglasses",
    image: "/products/sunglasses_apex.jpg",
    images: [
      "/products/sunglasses_apex.jpg",
      "/products/sunglasses_vortex.jpg"
    ],
    gallery: [
      "/products/sunglasses_apex.jpg",
      "/products/sunglasses_vortex.jpg"
    ],
    mrp: 2599,
    originalPrice: 2599,
    price: 1699,
    rating: 4.9,
    reviewCount: 31,
    reviewsCount: 31,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Apex Shield Performance Sports Sunglasses. Built with an oversized cylindrical shield lens providing maximum wind, dust, and UV protection for high-speed athletics, cycling, and cricket fielding.",
    shortDescription: "Wide panoramic cylindrical rimless sports eyewear with shatterproof HD lenses.",
    highlights: [
      "Oversized Panoramic Cylindrical Shield",
      "Maximum Wind & Dust Eye Protection",
      "Shatterproof Polycarbonate HD Clarity",
      "Custom Microfiber Hard Case Included"
    ],
    specs: {
      "Frame Material": "Rimless TR90 Upper Brow",
      "Lens Type": "Cylindrical Shield Polycarbonate",
      "UV Rating": "UV400 100% Protection",
      "Weight": "29 grams"
    },
    specifications: {
      "Frame Material": "Rimless TR90 Upper Brow",
      "Lens Type": "Cylindrical Shield",
      "Weight": "29g"
    },
    colors: ["Crystal Clear / Gold Mirror", "Matte Black / Platinum"],
    sizes: ["Standard Adult Fit"],
    sportsType: "Cricket, Cycling, Running",
    weight: "29g",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },

  // =========================================================================
  // 2. SPORTS CAPS (6 items - ALL STOCK = 0)
  // =========================================================================
  {
    id: "rp-cap-001",
    name: "RP Pro Dry-Fit Perforated Running Cap",
    slug: "rp-pro-dryfit-perforated-running-cap",
    sku: "RP-CAP-001",
    brand: "RP Sports",
    category: "jerseys",
    subcategory: "caps",
    image: "/products/cap_dryfit_run.jpg",
    images: [
      "/products/cap_dryfit_run.jpg",
      "/products/cap_flexfit.jpg"
    ],
    gallery: [
      "/products/cap_dryfit_run.jpg",
      "/products/cap_flexfit.jpg"
    ],
    mrp: 899,
    originalPrice: 899,
    price: 499,
    rating: 4.8,
    reviewCount: 54,
    reviewsCount: 54,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Pro Dry-Fit Perforated Running Cap. Crafted from featherlight moisture-wicking micro-polyester with laser-cut side perforations for enhanced air circulation. Features a soft inner sweatband and reflective rear strap for low-light safety.",
    shortDescription: "Ultra-breathable laser-perforated sweat-wicking lightweight athletic running cap.",
    highlights: [
      "Laser-Cut Side Breathability Perforations",
      "Quick-Drying Dry-Fit Micro-Polyester",
      "Moisture-Absorbent Inner Terry Band",
      "Reflective Night Safety Rear Strap"
    ],
    specs: {
      "Material": "100% Micro Polyester",
      "Closure": "Adjustable Reflective Velcro Strap",
      "Visor": "Pre-Curved Lightweight EVA",
      "Care": "Hand Wash Cold"
    },
    specifications: {
      "Material": "100% Micro Polyester",
      "Closure": "Adjustable Velcro",
      "Weight": "48g"
    },
    colors: ["Midnight Black", "Arctic White"],
    sizes: ["Free Size (Adjustable)"],
    sportsType: "Running & Training",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "rp-cap-002",
    name: "RP Classic Cricket Sun Visor Training Cap",
    slug: "rp-classic-cricket-sun-visor-training-cap",
    sku: "RP-CAP-002",
    brand: "RP Sports",
    category: "jerseys",
    subcategory: "caps",
    image: "/products/cap_sun_visor.jpg",
    images: [
      "/products/cap_sun_visor.jpg",
      "/products/cap_legacy_embroidered.jpg"
    ],
    gallery: [
      "/products/cap_sun_visor.jpg",
      "/products/cap_legacy_embroidered.jpg"
    ],
    mrp: 699,
    originalPrice: 699,
    price: 399,
    rating: 4.7,
    reviewCount: 41,
    reviewsCount: 41,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Classic Cricket Sun Visor Training Cap. Designed for long hours in the sun during net practice, umpire duties, and coaching sessions. Open-top design keeps the head cool while the wide visor shields eyes from harsh sunlight.",
    shortDescription: "Structured wide-brim UV-blocking sun visor cap with absorbent terry-cloth inner sweatband.",
    highlights: [
      "Wide Pre-Curved UV Sun Shield Brim",
      "Open-Crown Maximum Thermal Heat Dispersion",
      "Padded Terrycloth Forehead Sweatband",
      "Adjustable Elastic Hook-and-Loop Closure"
    ],
    specs: {
      "Material": "Heavy-Duty Poly-Cotton Twill",
      "Closure": "Hook-and-Loop Strap",
      "Brim Length": "7.5 cm",
      "Care": "Hand Wash Only"
    },
    specifications: {
      "Material": "Poly-Cotton Twill",
      "Closure": "Hook-and-Loop",
      "Weight": "55g"
    },
    colors: ["White / Navy Trim", "Maroon / Gold Trim"],
    sizes: ["Free Size (Adjustable Velcro)"],
    sportsType: "Cricket & Tennis",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "rp-cap-003",
    name: "RP Legacy 3D Embroidered Team Athletic Cap",
    slug: "rp-legacy-3d-embroidered-team-athletic-cap",
    sku: "RP-CAP-003",
    brand: "RP Sports",
    category: "jerseys",
    subcategory: "caps",
    image: "/products/cap_legacy_embroidered.jpg",
    images: [
      "/products/cap_legacy_embroidered.jpg",
      "/products/cap_dryfit_run.jpg"
    ],
    gallery: [
      "/products/cap_legacy_embroidered.jpg",
      "/products/cap_dryfit_run.jpg"
    ],
    mrp: 999,
    originalPrice: 999,
    price: 599,
    rating: 4.9,
    reviewCount: 68,
    reviewsCount: 68,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Legacy 3D Embroidered Team Athletic Cap. Premium 6-panel structured baseball cap tailored with high-density cotton twill and raised 3D metallic embroidery. Features reinforced eyelets for airflow and an antique brass buckle.",
    shortDescription: "Heavy twill 6-panel athletic cap with 3D raised embroidery and adjustable brass buckle.",
    highlights: [
      "Structured 6-Panel High-Density Twill Crown",
      "Raised 3D High-Precision Embroidery",
      "Embroidered Ventilation Eyelets",
      "Antique Brass Slider Clasp"
    ],
    specs: {
      "Material": "100% Premium Cotton Twill",
      "Panels": "6-Panel Structured Crown",
      "Closure": "Antique Brass Buckle with Strap",
      "Care": "Spot Clean Only"
    },
    specifications: {
      "Material": "100% Cotton Twill",
      "Closure": "Brass Metal Buckle",
      "Weight": "85g"
    },
    colors: ["Navy Blue", "Crimson Red"],
    sizes: ["Free Size (Metal Buckle)"],
    sportsType: "Athletic & Casual",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "rp-cap-004",
    name: "RP AeroMesh Ventilated Trucker Sports Cap",
    slug: "rp-aeromesh-ventilated-trucker-sports-cap",
    sku: "RP-CAP-004",
    brand: "RP Sports",
    category: "jerseys",
    subcategory: "caps",
    image: "/products/cap_aeromesh.png",
    images: [
      "/products/cap_aeromesh.png",
      "/products/cap_water_storm.png"
    ],
    gallery: [
      "/products/cap_aeromesh.png",
      "/products/cap_water_storm.png"
    ],
    mrp: 799,
    originalPrice: 799,
    price: 449,
    rating: 4.6,
    reviewCount: 33,
    reviewsCount: 33,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP AeroMesh Ventilated Trucker Sports Cap. Built for intense summer net practices and conditioning drills. The open-mesh back panels maximize ventilation while the structured foam front panel maintains crisp shape.",
    shortDescription: "Breathable open-mesh rear panels with moisture-management front crown for summer training.",
    highlights: [
      "High-Airflow Rear Mesh Cooling Panels",
      "Padded Foam Front Crown",
      "Classic Snapback Custom Sizing",
      "Sweat-Wicking Inner Headband"
    ],
    specs: {
      "Material": "Polyester Mesh + Cotton Twill",
      "Closure": "7-Hole Plastic Snapback",
      "Profile": "Mid-Profile Structured",
      "Care": "Hand Wash Cold"
    },
    specifications: {
      "Material": "Polyester Mesh & Twill",
      "Closure": "Plastic Snapback",
      "Weight": "65g"
    },
    colors: ["Graphite / White Mesh", "Black / Charcoal Mesh"],
    sizes: ["Free Size (Snapback)"],
    sportsType: "Training & Fitness",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "rp-cap-005",
    name: "RP Performance Water-Resistant Storm Cap",
    slug: "rp-performance-water-resistant-storm-cap",
    sku: "RP-CAP-005",
    brand: "RP Sports",
    category: "jerseys",
    subcategory: "caps",
    image: "/products/cap_water_storm.png",
    images: [
      "/products/cap_water_storm.png",
      "/products/cap_dryfit_run.jpg"
    ],
    gallery: [
      "/products/cap_water_storm.png",
      "/products/cap_dryfit_run.jpg"
    ],
    mrp: 1099,
    originalPrice: 1099,
    price: 649,
    rating: 4.8,
    reviewCount: 27,
    reviewsCount: 27,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Performance Water-Resistant Storm Cap. Engineered with a Durable Water Repellent (DWR) treated ripstop nylon shell that sheds light rain, dew, and moisture during morning cricket drills and winter matches.",
    shortDescription: "DWR coated water-repellent quick-dry sports cap for outdoor cricket and football drills.",
    highlights: [
      "DWR Water-Repellent Ripstop Nylon Fabric",
      "Ultra-Packable Flexible Visor",
      "Elastic Bungee Quick-Toggle Back Strap",
      "Taped Anti-Chafe Interior Seams"
    ],
    specs: {
      "Material": "100% DWR Ripstop Nylon",
      "Closure": "Elastic Bungee Cord with Toggle",
      "Weather Rating": "Water-Resistant / Windproof",
      "Care": "Wipe Clean / Hand Wash"
    },
    specifications: {
      "Material": "DWR Ripstop Nylon",
      "Closure": "Bungee Toggle",
      "Weight": "42g"
    },
    colors: ["Anthracite Gray", "Olive Green"],
    sizes: ["Free Size (Elastic Cord)"],
    sportsType: "Outdoor Athletics",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "rp-cap-006",
    name: "RP FlexFit Low-Profile Athletic Match Cap",
    slug: "rp-flexfit-low-profile-athletic-match-cap",
    sku: "RP-CAP-006",
    brand: "RP Sports",
    category: "jerseys",
    subcategory: "caps",
    image: "/products/cap_flexfit.jpg",
    images: [
      "/products/cap_flexfit.jpg",
      "/products/cap_legacy_embroidered.jpg"
    ],
    gallery: [
      "/products/cap_flexfit.jpg",
      "/products/cap_legacy_embroidered.jpg"
    ],
    mrp: 899,
    originalPrice: 899,
    price: 549,
    rating: 4.7,
    reviewCount: 39,
    reviewsCount: 39,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP FlexFit Low-Profile Athletic Match Cap. Features an integrated Spandex stretch headband for a snug, secure fit without bulky external strap buckles. Perfect under helmets or for running.",
    shortDescription: "Ergonomic elastic stretch-fit matchday sports cap in midnight navy and crimson.",
    highlights: [
      "Spandex Stretch-Fit Seamless Interior Band",
      "Low-Profile Snug Athletic Crown",
      "Pre-Formed Shape-Retaining Visor",
      "Anti-Odor Fabric Treatment"
    ],
    specs: {
      "Material": "97% Cotton, 3% Spandex Elastic Weave",
      "Fit": "Fitted Stretch-Band (No Strap)",
      "Crown": "Low-Profile 6-Panel",
      "Care": "Spot Clean Only"
    },
    specifications: {
      "Material": "Cotton-Spandex Stretch",
      "Fit": "Fitted Stretch-Band",
      "Weight": "75g"
    },
    colors: ["Crimson Red", "Deep Black"],
    sizes: ["S/M (Stretch)", "L/XL (Stretch)"],
    sportsType: "Cricket, Fitness, Athletics",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },

  // =========================================================================
  // 3. BADMINTON (6 items - ALL STOCK = 0)
  // =========================================================================
  {
    id: "rp-bad-002",
    name: "RP SmashVolt 99 High Modulus Carbon Badminton Racket",
    slug: "rp-smashvolt-99-high-modulus-carbon-racket",
    sku: "RP-BAD-002",
    brand: "RP Sports",
    category: "badminton",
    subcategory: "rackets",
    image: "/products/badminton_smashvolt.jpg",
    images: [
      "/products/badminton_smashvolt.jpg",
      "/products/badminton_nanoblade.jpg"
    ],
    gallery: [
      "/products/badminton_smashvolt.jpg",
      "/products/badminton_nanoblade.jpg"
    ],
    mrp: 4499,
    originalPrice: 4499,
    price: 2899,
    rating: 4.9,
    reviewCount: 73,
    reviewsCount: 73,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP SmashVolt 99 High Modulus Carbon Badminton Racket. Built for heavy smashers with a 300mm head-heavy balance point and stiff high-modulus Japanese graphite shaft. Supports up to 32 lbs string tension for explosive power on court.",
    shortDescription: "Tournament-grade 3U head-heavy carbon graphite racket supporting up to 32 lbs tension.",
    highlights: [
      "Japanese High-Modulus Carbon Graphite (30T)",
      "Head-Heavy 300mm Balance for Lethal Power Smashes",
      "Slim Aerodynamic Hexagonal Frame Geometry",
      "High String Tension Support up to 32 lbs"
    ],
    specs: {
      "Frame Material": "30T High Modulus Carbon Graphite",
      "Shaft": "Stiff High-Tensile 7.0mm Slim Shaft",
      "Weight / Grip": "3U (86±2g) / G4",
      "Balance Point": "Head Heavy (300±3mm)",
      "Max Tension": "32 lbs"
    },
    specifications: {
      "Material": "30T Carbon Graphite",
      "Weight": "3U (86g)",
      "Max Tension": "32 lbs",
      "Balance": "Head Heavy"
    },
    colors: ["Matte Black / Gold"],
    sizes: ["3U - G4 (Head Heavy)"],
    sportsType: "Badminton",
    weight: "86g",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-bad-003",
    name: "RP NanoBlade 700 Speed Badminton Racket",
    slug: "rp-nanoblade-700-speed-badminton-racket",
    sku: "RP-BAD-003",
    brand: "RP Sports",
    category: "badminton",
    subcategory: "rackets",
    image: "/products/badminton_nanoblade.jpg",
    images: [
      "/products/badminton_nanoblade.jpg",
      "/products/badminton_smashvolt.jpg"
    ],
    gallery: [
      "/products/badminton_nanoblade.jpg",
      "/products/badminton_smashvolt.jpg"
    ],
    mrp: 3499,
    originalPrice: 3499,
    price: 2199,
    rating: 4.8,
    reviewCount: 49,
    reviewsCount: 49,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP NanoBlade 700 Speed Badminton Racket. Engineered for rapid defensive returns, quick drives, and deft touch at the net. The head-light 4U frame reduces swing drag for effortless reaction speed in doubles matches.",
    shortDescription: "Head-light 4U aerodynamic frame for fast defensive blocks and lightning-quick net play.",
    highlights: [
      "Ultra-Light 4U (82g) Maneuverable Frame",
      "Head-Light Balance for Rapid Defensive Swings",
      "Aero-Speed Frame Profile Cuts Air Resistance",
      "Pre-Strung with High-Repulsion 0.68mm String"
    ],
    specs: {
      "Frame Material": "Nano Carbon Graphite Composite",
      "Shaft": "Medium Flexible 6.8mm Shaft",
      "Weight / Grip": "4U (82±2g) / G5",
      "Balance Point": "Head Light (285±3mm)",
      "Max Tension": "28 lbs"
    },
    specifications: {
      "Material": "Nano Carbon Graphite",
      "Weight": "4U (82g)",
      "Max Tension": "28 lbs",
      "Balance": "Head Light"
    },
    colors: ["Cyan Blue / Silver"],
    sizes: ["4U - G5 (Head Light)"],
    sportsType: "Badminton",
    weight: "82g",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-bad-004",
    name: "RP Titan Force Goose Feather Shuttlecocks (Tube of 12)",
    slug: "rp-titan-force-feather-shuttlecock-tube-12",
    sku: "RP-BAD-004",
    brand: "RP Sports",
    category: "badminton",
    subcategory: "shuttlecocks",
    image: "/products/badminton_feather_tube.jpg",
    images: [
      "/products/badminton_feather_tube.jpg",
      "/products/badminton_nylon_shuttle.jpg"
    ],
    gallery: [
      "/products/badminton_feather_tube.jpg",
      "/products/badminton_nylon_shuttle.jpg"
    ],
    mrp: 1699,
    originalPrice: 1699,
    price: 1199,
    rating: 4.9,
    reviewCount: 92,
    reviewsCount: 92,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Titan Force Goose Feather Shuttlecocks. Hand-sorted Grade-A goose feathers mounted on a 2-layer natural cork base for consistent flight trajectory, accurate drop shots, and long-lasting durability during tournament play.",
    shortDescription: "Premium goose feather shuttlecocks with solid natural cork base for stable parabolic flight.",
    highlights: [
      "100% Hand-Selected Grade-A Goose Feathers",
      "Two-Layer Natural Solid Cork Base",
      "Consistent Flight Stability & Accurate Speed",
      "Airtight Sealed Foil Tube of 12 Shuttles"
    ],
    specs: {
      "Feather Material": "Selected Natural Goose Feather",
      "Base Cork": "Double-Layer Natural Wood Cork",
      "Quantity": "12 Shuttlecocks per Tube",
      "Speed Rating": "Speed 77 (Standard Indian Climate)"
    },
    specifications: {
      "Material": "Goose Feather & Natural Cork",
      "Quantity": "12 Pieces",
      "Speed": "77 / 78"
    },
    colors: ["Natural White Goose Feather"],
    sizes: ["Speed 77 (Club Standard)", "Speed 78 (Fast Pace)"],
    sportsType: "Badminton",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-bad-005",
    name: "RP AeroSpeed Nylon Tournament Shuttlecocks (Pack of 6)",
    slug: "rp-aerospeed-nylon-tournament-shuttlecock-pack-6",
    sku: "RP-BAD-005",
    brand: "RP Sports",
    category: "badminton",
    subcategory: "shuttlecocks",
    image: "/products/badminton_nylon_shuttle.jpg",
    images: [
      "/products/badminton_nylon_shuttle.jpg",
      "/products/badminton_feather_tube.jpg"
    ],
    gallery: [
      "/products/badminton_nylon_shuttle.jpg",
      "/products/badminton_feather_tube.jpg"
    ],
    mrp: 749,
    originalPrice: 749,
    price: 499,
    rating: 4.7,
    reviewCount: 65,
    reviewsCount: 65,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP AeroSpeed Nylon Tournament Shuttlecocks. Precision-molded synthetic polymer skirt with foam cork base. Engineered to simulate the parabolic recovery curve of feather shuttles while offering up to 5x higher durability.",
    shortDescription: "Durable precision-molded yellow synthetic nylon skirts with synthetic foam base for club training.",
    highlights: [
      "Precision-Molded High-Flex Nylon Skirt",
      "High-Visibility Fluorescent Yellow Color",
      "5x Longer Durability than Feather Shuttles",
      "Foam Base for Predictable Rebound"
    ],
    specs: {
      "Skirt Material": "Precision Synthetic Polymer",
      "Base": "Compressed Foam Cork",
      "Quantity": "6 Shuttlecocks per Tube",
      "Pace": "Medium Fast Flight"
    },
    specifications: {
      "Material": "Synthetic Nylon",
      "Quantity": "6 Pieces",
      "Color": "Neon Yellow"
    },
    colors: ["High-Visibility Neon Yellow"],
    sizes: ["Slow Pace (Blue Cap)", "Medium Pace (Green Cap)"],
    sportsType: "Badminton",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-bad-006",
    name: "RP Tour Grip Pro PU Super Tacky Overgrips (Pack of 5)",
    slug: "rp-tour-grip-pro-pu-super-tacky-grip-pack-5",
    sku: "RP-BAD-006",
    brand: "RP Sports",
    category: "badminton",
    subcategory: "grips",
    image: "/products/badminton_overgrips.jpg",
    images: [
      "/products/badminton_overgrips.jpg",
      "/products/badminton_smashvolt.jpg"
    ],
    gallery: [
      "/products/badminton_overgrips.jpg",
      "/products/badminton_smashvolt.jpg"
    ],
    mrp: 599,
    originalPrice: 599,
    price: 349,
    rating: 4.8,
    reviewCount: 88,
    reviewsCount: 88,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Tour Grip Pro PU Super Tacky Overgrips. High-absorption polyurethane replacement overgrips with tapered ends and adhesive starting strip. Provides non-slip traction even in high-humidity Kolkata summer games.",
    shortDescription: "High-absorption non-slip polyurethane replacement overgrips with tapered edge adhesive.",
    highlights: [
      "Super Tacky Polyurethane Surface Texture",
      "High Moisture & Sweat Absorption Rate",
      "0.6mm Ultra-Thin Responsive Feel",
      "Pack of 5 Multicolor Tournament Grips"
    ],
    specs: {
      "Material": "Polyurethane (PU) with Felt Base",
      "Thickness": "0.6mm Ultra-Thin",
      "Length": "1100mm per Grip",
      "Package": "5 Grips with Finishing Tape"
    },
    specifications: {
      "Material": "Super Tacky PU",
      "Thickness": "0.6mm",
      "Quantity": "5 Grips"
    },
    colors: ["Assorted (Red, Black, Yellow, Blue, White)"],
    sizes: ["Standard (0.6mm thickness)"],
    sportsType: "Badminton, Tennis, Squash",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },
  {
    id: "rp-bad-007",
    name: "RP ThermoGuard 6-Racket Tournament Badminton Bag",
    slug: "rp-thermoguard-6-racket-tournament-badminton-bag",
    sku: "RP-BAD-007",
    brand: "RP Sports",
    category: "badminton",
    subcategory: "accessories",
    image: "/products/badminton_kitbag.jpg",
    images: [
      "/products/badminton_kitbag.jpg",
      "/products/generated_bag.jpg"
    ],
    gallery: [
      "/products/badminton_kitbag.jpg",
      "/products/generated_bag.jpg"
    ],
    mrp: 2999,
    originalPrice: 2999,
    price: 1799,
    rating: 4.9,
    reviewCount: 45,
    reviewsCount: 45,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP ThermoGuard 6-Racket Tournament Badminton Bag. Features dual thermal-insulated compartments to protect racket string tension from heat degradation. Includes a separate ventilated shoe tunnel and padded ergonomic backpack straps.",
    shortDescription: "Dual thermal-insulated racket compartments with ventilated shoe tunnel and padded backpack straps.",
    highlights: [
      "ThermoGuard Heat-Shield Racket Lining",
      "Holds Up to 6 Rackets + Apparel & Gear",
      "Separate Bottom Ventilated Shoe Bay",
      "Padded Adjustable Dual Backpack Shoulder Straps"
    ],
    specs: {
      "Material": "900D Ballistic Water-Resistant Polyester",
      "Dimensions": "75cm x 30cm x 22cm",
      "Compartments": "2 Main + 1 Shoe + 1 Accessory Pocket",
      "Capacity": "6 Rackets"
    },
    specifications: {
      "Material": "900D Polyester",
      "Dimensions": "75cm x 30cm x 22cm",
      "Capacity": "6 Rackets"
    },
    colors: ["Crimson Red / Black"],
    sizes: ["6-Racket Capacity (75cm x 30cm x 22cm)"],
    sportsType: "Badminton & Tennis",
    weight: "950g",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Sports Works, Dumdum, Kolkata"
  },

  // =========================================================================
  // 4. FOOTBALL BOOTS (6 items - ALL STOCK = 0)
  // =========================================================================
  {
    id: "rp-fb-001",
    name: "RP Striker Velocity FG Firm Ground Football Boots",
    slug: "rp-striker-velocity-fg-firm-ground-football-boots",
    sku: "RP-FB-001",
    brand: "RP Sports",
    category: "football",
    subcategory: "boots",
    image: "/products/football_boot_fg_striker.jpg",
    images: [
      "/products/football_boot_fg_striker.jpg",
      "/products/football_boot_fg_speeddemon.jpg"
    ],
    gallery: [
      "/products/football_boot_fg_striker.jpg",
      "/products/football_boot_fg_speeddemon.jpg"
    ],
    mrp: 3999,
    originalPrice: 3999,
    price: 2499,
    rating: 4.8,
    reviewCount: 62,
    reviewsCount: 62,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Striker Velocity FG Firm Ground Football Boots. Engineered with a lightweight textured synthetic upper that provides precise ball control. Outfitted with 13 molded conical and bladed TPU studs for maximum acceleration on natural grass pitches.",
    shortDescription: "Lightweight synthetic upper with 13 conical molded TPU studs for explosive acceleration on grass.",
    highlights: [
      "Molded 13-Stud Firm Ground (FG) Outsole",
      "Micro-Textured Synthetic Strike Skin",
      "Cushioned EVA Insole for Shock Dispersion",
      "Reinforced Heel Counter for Ankle Lock"
    ],
    specs: {
      "Upper": "Textured Synthetic Micro-Poly",
      "Outsole": "Molded TPU Firm Ground Cleats",
      "Stud Configuration": "13 Conical & Bladed Studs",
      "Suitable Pitch": "Dry Natural Grass"
    },
    specifications: {
      "Upper": "Synthetic Micro-Poly",
      "Outsole": "TPU Studs",
      "Weight": "230g (per boot)"
    },
    colors: ["Metallic Silver / Crimson Red", "Triple Black"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    sportsType: "Football",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Footwear Division, Kolkata"
  },
  {
    id: "rp-fb-002",
    name: "RP Phantom Control TF Turf Football Shoes",
    slug: "rp-phantom-control-tf-turf-football-shoes",
    sku: "RP-FB-002",
    brand: "RP Sports",
    category: "football",
    subcategory: "boots",
    image: "/products/football_boot_tf_phantom.jpg",
    images: [
      "/products/football_boot_tf_phantom.jpg",
      "/products/football_boot_ic_hypercourt.jpg"
    ],
    gallery: [
      "/products/football_boot_tf_phantom.jpg",
      "/products/football_boot_ic_hypercourt.jpg"
    ],
    mrp: 3499,
    originalPrice: 3499,
    price: 2199,
    rating: 4.7,
    reviewCount: 58,
    reviewsCount: 58,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Phantom Control TF Turf Football Shoes. Designed for short-blade artificial turf and hard ground 5-a-side cages. Multi-directional rubber mini-lugs provide instant grip without joint stress.",
    shortDescription: "Textured micro-grip forefoot with multi-stud rubber turf outsole for 5-a-side artificial turf.",
    highlights: [
      "Multi-Stud Turf (TF) High-Grip Rubber Sole",
      "Low-Profile Shock Absorbing Phylon Midsole",
      "Asymmetric Lacing System for Cleaner Striking",
      "Breathable Padded Mesh Ankle Collar"
    ],
    specs: {
      "Upper": "Embossed Synthetic Leather",
      "Sole": "Non-Marking Multi-Lug Rubber",
      "Midsole": "Die-Cut Foam EVA",
      "Suitable Pitch": "Artificial 2G/3G Turf & Hard Courts"
    },
    specifications: {
      "Upper": "Synthetic Leather",
      "Sole": "Rubber Turf Multi-Lug",
      "Weight": "245g"
    },
    colors: ["Electric Blue / Volt Yellow", "Matte Black"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    sportsType: "Football & Turf",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Footwear Division, Kolkata"
  },
  {
    id: "rp-fb-003",
    name: "RP Precision Touch AG Artificial Grass Football Boots",
    slug: "rp-precision-touch-ag-artificial-grass-football-boots",
    sku: "RP-FB-003",
    brand: "RP Sports",
    category: "football",
    subcategory: "boots",
    image: "/products/football_boot_ag_precision.jpg",
    images: [
      "/products/football_boot_ag_precision.jpg",
      "/products/football_boot_fg_striker.jpg"
    ],
    gallery: [
      "/products/football_boot_ag_precision.jpg",
      "/products/football_boot_fg_striker.jpg"
    ],
    mrp: 4299,
    originalPrice: 4299,
    price: 2699,
    rating: 4.8,
    reviewCount: 44,
    reviewsCount: 44,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Precision Touch AG Artificial Grass Football Boots. Features hollow circular stud geometry engineered specifically to relieve rotational pressure on player knees and ankles during rapid turns on 3G and 4G synthetic turf pitches.",
    shortDescription: "Low-profile hollow circular stud configuration designed specifically to prevent knee torque on synthetic pitches.",
    highlights: [
      "Hollow Circular AG (Artificial Grass) Studs",
      "Reduces Knee Torque and Pitch Friction",
      "Super-Soft Synthetic K-Touch Vamp",
      "Anti-Abrasion Toe Bumper"
    ],
    specs: {
      "Upper": "Soft-Touch Polyurethane Leather",
      "Outsole": "Engineered AG Hollow Circular Cleats",
      "Suitable Pitch": "Synthetic 3G / 4G Rubber Infill Turf",
      "Closure": "Center Lace Lock"
    },
    specifications: {
      "Upper": "PU Soft Leather",
      "Outsole": "Hollow AG Studs",
      "Weight": "235g"
    },
    colors: ["Volt Yellow / Black", "White / Ocean Blue"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    sportsType: "Football",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Footwear Division, Kolkata"
  },
  {
    id: "rp-fb-004",
    name: "RP SpeedDemon Pro Sock-Collar FG Football Cleats",
    slug: "rp-speeddemon-pro-sock-collar-fg-football-cleats",
    sku: "RP-FB-004",
    brand: "RP Sports",
    category: "football",
    subcategory: "boots",
    image: "/products/football_boot_fg_speeddemon.jpg",
    images: [
      "/products/football_boot_fg_speeddemon.jpg",
      "/products/football_boot_fg_striker.jpg"
    ],
    gallery: [
      "/products/football_boot_fg_speeddemon.jpg",
      "/products/football_boot_fg_striker.jpg"
    ],
    mrp: 4799,
    originalPrice: 4799,
    price: 2999,
    rating: 4.9,
    reviewCount: 71,
    reviewsCount: 71,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP SpeedDemon Pro Sock-Collar FG Football Cleats. Integrated elastic knit ankle collar creates a seamless, glove-like lockdown fit. The lightweight speed plate outsole provides responsive spring-back during full sprint breaks.",
    shortDescription: "High-elasticity dynamic fit ankle collar with micro-textured 3D strike zone skin.",
    highlights: [
      "Seamless Knitted Dynamic Sock Collar",
      "Anatomical Heel & Arch Lockdown",
      "Reactive Spring TPU Speed Outsole",
      "3D Grip Ribs for Spin and Dip Control"
    ],
    specs: {
      "Upper": "Engineered Knit Collar + Synthetic Skin",
      "Sole": "High-Flex TPU Speed Frame",
      "Fit": "Second-Skin Adaptive Knit Collar",
      "Suitable Pitch": "Firm Natural Turf"
    },
    specifications: {
      "Upper": "Engineered Knit & Synthetic",
      "Sole": "TPU Speed Plate",
      "Weight": "218g"
    },
    colors: ["Midnight Black / Metallic Gold"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    sportsType: "Football",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Footwear Division, Kolkata"
  },
  {
    id: "rp-fb-005",
    name: "RP HyperCourt Indoor Futsal Football Shoes",
    slug: "rp-hypercourt-indoor-futsal-football-shoes",
    sku: "RP-FB-005",
    brand: "RP Sports",
    category: "football",
    subcategory: "boots",
    image: "/products/football_boot_ic_hypercourt.jpg",
    images: [
      "/products/football_boot_ic_hypercourt.jpg",
      "/products/football_boot_tf_phantom.jpg"
    ],
    gallery: [
      "/products/football_boot_ic_hypercourt.jpg",
      "/products/football_boot_tf_phantom.jpg"
    ],
    mrp: 2999,
    originalPrice: 2999,
    price: 1999,
    rating: 4.7,
    reviewCount: 37,
    reviewsCount: 37,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP HyperCourt Indoor Futsal Football Shoes. Non-marking natural gum rubber flat outsole delivers high traction on indoor wooden, vinyl, and cement courts without leaving scuffs. Suede toe cap extends durability during toe-pokes.",
    shortDescription: "Non-marking gum rubber flat outsole with cushioned EVA midsole for wooden court and indoor arena play.",
    highlights: [
      "Non-Marking Natural Gum Rubber Court Sole",
      "Reinforced Suede Toe Cap Bumper",
      "Full-Length EVA Cushioning Midsole",
      "Breathable Perforated Tongue"
    ],
    specs: {
      "Upper": "Synthetic Leather with Suede Toe Cap",
      "Sole": "Non-Marking Gum Rubber",
      "Midsole": "Die-Cut EVA Foam",
      "Suitable Pitch": "Indoor Wooden Court / Cement"
    },
    specifications: {
      "Upper": "Synthetic & Suede",
      "Sole": "Gum Rubber",
      "Weight": "250g"
    },
    colors: ["Pure White / Gum Rubber Sole", "Navy / Orange"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    sportsType: "Futsal & Indoor Football",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Footwear Division, Kolkata"
  },
  {
    id: "rp-fb-006",
    name: "RP Blitz Vortex Mixed-Stud Soft Ground Boots",
    slug: "rp-blitz-vortex-mixed-stud-soft-ground-boots",
    sku: "RP-FB-006",
    brand: "RP Sports",
    category: "football",
    subcategory: "boots",
    image: "/products/football_boot_sg_blitz.jpg",
    images: [
      "/products/football_boot_sg_blitz.jpg",
      "/products/football_boot_fg_striker.jpg"
    ],
    gallery: [
      "/products/football_boot_sg_blitz.jpg",
      "/products/football_boot_fg_striker.jpg"
    ],
    mrp: 4999,
    originalPrice: 4999,
    price: 3199,
    rating: 4.8,
    reviewCount: 26,
    reviewsCount: 26,
    deliveryDays: "2 - 4 Days",
    stock: 0,
    description: "RP Blitz Vortex Mixed-Stud Soft Ground Boots. Built for monsoon pitches and wet muddy fields. Features 6 removable aluminum screw-in studs combined with 5 molded TPU support studs to ensure reliable grip in heavy ground conditions.",
    shortDescription: "Interchangeable aluminum and TPU stud hybrid outsole for wet, muddy natural turf conditions.",
    highlights: [
      "Hybrid 6 Aluminum Screw-In + 5 TPU Molded Studs",
      "Deep Mud Penetration & Rapid Shedding Channel",
      "Water-Resistant Coated Synthetic Upper",
      "Stud Wrench Included in Box"
    ],
    specs: {
      "Upper": "Water-Repellent Polyurethane Skin",
      "Outsole": "Aluminum / TPU Mixed SG Frame",
      "Studs": "6 Removable Metal + 5 Fixed Molded",
      "Suitable Pitch": "Wet, Muddy, Soft Natural Grass"
    },
    specifications: {
      "Upper": "Water-Repellent PU",
      "Outsole": "Aluminum & TPU SG Studs",
      "Weight": "260g"
    },
    colors: ["Royal Blue / Silver Metallic"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    sportsType: "Football",
    countryOfOrigin: "India",
    manufacturerDetails: "RP Footwear Division, Kolkata"
  },

  // =========================================================================
  // 5. REAL MADRID INSPIRED JERSEYS (5 items - ALL STOCK = 0)
  // =========================================================================
  {
    id: "rm-jer-001",
    name: "Real Madrid 2024/25 Home Classic All-White Football Jersey",
    slug: "real-madrid-2024-25-home-classic-all-white-football-jersey",
    sku: "RM-JER-001",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "football-jerseys",
    image: "/products/rm_home_white_2024.jpg",
    images: [
      "/products/rm_home_white_2024.jpg",
      "/products/rm_away_navy_2023.jpg"
    ],
    gallery: [
      "/products/rm_home_white_2024.jpg",
      "/products/rm_away_navy_2023.jpg"
    ],
    mrp: 1499,
    originalPrice: 1499,
    price: 899,
    rating: 4.9,
    reviewCount: 118,
    reviewsCount: 118,
    deliveryDays: "3 - 5 Days",
    stock: 0,
    description: "Real Madrid 2024/25 Home Classic All-White Football Jersey. Pure pristine royal white body with subtle houndstooth fabric watermark patterning and black three-stripe shoulder accents. Woven from breathable 160 GSM moisture-wicking honeycomb poly fabric with custom player name & number personalization available.",
    shortDescription: "Official 2024/25 season royal white home match football jersey with subtle houndstooth texture.",
    highlights: [
      "100% Moisture-Wicking Honeycomb Polyester (160 GSM)",
      "Pristine Royal White Body with Black Accent Stripes",
      "Optional Custom Player Name & Number Sublimation",
      "Anti-Bacterial Odor-Resistant Finish"
    ],
    specs: {
      "Season / Year": "2024 / 2025 Home",
      "Material": "100% Breathable Micro Polyester",
      "Fabric Weight": "160 GSM",
      "Fit Type": "Athletic Regular Fit",
      "Care": "Machine Wash Cold, Do Not Iron on Print"
    },
    specifications: {
      "Season": "2024/25 Home",
      "Material": "100% Micro Polyester",
      "Weight": "160 GSM",
      "Fit": "Regular Athletic Fit"
    },
    colors: ["Pristine White / Black Stripes"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Football",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "rm-jer-002",
    name: "Real Madrid 2023/24 Away Deep Navy & Gold Football Jersey",
    slug: "real-madrid-2023-24-away-deep-navy-gold-football-jersey",
    sku: "RM-JER-002",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "football-jerseys",
    image: "/products/rm_away_navy_2023.jpg",
    images: [
      "/products/rm_away_navy_2023.jpg",
      "/products/rm_home_white_2024.jpg"
    ],
    gallery: [
      "/products/rm_away_navy_2023.jpg",
      "/products/rm_home_white_2024.jpg"
    ],
    mrp: 1499,
    originalPrice: 1499,
    price: 899,
    rating: 4.8,
    reviewCount: 84,
    reviewsCount: 84,
    deliveryDays: "3 - 5 Days",
    stock: 0,
    description: "Real Madrid 2023/24 Away Deep Navy & Gold Football Jersey. Features the iconic deep navy blue base accented with metallic gold infinity wave micro-patterning across the chest and gold three stripes on shoulders. Built for high-tempo match play and fan wear with quick-dry sweat dispersion technology.",
    shortDescription: "Deep navy blue with gold infinity wave tonal pattern and moisture-wicking honeycomb micro-poly fabric.",
    highlights: [
      "Deep Navy Blue with Gold Infinity Wave Accents",
      "Quick-Dry Sweat Management Fabric",
      "Reinforced Flatlock Anti-Chafe Seams",
      "Free Custom Name & Number Option"
    ],
    specs: {
      "Season / Year": "2023 / 2024 Away",
      "Material": "100% Interlock Micro Polyester",
      "Fabric Weight": "160 GSM",
      "Sleeves": "Short Raglan Athletic Sleeves",
      "Care": "Machine Wash Gentle"
    },
    specifications: {
      "Season": "2023/24 Away",
      "Material": "100% Micro Polyester",
      "Weight": "160 GSM"
    },
    colors: ["Deep Navy Blue / Metallic Gold Trim"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Football",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "rm-jer-003",
    name: "Real Madrid 2017/18 Third Black & Teal Carbon Football Jersey",
    slug: "real-madrid-2017-18-third-black-teal-carbon-football-jersey",
    sku: "RM-JER-003",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "football-jerseys",
    image: "/products/rm_third_black_teal_2018.jpg",
    images: [
      "/products/rm_third_black_teal_2018.jpg",
      "/products/rm_home_white_2024.jpg"
    ],
    gallery: [
      "/products/rm_third_black_teal_2018.jpg",
      "/products/rm_home_white_2024.jpg"
    ],
    mrp: 1599,
    originalPrice: 1599,
    price: 949,
    rating: 4.9,
    reviewCount: 96,
    reviewsCount: 96,
    deliveryDays: "3 - 5 Days",
    stock: 0,
    description: "Real Madrid 2017/18 Third Black & Teal Carbon Football Jersey. Commemorating the legendary 13th European Cup UCL winning campaign in deep pitch carbon black finished with vibrant electric teal cyan shoulder stripes and digitized pixel graphic accents.",
    shortDescription: "Sleek carbon black with vibrant electric teal cyan graphics and athletic taper cut.",
    highlights: [
      "Sleek Carbon Black & Vibrant Electric Teal Cyan Palette",
      "Digitized Graphic Sublimation Accents",
      "Micro-Mesh Underarm Air Flow Panels",
      "Personalized Back Number Printing"
    ],
    specs: {
      "Season / Year": "2017 / 2018 Third UCL Edition",
      "Material": "100% Dry-Fit Polyester",
      "Fabric Weight": "165 GSM",
      "Fit": "Semi-Tapered Performance Cut",
      "Care": "Cold Wash Only"
    },
    specifications: {
      "Season": "2017/18 Third",
      "Material": "100% Dry-Fit Polyester",
      "Weight": "165 GSM"
    },
    colors: ["Carbon Black / Electric Teal Cyan"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Football",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "rm-jer-004",
    name: "Real Madrid 2016/17 Retro Royal Purple Champions League Final Jersey",
    slug: "real-madrid-2016-17-retro-royal-purple-champions-league-final-jersey",
    sku: "RM-JER-004",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "football-jerseys",
    image: "/products/rm_retro_purple_2017.jpg",
    images: [
      "/products/rm_retro_purple_2017.jpg",
      "/products/rm_home_white_2024.jpg"
    ],
    gallery: [
      "/products/rm_retro_purple_2017.jpg",
      "/products/rm_home_white_2024.jpg"
    ],
    mrp: 1699,
    originalPrice: 1699,
    price: 999,
    rating: 4.9,
    reviewCount: 104,
    reviewsCount: 104,
    deliveryDays: "3 - 5 Days",
    stock: 0,
    description: "Real Madrid 2016/17 Retro Royal Purple Champions League Final Jersey. The legendary purple kit worn during the historic Cardiff Champions League Final triumph. Rich vivid royal purple base with pure white contrast shoulder stripes and commemorative match badge details.",
    shortDescription: "Iconic Cardiff 2017 UCL Final commemorative royal purple jersey with white shoulder stripes.",
    highlights: [
      "Iconic Cardiff UCL Final 2017 Commemorative Kit",
      "Rich Royal Purple Body with Crisp White Stripes",
      "Dense 165 GSM Interlock Poly Construction",
      "Custom Name & Number Ready"
    ],
    specs: {
      "Season / Year": "2016 / 2017 Cardiff Final Retro",
      "Material": "Premium Interlock Micro-Poly",
      "Fabric Weight": "165 GSM",
      "Neckline": "Ribbed Contrast Crew Collar",
      "Care": "Machine Wash Cold"
    },
    specifications: {
      "Season": "2016/17 Cardiff Retro",
      "Material": "Interlock Micro-Poly",
      "Weight": "165 GSM"
    },
    colors: ["Royal Purple / Crisp White Stripes"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Football",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "rm-jer-005",
    name: "Real Madrid 2024/25 Away Solar Orange Football Jersey",
    slug: "real-madrid-2024-25-away-solar-orange-football-jersey",
    sku: "RM-JER-005",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "football-jerseys",
    image: "/products/rm_away_orange_2024.jpg",
    images: [
      "/products/rm_away_orange_2024.jpg",
      "/products/rm_home_white_2024.jpg"
    ],
    gallery: [
      "/products/rm_away_orange_2024.jpg",
      "/products/rm_home_white_2024.jpg"
    ],
    mrp: 1499,
    originalPrice: 1499,
    price: 899,
    rating: 4.8,
    reviewCount: 52,
    reviewsCount: 52,
    deliveryDays: "3 - 5 Days",
    stock: 0,
    description: "Real Madrid 2024/25 Away Solar Orange Football Jersey. Designed in an energetic bright solar orange with metallic night navy blue collar and shoulder stripes, paying homage to the legendary 2013/14 La Décima away kit.",
    shortDescription: "Vibrant solar orange and night navy 2024/25 away match jersey with quick-dry sweat dispersion.",
    highlights: [
      "Vibrant Solar Orange Body with Night Navy Accents",
      "4-Way Stretch Interlock Polyester",
      "Underarm Laser Vent Air Holes",
      "Durable Fade-Proof Sublimation"
    ],
    specs: {
      "Season / Year": "2024 / 2025 Away",
      "Material": "100% Breathable Micro Polyester",
      "Fabric Weight": "160 GSM",
      "Fit": "Athletic Regular Fit",
      "Care": "Machine Wash Cold"
    },
    specifications: {
      "Season": "2024/25 Away",
      "Material": "Micro Polyester",
      "Weight": "160 GSM"
    },
    colors: ["Solar Orange / Night Navy Blue"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Football",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },

  // =========================================================================
  // 6. BARCELONA INSPIRED JERSEYS (5 items - ALL STOCK = 0)
  // =========================================================================
  {
    id: "fcb-jer-001",
    name: "Barcelona 2024/25 125th Anniversary Half-and-Half Blaugrana Football Jersey",
    slug: "barcelona-2024-25-125th-anniversary-half-and-half-blaugrana-football-jersey",
    sku: "FCB-JER-001",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "football-jerseys",
    image: "/products/fcb_home_half_blaugrana_2024.jpg",
    images: [
      "/products/fcb_home_half_blaugrana_2024.jpg",
      "/products/fcb_home_stripes_2015.jpg"
    ],
    gallery: [
      "/products/fcb_home_half_blaugrana_2024.jpg",
      "/products/fcb_home_stripes_2015.jpg"
    ],
    mrp: 1499,
    originalPrice: 1499,
    price: 899,
    rating: 4.9,
    reviewCount: 132,
    reviewsCount: 132,
    deliveryDays: "3 - 5 Days",
    stock: 0,
    description: "Barcelona 2024/25 125th Anniversary Half-and-Half Blaugrana Football Jersey. Features the iconic split 50/50 royal blue and deep garnet red design celebrating 125 years of club heritage, with metallic gold center Spotify logo and navy collar detailing.",
    shortDescription: "Official 125th anniversary 2024/25 half-and-half blue and red split heritage match jersey.",
    highlights: [
      "125th Anniversary 50/50 Royal Blue & Garnet Red Split",
      "Metallic Gold Chest Accents and Navy Ribbed Collar",
      "Complimentary Custom Player Name & Number",
      "Breathable Mesh Underarm Insert Panels"
    ],
    specs: {
      "Season / Year": "2024 / 2025 125th Anniversary Home",
      "Material": "100% High-Filament Polyester",
      "Fabric Weight": "160 GSM",
      "Fit": "Regular Athletic Fit",
      "Care": "Machine Wash Cold"
    },
    specifications: {
      "Season": "2024/25 125th Anniv",
      "Material": "100% High-Filament Polyester",
      "Weight": "160 GSM",
      "Fit": "Regular Fit"
    },
    colors: ["Half Royal Blue / Half Garnet Red (125th Anniv)"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Football",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "fcb-jer-002",
    name: "Barcelona 2014/15 Iconic Treble Classic Vertical Stripes Blaugrana Jersey",
    slug: "barcelona-2014-15-iconic-treble-classic-vertical-stripes-blaugrana-jersey",
    sku: "FCB-JER-002",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "football-jerseys",
    image: "/products/fcb_home_stripes_2015.jpg",
    images: [
      "/products/fcb_home_stripes_2015.jpg",
      "/products/fcb_home_half_blaugrana_2024.jpg"
    ],
    gallery: [
      "/products/fcb_home_stripes_2015.jpg",
      "/products/fcb_home_half_blaugrana_2024.jpg"
    ],
    mrp: 1499,
    originalPrice: 1499,
    price: 899,
    rating: 4.9,
    reviewCount: 98,
    reviewsCount: 98,
    deliveryDays: "3 - 5 Days",
    stock: 0,
    description: "Barcelona 2014/15 Iconic Treble Classic Vertical Stripes Blaugrana Jersey. Commemorating the legendary MSN treble-winning season in bold vertical royal blue and deep red stripes, accented with the yellow and red Senyera flag collar insert.",
    shortDescription: "Legendary 2014/15 Treble season classic vertical stripes Blaugrana matchday jersey.",
    highlights: [
      "Classic Bold Vertical Royal Blue & Deep Red Stripes",
      "Catalan Senyera Flag Neckline V-Insert",
      "Lightweight Honeycomb Texture Polyester",
      "Free Back Name & Number Customization"
    ],
    specs: {
      "Season / Year": "2014 / 2015 Treble Era Retro",
      "Material": "100% Breathable Honeycomb Poly",
      "Fabric Weight": "160 GSM",
      "Collar": "Senyera V-Insert Collar",
      "Care": "Machine Wash Inside Out"
    },
    specifications: {
      "Season": "2014/15 Treble Retro",
      "Material": "Honeycomb Poly",
      "Weight": "160 GSM"
    },
    colors: ["Classic Royal Blue & Deep Red Vertical Stripes"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Football",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "fcb-jer-003",
    name: "Barcelona 2024/25 125 Years Edition Pro Match Football Jersey",
    slug: "barcelona-2024-25-125-years-edition-pro-match-football-jersey",
    sku: "FCB-JER-003",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "football-jerseys",
    image: "/products/fcb_home_half_blaugrana_2024.jpg",
    images: [
      "/products/fcb_home_half_blaugrana_2024.jpg",
      "/products/fcb_home_stripes_2015.jpg"
    ],
    gallery: [
      "/products/fcb_home_half_blaugrana_2024.jpg",
      "/products/fcb_home_stripes_2015.jpg"
    ],
    mrp: 1599,
    originalPrice: 1599,
    price: 949,
    rating: 4.9,
    reviewCount: 91,
    reviewsCount: 91,
    deliveryDays: "3 - 5 Days",
    stock: 0,
    description: "Barcelona 2024/25 125 Years Edition Pro Match Football Jersey. Tailored with high-performance evaporative jacquard mesh fabric featuring 125 anniversary gold center embroidery, deep garnet and royal blue split panels, and breathable underarm ventilation channels.",
    shortDescription: "Pro edition 125th anniversary split Blaugrana jersey with high-performance jacquard mesh weave.",
    highlights: [
      "125th Anniversary Special Commemorative Gold Crest",
      "Breathable Jacquard Evaporative Weave",
      "Tagless Neck Label for Zero Irritation",
      "Custom Name and Number Ready"
    ],
    specs: {
      "Season / Year": "2024 / 2025 Pro 125th Edition",
      "Material": "100% Jacquard Micro-Poly",
      "Fabric Weight": "160 GSM",
      "Fit": "Modern Athletic Cut",
      "Care": "Machine Wash Cold"
    },
    specifications: {
      "Season": "2024/25 Pro Edition",
      "Material": "Jacquard Micro-Poly",
      "Weight": "160 GSM"
    },
    colors: ["Split Royal Blue & Garnet Red with Gold Accents"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Football",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "fcb-jer-004",
    name: "Barcelona Camp Nou Heritage Classic Match Football Jersey",
    slug: "barcelona-camp-nou-heritage-classic-match-football-jersey",
    sku: "FCB-JER-004",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "football-jerseys",
    image: "/products/fcb_home_stripes_2015.jpg",
    images: [
      "/products/fcb_home_stripes_2015.jpg",
      "/products/fcb_home_half_blaugrana_2024.jpg"
    ],
    gallery: [
      "/products/fcb_home_stripes_2015.jpg",
      "/products/fcb_home_half_blaugrana_2024.jpg"
    ],
    mrp: 1699,
    originalPrice: 1699,
    price: 999,
    rating: 4.9,
    reviewCount: 115,
    reviewsCount: 115,
    deliveryDays: "3 - 5 Days",
    stock: 0,
    description: "Barcelona Camp Nou Heritage Classic Match Football Jersey. Commemorative classic vertical royal blue and deep garnet red stripes tribute jersey with gold contrast sleeve trims and high-durability interlock knit poly.",
    shortDescription: "Camp Nou heritage classic vertical stripes tribute jersey with gold contrast sleeve trims.",
    highlights: [
      "Heritage Bold Vertical Striped Graphic",
      "Gold Contrast Ribbed Collar & Cuffs",
      "Dense 165 GSM Anti-Pilling Knit Poly",
      "Laser Sublimation Customization Included"
    ],
    specs: {
      "Season / Year": "Heritage Classic Edition",
      "Material": "100% Interlock Micro-Polyester",
      "Fabric Weight": "165 GSM",
      "Fit": "Athletic Regular",
      "Care": "Machine Wash Cold"
    },
    specifications: {
      "Season": "Heritage Classic",
      "Material": "Interlock Micro-Poly",
      "Weight": "165 GSM"
    },
    colors: ["Classic Vertical Royal Blue & Garnet Red"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Football",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  },
  {
    id: "fcb-jer-005",
    name: "Barcelona 2024/25 Pre-Match Warmup Graphic Football Jersey",
    slug: "barcelona-2024-25-pre-match-warmup-graphic-football-jersey",
    sku: "FCB-JER-005",
    brand: "RP Custom Apparel",
    category: "jerseys",
    subcategory: "football-jerseys",
    image: "/products/fcb_home_half_blaugrana_2024.jpg",
    images: [
      "/products/fcb_home_half_blaugrana_2024.jpg",
      "/products/fcb_home_stripes_2015.jpg"
    ],
    gallery: [
      "/products/fcb_home_half_blaugrana_2024.jpg",
      "/products/fcb_home_stripes_2015.jpg"
    ],
    mrp: 1299,
    originalPrice: 1299,
    price: 799,
    rating: 4.7,
    reviewCount: 48,
    reviewsCount: 48,
    deliveryDays: "3 - 5 Days",
    stock: 0,
    description: "Barcelona 2024/25 Pre-Match Warmup Graphic Football Jersey. Features the dynamic 125th anniversary Blaugrana artwork on ultra-light, highly breathable fabric designed to regulate body temperature during warmup training sessions.",
    shortDescription: "Dynamic 125th anniversary Blaugrana warmup jersey with anti-cling stretch polyester weave.",
    highlights: [
      "Dynamic 125th Anniversary Blaugrana Artwork",
      "Anti-Cling Sweat Dispersal Finish",
      "Ultra-Light 150 GSM Aerodynamic Weave",
      "Full Front & Back Sublimation"
    ],
    specs: {
      "Season / Year": "2024 / 2025 Warmup",
      "Material": "95% Polyester, 5% Spandex",
      "Fabric Weight": "150 GSM",
      "Fit": "Athletic Training Fit",
      "Care": "Machine Wash Cold"
    },
    specifications: {
      "Season": "2024/25 Warmup",
      "Material": "Poly-Spandex Blend",
      "Weight": "150 GSM"
    },
    colors: ["Blaugrana 125th Artwork"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sportsType: "Football & Training",
    customizable: true,
    enableJerseyCustomization: true,
    countryOfOrigin: "India",
    manufacturerDetails: "RP Custom Apparel, Dumdum, Kolkata"
  }
];
