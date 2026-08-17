"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MOCK_BLOGS } from "@/lib/mockData";
import { Calendar, User, Clock, ArrowLeft, Share2, Tag, CheckCircle2 } from "lucide-react";

export default function SingleBlogPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const post = MOCK_BLOGS.find((b) => b.slug === slug) || MOCK_BLOGS[0];

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-20 md:pt-28 pb-28 md:pb-10 px-4 px-4 sm:px-8 max-w-4xl mx-auto">
      
      {/* Back Button */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-500 hover:text-[#CC0000] mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Journal & Guides
      </Link>

      {/* Main Article Container */}
      <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg p-6 sm:p-10">
        
        {/* Category tag */}
        <span className="inline-block bg-[#CC0000] text-white text-[10px] font-display font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-sm">
          RP Sports Guide
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-display font-black text-[#111111] uppercase leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 pb-6 mb-8 border-b border-gray-200 font-medium">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#CC0000]" /> {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#CC0000]" /> {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#CC0000]" /> {post.readTime}
          </span>
        </div>

        {/* Hero Image */}
        <div className="aspect-[16/9] w-full bg-gray-100 rounded-lg overflow-hidden mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Content Body */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 text-base">
          <p className="font-semibold text-lg text-gray-900 leading-snug">
            {post.excerpt}
          </p>

          <p>{post.content}</p>

          <h3 className="text-xl font-display font-bold uppercase text-[#111111] pt-4">
            Key Considerations Before Playing Leather Matches
          </h3>

          <ul className="space-y-3 font-medium text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#CC0000] flex-shrink-0 mt-0.5" />
              <span><strong>Pre-Knocking:</strong> Always oil and knock raw willow with a wooden mallet for 10,000+ strokes before match day play.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#CC0000] flex-shrink-0 mt-0.5" />
              <span><strong>Grain Integrity:</strong> Straight, evenly spaced grains (6-10 grains) indicate premium pressed wood and sweet-spot longevity.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#CC0000] flex-shrink-0 mt-0.5" />
              <span><strong>Handle Grip:</strong> Multi-piece cane handles with rubber inserts absorb high-velocity bowling shock seamlessly.</span>
            </li>
          </ul>

          <div className="bg-red-50 border-l-4 border-[#CC0000] p-5 my-6 rounded-r">
            <p className="text-xs font-bold text-[#CC0000] uppercase tracking-widest mb-1">Store Expert Tip</p>
            <p className="text-sm text-gray-800 italic">
              "Visit RP Sports in Dumdum for complimentary professional machine-knocking & toe-guard fitting with every bat purchase."
            </p>
          </div>
        </div>

        {/* Footer Share & Tags */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Tag className="w-4 h-4 text-[#CC0000]" />
            <span>Cricket, English Willow, Kashmir Willow, Bat Maintenance</span>
          </div>

          <Link href="/shop?category=cricket" className="btn-primary text-xs uppercase font-display font-bold px-4 py-2">
            Explore Cricket Bats Range
          </Link>
        </div>

      </article>

    </div>
  );
}
