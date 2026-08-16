"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail, Clock, Share2, PlayCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white border-t-4 border-primary relative overflow-hidden">

      {/* Top: Brand Callout */}
      <div className="border-b border-white/5 py-12 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-black uppercase text-5xl md:text-7xl leading-none text-white">
              RP <span className="text-primary">SPORTS</span>
            </h2>
            <p className="text-white/50 text-sm mt-2 font-medium">Dumdum, Kolkata's #1 Sports Shop</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop" className="btn-primary text-sm">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/jersey-builder" className="border border-white/20 text-white font-display font-bold uppercase text-sm tracking-wider px-6 py-3.5 hover:border-primary hover:text-primary transition-colors">
              Custom Jerseys
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Col 1: Store Info */}
        <div>
          <h4 className="font-display font-extrabold uppercase text-sm tracking-widest text-primary mb-6">Visit Our Store</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-white/60">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Near Dumdum Metro Station,<br/>Dumdum, Kolkata – 700028<br/>West Bengal, India</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-white/60">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex items-center gap-3 text-sm text-white/60">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <a href="mailto:info@rpsports.in" className="hover:text-white transition-colors">info@rpsports.in</a>
            </li>
            <li className="flex items-start gap-3 text-sm text-white/60">
              <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Mon–Sat: 10AM – 9PM<br/>Sunday: 11AM – 7PM</span>
            </li>
          </ul>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-display font-extrabold uppercase text-sm tracking-widest text-primary mb-6">Shop</h4>
          <ul className="space-y-3">
            {["Cricket Equipment", "Football Gear", "Badminton", "Custom Jerseys", "Sports Shoes", "Trophies & Awards"].map((item) => (
              <li key={item}>
                <Link href="/shop" className="text-white/60 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 text-sm font-medium">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Customer Care & Legal */}
        <div>
          <h4 className="font-display font-extrabold uppercase text-sm tracking-widest text-primary mb-6">Customer Care</h4>
          <ul className="space-y-3">
            {[
              { label: "Track Live Order", href: "/track-order" },
              { label: "Compare Bats", href: "/compare" },
              { label: "Cricket Journal & Blog", href: "/blog" },
              { label: "Frequently Asked Questions", href: "/faq" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Shipping Policy", href: "/shipping-policy" },
              { label: "Refund & Replacement", href: "/refund-policy" },
              { label: "Contact Us", href: "/contact" },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="text-white/60 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 text-xs font-medium">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>


        {/* Col 4: Newsletter & Social */}
        <div>
          <h4 className="font-display font-extrabold uppercase text-sm tracking-widest text-primary mb-6">Stay Updated</h4>
          <p className="text-white/50 text-sm mb-5 leading-relaxed">
            Get updates on new stock, exclusive Kolkata offers, and cricket season deals.
          </p>
          <div className="relative mb-8">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-primary hover:bg-primary-dark transition-colors">
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/50 hover:border-primary hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" aria-label="YouTube" className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/50 hover:border-primary hover:text-primary transition-colors">
              <PlayCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-xs font-medium uppercase tracking-widest">
            &copy; {new Date().getFullYear()} RP Sports, Dumdum, Kolkata. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-white/30 text-xs uppercase tracking-wider hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-white/30 text-xs uppercase tracking-wider hover:text-white/60 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
