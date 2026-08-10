"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Phone, Mail, MapPin } from "lucide-react";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const FAQS = [
    {
      cat: "bats",
      q: "Does RP Sports offer pre-knocking and oiling for cricket bats?",
      a: "Yes! Every cricket bat purchased at RP Sports (or online) comes with complimentary hand oiling and professional machine knocking so your bat is ready for match play."
    },
    {
      cat: "bats",
      q: "What is the difference between English Willow and Kashmir Willow?",
      a: "English Willow is lighter, softer, and offers explosive rebound ping for professional leather ball matches. Kashmir Willow is denser, slightly heavier, and highly durable for practice sessions and hard ball training."
    },
    {
      cat: "shipping",
      q: "How long does shipping take to Kolkata and Pan-India?",
      a: "Orders within Kolkata (Dumdum, Salt Lake, New Town, South Kolkata) are delivered within 24-48 hours. Orders across West Bengal and Pan-India take 3-5 business days with full live tracking."
    },
    {
      cat: "returns",
      q: "What is your return and replacement policy?",
      a: "We offer a 7-day hassle-free return or exchange policy for unused items in original packaging. If a bat develops a structural manufacturing fault within 30 days, we inspect and replace it."
    },
    {
      cat: "store",
      q: "Where is the RP Sports physical store located?",
      a: "Our master sports shop is located near Dumdum Metro Station, Kolkata – 700028. We are open Monday to Saturday from 10:00 AM to 9:00 PM."
    },
    {
      cat: "custom",
      q: "Can I order custom sublimated team jerseys or engraved trophies?",
      a: "Absolutely! We manufacture custom team jerseys with sublimation printing, player names, numbers, and sponsor logos (minimum 10 jerseys). We also provide custom engraved gold cups and trophies."
    }
  ];

  const filteredFaqs = activeCategory === "all" ? FAQS : FAQS.filter((f) => f.cat === activeCategory);

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-4 sm:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs mb-3">
          <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
        </span>
        <h1 className="text-3xl md:text-5xl font-display font-black text-[#111111] uppercase mb-4">
          Got Questions? We Have Answers.
        </h1>
        <p className="text-gray-500 text-sm">
          Everything you need to know about cricket bats, knocking, shipping, returns, and custom kit orders.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          { id: "all", label: "All Questions" },
          { id: "bats", label: "Cricket Bats & Knocking" },
          { id: "shipping", label: "Delivery & Shipping" },
          { id: "returns", label: "Returns & Warranty" },
          { id: "store", label: "Store Location" },
          { id: "custom", label: "Custom Jerseys & Trophies" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveCategory(tab.id);
              setOpenIdx(null);
            }}
            className={`px-4 py-2 text-xs font-display font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              activeCategory === tab.id
                ? "bg-[#CC0000] text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion list */}
      <div className="space-y-4 mb-16">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left font-display font-bold uppercase text-base text-[#111111] flex items-center justify-between gap-4 cursor-pointer hover:text-[#CC0000]"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#CC0000] transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-[#111111] text-white p-8 rounded-xl text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-display font-black uppercase">Still Need Help?</h3>
        <p className="text-white/70 text-sm max-w-md mx-auto">
          Contact our Dumdum team directly via phone or WhatsApp for bat consultations and store guidance.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="tel:+919876543210"
            className="btn-primary text-xs flex items-center gap-2 font-display font-bold uppercase tracking-wider px-5 py-3"
          >
            <Phone className="w-4 h-4" /> Call +91 98765 43210
          </a>
          <Link
            href="/contact"
            className="btn-outline text-xs border-white/30 text-white hover:border-[#CC0000] hover:bg-[#CC0000] px-5 py-3"
          >
            Visit Contact Page
          </Link>
        </div>
      </div>

    </div>
  );
}
