"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, Order } from "@/lib/store";
import { listenToOrders } from "@/lib/firestoreService";
import { 
  ShoppingBag, Search, Filter, Truck, CheckCircle2, Clock, 
  XCircle, AlertCircle, Phone, MapPin, ExternalLink, RefreshCw, X, ShieldCheck, Eye, Copy, Check, Printer 
} from "lucide-react";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { orders, setOrders, updateOrderStatus, currentUser, showToast } = useStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPushingShiprocket, setIsPushingShiprocket] = useState(false);
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
      return;
    }
    // Listen to orders from Cloud Firestore in real-time
    const unsubscribe = listenToOrders((dbOrders) => {
      setOrders(dbOrders);
    });
    return () => unsubscribe();
  }, [currentUser, setOrders]);

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return null;
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress.phone.includes(searchTerm) ||
      o.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} status updated to ${newStatus}`, "success");
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handlePushShiprocket = async (order: Order) => {
    setIsPushingShiprocket(true);
    try {
      // Get Firebase Auth ID Token for admin authorization
      let token = "";
      try {
        const { auth } = await import("@/lib/firebase");
        if (auth.currentUser) {
          token = await auth.currentUser.getIdToken();
        }
      } catch (err) {
        console.warn("Could not retrieve auth token for admin push:", err);
      }

      const res = await fetch("/api/shiprocket/create-order", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(order),
      });
      const data = await res.json();
      setIsPushingShiprocket(false);

      if (data.success) {
        showToast(`Order ${order.id} pushed to Shiprocket! AWB: ${data.awbCode || 'Assigned'}`, "success");
        // Update local store immediately
        const updatedOrders = orders.map((ord) => 
          ord.id === order.id 
            ? { 
                ...ord, 
                shiprocket_order_id: data.orderId,
                shiprocket_shipment_id: data.shipmentId,
                awb_code: data.awbCode,
                courier_name: data.courierName,
                shipping_status: data.status || "NEW",
                pickup_status: data.awbCode ? "Scheduled" : "Not Scheduled",
                shiprocket_status: data.status || "NEW"
              } 
            : ord
        );
        setOrders(updatedOrders);
      } else {
        showToast(`Shiprocket Push Notice: ${data.message || "Order registered with fallback"}`, "info");
      }
    } catch (err: any) {
      setIsPushingShiprocket(false);
      console.error("Shiprocket push error:", err);
      showToast(err.message || "An unexpected error occurred during sync.", "error");
    }
  };

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000]">
            RP Admin Order Center
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-[#111111] tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Customer Orders & Fulfillment
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Monitor real-time customer purchases, update order statuses, and push shipments to Shiprocket.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone, AWB..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs font-medium text-[#111111] focus:outline-none focus:border-[#CC0000]"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar w-full md:w-auto">
          {["All", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? "bg-[#111111] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 font-bold uppercase tracking-wider">
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Grand Total</th>
                <th className="p-4">Order Status</th>
                <th className="p-4">Courier / AWB</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-10 text-gray-500 font-bold">
                    No orders found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    <td className="p-4">
                      <strong className="block text-sm font-mono text-[#111111]">{ord.id}</strong>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>

                    <td className="p-4">
                      <strong className="block font-bold text-[#111111]">{ord.shippingAddress.fullName}</strong>
                      <span className="text-[11px] text-gray-500 font-mono">{ord.shippingAddress.phone}</span>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 font-bold text-gray-700">
                        {ord.paymentMethod}
                      </span>
                      <span className={`block text-[10px] font-bold uppercase tracking-wider ${
                        ord.paymentStatus === "Success" ? "text-emerald-600" : "text-amber-600"
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4 text-sm font-black text-[#CC0000]">
                      ₹{ord.total.toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as Order["status"])}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border bg-white focus:outline-none cursor-pointer ${
                          ord.status === "Delivered" ? "border-emerald-300 text-emerald-700 bg-emerald-50" :
                          ord.status === "Shipped" || ord.status === "Out for Delivery" ? "border-blue-300 text-blue-700 bg-blue-50" :
                          ord.status === "Cancelled" ? "border-red-300 text-red-700 bg-red-50" :
                          "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 font-mono text-[11px]">
                      <span className="block font-bold text-gray-700">
                        {ord.deliveryPartnerInfo?.carrier || "Delhivery"}
                      </span>
                      <span className="text-gray-500">
                        {ord.deliveryPartnerInfo?.awbNumber || ord.trackingNumber || "Assigned"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-[#111111] text-white hover:bg-[#CC0000] text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 bg-[#111111] text-white flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000] block mb-1">
                  RP Order Detail View
                </span>
                <h2 className="text-2xl font-display font-black uppercase text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Order #{selectedOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Shiprocket Push Banner */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs uppercase text-[#CC0000] mb-0.5 flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> Shiprocket Logistics Status
                  </h4>
                  <p className="text-xs text-gray-600 font-medium">
                    Carrier: <strong>{selectedOrder.deliveryPartnerInfo?.carrier || "Delhivery Express"}</strong> | AWB: <strong className="font-mono">{selectedOrder.deliveryPartnerInfo?.awbNumber}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePushShiprocket(selectedOrder)}
                  disabled={isPushingShiprocket}
                  className="px-4 py-2 bg-[#CC0000] hover:bg-[#990000] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  {isPushingShiprocket ? "Syncing..." : "Sync to Shiprocket API"}
                </button>
              </div>

              {/* Customer & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#CC0000]" /> Customer Profile
                  </h4>
                  <p className="font-bold text-sm text-[#111111]">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-xs text-gray-600 font-mono mt-0.5">{selectedOrder.shippingAddress.phone}</p>
                  <p className="text-xs text-gray-500 mt-1">Order Date: {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#CC0000]" /> Shipping Address
                  </h4>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    {selectedOrder.shippingAddress.addressLine}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} – <strong>{selectedOrder.shippingAddress.pincode}</strong>
                  </p>
                </div>
              </div>

              {/* Itemized Products List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Purchased Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl">
                      <img 
                        src={item.product.image || item.product.images?.[0]} 
                        alt={item.product.name} 
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-[#111111] truncate">{item.product.name}</p>
                        <p className="text-[11px] text-gray-500 font-mono">
                          {item.selectedSize ? `Size: ${item.selectedSize} | ` : ''}Qty: {item.quantity} x ₹{item.product.price.toLocaleString("en-IN")}
                        </p>
                        {item.customization && item.customization.type === "jersey_name_number" && (
                          <div className="mt-2 bg-slate-900 text-white p-2.5 rounded-lg border border-slate-700 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-base">👕</span>
                              <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Custom Jersey Print:</span>
                                <span className="font-mono font-black text-amber-400 uppercase tracking-widest">{item.customization.name}</span>
                              </div>
                            </div>
                            <span className="font-black bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-xs font-mono">
                              #{item.customization.number}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-black text-sm text-[#CC0000]">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total Breakdown */}
              <div className="pt-4 border-t border-gray-200 flex flex-col items-end text-xs space-y-1.5 font-medium">
                <div className="flex justify-between w-56 text-gray-600">
                  <span>Subtotal:</span>
                  <span>
                    ₹{((selectedOrder.subtotal !== undefined) 
                      ? selectedOrder.subtotal 
                      : Math.round(selectedOrder.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0) / 1.18)
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                
                {selectedOrder.discount !== undefined && selectedOrder.discount > 0 && (
                  <div className="flex justify-between w-56 text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-₹{selectedOrder.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                
                <div className="flex justify-between w-56 text-gray-600">
                  <span>Delivery Fee:</span>
                  <span className={selectedOrder.deliveryFee === 0 || selectedOrder.freeDelivery ? "text-emerald-600 font-bold" : "text-gray-900"}>
                    {selectedOrder.deliveryFee === 0 || selectedOrder.freeDelivery ? "FREE" : `₹${selectedOrder.deliveryFee}`}
                  </span>
                </div>
                
                <div className="flex justify-between w-56 text-gray-600">
                  <span>GST Tax (18%):</span>
                  <span>
                    ₹{((selectedOrder.tax !== undefined)
                      ? selectedOrder.tax
                      : (selectedOrder.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0) - Math.round(selectedOrder.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0) / 1.18))
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                
                <div className="flex justify-between w-56 font-black text-sm text-[#111111] pt-2.5 border-t border-gray-200">
                  <span>Grand Total:</span>
                  <span className="text-[#CC0000]">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Action Buttons: Print Tax Invoice */}
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print GST Tax Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* GST TAX INVOICE MODAL */}
      {selectedOrder && (
        <TaxInvoiceModal
          order={selectedOrder}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      )}

    </div>
  );
}
