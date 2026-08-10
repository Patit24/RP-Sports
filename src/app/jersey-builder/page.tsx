"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Share2, ZoomIn, ZoomOut, Save, FileText, CheckCircle2, User, Menu, RotateCw, RotateCcw } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import JerseyModel from "@/components/jersey-builder/JerseyModel";
import StadiumEnvironment from "@/components/jersey-builder/StadiumEnvironment";
import CameraRig from "@/components/jersey-builder/CameraRig";

export default function JerseyBuilderPage() {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"Design" | "Colors" | "Text" | "Logos">("Design");
  const [cameraView, setCameraView] = useState<"front" | "back" | "left" | "right" | "zoom">("front");
  
  // Customizer inputs
  const [jerseyStyle, setJerseyStyle] = useState("Triple");
  const [teamName, setTeamName] = useState("OWAYO");
  const [playerName, setPlayerName] = useState("PLAYER");
  const [playerNumber, setPlayerNumber] = useState("00");
  
  const [primaryColor, setPrimaryColor] = useState("#2f528f");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [tertiaryColor, setTertiaryColor] = useState("#1e293b");

  const TEMPLATES = ["Legend", "Screen", "Fly", "Triple", "Buzzer", "Rim", "Tower", "Aero", "Dagger"];

  return (
    // We use a fixed absolute wrapper to cover the entire viewport and hide the global Navbar
    <div className="fixed inset-0 z-50 flex overflow-hidden font-sans" style={{ backgroundColor: '#f4f4f4', color: '#111827' }}>
      
      {/* LEFT: 3D CANVAS & Header */}
      <div className="flex-grow h-full relative flex flex-col">
        
        {/* Top Header (Overlapping Canvas) */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 pointer-events-none">
           <div className="flex items-center gap-3 pointer-events-auto">
             <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">D</div>
             <span className="font-semibold text-slate-500 text-sm">owayo 3D Designer</span>
           </div>
        </div>

        {/* Floating Tools (Left Edge) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 z-10 flex flex-col items-center gap-6 pointer-events-auto">
          <button onClick={() => setCameraView("zoom")} className="p-2 text-slate-700 hover:text-black transition-colors">
             <ZoomIn className="w-5 h-5" />
          </button>
          <button onClick={() => setCameraView("front")} className="p-2 text-slate-700 hover:text-black transition-colors">
             <ZoomOut className="w-5 h-5" />
          </button>
          <button onClick={() => setCameraView("left")} className="p-2 text-slate-700 hover:text-black transition-colors">
             <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={() => setCameraView("right")} className="p-2 text-slate-700 hover:text-black transition-colors">
             <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
            <Suspense fallback={null}>
              <StadiumEnvironment preset="studio" />
              
              <JerseyModel 
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                tertiaryColor={tertiaryColor}
                playerName={playerName}
                playerNumber={playerNumber}
                teamName={teamName}
                style={jerseyStyle}
                fabric="premium"
              />

              <CameraRig view={cameraView} />
              <OrbitControls enablePan={false} makeDefault />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* RIGHT: CLEAN CONFIGURATOR UI */}
      <div className="w-[420px] shrink-0 h-full overflow-y-auto border-l flex flex-col relative" style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-xl font-bold leading-none mb-1" style={{ color: '#111827' }}>
                Basketball Jerseys B6 Hero
              </h1>
              <button className="text-sm underline hover:no-underline" style={{ color: '#6b7280' }}>
                Change Product
              </button>
            </div>
            <div className="flex gap-4" style={{ color: '#4b5563' }}>
              <button><Menu className="w-5 h-5" /></button>
              <button><User className="w-5 h-5" /></button>
              <button><ShoppingCart className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Pills) */}
        <div className="px-6 py-2 flex justify-center gap-2">
          {["Design", "Colors", "Text", "Logos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-1.5 text-sm font-medium rounded-full transition-colors border ${
                activeTab === tab 
                  ? "border-transparent" 
                  : "border-slate-300 hover:border-slate-400"
              }`}
              style={{
                backgroundColor: activeTab === tab ? '#1f2937' : '#ffffff',
                color: activeTab === tab ? '#ffffff' : '#4b5563',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="flex-grow p-6 overflow-y-auto no-scrollbar pb-32">
          
          {/* DESIGN TAB */}
          {activeTab === "Design" && (
            <div className="grid grid-cols-3 gap-x-2 gap-y-8">
              {TEMPLATES.map((t) => (
                <button
                  key={t}
                  onClick={() => setJerseyStyle(t)}
                  className="flex flex-col items-center group relative"
                >
                  <div className={`w-16 h-20 rounded-md mb-2 flex flex-col overflow-hidden border ${jerseyStyle === t ? 'ring-2 ring-offset-2 ring-blue-500 border-blue-500' : 'border-slate-200'} shadow-sm`} style={{ backgroundColor: '#f8fafc' }}>
                    {/* Mock Mini Jersey Representation */}
                    <div className="flex-1 flex w-full">
                       <div className="w-1/3 h-full bg-white"></div>
                       <div className="w-1/3 h-full bg-[#2f528f]"></div>
                       <div className="w-1/3 h-full bg-slate-800"></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#4b5563' }}>{t}</span>
                  {jerseyStyle === t && (
                    <div className="absolute inset-0 bg-blue-50/50 rounded-lg -m-2 pointer-events-none border border-blue-100 -z-10"></div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* COLORS TAB */}
          {activeTab === "Colors" && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold block mb-3" style={{ color: '#1f2937' }}>Base Color (Primary)</label>
                <div className="flex gap-3 items-center border p-2 rounded-xl" style={{ borderColor: '#e5e7eb' }}>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border-none bg-transparent cursor-pointer appearance-none"
                  />
                  <span className="text-sm font-mono uppercase" style={{ color: '#4b5563' }}>{secondaryColor}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-3" style={{ color: '#1f2937' }}>Center Stripe (Secondary)</label>
                <div className="flex gap-3 items-center border p-2 rounded-xl" style={{ borderColor: '#e5e7eb' }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border-none bg-transparent cursor-pointer appearance-none"
                  />
                  <span className="text-sm font-mono uppercase" style={{ color: '#4b5563' }}>{primaryColor}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-3" style={{ color: '#1f2937' }}>Right Panel (Tertiary)</label>
                <div className="flex gap-3 items-center border p-2 rounded-xl" style={{ borderColor: '#e5e7eb' }}>
                  <input
                    type="color"
                    value={tertiaryColor}
                    onChange={(e) => setTertiaryColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border-none bg-transparent cursor-pointer appearance-none"
                  />
                  <span className="text-sm font-mono uppercase" style={{ color: '#4b5563' }}>{tertiaryColor}</span>
                </div>
              </div>
            </div>
          )}

          {/* TEXT TAB */}
          {activeTab === "Text" && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold block mb-2" style={{ color: '#1f2937' }}>Team Name</label>
                <input
                  type="text"
                  maxLength={15}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value.toUpperCase())}
                  className="w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  style={{ borderColor: '#d1d5db', color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="absolute bottom-0 w-full p-6 bg-white border-t" style={{ borderColor: '#e5e7eb' }}>
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {[
              { icon: Save, label: "Save" },
              { icon: FileText, label: "Saved Drafts" },
              { icon: User, label: "Roster" },
              { icon: CheckCircle2, label: "Design-check" },
              { icon: Share2, label: "Share draft" }
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-1 hover:text-blue-600" style={{ color: '#4b5563' }}>
                <action.icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[10px] text-center font-medium leading-tight">{action.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-white border font-semibold text-sm py-3 rounded-full hover:bg-slate-50 transition-colors" style={{ borderColor: '#d1d5db', color: '#374151' }}>
              Price and delivery
            </button>
            <button onClick={() => router.push("/cart")} className="flex-1 font-semibold text-sm py-3 rounded-full transition-colors" style={{ backgroundColor: '#0a66c2', color: '#ffffff' }}>
              Add to cart
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
