"use client";

import Link from "next/link";
import { ShieldCheck, MapPin, Award, Heart, Sparkles, Clock } from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Cinematic Header */}
        <div className="relative rounded-3xl border border-zinc-900 bg-zinc-950 p-8 md:p-16 mb-16 overflow-hidden flex flex-col justify-center text-center">
          <div className="absolute inset-0 carbon-grid opacity-10 pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-accent/5 rounded-full filter blur-[100px] pointer-events-none" />
          
          <span className="text-cyan-accent font-mono text-xs tracking-wider font-bold">ESTD. 2018 · MUMBAI</span>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase mt-4">
            RP SPORTS
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg max-w-xl mx-auto mt-4 leading-relaxed">
            The premium destination for professional athletes and local club cricketers. We handcraft success on the pitch.
          </p>
        </div>

        {/* History and Image Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <span className="text-lime-accent font-mono text-xs tracking-wider font-bold">THE FOUNDING LEGACY</span>
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase leading-tight">
              FROM A LOCAL WORKSHOP TO AN ENTERPRISE PLATFORM
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              RP Sports was founded with a single mission: to provide Indian cricketers with international-grade willow without the premium import markups. We began by sourcing raw English Willow splits and grading them in our Mumbai workshops.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Today, RP Sports equips first-class Ranji Trophy players, corporate cricket leagues, sports academies, and thousands of young talents across India. Our workshop presses, shapes, and wraps bats to fit individual player stances.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-900">
              <div>
                <span className="text-2xl font-mono font-black text-cyan-accent block">50K+</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Bats Pressed</span>
              </div>
              <div>
                <span className="text-2xl font-mono font-black text-lime-accent block">120+</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Academies</span>
              </div>
              <div>
                <span className="text-2xl font-mono font-black text-white block">15+</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Pro Athletes</span>
              </div>
            </div>
          </div>

          {/* Authentic Store Image using rp_product_08 */}
          <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950/60 p-4 aspect-[4/5] overflow-hidden flex flex-col justify-end group">
            <img 
              src="/products/rp_screenshot_3.png" 
              alt="RP Sports bat racking store and founder"
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="relative z-10 p-6 bg-zinc-950/80 border border-zinc-850 rounded-2xl backdrop-blur-md">
              <span className="text-[10px] font-mono text-cyan-accent block">OFFICIAL STORE OUTLET</span>
              <p className="font-bold text-white text-sm mt-1">Our Mumbai pressing warehouse and rack store</p>
              <p className="text-zinc-500 text-xs mt-0.5">Where our master craftsmen grade every willow blade</p>
            </div>
          </div>
        </div>

        {/* Why choose RP Sports */}
        <div className="border-t border-zinc-900 pt-24 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase">
              WHY ATHLETES <span className="text-cyan-accent">TRUST US</span>
            </h2>
            <p className="text-zinc-500 text-sm mt-2">Engineered to support match pressure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "PREMIUM WILLOW GRADING",
                desc: "We physically index and measure density, grain continuity, and moisture levels before pressing wood.",
                icon: ShieldCheck,
                color: "text-lime-accent"
              },
              {
                title: "TAILORED CUSTOMIZATION",
                desc: "Every bat weight, handle diameter, and sweet spot profile can be custom calibrated in our labs.",
                icon: Sparkles,
                color: "text-cyan-accent"
              },
              {
                title: "ACADEMY DIRECT DEALS",
                desc: "We supply schools, academies, and clubs with cost-efficient training gear and protective kits.",
                icon: Award,
                color: "text-white"
              }
            ].map((box, idx) => {
              const Icon = box.icon;
              return (
                <div key={idx} className="p-8 border border-zinc-900 bg-zinc-950/40 rounded-2xl space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center ${box.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white uppercase">{box.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{box.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Timings details */}
        <div className="p-8 border border-zinc-900 bg-zinc-950/40 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex gap-4">
            <Clock className="w-10 h-10 text-cyan-accent shrink-0" />
            <div>
              <h4 className="font-bold text-white uppercase text-sm">STORE OUTLET TIMINGS</h4>
              <p className="text-zinc-500 text-xs mt-1">Monday - Saturday: 10:00 AM - 08:30 PM</p>
              <p className="text-zinc-500 text-xs">Sunday: Closed</p>
            </div>
          </div>
          <div className="flex gap-4">
            <MapPin className="w-10 h-10 text-lime-accent shrink-0" />
            <div>
              <h4 className="font-bold text-white uppercase text-sm">HEADQUARTERS</h4>
              <p className="text-zinc-500 text-xs mt-1">Plot 4, Sports Arena Complex, Off Link Road</p>
              <p className="text-zinc-500 text-xs">Andheri West, Mumbai, MH - 400053</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <Link
              href="/contact"
              className="inline-flex px-8 py-3 bg-gradient-to-r from-cyan-accent to-lime-accent text-black font-extrabold text-xs rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              VISIT CONTACT PAGE
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
