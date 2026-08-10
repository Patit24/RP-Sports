"use client";

import { useState } from "react";
import { Camera, Image, Sparkles, Filter } from "lucide-react";

export default function GalleryPage() {
  const [filter, setFilter] = useState("all");

  const galleryItems = [
    { 
      id: 1, 
      type: "products", 
      src: "/products/rp_screenshot_7.png", 
      title: "Prime Edition Kashmir Bats", 
      desc: "Double pressed Kashmir Willow bats with high density grain alignment." 
    },
    { 
      id: 2, 
      type: "shop", 
      src: "/products/rp_screenshot_3.png", 
      title: "Andheri Store Showcase", 
      desc: "Inside our Mumbai store outlet with bats stacked for customized selection." 
    },
    { 
      id: 3, 
      type: "products", 
      src: "/products/rp_screenshot_2.png", 
      title: "Spiked Footwear Grip", 
      desc: "Close-up of lightweight spike studs and double density support heels." 
    },
    { 
      id: 4, 
      type: "apparel", 
      src: "/products/rp_screenshot_1.png", 
      title: "Seventy-7 Team Polo", 
      desc: "Desert Gold & Navy collared match jersey fitted with flatlock sewing." 
    },
    { 
      id: 5, 
      type: "apparel", 
      src: "/products/rp_screenshot_4.png", 
      title: "Classic Sun Visor Cap", 
      desc: "Adjustable blue and yellow training caps featuring front team emblems." 
    },
    { 
      id: 6, 
      type: "apparel", 
      src: "/products/rp_screenshot_5.png", 
      title: "Mesh Trucker Cap", 
      desc: "ventilated white mesh rear panel trucker caps built for summer nets." 
    },
    { 
      id: 7, 
      type: "shop", 
      src: "/products/rp_screenshot_6.png", 
      title: "League Net Practice", 
      desc: "Local Ranji division cricketers checking new prime willow blades." 
    },
    { 
      id: 8, 
      type: "products", 
      src: "/products/generated_football.jpg", 
      title: "Orbit Pro Soccer Ball", 
      desc: "Thermal-bonded match certified ball with stealth carbon panel skin." 
    },
    { 
      id: 9, 
      type: "products", 
      src: "/products/generated_racket.jpg", 
      title: "Carbon-X Graphite Frame", 
      desc: "High-tension cyan strings bound to an ultra-light carbon shaft." 
    },
    { 
      id: 10, 
      type: "products", 
      src: "/products/generated_bag.jpg", 
      title: "Ballistic Nylon Duffle Bag", 
      desc: "Gear bags containing custom bat slots and ventilated shoe bays." 
    },
    { 
      id: 11, 
      type: "awards", 
      src: "/products/generated_trophy.jpg", 
      title: "Gold Pedestal Cup Award", 
      desc: "Polished geometric gold cup trophy mounted on heavy black marble." 
    }
  ];

  const filteredItems = galleryItems.filter(item => filter === "all" || item.type === filter);

  return (
    <div className="min-h-screen bg-[#060608] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="mb-12 text-center max-w-xl mx-auto">
          <span className="text-lime-accent font-mono text-xs tracking-wider font-bold">THE ARENA VISION</span>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase mt-2">
            RP SPORTS GALLERY
          </h1>
          <p className="text-zinc-500 text-sm mt-3">
            A premium visual archive showcasing our custom pressed willow blades, active league gear, team jerseys, and championship awards.
          </p>
        </div>

        {/* Filter strip */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: "all", label: "ALL CAPTURES" },
            { id: "products", label: "RP PRODUCTS" },
            { id: "apparel", label: "TEAM APPAREL" },
            { id: "awards", label: "TROPHIES" },
            { id: "shop", label: "WORKSHOPS" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider font-bold border transition-colors cursor-pointer ${
                filter === btn.id 
                  ? "bg-cyan-accent border-cyan-accent text-black" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Pinterest-style Columns Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 animate-fade-up">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="break-inside-avoid relative rounded-2xl border border-zinc-900 bg-zinc-950/40 p-3 overflow-hidden group hover:border-cyan-accent/30 transition-colors"
            >
              <div className="rounded-xl overflow-hidden bg-zinc-950 relative">
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-auto object-cover group-hover:scale-101 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />
              </div>
              <div className="mt-4 px-1">
                <span className="text-[9px] font-mono text-cyan-accent uppercase tracking-widest block">{item.type}</span>
                <h4 className="font-bold text-sm text-white mt-1 group-hover:text-cyan-accent transition-colors duration-200">{item.title}</h4>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
