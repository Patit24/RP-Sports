import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import MobileBottomNav from "@/components/MobileBottomNav";
import ToastProvider from "@/components/ToastProvider";
import QuickViewModal from "@/components/QuickViewModal";
import CompareBar from "@/components/CompareBar";

export const metadata: Metadata = {
  title: "RP Sports | Kolkata's Premier Cricket & Sports Store",
  description: "Grade-1 English & Kashmir Willow Cricket Bats, Handcrafted Pre-Knocking, Custom Team Jerseys, and Sports Equipment in Dumdum, Kolkata.",
  keywords: "RP Sports, cricket bats, Kashmir Willow, English Willow, Dumdum sports shop, Kolkata cricket store, custom cricket jerseys, pre-knocked bats, RP Elite, 7070 bat, AA bat, KD bat",
  openGraph: {
    title: "RP Sports | Kolkata's Premier Cricket & Sports Store",
    description: "Grade-1 English & Kashmir Willow Cricket Bats, Handcrafted Pre-Knocking, Custom Team Jerseys, and Sports Equipment in Dumdum, Kolkata.",
    type: "website",
    locale: "en_IN",
    siteName: "RP Sports Kolkata",
  },
  twitter: {
    card: "summary_large_image",
    title: "RP Sports | Kolkata's Premier Cricket & Sports Store",
    description: "Grade-1 English & Kashmir Willow Cricket Bats, Handcrafted Pre-Knocking, Custom Team Jerseys, and Sports Equipment in Dumdum, Kolkata.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsGoodsStore",
  "name": "RP Sports",
  "image": "https://rpsports.in/hero-banner.jpg",
  "telephone": "+919876543210",
  "email": "info@rpsports.in",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Near Dumdum Metro Station",
    "addressLocality": "Dumdum",
    "addressRegion": "Kolkata, West Bengal",
    "postalCode": "700028",
    "addressCountry": "IN"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "10:00",
    "closes": "21:00"
  },
  "url": "https://rpsports.in"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <meta name="theme-color" content="#CC0000" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F9F9F9] text-[#111111]">
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          <main className="flex-grow pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
          <ToastProvider />
          <QuickViewModal />
          <CompareBar />
        </SmoothScroll>
      </body>
    </html>
  );
}
