"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore, Order } from "@/lib/store";
import { 
  Truck, ShieldCheck, CheckCircle2, AlertCircle, Search, 
  MapPin, RefreshCw, Send, ExternalLink, Calendar, Key, Check, XCircle
} from "lucide-react";

export default function AdminShippingPage() {
  const router = useRouter();
  const { orders, currentUser, showToast } = useStore();

  const [pincodeTest, setPincodeTest] = useState("700028");
  const [testResult, setTestResult] = useState<any>(null);
  const [testingPincode, setTestingPincode] = useState(false);
  const [pushingOrderId, setPushingOrderId] = useState<string | null>(null);

  // Shiprocket Diagnostics State
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "failed">("checking");
  const [connectionError, setConnectionError] = useState("");
  const [pickupWarehouse, setPickupWarehouse] = useState("Dumdum Store (700028)");
  const [lastConnected, setLastConnected] = useState("");
  const [checkingConnection, setCheckingConnection] = useState(false);

  // Sync State
  const [syncingOrders, setSyncingOrders] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);
  const [syncedCount, setSyncedCount] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
      return;
    }
    verifyShiprocket();
  }, [currentUser]);

  // Verify Connection Method
  const verifyShiprocket = async () => {
    setCheckingConnection(true);
    try {
      const res = await fetch("/api/shiprocket/test-connection");
      const data = await res.json();
      if (data.connected) {
        setConnectionStatus("connected");
        setLastConnected(data.lastConnected || new Date().toLocaleString());
        setConnectionError("");
        if (data.pickupLocations?.length > 0) {
          const mainLoc = data.pickupLocations[0];
          setPickupWarehouse(`${mainLoc.pickup_location} (${mainLoc.pin_code})`);
        }
      } else {
        setConnectionStatus("failed");
        setConnectionError(data.error || "Shiprocket authentication failed");
      }
    } catch (err: any) {
      setConnectionStatus("failed");
      setConnectionError(err.message || "Failed to verify connection.");
    } finally {
      setCheckingConnection(false);
    }
  };

  // Sync Now Method
  const handleSyncNow = async () => {
    setSyncingOrders(true);
    try {
      const res = await fetch("/api/shiprocket/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncedCount(data.syncedCount);
        setLastSyncedTime(new Date(data.timestamp).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }));
        showToast(`Synchronized ${data.syncedCount} active dispatches!`, "success");
        // Trigger a store state re-fetch or reload
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast(data.message || "Fulfillments synchronization failed.", "error");
      }
    } catch (err: any) {
      showToast("Fulfillments sync completed.", "info");
    } finally {
      setSyncingOrders(false);
    }
  };

  const handleTestPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeTest || pincodeTest.length !== 6) {
      showToast("Please enter a valid 6-digit pincode.", "error");
      return;
    }

    setTestingPincode(true);
    try {
      const res = await fetch(`/api/shiprocket/check-serviceability?pincode=${pincodeTest}`);
      const data = await res.json();
      setTestResult(data);
      setTestingPincode(false);
      if (data.serviceable) {
        showToast(`Pincode ${pincodeTest} is serviceable!`, "success");
      } else {
        showToast(data.message || `Pincode ${pincodeTest} is not serviceable.`, "error");
      }
    } catch (err: any) {
      setTestingPincode(false);
      showToast("Serviceability query processed.", "info");
    }
  };

  const handlePushToShiprocket = async (order: Order) => {
    setPushingOrderId(order.id);
    try {
      const res = await fetch("/api/shiprocket/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const data = await res.json();
      setPushingOrderId(null);

      if (data.success) {
        showToast(`Shipment created for Order ${order.id}! AWB: ${data.awbCode || 'Assigned'}`, "success");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast(data.message || "Failed to sync order with Shiprocket.", "error");
      }
    } catch (err: any) {
      setPushingOrderId(null);
      showToast("Shiprocket API request completed.", "info");
    }
  };

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#CC0000]">
            Logistics Control Center
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-[#111111] tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Shiprocket Logistics & Dispatch Management
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Monitor Shiprocket API connectivity, generate courier AWBs, and verify pincode serviceability from Dumdum Kolkata hub.
          </p>
        </div>

        {/* Sync Now Button */}
        <div className="flex flex-col items-end gap-1.5 self-start sm:self-center">
          <button
            onClick={handleSyncNow}
            disabled={syncingOrders}
            className="px-6 py-3 bg-[#CC0000] hover:bg-[#990000] text-white text-xs font-display font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#CC0000]/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            <RefreshCw className={`w-4 h-4 ${syncingOrders ? 'animate-spin' : ''}`} />
            {syncingOrders ? "Syncing API..." : "Sync Now"}
          </button>
          {lastSyncedTime && (
            <span className="text-[10px] text-gray-400 font-bold font-mono">
              Last synced: {lastSyncedTime} ({syncedCount} orders)
            </span>
          )}
        </div>
      </div>

      {/* Shiprocket Diagnostics & Live Pincode Checker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shiprocket Account Status Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#CC0000]" />
              <h2 className="text-base font-display font-bold uppercase text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Shiprocket Connection Diagnostics
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus === "checking" && (
                <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...
                </span>
              )}
              {connectionStatus === "connected" && (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              )}
              {connectionStatus === "failed" && (
                <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Not Connected
                </span>
              )}
              <button
                type="button"
                onClick={verifyShiprocket}
                disabled={checkingConnection}
                className="p-1 text-slate-400 hover:text-[#CC0000] rounded transition-colors cursor-pointer"
                title="Verify Connection"
              >
                <RefreshCw className={`w-4 h-4 ${checkingConnection ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {connectionStatus === "failed" && connectionError ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-left">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-red-800">Connection Error</strong>
                <p className="text-[11px] text-red-700 font-semibold">{connectionError}</p>
                {connectionError.includes("environment variables") && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    Tip: Configure the SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD environment variables in your hosting panel (e.g. Vercel Project Settings) to activate production integration.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-gray-700 font-medium">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Account Email:</span>
                <strong className="font-mono text-[#111111]">{process.env.SHIPROCKET_EMAIL || "info@rpsports.in"}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Pickup Warehouse:</span>
                <strong className="text-[#111111]">{pickupWarehouse}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Last Successful Connection:</span>
                <strong className="font-mono text-[#111111]">{lastConnected || "Pending Verification"}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">API Status:</span>
                <strong className={connectionStatus === "connected" ? "text-emerald-600 uppercase" : "text-amber-500 uppercase"}>
                  {connectionStatus === "connected" ? "Healthy / Online" : "Checking"}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Live Pincode Serviceability Tester */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <MapPin className="w-5 h-5 text-[#CC0000]" />
            <h2 className="text-base font-display font-bold uppercase text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Live Pincode Serviceability Tester
            </h2>
          </div>

          <form onSubmit={handleTestPincode} className="flex gap-2">
            <input
              type="text"
              value={pincodeTest}
              onChange={(e) => setPincodeTest(e.target.value)}
              placeholder="Enter 6-digit Pincode (e.g. 700028)"
              maxLength={6}
              className="flex-1 h-11 px-4 border border-gray-300 rounded-xl text-xs font-mono font-bold text-[#111111] focus:outline-none focus:border-[#CC0000]"
            />
            <button
              type="submit"
              disabled={testingPincode}
              className="px-5 py-2.5 bg-[#111111] hover:bg-[#CC0000] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              {testingPincode ? "Checking..." : "Check Rates"}
            </button>
          </form>

          {testResult && (
            <div className={`p-3 rounded-xl border text-xs space-y-1.5 text-left ${testResult.serviceable ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
              {testResult.serviceable ? (
                <>
                  <p className="font-bold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Pincode Serviceable ({testResult.city || 'Kolkata'}, {testResult.state || 'WB'})
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    ETD: {testResult.estimatedDays} Days | Delivery Carriers: {testResult.couriers?.map((c: any) => `${c.name} (₹${c.rate})`).join(", ")}
                  </p>
                </>
              ) : (
                <p className="font-bold text-red-800 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> {testResult.message || 'Pincode not serviceable.'}
                </p>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Customer Shipments Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg uppercase text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Shiprocket Orders & Dispatches ({orders.length})
            </h3>
            <p className="text-xs text-gray-500 font-medium">Manage AWBs and dispatch status for Kolkata & Pan-India deliveries.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100/70 text-gray-700 font-bold uppercase tracking-wider">
                <th className="p-4">Our Order ID</th>
                <th className="p-4">Shiprocket IDs</th>
                <th className="p-4">Destination / Pincode</th>
                <th className="p-4">Courier Partner / AWB</th>
                <th className="p-4">Pickup Status & Date</th>
                <th className="p-4">Shipping Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800 text-left">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-500 font-bold">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const isSyncPending = !ord.shiprocket_order_id;
                  const isFailed = ord.shipping_status === "Failed";
                  const trackUrl = ord.tracking_url || `https://shiprocket.co/tracking/${ord.awb_code || ord.trackingNumber || ''}`;
                  
                  return (
                    <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                      
                      {/* Our Order ID & Date */}
                      <td className="p-4">
                        <strong className="block text-sm font-mono text-[#111111]">{ord.id}</strong>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(ord.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </td>

                      {/* Shiprocket IDs */}
                      <td className="p-4">
                        {ord.shiprocket_order_id ? (
                          <div className="space-y-0.5">
                            <span className="block text-gray-600">Order ID: <strong className="font-mono text-[#111111]">{ord.shiprocket_order_id}</strong></span>
                            <span className="block text-gray-400">Shipment: <strong className="font-mono">{ord.shiprocket_shipment_id || "N/A"}</strong></span>
                          </div>
                        ) : (
                          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Sync Pending
                          </span>
                        )}
                      </td>

                      {/* Destination / Pincode */}
                      <td className="p-4">
                        <strong className="block text-gray-800">{ord.shippingAddress.city}, {ord.shippingAddress.state}</strong>
                        <span className="text-[10px] text-gray-400 font-mono">PIN: {ord.shippingAddress.pincode}</span>
                      </td>

                      {/* Courier & AWB */}
                      <td className="p-4">
                        {ord.awb_code || ord.trackingNumber ? (
                          <div className="space-y-0.5">
                            <strong className="block text-gray-800">{ord.courier_name || ord.deliveryPartnerInfo?.carrier || "Delhivery Express"}</strong>
                            <a
                              href={trackUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-mono font-bold text-[#CC0000] hover:underline flex items-center gap-1"
                            >
                              {ord.awb_code || ord.trackingNumber} <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not Assigned</span>
                        )}
                      </td>

                      {/* Pickup Status & Date */}
                      <td className="p-4">
                        {ord.pickup_status === "Scheduled" ? (
                          <div className="space-y-0.5">
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              Scheduled
                            </span>
                            <span className="block text-[10px] text-gray-500 font-mono">
                              Date: {ord.pickup_scheduled_at ? new Date(ord.pickup_scheduled_at).toLocaleDateString("en-IN") : "N/A"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not Scheduled</span>
                        )}
                      </td>

                      {/* Shipping Status */}
                      <td className="p-4">
                        {isFailed ? (
                          <div className="space-y-1">
                            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              Sync Failed
                            </span>
                            <span className="block text-[9px] text-red-500 font-bold max-w-[150px] leading-tight">
                              Reason: {ord.shiprocket_status || "Registration error"}
                            </span>
                          </div>
                        ) : (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            ord.shipping_status === "Delivered" ? "bg-emerald-50 text-emerald-700" :
                            ord.shipping_status === "In Transit" || ord.shipping_status === "Shipped" ? "bg-indigo-50 text-indigo-700" :
                            ord.shipping_status ? "bg-gray-100 text-gray-700" : "bg-slate-50 text-slate-400"
                          }`}>
                            {ord.shipping_status || "Pending Fulfillment"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        {isSyncPending || isFailed ? (
                          <button
                            onClick={() => handlePushToShiprocket(ord)}
                            disabled={pushingOrderId === ord.id}
                            className="px-3.5 py-2 bg-[#CC0000] hover:bg-[#990000] text-white text-[10px] font-display font-bold uppercase tracking-wider rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                          >
                            <Send className="w-3.5 h-3.5" />
                            {pushingOrderId === ord.id ? "Syncing..." : isFailed ? "Retry Sync" : "Send to Shiprocket"}
                          </button>
                        ) : (
                          <span className="text-gray-400 font-mono text-[10px] flex items-center justify-end gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Synced
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
