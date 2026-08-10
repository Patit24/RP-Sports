import Link from "next/link";
import { PlusCircle, Package, LayoutDashboard, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <h2 className="text-xl font-black uppercase text-primary tracking-tight">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto custom-scrollbar">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors whitespace-nowrap">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors whitespace-nowrap">
            <Package className="w-4 h-4" /> Products
          </Link>
          <Link href="/admin/add-product" className="flex items-center gap-3 px-4 py-3 text-sm font-bold bg-primary text-white rounded-lg hover:bg-accent transition-colors whitespace-nowrap shadow-sm">
            <PlusCircle className="w-4 h-4" /> Add Product
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-primary transition-colors whitespace-nowrap md:mt-auto">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
