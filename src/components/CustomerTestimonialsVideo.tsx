"use client";

import { useState } from "react";
import { Play, Star, CheckCircle2, X, ShoppingBag, ArrowRight, MapPin } from "lucide-react";

interface TestimonialVideo {
  id: string;
  title: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  duration: string;
  thumbnail: string;
  quote: string;
  productName: string;
  productPrice: string;
  date: string;
}

const TESTIMONIAL_VIDEOS: TestimonialVideo[] = [
  {
    id: "v1",
    title: "Unboxing & Testing My New RP Elite Bat at Dumdum Store!",
    author: "Rajiv Mukherjee",
    role: "Dumdum Sub-Division Batter",
    location: "Bought at Dumdum Store, Kolkata",
    rating: 5.0,
    duration: "04:12",
    thumbnail: "/images/rp_customer_video_1.jpg",
    quote: "I visited the RP Sports Dumdum store yesterday and Raj-da personally helped me pick this Grade-1 bat. Pre-knocked, oiled, and ready for match play!",
    productName: "RP Elite English Willow Bat",
    productPrice: "₹18,999",
    date: "Aug 2026",
  },
  {
    id: "v2",
    title: "RP Spark Spike Shoes & Bat Net Practice Ping Test",
    author: "Ayan Sengupta",
    role: "Kolkata 1st Division All-Rounder",
    location: "Salt Lake Nets, Kolkata",
    rating: 5.0,
    duration: "03:45",
    thumbnail: "/products/cricket_action_hero.jpg",
    quote: "Bought both the RP Spark spike shoes and bat from the Kolkata store. Spikes give great grip on turf and the bat ping is explosive!",
    productName: "RP Spark Pro Cricket Spikes",
    productPrice: "₹5,499",
    date: "Jul 2026",
  },
  {
    id: "v3",
    title: "Custom Sublimated Team Jerseys & Equipment Review",
    author: "Sourav Das",
    role: "Dumdum Cricket Club Captain",
    location: "Dumdum Club, Kolkata",
    rating: 5.0,
    duration: "05:20",
    thumbnail: "/products/cricket_locker_room.jpg",
    quote: "We ordered 16 custom team jerseys with player names, numbers & club logo from RP Sports. Print quality and fabric comfort is outstanding!",
    productName: "RP Custom Team Jersey Kit",
    productPrice: "₹3,500",
    date: "Jul 2026",
  },
];

export default function CustomerTestimonialsVideo() {
  const [activeVideo, setActiveVideo] = useState<TestimonialVideo | null>(null);

  return (
    <section className="bg-[#111111] text-white py-16 md:py-24 px-4 md:px-8 border-t-4 border-[#CC0000] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#CC0000]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#CC0000]/20 border border-[#CC0000]/40 px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#CC0000] animate-pulse"></span>
            <span className="text-red-400 font-display font-bold uppercase tracking-widest text-xs" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Real Customer Video Reviews • Dumdum, Kolkata Store
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-white mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            What Our Customers Say
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-medium">
            Watch real Kolkata buyers, local club captains & batters review their cricket bats, spike shoes & custom jerseys bought from RP Sports.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIAL_VIDEOS.map((video) => (
            <div
              key={video.id}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden hover:border-[#CC0000]/60 transition-all duration-300 group flex flex-col justify-between shadow-xl"
            >
              {/* Thumbnail Container */}
              <div 
                onClick={() => setActiveVideo(video)}
                className="relative aspect-video bg-black overflow-hidden cursor-pointer"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 bg-black/80 text-white font-mono font-bold text-[11px] px-2 py-0.5 rounded border border-white/20">
                  {video.duration}
                </span>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#CC0000] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 shadow-red-600/50">
                    <Play className="w-6 h-6 fill-white text-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                
                <div>
                  {/* Rating & Verified Buyer Badge */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="font-bold text-white ml-1">5.0</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => setActiveVideo(video)}
                    className="font-display font-bold text-lg text-white uppercase leading-snug hover:text-[#CC0000] transition-colors cursor-pointer mb-2 line-clamp-2"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {video.title}
                  </h3>

                  {/* Quote */}
                  <p className="text-gray-400 text-xs italic line-clamp-3 leading-relaxed mb-4">
                    "{video.quote}"
                  </p>
                </div>

                {/* Author Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">{video.author}</h4>
                    <p className="text-gray-400 text-[11px] font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#CC0000]" /> {video.location}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveVideo(video)}
                    className="text-xs font-display font-bold text-[#CC0000] hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Watch <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* INTERACTIVE VIDEO MODAL DIALOG */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in">
          <div className="bg-[#181818] border border-white/20 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-4 md:p-5 bg-black border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[#CC0000] text-xs font-display font-bold uppercase tracking-wider block">
                  RP Sports Dumdum Store — Customer Video Review
                </span>
                <h3 className="text-lg md:text-xl font-display font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#CC0000] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={activeVideo.thumbnail}
                alt={activeVideo.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-[#CC0000] text-white flex items-center justify-center shadow-2xl mb-4 animate-pulse">
                  <Play className="w-9 h-9 fill-white text-white ml-1.5" />
                </div>
                <h4 className="text-xl font-display font-bold text-white mb-2">{activeVideo.author} ({activeVideo.role})</h4>
                <p className="text-gray-300 text-xs md:text-sm max-w-md italic">"{activeVideo.quote}"</p>
              </div>
            </div>

            {/* Modal Footer Info */}
            <div className="p-5 bg-[#111111] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 font-medium">Purchased Product:</span>
                <p className="font-display font-bold text-white text-sm">{activeVideo.productName} ({activeVideo.productPrice})</p>
              </div>

              <a
                href="/shop?category=Cricket"
                onClick={() => setActiveVideo(null)}
                className="btn-primary px-6 py-3 text-xs font-display font-bold uppercase tracking-widest inline-flex items-center gap-2 shadow-lg shadow-[#CC0000]/40"
              >
                <ShoppingBag className="w-4 h-4" /> Shop This Item <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
