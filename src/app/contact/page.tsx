"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    // Simulate submission loading
    setSubmitted(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white pt-20 md:pt-28 pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="mb-12 text-center max-w-xl mx-auto">
          <span className="text-lime-accent font-mono text-xs tracking-wider font-bold">GET IN TOUCH</span>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase mt-2">
            CONNECT WITH THE ARENA
          </h1>
          <p className="text-zinc-500 text-sm mt-3">
            Have questions about custom batch bat pressings, club jersey customizers, or bulk school kit setups? Reach out today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: CONTACT CARDS & MAPS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Cards */}
            <div className="p-6 border border-zinc-900 bg-zinc-950/60 rounded-2xl space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-accent shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-zinc-400 uppercase">CALL & WHATSAPP</h4>
                  <p className="text-white text-sm font-bold mt-1">+91 98046 54445</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Primary business line and support</p>
                </div>
              </div>

              <div className="flex gap-4 border-t border-zinc-900/60 pt-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-accent shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-zinc-400 uppercase">EMAIL DESK</h4>
                  <p className="text-white text-sm font-bold mt-1">support@rpsports.com</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Corporate business queries</p>
                </div>
              </div>

              <div className="flex gap-4 border-t border-zinc-900/60 pt-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-zinc-400 uppercase">STORE ADDRESS</h4>
                  <p className="text-white text-sm font-bold mt-1">Andheri West, Mumbai, MH, India</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Plot 4, Sports Arena Complex, Off Link Road</p>
                </div>
              </div>
            </div>

            {/* Simulated Google Map */}
            <div className="relative h-64 rounded-2xl border border-zinc-900 bg-zinc-950/40 overflow-hidden flex items-center justify-center select-none">
              <div className="absolute inset-0 carbon-grid opacity-25 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
              
              {/* Radar scanner */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-cyan-accent/15 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-cyan-accent/20 animate-ping" />
              </div>

              <div className="absolute text-center z-10">
                <MapPin className="w-8 h-8 text-cyan-accent mx-auto animate-bounce mb-2" />
                <h5 className="font-bold text-white text-xs uppercase">MAP PREVIEW LOADED</h5>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ANDHERI WEST · MUMBAI</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ENQUIRY FORM */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-8 border border-cyan-accent/20 rounded-2xl bg-zinc-950/60 text-center space-y-6 animate-fade-up">
                <div className="w-16 h-16 rounded-full bg-cyan-accent/15 border border-cyan-accent/40 flex items-center justify-center text-cyan-accent mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black uppercase text-white">MESSAGE RECEIVED</h3>
                  <p className="text-zinc-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting RP Sports. Our warehouse team or head bat-presser will respond within 12 business hours.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 text-xs font-semibold rounded-full hover:border-cyan-accent text-white transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 md:p-8 border border-zinc-900 bg-zinc-950/60 rounded-2xl space-y-4">
                <h3 className="font-display font-bold text-lg uppercase text-white pb-3 border-b border-zinc-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-accent" /> ENQUIRY LAB
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-1">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-1">
                    SUBJECT
                  </label>
                  <select
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-accent cursor-pointer"
                  >
                    <option value="custom">CUSTOM BATS / WILLOW PRESINGS</option>
                    <option value="jersey">CUSTOM TEAM APPAREL / BULK STITCHES</option>
                    <option value="academy">ACADEMY & TOURNAMENT CONTRACTS</option>
                    <option value="retail">RETAIL ORDER SUPPORT</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-1">
                    YOUR MESSAGE
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs p-4 rounded-lg focus:outline-none focus:border-cyan-accent"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-accent to-lime-accent text-black font-extrabold text-xs rounded-full flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.15)] cursor-pointer"
                  >
                    SUBMIT ENQUIRY FORM
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
