"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Trophy, Zap } from "lucide-react";

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [lights, setLights] = useState([false, false, false, false]);
  const [textIndex, setTextIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const textOptions = [
    "IGNITING ARENA...",
    "CHARGING POWER CORE...",
    "CALIBRATING EQUIPMENT...",
    "PREPARING TRACK...",
    "READY TO EXPLODE"
  ];

  // Synthesize stadium audio effects using Web Audio API
  const playSynthesizedSound = (type: "light" | "crowd-start" | "crowd-stop") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === "light") {
        // High tension clicking sound followed by hum
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(2000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "crowd-start") {
        // White noise for crowd roar with bandpass filter
        const bufferSize = ctx.sampleRate * 2; // 2 seconds
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(300, ctx.currentTime);
        filter.Q.setValueAtTime(2, ctx.currentTime);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5); // Fade in hum
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start();
        (window as any)._crowdSource = noise;
        (window as any)._crowdGain = gain;
        (window as any)._crowdCtx = ctx;
      }
    } catch (e) {
      console.warn("Web Audio failed to initialize", e);
    }
  };

  useEffect(() => {
    // Play crowd hum
    playSynthesizedSound("crowd-start");

    // Sequential floodlight trigger
    const lightTimers = [500, 1000, 1500, 2000].map((delay, index) => {
      return setTimeout(() => {
        setLights(prev => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
        playSynthesizedSound("light");
      }, delay);
    });

    // Progress counter
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDone(true);
          // Fade crowd sound
          setTimeout(() => {
            const crowdGain = (window as any)._crowdGain;
            const crowdCtx = (window as any)._crowdCtx;
            if (crowdGain && crowdCtx) {
              crowdGain.gain.exponentialRampToValueAtTime(0.0001, crowdCtx.currentTime + 0.8);
            }
            onComplete();
          }, 800);
          return 100;
        }
        
        // Progress speed increments
        const step = Math.floor(Math.random() * 5) + 3;
        const next = Math.min(100, prev + step);
        
        // Match progress status text
        if (next > 80) setTextIndex(4);
        else if (next > 60) setTextIndex(3);
        else if (next > 40) setTextIndex(2);
        else if (next > 20) setTextIndex(1);
        
        return next;
      });
    }, 120);

    return () => {
      lightTimers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#060608] z-[99999] flex flex-col justify-between p-8 md:p-16 overflow-hidden">
      {/* Stadium Grid mesh */}
      <div className="absolute inset-0 carbon-grid opacity-20 pointer-events-none" />

      {/* Stadium light beam simulations */}
      <div className="absolute inset-x-0 top-0 h-[400px] flex justify-between px-20 pointer-events-none opacity-40">
        {lights.map((isOn, idx) => (
          <div
            key={idx}
            className={`w-[1px] h-full bg-gradient-to-b from-cyan-accent to-transparent transition-all duration-700 origin-top ${
              isOn ? "opacity-100 rotate-12 scale-100 blur-[2px]" : "opacity-0 rotate-0 scale-50"
            }`}
            style={{
              boxShadow: isOn ? `0 0 40px var(--cyan-accent)` : "none",
              transform: isOn ? `rotate(${(idx - 1.5) * 15}deg) scaleY(1.5)` : "rotate(0) scaleY(0)"
            }}
          />
        ))}
      </div>

      {/* Top logo */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-accent to-lime-accent flex items-center justify-center font-bold text-black text-sm">
            RP
          </div>
          <span className="font-display font-extrabold tracking-widest text-lg">SPORTS</span>
        </div>
        <div className="text-zinc-600 font-mono text-sm tracking-wider">
          SYSTEM_ONLINE_V2.0
        </div>
      </div>

      {/* Center 3D-styled logo and floating widgets */}
      <div className="relative flex flex-col items-center justify-center flex-grow z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative text-center select-none"
        >
          {/* Neon Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-zinc-800/60 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border border-cyan-accent/25 animate-pulse" />
          </div>

          <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-white uppercase relative">
            ARENA
            <span className="absolute -top-6 -right-6 text-cyan-accent text-lg flex items-center gap-1 font-mono">
              <Zap className="w-4 h-4 fill-cyan-accent animate-bounce" /> CORE
            </span>
          </h2>
          <p className="text-zinc-500 font-mono mt-2 tracking-[0.3em] text-xs">
            ENTERPRISE SPORTS EXPERIENCE
          </p>
        </motion.div>

        {/* Floating Icons mimicking rotating objects */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-80 h-80 relative flex items-center justify-center"
          >
            {/* Football icon floating */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-10 p-3 bg-zinc-900 border border-zinc-800 rounded-full text-lime-accent"
            >
              ⚽
            </motion.div>
            {/* Bat (Trophy) floating */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 right-0 p-3 bg-zinc-900 border border-zinc-800 rounded-full text-cyan-accent"
            >
              <Trophy className="w-5 h-5" />
            </motion.div>
            {/* Badminton racket floating */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 -right-10 p-3 bg-zinc-900 border border-zinc-800 rounded-full text-gold-accent"
            >
              🏸
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Loading Track */}
      <div className="flex flex-col gap-4 z-10 max-w-xl mx-auto w-full">
        <div className="flex justify-between items-end font-mono text-xs text-zinc-500">
          <span>{textOptions[textIndex]}</span>
          <span className="text-cyan-accent font-bold">{progress}%</span>
        </div>

        {/* Running track loading bar */}
        <div className="relative h-4 bg-zinc-900/60 rounded-full border border-zinc-800 overflow-hidden px-1 flex items-center">
          {/* Running lanes grid */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-zinc-800/40 border-dashed" />
          
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-cyan-accent to-lime-accent relative"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          >
            {/* Glowing runner indicator */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#ffffff] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-accent" />
            </div>
          </motion.div>
        </div>
        <p className="text-[10px] text-zinc-600 text-center font-mono tracking-wider">
          HOLD TIGHT · HIGH STRENGTH DESIGN SYSTEMS ENABLED
        </p>
      </div>
    </div>
  );
}
