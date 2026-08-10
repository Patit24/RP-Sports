"use client";

import Link from "next/link";
import { MOCK_BLOGS } from "@/lib/mockData";
import { Calendar, User, Clock, ArrowRight, BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-4 sm:px-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-2 text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs mb-3">
          <BookOpen className="w-4 h-4" /> RP Sports Journal & Guides
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-black text-[#111111] uppercase leading-none mb-4">
          Cricket Gear & Willow Guide
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Expert insights, knocking & oiling techniques, willow grain guides, and performance advice directly from Kolkata's master bat makers.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_BLOGS.map((post) => (
          <article
            key={post.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#CC0000] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col group"
          >
            {/* Featured Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-3 left-3 bg-[#111111] text-white text-[10px] font-display font-bold uppercase tracking-wider px-2.5 py-1">
                Cricket Guide
              </span>
            </div>

            {/* Post Metadata & Content */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#CC0000]" /> {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#CC0000]" /> {post.readTime}
                </span>
              </div>

              <h2 className="text-xl font-display font-black text-[#111111] uppercase leading-tight group-hover:text-[#CC0000] transition-colors mb-3">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-6">
                {post.excerpt}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#CC0000]" /> {post.author}
                </span>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-display font-bold uppercase tracking-wider text-[#CC0000] group-hover:translate-x-1 transition-transform flex items-center gap-1"
                >
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
