"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { Product } from "@/lib/mockData";

interface ProductAccordionSectionProps {
  product: Product;
}

export default function ProductAccordionSection({ product }: ProductAccordionSectionProps) {
  const [openSection, setOpenSection] = useState<"desc" | "specs" | "mfg" | "origin" | null>("specs");

  const toggleSection = (section: "desc" | "specs" | "mfg" | "origin") => {
    setOpenSection(openSection === section ? null : section);
  };

  // Extract specs cleanly with fallbacks
  const specsTableData = [
    { label: "Brand", value: product.brand || "RP Sports" },
    { label: "Willow Type", value: product.willowType || product.specifications["Willow Type"] || product.specifications["Material"] || "English Willow" },
    { label: "Willow Grade", value: product.willowGrade || product.specifications["Willow Grade"] || "Grade 1 Pro" },
    { label: "Weight", value: product.weight || product.specifications["Weight"] || "1140-1200 Gms" },
    { label: "Handle Size", value: product.handleSize || product.specifications["Handle Size"] || product.sizes?.[0] || "Short Handle" },
    { label: "Level", value: product.playerLevel || product.specifications["Level"] || "Professional" },
    { label: "Country of Origin", value: product.countryOfOrigin || "India" },
  ];

  return (
    <div className="mt-10 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      
      {/* 1. DESCRIPTION ACCORDION */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("desc")}
          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <h3 className="text-xl font-display font-bold text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Description
          </h3>
          <span className="text-gray-500 font-bold text-lg">
            {openSection === "desc" ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </span>
        </button>

        {openSection === "desc" && (
          <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            <p className="mb-3 font-medium">{product.description}</p>
            {product.highlights && product.highlights.length > 0 && (
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-700 font-medium">
                {product.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 2. SPECIFICATIONS ACCORDION (SPECIFICALLY HIGHLIGHTED MATCHING SCREENSHOT 2) */}
      <div className={`border-b border-gray-200 ${openSection === "specs" ? "border-2 border-blue-600" : ""}`}>
        <button
          onClick={() => toggleSection("specs")}
          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <h3 className="text-xl font-display font-bold text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Specifications
          </h3>
          <span className="text-gray-500 font-bold text-lg">
            {openSection === "specs" ? <Minus className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5" />}
          </span>
        </button>

        {openSection === "specs" && (
          <div className="px-6 pb-6 border-t border-gray-200 pt-4">
            {/* Table layout matching Screenshot 2 */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left text-sm border-collapse">
                <tbody>
                  {specsTableData.map((row, idx) => (
                    <tr
                      key={row.label}
                      className={idx % 2 === 0 ? "bg-[#F9F9F9]" : "bg-white"}
                    >
                      <td className="py-3 px-4 font-bold text-[#111111] border-r border-b border-gray-200 w-1/2 md:w-1/3">
                        {row.label}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium border-b border-gray-200">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. MANUFACTURED BY / IMPORTED BY ACCORDION */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("mfg")}
          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <h3 className="text-xl font-display font-bold text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Manufactured by/Imported by
          </h3>
          <span className="text-gray-500 font-bold text-lg">
            {openSection === "mfg" ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </span>
        </button>

        {openSection === "mfg" && (
          <div className="px-6 pb-6 text-sm text-gray-700 border-t border-gray-100 pt-4 font-medium">
            <p>{product.manufacturerDetails || "RP Sports Gear Ltd, Near Dumdum Metro Station, Dumdum, Kolkata – 700028, West Bengal, India"}</p>
            <p className="text-xs text-gray-400 mt-1">Customer Care Email: info@rpsports.in | Helpline: +91 98765 43210</p>
          </div>
        )}
      </div>

      {/* 4. COUNTRY OF ORIGIN ACCORDION */}
      <div>
        <button
          onClick={() => toggleSection("origin")}
          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <h3 className="text-xl font-display font-bold text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Country of Origin
          </h3>
          <span className="text-gray-500 font-bold text-lg">
            {openSection === "origin" ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </span>
        </button>

        {openSection === "origin" && (
          <div className="px-6 pb-6 text-sm text-gray-700 border-t border-gray-100 pt-4 font-medium">
            <p>{product.countryOfOrigin || "India"}</p>
          </div>
        )}
      </div>

    </div>
  );
}
