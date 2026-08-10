import Link from "next/link";
import { ArrowUpRight, Palette, Award, Zap, Layers, ChevronRight } from "lucide-react";

export default function CustomKitsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-electric-blue font-bold text-[10px] tracking-widest uppercase mb-4 block">BESPOKE ATHLETIC GEAR</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            CUSTOM KITS
          </h1>
          <p className="text-warm-gray text-sm font-medium leading-relaxed max-w-xl mx-auto">
            Design professional-grade jerseys and trophies for your entire team. RP Sports offers an industry-leading 3D builder for precise customization, allowing you to control every color, fabric, and logo placement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Jersey Builder Link */}
          <Link href="/jersey-builder" className="group block p-12 neumorphic rounded-[32px] relative overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute top-8 right-8 w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center text-foreground group-hover:text-electric-blue transition-colors z-10">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            
            <div className="relative z-10">
              <Palette className="w-10 h-10 text-electric-blue mb-8" />
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">3D Jersey Builder</h2>
              <p className="text-warm-gray text-xs font-medium mb-8 max-w-sm">
                Engineer your team's visual identity. Choose from premium breathable fabrics, add sponsor logos, and select player numbers in real-time 3D.
              </p>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-foreground">
                Start Designing <ChevronRight className="w-3 h-3 text-electric-blue group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Trophy Builder Link */}
          <Link href="/trophy-customizer" className="group block p-12 neumorphic rounded-[32px] relative overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute top-8 right-8 w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center text-foreground group-hover:text-electric-blue transition-colors z-10">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            
            <div className="relative z-10">
              <Award className="w-10 h-10 text-foreground mb-8" />
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Award Customizer</h2>
              <p className="text-warm-gray text-xs font-medium mb-8 max-w-sm">
                Craft luxurious, heavyweight trophies to celebrate victory. Engrave names, adjust metallic finishes, and build a lasting legacy.
              </p>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-foreground">
                Craft Awards <ChevronRight className="w-3 h-3 text-electric-blue group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Enterprise Features */}
        <div className="p-12 neumorphic rounded-[32px]">
          <h3 className="font-black text-sm uppercase text-foreground tracking-widest mb-12 text-center">Enterprise Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 neumorphic-inset rounded-[24px]">
              <Layers className="w-8 h-8 text-foreground mx-auto mb-4" />
              <h4 className="font-black uppercase tracking-widest text-xs mb-2">Bulk Orders</h4>
              <p className="text-[10px] text-warm-gray font-medium">Automatic volume pricing for leagues and corporate athletic events.</p>
            </div>
            <div className="p-8 neumorphic-inset rounded-[24px]">
              <Zap className="w-8 h-8 text-electric-blue mx-auto mb-4" />
              <h4 className="font-black uppercase tracking-widest text-xs mb-2">Rapid Prototyping</h4>
              <p className="text-[10px] text-warm-gray font-medium">Get a physical prototype of your custom kit shipped within 72 hours.</p>
            </div>
            <div className="p-8 neumorphic-inset rounded-[24px]">
              <Palette className="w-8 h-8 text-foreground mx-auto mb-4" />
              <h4 className="font-black uppercase tracking-widest text-xs mb-2">Pantone Matching</h4>
              <p className="text-[10px] text-warm-gray font-medium">Exact color-matching to ensure your team's brand guidelines are respected.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
