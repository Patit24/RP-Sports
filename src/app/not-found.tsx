"use client";

import Link from "next/link";
import { ArrowLeft, Home as HomeIcon, Search, Trophy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-center items-center p-6 text-center">
      
      {/* 404 Visual Header */}
      <div className="relative mb-6">
        <span className="font-display font-black text-8xl md:text-9xl text-white/10 select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-[#CC0000]/20 border-2 border-[#CC0000] rounded-full flex items-center justify-center text-[#CC0000]">
            <Trophy className="w-10 h-10" />
          </div>
        </div>
      </div>

      <span className="text-[#FF3333] font-display font-bold uppercase tracking-widest text-xs mb-3">
        Page Out Of Bounds
      </span>
      <h1 className="text-3xl md:text-5xl font-display font-black uppercase text-white mb-4">
        Looks Like This Shot Missed The Field!
      </h1>
      <p className="text-white/60 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-8">
        The page you are looking for might have been removed, renamed, or is temporarily unavailable.
      </p>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary text-xs flex items-center gap-2 font-display font-bold uppercase tracking-wider px-6 py-3.5">
          <HomeIcon className="w-4 h-4" /> Back to Home
        </Link>

        <Link href="/shop" className="btn-outline border-white/40 text-white hover:border-[#CC0000] hover:bg-[#CC0000] text-xs flex items-center gap-2 font-display font-bold uppercase tracking-wider px-6 py-3.5">
          <Search className="w-4 h-4" /> Browse Cricket Bats
        </Link>
      </div>

      <div className="mt-12 text-xs text-white/40 border-t border-white/10 pt-6">
        RP Sports • Dumdum, Kolkata – 700028
      </div>

    </div>
  );
}
