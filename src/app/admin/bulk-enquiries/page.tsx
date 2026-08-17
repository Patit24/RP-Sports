"use client";

import { useState, useEffect } from "react";
import { 
  Users, Search, Filter, MessageSquare, ExternalLink, CheckCircle2, 
  Clock, RefreshCw, Eye, MapPin, Shirt, Calendar, Building, Phone, Mail, FileText, ChevronDown, Check, AlertCircle 
} from "lucide-react";
import { useStore } from "@/lib/store";
import { BulkJerseyEnquiry } from "@/app/api/enquiries/bulk-jersey/route";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  New: { label: "New Lead", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  Contacted: { label: "Contacted", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  "Quotation Sent": { label: "Quotation Sent", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  Confirmed: { label: "Confirmed", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  "In Production": { label: "In Production", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  Completed: { label: "Completed", color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-300" },
  Cancelled: { label: "Cancelled", color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-300" },
};

const ALL_STATUSES = ["New", "Contacted", "Quotation Sent", "Confirmed", "In Production", "Completed", "Cancelled"] as const;

export default function AdminBulkEnquiriesPage() {
  const { showToast } = useStore();
  const [enquiries, setEnquiries] = useState<BulkJerseyEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<BulkJerseyEnquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enquiries/bulk-jersey");
      const data = await res.json();
      if (data.success && Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error("Failed to load bulk enquiries:", err);
      showToast("Could not load bulk enquiries", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/enquiries/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus as any } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus as any });
        }
        showToast(`Status updated to ${newStatus}`, "success");
      } else {
        showToast(data.error || "Failed to update status", "error");
      }
    } catch (err) {
      showToast("Network error updating status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === "New").length;
  const inProgressEnquiries = enquiries.filter((e) =>
    ["Contacted", "Quotation Sent", "Confirmed", "In Production"].includes(e.status)
  ).length;
  const totalUnitsInquired = enquiries.reduce((sum, e) => sum + (e.quantity || 0), 0);

  // Filtered List
  const filteredEnquiries = enquiries.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      e.enquiryId.toLowerCase().includes(q) ||
      e.customerName.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q) ||
      (e.teamName && e.teamName.toLowerCase().includes(q)) ||
      e.productName.toLowerCase().includes(q) ||
      e.deliveryCity.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold font-mono text-[#CC0000] uppercase tracking-widest bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              Production & B2B Lead Hub
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-[#111111]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Bulk Jersey Enquiries
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage bulk team kit enquiries, quote requests, and direct customer WhatsApp communications.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          disabled={loading}
          className="self-start md:self-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#CC0000]" : ""}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Total Enquiries</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-black text-slate-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {totalEnquiries}
            </span>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/20 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#CC0000] block mb-1">New & Uncontacted</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-black text-[#CC0000]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {newEnquiries}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block mb-1">In Negotiation / Production</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-black text-amber-800" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {inProgressEnquiries}
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Total Jerseys Requested</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-black text-emerald-600" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {totalUnitsInquired.toLocaleString()}
            </span>
            <Shirt className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Enquiry ID, customer, team, phone, city..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#CC0000] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {["All", "New", "Contacted", "Quotation Sent", "Confirmed", "In Production", "Completed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? "bg-[#CC0000] text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#CC0000] animate-spin mx-auto" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Loading bulk enquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">No Bulk Enquiries Found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              {searchQuery || statusFilter !== "All"
                ? "Try clearing your search query or filters to see other enquiries."
                : "No customer has submitted a bulk jersey request yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Ref ID & Date</th>
                  <th className="py-3.5 px-4">Customer & WhatsApp</th>
                  <th className="py-3.5 px-4">Jersey Product</th>
                  <th className="py-3.5 px-4 text-center">Quantity</th>
                  <th className="py-3.5 px-4">Customization</th>
                  <th className="py-3.5 px-4">Team & Location</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredEnquiries.map((enq) => {
                  const stConfig = STATUS_CONFIG[enq.status] || STATUS_CONFIG["New"];
                  const cleanPhone = enq.phone.replace(/[^0-9]/g, "");
                  const waReplyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hi ${enq.customerName}, this is RP Sports Kolkata regarding your bulk order enquiry [${enq.enquiryId}] for ${enq.quantity}x ${enq.productName}.`
                  )}`;

                  return (
                    <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID & Date */}
                      <td className="py-4 px-4 align-middle">
                        <span className="font-mono font-bold text-[#CC0000] text-sm block">
                          {enq.enquiryId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4 align-middle">
                        <strong className="text-slate-900 font-bold block">{enq.customerName}</strong>
                        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{enq.phone}</span>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="py-4 px-4 align-middle max-w-xs">
                        <span className="font-bold text-slate-800 line-clamp-1 block">{enq.productName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">SKU: {enq.productSku || enq.productId}</span>
                      </td>

                      {/* Quantity */}
                      <td className="py-4 px-4 align-middle text-center">
                        <span className="inline-block font-mono font-black text-sm text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                          {enq.quantity}
                        </span>
                      </td>

                      {/* Customization */}
                      <td className="py-4 px-4 align-middle">
                        <span className="font-medium text-slate-700 block">{enq.printingOption}</span>
                        {enq.noSizeBreakdownYet ? (
                          <span className="text-[10px] text-amber-600 font-medium">Sizes to be discussed</span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {Object.entries(enq.sizeBreakdown)
                              .filter(([_, q]) => q > 0)
                              .map(([s, q]) => `${s}:${q}`)
                              .join(" ")}
                          </span>
                        )}
                      </td>

                      {/* Team & Location */}
                      <td className="py-4 px-4 align-middle">
                        <span className="font-bold text-slate-800 block">
                          {enq.teamName || "—"}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {enq.deliveryCity}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-middle text-center">
                        <select
                          value={enq.status}
                          disabled={updatingId === enq.id}
                          onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${stConfig.bg} ${stConfig.color} ${stConfig.border}`}
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 align-middle text-right space-x-2">
                        <a
                          href={waReplyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Chat with customer on WhatsApp"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enq)}
                          title="View Full Enquiry Details"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#CC0000] uppercase tracking-widest block">
                  Reference: {selectedEnquiry.enquiryId}
                </span>
                <h3 className="text-xl font-display font-black uppercase text-slate-900" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Bulk Order Specification
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Product & Quantity */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">Product Item</span>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedEnquiry.productName}</h4>
                  <span className="text-xs text-slate-400 font-mono">SKU: {selectedEnquiry.productSku || selectedEnquiry.productId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Units</span>
                  <div className="text-xl font-mono font-black text-emerald-600">{selectedEnquiry.quantity} Jerseys</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">PRINTING SPECIFICATION</span>
                  <strong className="text-slate-800">{selectedEnquiry.printingOption}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TEAM / CLUB</span>
                  <strong className="text-slate-800">{selectedEnquiry.teamName || "Not specified"}</strong>
                </div>
              </div>
            </div>

            {/* Size Breakdown */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Size Breakdown</h5>
              {selectedEnquiry.noSizeBreakdownYet ? (
                <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
                  ⚠️ Customer requested to finalize size breakdown directly with the team.
                </p>
              ) : (
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {["S", "M", "L", "XL", "XXL"].map((sz) => (
                    <div key={sz} className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-400 font-bold block text-[10px]">{sz}</span>
                      <span className="font-mono font-black text-slate-800 text-sm">
                        {selectedEnquiry.sizeBreakdown[sz] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="space-y-2 text-xs">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-1">
                Customer & Destination
              </h5>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] block">NAME</span>
                  <strong>{selectedEnquiry.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">WHATSAPP</span>
                  <strong>{selectedEnquiry.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">DELIVERY CITY</span>
                  <strong>{selectedEnquiry.deliveryCity}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">EMAIL</span>
                  <strong>{selectedEnquiry.email || "—"}</strong>
                </div>
              </div>
              {selectedEnquiry.deliveryAddress && (
                <div className="pt-1">
                  <span className="text-slate-400 text-[10px] block">FULL ADDRESS</span>
                  <p className="text-slate-700">{selectedEnquiry.deliveryAddress}</p>
                </div>
              )}
              {selectedEnquiry.additionalNotes && (
                <div className="pt-2 bg-yellow-50/50 p-3 rounded-xl border border-yellow-200 text-slate-800">
                  <span className="text-yellow-800 text-[10px] font-bold uppercase block">Customer Notes</span>
                  <p className="text-xs italic mt-0.5">{selectedEnquiry.additionalNotes}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2">
              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hi ${selectedEnquiry.customerName}, this is RP Sports Kolkata regarding your bulk order enquiry [${selectedEnquiry.enquiryId}] for ${selectedEnquiry.quantity}x ${selectedEnquiry.productName}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-display font-bold uppercase text-xs tracking-wider rounded-xl transition-colors cursor-pointer"
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
