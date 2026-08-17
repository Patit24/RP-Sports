"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { 
  Shirt, Search, Filter, Printer, CheckCircle2, Clock, 
  Package, ChevronRight, Eye, RefreshCw, AlertCircle, Sparkles, Download, Phone, MapPin
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

interface CustomJerseyRow {
  orderId: string;
  orderDocId?: string;
  orderStatus: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  productName: string;
  productImage: string;
  size: string;
  playerName: string;
  jerseyNumber: number | string;
  quantity: number;
  price: number;
  total: number;
}

export default function AdminCustomJerseysPage() {
  const { currentUser, orders: storeOrders, showToast } = useStore();
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [selectedSlip, setSelectedSlip] = useState<CustomJerseyRow | null>(null);

  // Subscribe to real-time orders from Firestore with fallback to storeOrders
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetched = snapshot.docs.map((d) => ({
            _docId: d.id,
            ...d.data(),
          }));
          setLiveOrders(fetched);
          setLoading(false);
        },
        (err) => {
          console.warn("Firestore live orders subscription error, using local orders:", err);
          setLiveOrders(storeOrders);
          setLoading(false);
        }
      );
    } catch (err) {
      console.warn("Firebase snapshot listener setup error:", err);
      setLiveOrders(storeOrders);
      setLoading(false);
    }

    return () => unsubscribe();
  }, [storeOrders]);

  // Extract all customized jersey items from all orders
  const allCustomJerseys: CustomJerseyRow[] = [];

  const sourceOrders = liveOrders.length > 0 ? liveOrders : storeOrders;

  sourceOrders.forEach((order) => {
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        // Check for item.customization or legacy item.customJersey
        if (item.customization && item.customization.type === "jersey_name_number") {
          allCustomJerseys.push({
            orderId: order.id || "ORD-UNKNOWN",
            orderDocId: order._docId,
            orderStatus: order.status || "Confirmed",
            orderDate: order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString("en-IN") : typeof order.createdAt === "string" ? new Date(order.createdAt).toLocaleDateString("en-IN") : "Recent",
            customerName: order.shippingAddress?.fullName || order.customerName || "Customer",
            customerPhone: order.shippingAddress?.phone || "N/A",
            customerCity: `${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""}`,
            productName: item.product?.name || item.name || "Custom Sublimated Jersey",
            productImage: item.product?.image || item.product?.images?.[0] || "/products/generated_jersey.jpg",
            size: item.selectedSize || "L",
            playerName: item.customization.name,
            jerseyNumber: item.customization.number,
            quantity: item.quantity || 1,
            price: item.product?.price || item.price || 699,
            total: (item.product?.price || item.price || 699) * (item.quantity || 1),
          });
        } else if (item.customJersey) {
          allCustomJerseys.push({
            orderId: order.id || "ORD-UNKNOWN",
            orderDocId: order._docId,
            orderStatus: order.status || "Confirmed",
            orderDate: order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString("en-IN") : typeof order.createdAt === "string" ? new Date(order.createdAt).toLocaleDateString("en-IN") : "Recent",
            customerName: order.shippingAddress?.fullName || order.customerName || "Customer",
            customerPhone: order.shippingAddress?.phone || "N/A",
            customerCity: `${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""}`,
            productName: item.product?.name || item.name || "Custom Team Jersey",
            productImage: item.product?.image || item.product?.images?.[0] || "/products/generated_jersey.jpg",
            size: item.selectedSize || "L",
            playerName: item.customJersey.playerName || item.customJersey.teamName || "PLAYER",
            jerseyNumber: item.customJersey.jerseyNumber || item.customJersey.playerNumber || "00",
            quantity: item.quantity || 1,
            price: item.product?.price || item.price || 699,
            total: (item.product?.price || item.price || 699) * (item.quantity || 1),
          });
        }
      });
    }
  });

  // Filtered rows
  const filteredJerseys = allCustomJerseys.filter((j) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      j.playerName.toLowerCase().includes(q) ||
      String(j.jerseyNumber).includes(q) ||
      j.orderId.toLowerCase().includes(q) ||
      j.customerName.toLowerCase().includes(q) ||
      j.customerPhone.includes(q) ||
      j.productName.toLowerCase().includes(q);

    const matchStatus = statusFilter === "all" || j.orderStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchSize = sizeFilter === "all" || j.size.toUpperCase() === sizeFilter.toUpperCase();

    return matchSearch && matchStatus && matchSize;
  });

  // Metrics
  const totalCount = allCustomJerseys.reduce((sum, j) => sum + j.quantity, 0);
  const pendingCount = allCustomJerseys.filter((j) => ["Confirmed", "Pending", "Processing"].includes(j.orderStatus)).reduce((sum, j) => sum + j.quantity, 0);
  const shippedCount = allCustomJerseys.filter((j) => ["Shipped", "Delivered"].includes(j.orderStatus)).reduce((sum, j) => sum + j.quantity, 0);

  const handlePrintSlip = (j: CustomJerseyRow) => {
    setSelectedSlip(j);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#CC0000] text-white flex items-center justify-center shadow">
              <Shirt className="w-4 h-4" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black uppercase text-slate-900 tracking-wider" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Custom Jersey Fulfillment Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Dedicated queue for player name & number laser sublimation printing, quality checks, and dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
          >
            All Orders
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#111111] hover:bg-[#CC0000] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Production Batch
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#CC0000] shrink-0">
            <Shirt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Custom Units</span>
            <span className="text-2xl font-black text-slate-900">{totalCount} Units</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Custom Printing</span>
            <span className="text-2xl font-black text-amber-600">{pendingCount} Units</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed & Dispatched</span>
            <span className="text-2xl font-black text-emerald-600">{shippedCount} Units</span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Player Name, Number, Order ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#CC0000]"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing / Printing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 ml-2">
            <span>Size:</span>
          </div>
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#CC0000]"
          >
            <option value="all">All Sizes</option>
            <option value="S">Size S</option>
            <option value="M">Size M</option>
            <option value="L">Size L</option>
            <option value="XL">Size XL</option>
            <option value="XXL">Size XXL</option>
          </select>
        </div>
      </div>

      {/* Main Custom Jerseys Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredJerseys.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Shirt className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-display font-black uppercase text-slate-800 mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              No Custom Jersey Orders Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When customers purchase customizable jerseys with their personalized name & number, they will instantly appear here for print fulfillment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Info</th>
                  <th className="p-4">Jersey Product</th>
                  <th className="p-4 text-center">Size</th>
                  <th className="p-4">Custom Print Specs</th>
                  <th className="p-4 text-center">Qty</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredJerseys.map((j, idx) => (
                  <tr key={`${j.orderId}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Order ID & Date */}
                    <td className="p-4">
                      <span className="font-mono font-bold text-[#CC0000] text-xs block">{j.orderId}</span>
                      <span className="text-[10px] text-slate-400">{j.orderDate}</span>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{j.customerName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-2.5 h-2.5" /> {j.customerPhone}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {j.customerCity}
                      </div>
                    </td>

                    {/* Jersey */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={j.productImage}
                          alt={j.productName}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <span className="font-bold text-slate-800 line-clamp-1 max-w-[180px]">{j.productName}</span>
                      </div>
                    </td>

                    {/* Size */}
                    <td className="p-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-slate-900 text-white rounded-md font-mono font-black text-xs">
                        {j.size}
                      </span>
                    </td>

                    {/* Custom Print Specs Card */}
                    <td className="p-4">
                      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-3 py-2 rounded-xl border border-slate-700 shadow-sm inline-flex items-center gap-3 min-w-[200px]">
                        <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-black text-sm shrink-0">
                          #{j.jerseyNumber}
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Laser Print Name:</div>
                          <div className="font-mono font-black text-amber-300 text-xs uppercase tracking-widest leading-none">
                            {j.playerName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="p-4 text-center">
                      <span className="font-bold text-slate-900 text-xs">{j.quantity}</span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        j.orderStatus === "Delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        j.orderStatus === "Shipped" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                        "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {j.orderStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handlePrintSlip(j)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-[#CC0000] hover:text-white text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                          title="Print Laser Sublimation Slip"
                        >
                          <Printer className="w-3 h-3" /> Slip
                        </button>
                        <Link
                          href={`/admin/orders`}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Order
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL / PRINTABLE PRODUCTION SLIP */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#CC0000] uppercase tracking-widest block">RP Sports Sublimation Unit</span>
                <h3 className="text-xl font-display font-black uppercase text-slate-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Jersey Production Job Slip
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlip(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Print Slip Core Layout */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 text-center space-y-4 shadow-inner border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Official Match Edition • Laser Cut & Heat Press
              </div>

              {/* Player Name */}
              <div className="font-mono font-black text-2xl uppercase tracking-widest text-amber-400 border-b border-white/10 pb-3">
                {selectedSlip.playerName}
              </div>

              {/* Number & Size */}
              <div className="flex items-center justify-center gap-8 py-2">
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Jersey Number</div>
                  <div className="font-display font-black text-5xl text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    #{selectedSlip.jerseyNumber}
                  </div>
                </div>

                <div className="w-px h-12 bg-white/20" />

                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Jersey Size</div>
                  <div className="font-mono font-black text-3xl text-emerald-400">
                    {selectedSlip.size}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 border-t border-white/10 pt-3">
                Product: {selectedSlip.productName} (Qty: {selectedSlip.quantity})
              </div>
            </div>

            {/* Job Metadata */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-bold text-[#CC0000]">{selectedSlip.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-800">{selectedSlip.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="font-bold text-slate-800">{selectedSlip.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-slate-800">{selectedSlip.customerCity}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#CC0000] hover:bg-[#990000] text-white rounded-xl font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                <Printer className="w-4 h-4" /> Print Production Slip
              </button>
              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
