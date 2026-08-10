import { ShieldCheck, Crosshair, Hexagon, Feather } from "lucide-react";

export default function InsideRpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Hero */}
        <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
          <div className="md:w-1/2">
            <span className="text-electric-blue font-bold text-[10px] tracking-widest uppercase mb-4 block">OUR MANIFESTO</span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
              INSIDE<br />RP SPORTS
            </h1>
            <p className="text-warm-gray text-sm font-medium leading-relaxed">
              We engineer equipment for the uncompromising athlete. By combining aerospace-grade materials with aggressive, liquid-glass aesthetics, RP Sports redefines what it means to step onto the field. 
            </p>
          </div>
          <div className="md:w-1/2 w-full h-[400px] neumorphic rounded-[32px] p-4">
            <div className="w-full h-full rounded-[24px] overflow-hidden neumorphic-inset relative">
              <img 
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200" 
                alt="Stadium" 
                className="w-full h-full object-cover mix-blend-multiply opacity-80" 
              />
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { icon: Hexagon, title: "Carbon Composite", desc: "Our bats and rackets leverage C-45 carbon fiber for max tensile strength." },
            { icon: Feather, title: "Aero-Light", desc: "Removing every unnecessary gram without sacrificing structural integrity." },
            { icon: Crosshair, title: "Precision Milled", desc: "CNC-milled grip geometries tailored for absolute kinetic transfer." },
            { icon: ShieldCheck, title: "Impact Tested", desc: "Every product survives a 10,000-impact durability gauntlet." }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-8 neumorphic rounded-[24px]">
                <div className="w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-electric-blue" />
                </div>
                <h3 className="font-black uppercase tracking-widest text-xs mb-3 text-foreground">{item.title}</h3>
                <p className="text-[10px] text-warm-gray font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* The Factory */}
        <div className="p-12 md:p-16 neumorphic rounded-[32px] flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-foreground">The Factory</h2>
            <p className="text-warm-gray text-xs font-medium mb-6 leading-relaxed">
              Based out of state-of-the-art facilities, our production line bridges the gap between artisanal craftsmanship and robotic precision. We don't just assemble gear; we forge weapons for modern gladiators.
            </p>
            <div className="inline-block px-6 py-3 neumorphic rounded-xl text-[10px] font-bold uppercase tracking-widest text-electric-blue">
              Est. 2024
            </div>
          </div>
          <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
            <div className="h-48 neumorphic-inset rounded-2xl overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Factory" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60" />
            </div>
            <div className="h-48 neumorphic-inset rounded-2xl overflow-hidden relative mt-8">
               <img src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800" alt="Robotics" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
