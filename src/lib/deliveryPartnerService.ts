import { Order, DeliveryPartnerInfo } from "./store";
import { updateOrderStatusInDB } from "./firestoreService";

/**
 * Logistics partners configured for RP Sports India delivery
 */
export const DELIVERY_CARRIERS = [
  {
    name: "Delhivery Express",
    code: "DELHIVERY",
    prefix: "DLH",
    hub: "Kolkata Central Hub, Dumdum (700028)",
    avgDeliveryDays: "2-4 Business Days",
    agentPhone: "+91 98300 12345",
  },
  {
    name: "Blue Dart Logistics",
    code: "BLUEDART",
    prefix: "BLD",
    hub: "Kolkata Airport Logistics Park",
    avgDeliveryDays: "1-3 Business Days",
    agentPhone: "+91 98311 54321",
  },
  {
    name: "Shadowfax Express",
    code: "SHADOWFAX",
    prefix: "SFX",
    hub: "North Kolkata Express Hub",
    avgDeliveryDays: "2-3 Business Days",
    agentPhone: "+91 98322 99887",
  },
  {
    name: "Porter Same-Day Local",
    code: "PORTER",
    prefix: "PTR",
    hub: "Dumdum Local Fleet Depot",
    avgDeliveryDays: "Same-Day / Next-Day Delivery",
    agentPhone: "+91 98333 44556",
  },
];

/**
 * Dispatch notification payload structure sent to logistics partner API / Webhook
 */
export interface DispatchPayload {
  dispatchId: string;
  orderId: string;
  awbNumber: string;
  carrierName: string;
  carrierHub: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  pincode: string;
  itemCount: number;
  totalAmount: number;
  paymentType: string;
  timestamp: string;
  estimatedDeliveryDate: string;
}

/**
 * Automatically assign delivery partner and send dispatch notification upon successful order placement
 */
export async function notifyDeliveryPartner(order: Order): Promise<{
  success: boolean;
  deliveryPartnerInfo: DeliveryPartnerInfo;
  payload: DispatchPayload;
  message: string;
}> {
  // Select delivery partner based on pincode or default to Delhivery Express
  const isKolkataLocal = order.shippingAddress.pincode.startsWith("700");
  const carrier = isKolkataLocal ? DELIVERY_CARRIERS[0] : DELIVERY_CARRIERS[1];

  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const awbNumber = `${carrier.prefix}-KOL-${randomNum}`;
  
  // Calculate estimated delivery date (3 days from now)
  const estDate = new Date();
  estDate.setDate(estDate.getDate() + (isKolkataLocal ? 2 : 4));
  const estimatedDeliveryDate = estDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const dispatchedAt = new Date().toISOString();

  const deliveryPartnerInfo: DeliveryPartnerInfo = {
    carrier: carrier.name,
    awbNumber,
    hub: carrier.hub,
    status: "Pickup Requested",
    dispatchedAt,
    estimatedDeliveryDate,
    agentPhone: carrier.agentPhone,
    dispatchMessage: `Dispatch request #DSP-${randomNum} generated for ${carrier.name}. Delivery agent notified.`,
  };

  const fullAddress = `${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`;

  const payload: DispatchPayload = {
    dispatchId: `DSP-${randomNum}`,
    orderId: order.id,
    awbNumber,
    carrierName: carrier.name,
    carrierHub: carrier.hub,
    customerName: order.shippingAddress.fullName,
    customerPhone: order.shippingAddress.phone,
    deliveryAddress: fullAddress,
    city: order.shippingAddress.city,
    pincode: order.shippingAddress.pincode,
    itemCount: order.items.reduce((acc, item) => acc + item.quantity, 0),
    totalAmount: order.total,
    paymentType: order.paymentMethod === "COD" ? `COD (Collect ₹${order.total.toLocaleString("en-IN")})` : "Prepaid Online",
    timestamp: dispatchedAt,
    estimatedDeliveryDate,
  };

  // Simulate API Webhook Call to Logistics Partner
  try {
    console.log("🚚 [LOGISTICS DISPATCH API] Notifying Delivery Partner:", payload);
    
    // Save dispatch log to browser storage
    const existingLogs = JSON.parse(localStorage.getItem("rp_sports_dispatch_logs") || "[]");
    localStorage.setItem(
      "rp_sports_dispatch_logs",
      JSON.stringify([payload, ...existingLogs])
    );

    // Sync status to Firestore if enabled
    updateOrderStatusInDB(order.id, "Confirmed").catch((err) =>
      console.warn("Firestore order update notice:", err)
    );
  } catch (err) {
    console.warn("Delivery partner dispatch log notice:", err);
  }

  return {
    success: true,
    deliveryPartnerInfo,
    payload,
    message: `Delivery Partner '${carrier.name}' notified! AWB: ${awbNumber}`,
  };
}

/**
 * Generate formatted SMS / WhatsApp text sent to the logistics delivery partner agent
 */
export function generateLogisticsMessage(payload: DispatchPayload): string {
  return `📦 *RP SPORTS LOGISTICS PICKUP ALERT*
------------------------------
*Order ID:* ${payload.orderId}
*AWB No:* ${payload.awbNumber}
*Carrier:* ${payload.carrierName}
*Hub:* ${payload.carrierHub}

*Customer:* ${payload.customerName}
*Phone:* ${payload.customerPhone}
*Address:* ${payload.deliveryAddress}

*Items:* ${payload.itemCount} Units
*Total Value:* ₹${payload.totalAmount.toLocaleString("en-IN")}
*Payment Status:* ${payload.paymentType}
*Est Delivery:* ${payload.estimatedDeliveryDate}
------------------------------
RP Sports Dumdum Fulfillment Center`;
}
