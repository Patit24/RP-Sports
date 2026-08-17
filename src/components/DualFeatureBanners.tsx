"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Tag, X, MessageCircle } from "lucide-react";

export default function DualFeatureBanners() {
  const [showOffersDrawer, setShowOffersDrawer] = useState(false);
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false);

  return (
    <section className="bg-[#0B0B0B] py-8 md:py-16 px-4 md:px-8 relative overflow-hidden">
      
      {/* Section Container */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* LEFT BANNER: PRO CRICKET SUNGLASSES */}
        <Link
          href="/shop?category=cricket"
          className="group relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] bg-black border border-white/10 hover:border-[#CC0000]/50 transition-all duration-500 shadow-2xl block"
        >
          {/* Image */}
          <img
            src="/images/feature_sunglasses.jpg"
            alt="Pro Cricket Sports Sunglasses"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10">
            <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
              <span className="inline-flex items-center gap-1.5 bg-[#CC0000] text-white text-[10px] font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-lg">
                Pro Cricket Optics & Sunglasses
              </span>
              <h3 className="text-2xl md:text-4xl font-display font-black uppercase text-white tracking-tight leading-none mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Pro Polarized Cricket Sunglasses
              </h3>
              <p className="text-white/60 text-xs md:text-sm max-w-md font-medium mb-4">
                UV400 anti-glare mirrored sunglasses engineered for high-visibility outfield catch tracking & batting under bright sunlight.
              </p>
              
              <span className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-white group-hover:text-[#CC0000] transition-colors">
                Shop Sunglasses Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>


        {/* RIGHT BANNER: LIMITED EDITION CAPS */}
        <Link
          href="/shop?category=badminton"
          className="group relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] bg-black border border-white/10 hover:border-[#CC0000]/50 transition-all duration-500 shadow-2xl block"
        >
          {/* Image */}
          <img
            src="/images/feature_caps.jpg"
            alt="RP Sports Athlete Caps"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10">
            <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
              <span className="inline-flex items-center gap-1.5 bg-[#111111] border border-white/20 text-white text-[10px] font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-lg">
                Exclusive Kolkata Drop
              </span>
              <h3 className="text-2xl md:text-4xl font-display font-black uppercase text-white tracking-tight leading-none mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Legacy Athletic Headwear
              </h3>
              <p className="text-white/60 text-xs md:text-sm max-w-md font-medium mb-4">
                Moisture-wicking performance caps with 3D metallic embroidery & adjustable snap closure.
              </p>
              
              <span className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-white group-hover:text-[#CC0000] transition-colors">
                Shop Headwear Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>

      </div>

      {/* FLOATING RIGHT SIDE TAB: SPECIAL OFFERS (Hidden on small mobile to avoid obstructing content, visible on md+) */}
      <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 items-center">
        <button
          onClick={() => setShowOffersDrawer(!showOffersDrawer)}
          className="bg-[#CC0000] text-white font-display font-bold text-xs uppercase tracking-widest px-3 py-4 rounded-l-xl flex items-center gap-2 shadow-2xl hover:bg-red-700 transition-colors cursor-pointer"
          style={{ writingMode: 'vertical-rl' }}
        >
          <span className="w-5 h-5 bg-white text-[#CC0000] rounded-full text-[10px] font-black flex items-center justify-center -rotate-90">
            2
          </span>
          <span>Special Offers</span>
        </button>

        {/* Drawer modal overlay */}
        {showOffersDrawer && (
          <div className="bg-[#111111] text-white border-l-2 border-[#CC0000] p-6 shadow-2xl w-80 fixed right-12 top-1/2 -translate-y-1/2 rounded-xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h4 className="font-display font-black uppercase text-sm text-[#CC0000]">Kolkata Store Deals</h4>
              <button onClick={() => setShowOffersDrawer(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-white/5 border border-white/10 p-3 rounded">
                <span className="font-mono font-bold text-[#CC0000] block mb-1">RPSPORTS10</span>
                <p className="text-gray-300">Get Flat 10% OFF on all Kashmir & English Willow bats!</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded">
                <span className="font-mono font-bold text-emerald-400 block mb-1">KOLKATAFREE</span>
                <p className="text-gray-300">Free Machine Knocking & Oiling on orders above ₹4,999.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FLOATING WHATSAPP ASSISTANT (Positioned above mobile bottom nav: bottom-20 on mobile, bottom-8 on desktop) */}
      <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 flex items-center gap-3">
        {showWhatsAppTooltip && (
          <div className="bg-white text-[#111111] px-3.5 py-1.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-200 animate-bounce">
            <span>Need Help? Chat with us</span>
            <button onClick={() => setShowWhatsAppTooltip(false)} className="text-gray-400 hover:text-black">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <a
          href="https://wa.me/919876543210?text=Hi%20RP%20Sports%20Kolkata!%20I%20have%20a%20query%20about%20your%20products."
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 fill-white text-[#25D366]" />
        </a>
      </div>

    </section>
  );
}
