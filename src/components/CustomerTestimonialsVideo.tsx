"use client";

import { useState } from "react";
import { Play, Star, CheckCircle2, X, ShoppingBag, ArrowRight, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";

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
  videoUrl?: string;
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
  
  // Connect to Zustand store testimonies list
  const { testimonials: dbTestimonials } = useStore();
  const testimonialList = dbTestimonials && dbTestimonials.length > 0
    ? dbTestimonials
    : TESTIMONIAL_VIDEOS;

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0] || "";
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : "";
  };

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
          {testimonialList.map((video: TestimonialVideo) => (
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
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/45 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-[#CC0000] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white text-white ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 bg-black/75 px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider">
                  {video.duration}
                </span>

                {/* Stars Badge */}
                <div className="absolute top-3 left-3 bg-[#CC0000] px-2.5 py-1 rounded-sm text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{video.rating.toFixed(1)} Rating</span>
                </div>
              </div>

              {/* Review Text Detail */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base md:text-lg text-white group-hover:text-[#CC0000] transition-colors leading-tight line-clamp-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-xs italic font-medium leading-relaxed line-clamp-3">
                    "{video.quote}"
                  </p>
                </div>

                {/* Product Tags & Author details */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold tracking-wider text-[#CC0000] uppercase block">REVIEWER</span>
                    <strong className="text-xs text-white truncate block">{video.author}</strong>
                    <span className="text-[10px] text-gray-500 font-mono block truncate">{video.role}</span>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[9px] font-bold tracking-wider text-gray-500 uppercase block">RECOMMENDED ITEM</span>
                    <strong className="text-xs text-white block">{video.productName}</strong>
                    <span className="text-xs font-bold text-red-400 font-mono block">{video.productPrice}</span>
                  </div>
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
              {activeVideo.videoUrl && getEmbedUrl(activeVideo.videoUrl) ? (
                <iframe
                  src={getEmbedUrl(activeVideo.videoUrl)}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Modal Footer Info */}
            <div className="p-5 bg-[#111111] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 font-medium">Purchased Product:</span>
                <p className="font-display font-bold text-white text-sm">{activeVideo.productName} ({activeVideo.productPrice})</p>
              </div>

              <a
                href="/shop"
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
