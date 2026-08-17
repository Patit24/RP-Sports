"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function LookbookPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax images
    gsap.utils.toArray(".parallax-img").forEach((img: any) => {
      gsap.to(img, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Fade up texts
    gsap.utils.toArray(".fade-up").forEach((el: any) => {
      gsap.fromTo(el,
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          }
        }
      );
    });

  }, { scope: container });

  return (
    <div ref={container} className="bg-primary text-white min-h-screen overflow-hidden pb-24 md:pb-0">
      
      {/* Header */}
      <section className="pt-24 md:pt-40 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto text-center fade-up">
        <h1 className="text-massive uppercase tracking-tighter">
          THE <span className="font-editorial italic text-warm-gray font-normal normal-case">Lookbook.</span>
        </h1>
        <p className="text-warm-gray text-xl mt-8 max-w-2xl mx-auto">
          A visual exploration of precision engineering and athletic elegance. Designed in Mumbai. Built for the world stage.
        </p>
      </section>

      {/* Look 1: Full width editorial */}
      <section className="relative w-full h-screen overflow-hidden mb-32 group">
        <div className="absolute inset-0 z-0">
          <img 
            src="/products/campaign_banner_cricketer.jpg" 
            alt="Look 1" 
            className="parallax-img w-full h-[130%] object-cover opacity-60 mix-blend-luminosity scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10" />
        <div className="relative z-20 h-full flex flex-col justify-end p-12 md:p-24 fade-up">
          <span className="text-xs font-bold uppercase tracking-widest text-warm-gray mb-4 block">Look 01</span>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6">Absolute<br/>Focus.</h2>
          <Link href="/shop" className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:text-electric-blue transition-colors w-max pb-2 border-b border-white/20">
            Shop The Look <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Look 2 & 3: Asymmetrical split */}
      <section className="px-6 md:px-12 max-w-[1600px] mx-auto mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          <div className="lg:col-span-5 fade-up">
            <span className="text-xs font-bold uppercase tracking-widest text-warm-gray mb-4 block">Look 02</span>
            <h2 className="font-editorial italic text-5xl md:text-7xl mb-8 leading-tight">Tactile<br/>Perfection.</h2>
            <p className="text-warm-gray text-lg mb-12">
              Premium leather craftsmanship meets modern shock-absorption technology. Every stitch serves a purpose.
            </p>
            <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-carbon-black relative group">
              <img src="/products/editorial_lookbook_1.jpg" alt="Gloves" className="parallax-img w-full h-[120%] object-cover opacity-80" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link href="/shop" className="btn-luxury !bg-white !text-primary"><span>Shop Gloves</span></Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 mt-24 lg:mt-0 fade-up">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-carbon-black relative group">
              <img src="/products/editorial_lookbook_2.jpg" alt="Ball" className="parallax-img w-full h-[120%] object-cover opacity-90 mix-blend-lighten" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-12">
                <span className="text-xs font-bold uppercase tracking-widest text-warm-gray mb-2 block">Look 03</span>
                <h3 className="text-4xl font-black uppercase">The Match Ball</h3>
                <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-white hover:text-electric-blue mt-6 flex items-center gap-2 w-max">
                  Explore <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Look 4: Cinematic Wide */}
      <section className="relative w-full h-[80vh] overflow-hidden mb-32 flex items-center justify-center">
        <div className="absolute inset-0 bg-carbon-black z-0">
          <img 
            src="/products/cinematic_hero_bat.jpg" 
            alt="Look 4" 
            className="parallax-img w-full h-[130%] object-cover opacity-50 mix-blend-screen"
          />
        </div>
        <div className="relative z-10 text-center fade-up px-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-electric-blue mb-6 block">Look 04</span>
          <h2 className="text-huge mix-blend-overlay opacity-90">
            THE APEX<br/>PREDATOR
          </h2>
          <Link href="/shop" className="btn-luxury mt-12 inline-flex">
            <span>Discover The Series</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
