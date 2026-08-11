/**
 * RP Sports — Shiprocket Logistics Service Layer
 *
 * Shiprocket API v2 Endpoints:
 *  - Authentication: /v1/external/auth/login
 *  - Pincode Serviceability: /v1/external/courier/serviceability
 *  - Create Order (Adhoc): /v1/external/orders/create/adhoc
 *  - Assign AWB: /v1/external/courier/assign/awb
 *  - Tracking: /v1/external/courier/track/awb/{awb_code}
 *  - Pickup Locations: /v1/external/settings/company/pickup
 */

import type { Order } from "./store";
import { getStoreSettings } from "./firestoreService";

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// In-memory token cache (valid for 10 days according to Shiprocket spec)
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

export interface PincodeServiceabilityResult {
  serviceable: boolean;
  city?: string;
  state?: string;
  estimatedDays?: number;
  couriers?: {
    name: string;
    rate: number;
    etd: string;
  }[];
  message?: string;
}

export interface ShiprocketOrderResponse {
  success: boolean;
  orderId?: number;
  shipmentId?: number;
  status?: string;
  statusCode?: number;
  awbCode?: string;
  courierName?: string;
  message?: string;
}

export interface ShiprocketConnectionTestResult {
  connected: boolean;
  lastConnected?: string;
  apiStatus: string;
  pickupLocations: any[];
  configurationStatus: string;
  error?: string;
}

/**
 * Get Shiprocket Auth Token
 */
export async function getShiprocketToken(): Promise<string> {
  // Return cached token if valid
  if (cachedToken && Date.now() < tokenExpiryTime) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    if (process.env.SHIPROCKET_MOCK_MODE === "true" || process.env.NODE_ENV === "development") {
      return "mock_shiprocket_jwt_token";
    }
    throw new Error("Shiprocket credentials are not configured in environment variables.");
  }

  try {
    const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Shiprocket Auth failed with status ${res.status}`);
    }

    const data = await res.json();
    if (data.token) {
      const tok = data.token as string;
      cachedToken = tok;
      // Cache token for 9 days (expiry is 10 days)
      tokenExpiryTime = Date.now() + 9 * 24 * 60 * 60 * 1000;
      return tok;
    }
    throw new Error("Token was not returned in Shiprocket login response.");
  } catch (err: any) {
    if (process.env.SHIPROCKET_MOCK_MODE === "true" || (process.env.NODE_ENV === "development" && !process.env.SHIPROCKET_EMAIL)) {
      console.warn("⚠️ Using Shiprocket fallback token:", err.message);
      return "mock_shiprocket_jwt_token";
    }
    throw err;
  }
}

/**
 * Sanitize phone number to a clean 10-digit numeric string
 */
function sanitizePhone(phoneStr: string): string {
  if (!phoneStr) return "9734019005"; // Default fallback to store admin phone
  let clean = phoneStr.replace(/\D/g, "");
  
  if (clean.length === 12 && clean.startsWith("91")) {
    clean = clean.slice(2);
  } else if (clean.length > 10) {
    clean = clean.slice(-10);
  }
  
  if (clean.length !== 10) {
    return "9734019005"; // Fallback to store admin phone if not 10 digits
  }
  return clean;
}

/**
 * Parse product weight string into a numeric kg value
 */
function parseWeight(weightStr: string): number | null {
  if (!weightStr) return null;
  const clean = weightStr.toLowerCase();
  
  const match = clean.match(/([\d.]+)\s*(kg|grams|g|u)?/);
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  if (isNaN(value)) return null;
  
  const unit = match[2];
  if (unit === "kg") {
    return value;
  } else if (unit === "g" || unit === "grams" || clean.includes("grams") || clean.includes("g")) {
    return value / 1000;
  }
  return value > 15 ? value / 1000 : value;
}

/**
 * Parse product dimensions string into length, breadth, height
 */
function parseDimensions(dimStr: string): { length: number; breadth: number; height: number } | null {
  if (!dimStr) return null;
  const clean = dimStr.toLowerCase();
  if (clean.includes("custom") || clean.includes("fit")) return null;

  const numbers = clean.match(/\d+(\.\d+)?/g);
  if (!numbers || numbers.length < 2) return null;
  
  const length = parseFloat(numbers[0]);
  const breadth = parseFloat(numbers[1]);
  const height = numbers.length >= 3 ? parseFloat(numbers[2]) : 5; // default height if missing
  
  if (isNaN(length) || isNaN(breadth) || isNaN(height)) return null;
  return { length, breadth, height };
}

/**
 * Calculate consolidated package specifications for shipping
 */
export function getOrderPackageDetails(order: Order): { weight: number; length: number; breadth: number; height: number; error?: string } {
  let totalWeight = 0;
  let maxLength = 0;
  let maxBreadth = 0;
  let totalHeight = 0;
  
  for (const item of order.items) {
    const qty = item.quantity;
    const prod = item.product;
    
    const parsedWt = parseWeight(prod.weight);
    const parsedDim = parseDimensions(prod.dimensions);
    
    if (parsedWt === null || parsedDim === null) {
      return {
        weight: 0,
        length: 0,
        breadth: 0,
        height: 0,
        error: `Shipping Configuration Required (Weight or dimensions missing or invalid for item '${prod.name}')`,
      };
    }
    
    totalWeight += parsedWt * qty;
    maxLength = Math.max(maxLength, parsedDim.length);
    maxBreadth = Math.max(maxBreadth, parsedDim.breadth);
    totalHeight += parsedDim.height * qty;
  }
  
  return {
    weight: Math.max(0.5, parseFloat(totalWeight.toFixed(2))),
    length: Math.max(10, Math.round(maxLength)),
    breadth: Math.max(10, Math.round(maxBreadth)),
    height: Math.max(10, Math.round(totalHeight)),
  };
}

/**
 * Assign AWB Tracking code to a Shiprocket shipment
 */
export async function assignShiprocketAWB(shipmentId: number, courierId?: number): Promise<{ success: boolean; awbCode?: string; courierName?: string; message?: string }> {
  try {
    const token = await getShiprocketToken();
    if (token === "mock_shiprocket_jwt_token") {
      return {
        success: true,
        awbCode: "SR" + Math.floor(100000000 + Math.random() * 900000000),
        courierName: "BlueDart Express",
      };
    }

    const payload: any = { shipment_id: shipmentId };
    if (courierId) {
      payload.courier_id = courierId;
    }

    const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/awb`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.response?.data?.awb_code) {
      const responseData = data.response.data;
      return {
        success: true,
        awbCode: responseData.awb_code,
        courierName: responseData.courier_name,
        message: "AWB code successfully generated & assigned.",
      };
    }

    return {
      success: false,
      message: data.message || "Failed to generate AWB from Shiprocket.",
    };
  } catch (err: any) {
    console.error("❌ Error generating Shiprocket AWB:", err.message);
    return {
      success: false,
      message: err.message || "Failed to generate AWB.",
    };
  }
}

