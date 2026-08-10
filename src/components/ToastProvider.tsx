"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function ToastProvider() {
  const { toast, clearToast } = useStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 flex-shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/30 bg-[#111111]/95 text-white",
    error: "border-red-500/30 bg-[#111111]/95 text-white",
    info: "border-sky-500/30 bg-[#111111]/95 text-white",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] max-w-sm w-full transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div
        className={`flex items-center gap-3 p-4 rounded-lg shadow-2xl border backdrop-blur-md ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
        <button
          onClick={clearToast}
          className="text-white/60 hover:text-white transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
