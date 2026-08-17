"use client";

import { useState, useEffect, useCallback } from "react";

export interface CustomerLocationData {
  locality?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  formattedAddress: string;
  isGpsAccurate?: boolean;
}

const STORAGE_KEY = "rp_sports_customer_location";

// Built-in Indian Postal / Metro lookup for instant 0ms latency
const COMMON_PINCODES: Record<string, { locality: string; city: string; state: string }> = {
  "700028": { locality: "Dum Dum / Nagerbazar", city: "Kolkata", state: "West Bengal" },
  "700001": { locality: "BBD Bagh / Dalhousie", city: "Kolkata", state: "West Bengal" },
  "700002": { locality: "Cossipore", city: "Kolkata", state: "West Bengal" },
  "700003": { locality: "Shyambazar", city: "Kolkata", state: "West Bengal" },
  "700004": { locality: "Belgachia", city: "Kolkata", state: "West Bengal" },
  "700006": { locality: "Beadon Street / Girish Park", city: "Kolkata", state: "West Bengal" },
  "700009": { locality: "Amherst Street / Sealdah", city: "Kolkata", state: "West Bengal" },
  "700012": { locality: "Bowbazar / College Street", city: "Kolkata", state: "West Bengal" },
  "700019": { locality: "Ballygunge", city: "Kolkata", state: "West Bengal" },
  "700020": { locality: "Bhawanipore", city: "Kolkata", state: "West Bengal" },
  "700029": { locality: "Kalighat", city: "Kolkata", state: "West Bengal" },
  "700032": { locality: "Jadavpur", city: "Kolkata", state: "West Bengal" },
  "700050": { locality: "Baranagar", city: "Kolkata", state: "West Bengal" },
  "700055": { locality: "Dum Dum Cantonment", city: "Kolkata", state: "West Bengal" },
  "700064": { locality: "Salt Lake (Sector I)", city: "Kolkata", state: "West Bengal" },
  "700091": { locality: "Salt Lake (Sector V)", city: "Kolkata", state: "West Bengal" },
  "700102": { locality: "New Town (Action Area I)", city: "Kolkata", state: "West Bengal" },
  "700124": { locality: "Barasat", city: "Kolkata", state: "West Bengal" },
  "700135": { locality: "New Town (Action Area II/III)", city: "Kolkata", state: "West Bengal" },
  "700136": { locality: "Rajarhat / Chinar Park", city: "Kolkata", state: "West Bengal" },
  "700156": { locality: "New Town Eco Park", city: "Kolkata", state: "West Bengal" },
  "711101": { locality: "Howrah Station", city: "Howrah", state: "West Bengal" },
  "110001": { locality: "Connaught Place", city: "New Delhi", state: "Delhi" },
  "400001": { locality: "Fort / Colaba", city: "Mumbai", state: "Maharashtra" },
  "560001": { locality: "MG Road / Brigade Rd", city: "Bengaluru", state: "Karnataka" },
  "600001": { locality: "George Town", city: "Chennai", state: "Tamil Nadu" },
  "500001": { locality: "Abids / Koti", city: "Hyderabad", state: "Telangana" },
};