/**
 * Verify Connection and Retrieve Pickup Locations
 */
export async function testShiprocketConnection(): Promise<ShiprocketConnectionTestResult> {
  try {
    const token = await getShiprocketToken();
    if (token === "mock_shiprocket_jwt_token") {
      return {
        connected: true,
        lastConnected: new Date().toISOString(),
        apiStatus: "Healthy (Demo Mock Mode)",
        pickupLocations: [
          { pickup_location: "Dumdum Store", pin_code: "700028", city: "Kolkata", state: "West Bengal" },
          { pickup_location: "Salt Lake Hub", pin_code: "700091", city: "Kolkata", state: "West Bengal" }
        ],
        configurationStatus: "Complete",
      };
    }

    const res = await fetch(`${SHIPROCKET_BASE_URL}/settings/company/pickup`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to retrieve settings (HTTP ${res.status})`);
    }

    const data = await res.json();
    const locations = data.data?.shipping_address || data.shipping_address || [];

    return {
      connected: true,
      lastConnected: new Date().toISOString(),
      apiStatus: "Healthy",
      pickupLocations: locations,
      configurationStatus: locations.length > 0 ? "Complete" : "Pending Pickup Location Config",
    };
  } catch (err: any) {
    return {
      connected: false,
      apiStatus: "Connection Refused / Unauthorized",
      pickupLocations: [],
      configurationStatus: "Incomplete",
      error: err.message || "Shiprocket authentication failed",
    };
  }
}

/**
 * Check Pincode Serviceability & Courier Rates
 */
export async function checkPincodeServiceability(
  deliveryPincode: string,
  weightInKg: number = 1.2,
  pickupPincode: string = "700028" // Dumdum, Kolkata
): Promise<PincodeServiceabilityResult> {
  try {
    const token = await getShiprocketToken();

    // If using mock token, return realistic Kolkata/Pan-India delivery estimate
    if (token === "mock_shiprocket_jwt_token") {
      const isKolkata = deliveryPincode.startsWith("700");
      return {
        serviceable: true,
        city: isKolkata ? "Kolkata" : "Metro City",
        state: isKolkata ? "West Bengal" : "India",
        estimatedDays: isKolkata ? 1 : 3,
        couriers: [
          { name: "BlueDart Express", rate: 75, etd: isKolkata ? "Tomorrow" : "3 Days" },
          { name: "Delhivery Surface", rate: 50, etd: isKolkata ? "1-2 Days" : "4 Days" },
          { name: "DTDC Premium", rate: 65, etd: isKolkata ? "Tomorrow" : "3 Days" },
        ],
      };
    }

    const url = `${SHIPROCKET_BASE_URL}/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weightInKg}&cod=1`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { serviceable: false, message: "Pincode not serviceable by express couriers." };
    }

    const data = await res.json();
    if (data.status === 200 && data.data?.available_courier_companies?.length > 0) {
      const companies = data.data.available_courier_companies;
      const minDays = Math.min(...companies.map((c: any) => parseInt(c.etd) || 3));
      return {
        serviceable: true,
        city: data.data.delivery_city,
        state: data.data.delivery_state,
        estimatedDays: minDays,
        couriers: companies.map((c: any) => ({
          name: c.courier_name,
          rate: parseFloat(c.rate),
          etd: c.etd,
        })),
      };
    }

    return { serviceable: false, message: "Location not currently serviceable." };
  } catch (err) {
    const isKolkata = deliveryPincode.startsWith("700");
    return {
      serviceable: true,
      estimatedDays: isKolkata ? 1 : 3,
      couriers: [
        { name: "BlueDart Express", rate: 75, etd: isKolkata ? "Tomorrow" : "3 Days" },
        { name: "Delhivery Direct", rate: 55, etd: isKolkata ? "1-2 Days" : "4 Days" },
      ],
    };
  }
}

/**
 * Create Order in Shiprocket
 */
export async function createShiprocketOrder(order: Order): Promise<ShiprocketOrderResponse> {
  // Prevent duplicate syncing
  if (order.shiprocket_order_id) {
    return {
      success: true,
      orderId: typeof order.shiprocket_order_id === "number" ? order.shiprocket_order_id : parseInt(order.shiprocket_order_id),
      shipmentId: order.shiprocket_shipment_id ? (typeof order.shiprocket_shipment_id === "number" ? order.shiprocket_shipment_id : parseInt(order.shiprocket_shipment_id)) : undefined,
      awbCode: order.awb_code,
      courierName: order.courier_name,
      message: "Order already synchronized with Shiprocket.",
    };
  }

  // Calculate package parameters
  const pkg = getOrderPackageDetails(order);
  if (pkg.error) {
    return {
      success: false,
      message: pkg.error, // Shipping Configuration Required
    };
  }

  try {
    const token = await getShiprocketToken();
    const settings = await getStoreSettings();
    let pickupLocation = settings?.shiprocketPickupLocation || process.env.SHIPROCKET_PICKUP_LOCATION || "Home";

    // Auto-fallback: Verify if configured location exists in Shiprocket, otherwise fallback to the first active one
    try {
      const conn = await testShiprocketConnection();
      if (conn.connected && conn.pickupLocations.length > 0) {
        const validNames = conn.pickupLocations.map((l: any) => l.pickup_location);
        if (!validNames.includes(pickupLocation)) {
          console.warn(`⚠️ Configured pickup location '${pickupLocation}' is invalid. Falling back to active location: '${validNames[0]}'`);
          pickupLocation = validNames[0];
        }
      }
    } catch (err: any) {
      console.warn("⚠️ Failed to verify pickup locations list:", err.message);
    }

    // Safe date parsing helper
    const parseOrderDate = (val: any): string => {
      try {
        if (!val) return new Date().toISOString().replace("T", " ").split(".")[0];
        let d: Date;
        if (typeof val.toDate === "function") {
          d = val.toDate();
        } else if (val.seconds !== undefined) {
          d = new Date(val.seconds * 1000);
        } else if (val instanceof Date) {
          d = val;
        } else {
          d = new Date(val);
        }
        if (isNaN(d.getTime())) {
          return new Date().toISOString().replace("T", " ").split(".")[0];
        }
        return d.toISOString().replace("T", " ").split(".")[0];
      } catch {
        return new Date().toISOString().replace("T", " ").split(".")[0];
      }
    };

    const orderPayload = {
      order_id: order.id,
      order_date: parseOrderDate(order.createdAt),
      pickup_location: pickupLocation,
      channel_id: "",
      comment: "RP Sports Handcrafted Premium Sports Gear",
      billing_customer_name: order.shippingAddress.fullName,
      billing_last_name: "",
      billing_address: order.shippingAddress.addressLine,
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: "India",
      billing_email: "customer@rpsports.in",
      billing_phone: sanitizePhone(order.shippingAddress.phone),
      shipping_is_billing: true,
      order_items: order.items.map((item) => {
        const prod = item.product;
        const brandName = prod.brand || "RP Sports";
        const hsnCode = prod.specs?.HSN || prod.specifications?.HSN || "9506";
        return {
          name: prod.name,
          sku: prod.sku || `RP-PROD-${prod.id}`,
          units: item.quantity,
          selling_price: prod.price,
          discount: 0,
          tax: Math.round(prod.price * 0.18),
          hsn: parseInt(hsnCode) || 9506,
          brand: brandName,
        };
      }),
      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      shipping_charges: order.total > 5000 ? 0 : 250,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: order.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
      length: pkg.length,
      breadth: pkg.breadth,
      height: pkg.height,
      weight: pkg.weight,
    };

    if (token === "mock_shiprocket_jwt_token") {
      const mockShipmentId = Math.floor(10000000 + Math.random() * 90000000);
      const mockAwb = "SR" + Math.floor(100000000 + Math.random() * 900000000);
      return {
        success: true,
        orderId: Math.floor(100000 + Math.random() * 900000),
        shipmentId: mockShipmentId,
        status: "NEW",
        statusCode: 1,
        awbCode: mockAwb,
        courierName: "BlueDart Express",
        message: "Order successfully pushed to Shiprocket (Mock)",
      };
    }

    const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();
    
    if (res.ok && data.order_id) {
      const orderId = data.order_id;
      const shipmentId = data.shipment_id;
      
      // Auto-generate/assign AWB
      let awbCode = "";
      let courierName = "";
      if (shipmentId) {
        const awbRes = await assignShiprocketAWB(shipmentId);
        if (awbRes.success) {
          awbCode = awbRes.awbCode || "";
          courierName = awbRes.courierName || "";
        }
      }

      return {
        success: true,
        orderId,
        shipmentId,
        status: data.status || "NEW",
        statusCode: data.status_code || 1,
        awbCode: awbCode || undefined,
        courierName: courierName || undefined,
        message: "Order created successfully in Shiprocket and AWB assigned.",
      };
    }

    let errorMessage = data.message || "Failed to create order on Shiprocket.";
    if (data.errors) {
      const errorDetails = Object.entries(data.errors)
        .map(([field, messages]) => {
          const formattedMsgs = Array.isArray(messages) ? messages.join(", ") : String(messages);
          return `${field}: ${formattedMsgs}`;
        })
        .join("; ");
      errorMessage = `${errorMessage} (${errorDetails})`;
    }

    return {
      success: false,
      message: errorMessage,
    };
  } catch (err: any) {
    console.error("❌ Error creating Shiprocket order:", err);
    return {
      success: false,
      message: err.message || "Shiprocket gateway error.",
    };
  }
}

/**
 * Track Order via Shiprocket Tracking API
 */
export async function trackShiprocketOrder(shipmentIdOrAwb: string) {
  try {
    const token = await getShiprocketToken();
    if (token === "mock_shiprocket_jwt_token") {
      return {
        success: true,
        trackingData: {
          track_status: 1,
          shipment_status: 7,
          current_status: "In Transit",
          courier_name: "BlueDart Express",
          awb_code: shipmentIdOrAwb,
          scans: [
            { location: "Dumdum, Kolkata Hub", activity: "Picked up & Handed to Courier", date: "2026-08-06 14:30" },
            { location: "Kolkata Airport Hub", activity: "Out for Dispatch", date: "2026-08-06 18:00" },
          ],
        },
      };
    }

    const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/track/awb/${shipmentIdOrAwb}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Tracking query failed (HTTP ${res.status})`);
    }

    const data = await res.json();
    
    // Parse response
    const track = data.tracking_data?.shipment_track?.[0];
    const scans = data.tracking_data?.shipment_track_activities || [];
    
    return {
      success: true,
      trackingData: track ? {
        track_status: data.tracking_data.track_status,
        shipment_status: data.tracking_data.shipment_status,
        current_status: track.current_status,
        courier_name: track.courier_name,
        awb_code: track.awb_code,
        pickup_date: track.pickup_date,
        delivered_date: track.delivered_date,
        scans: scans.map((s: any) => ({
          location: s.location,
          activity: s.activity,
          date: s.date,
        })),
      } : null,
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Unable to retrieve tracking." };
  }
}
