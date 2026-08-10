import { Suspense } from "react";
import ShopPageContent from "./ShopPageContent";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060608] flex items-center justify-center p-8">
          <div className="w-8 h-8 rounded-full border-t-2 border-cyan-accent border-r-2 border-zinc-800 animate-spin" />
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