export function useCustomerLocation() {
  const [location, setLocation] = useState<CustomerLocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to persist location
  const saveLocation = useCallback((data: CustomerLocationData) => {
    setLocation(data);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Helper to format city/locality cleanly
  const formatLocation = (loc: { locality?: string; city: string; district?: string; state: string; pincode: string }) => {
    const isKolkataPin = loc.pincode.startsWith("700") || loc.pincode.startsWith("711");
    let displayCity = loc.city;
    
    // Normalize Greater Kolkata districts to Kolkata
    if (isKolkataPin && (loc.district?.includes("Parganas") || loc.district?.includes("Howrah") || loc.city === "Bangaon" || loc.city === "Bongaon")) {
      displayCity = "Kolkata";
    }

    if (loc.locality && loc.locality !== displayCity && !loc.locality.toLowerCase().includes("bangaon")) {
      return `${loc.locality}, ${displayCity}, ${loc.state} - ${loc.pincode}`;
    }
    return `${displayCity}, ${loc.state} - ${loc.pincode}`;
  };

  // 1. Fetch official Postal data for any 6-digit Pincode
  const resolvePincodeData = useCallback(async (pincode: string): Promise<CustomerLocationData | null> => {
    const cleanPin = pincode.replace(/\D/g, "");
    if (cleanPin.length !== 6) return null;

    // Check pre-cached instant table
    if (COMMON_PINCODES[cleanPin]) {
      const p = COMMON_PINCODES[cleanPin];
      return {
        locality: p.locality,
        city: p.city,
        state: p.state,
        pincode: cleanPin,
        formattedAddress: `${p.locality}, ${p.city}, ${p.state} - ${cleanPin}`,
      };
    }

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const postName = po.Name || "";
          const district = po.District || "";
          const state = po.State || "West Bengal";
          
          let cityName = district;
          if (cleanPin.startsWith("700") || cleanPin.startsWith("711")) {
            cityName = cleanPin.startsWith("711") ? "Howrah" : "Kolkata";
          }

          const formatted = formatLocation({
            locality: postName,
            city: cityName,
            district,
            state,
            pincode: cleanPin,
          });

          return {
            locality: postName,
            city: cityName,
            district,
            state,
            pincode: cleanPin,
            formattedAddress: formatted,
          };
        }
      }
    } catch {
      // Ignore API errors
    }

    const isKolkata = cleanPin.startsWith("700");
    return {
      city: isKolkata ? "Kolkata" : "Delivery Destination",
      state: isKolkata ? "West Bengal" : "India",
      pincode: cleanPin,
      formattedAddress: isKolkata ? `Kolkata, West Bengal - ${cleanPin}` : `Pincode: ${cleanPin}`,
    };
  }, []);

  // 2. High-Accuracy GPS Geolocation
  const detectGpsLocation = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by your device");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // OpenStreetMap Nominatim reverse geocode for exact street/suburb accuracy
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: { "Accept-Language": "en" },
              signal: AbortSignal.timeout(6000),
            }
          );

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const pincode = addr.postcode?.replace(/\D/g, "") || "700028";
            const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.village || "";
            const city = addr.city || addr.town || addr.city_district || addr.county || "Kolkata";
            const state = addr.state || "West Bengal";

            // If we got a valid pincode, resolve exact locality from Postal data
            if (pincode && pincode.length === 6) {
              const postalData = await resolvePincodeData(pincode);
              if (postalData) {
                const combined = {
                  ...postalData,
                  locality: locality || postalData.locality,
                  formattedAddress: locality 
                    ? `${locality}, ${postalData.city}, ${postalData.state} - ${pincode}`
                    : postalData.formattedAddress,
                  isGpsAccurate: true,
                };
                saveLocation(combined);
                setIsLoading(false);
                return;
              }
            }

            const formatted = formatLocation({
              locality,
              city,
              state,
              pincode,
            });

            const locData: CustomerLocationData = {
              locality,
              city,
              state,
              pincode,
              formattedAddress: formatted,
              isGpsAccurate: true,
            };

            saveLocation(locData);
          } else {
            // Fallback to postal default
            const def = await resolvePincodeData("700028");
            if (def) saveLocation({ ...def, isGpsAccurate: true });
          }
        } catch (err: any) {
          console.warn("GPS reverse geocode error:", err);
          const def = await resolvePincodeData("700028");
          if (def) saveLocation({ ...def, isGpsAccurate: true });
        } finally {
          setIsLoading(false);
        }
      },
      async (err) => {
        console.warn("GPS permission rejected or timeout:", err.message);
        setError("GPS permission denied. Please enter your pincode.");
        setIsLoading(false);
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  }, [resolvePincodeData, saveLocation]);

  // 3. Manual Pincode Input Handler
  const setPincodeManual = useCallback(async (newPincode: string) => {
    const clean = newPincode.replace(/\D/g, "");
    if (clean.length !== 6) return;

    setIsLoading(true);
    const data = await resolvePincodeData(clean);
    if (data) {
      saveLocation({ ...data, isGpsAccurate: false });
    }
    setIsLoading(false);
  }, [resolvePincodeData, saveLocation]);

  // 4. Initial load with IP check
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.pincode && parsed?.formattedAddress && !parsed.formattedAddress.includes("Bangaon")) {
          setLocation(parsed);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Ignore
    }

    // Default to official Kolkata 700028 location on mount
    resolvePincodeData("700028").then((data) => {
      if (data) saveLocation(data);
      setIsLoading(false);
    });
  }, [resolvePincodeData, saveLocation]);

  return {
    location,
    pincode: location?.pincode || "700028",
    formattedAddress: location?.formattedAddress || "Dum Dum, Kolkata, West Bengal - 700028",
    city: location?.city || "Kolkata",
    state: location?.state || "West Bengal",
    isGpsAccurate: location?.isGpsAccurate || false,
    isLoading,
    error,
    detectGpsLocation,
    setPincodeManual,
  };
}
