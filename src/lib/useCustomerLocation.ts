"use client";

import { useState, useEffect, useCallback } from "react";

export interface CustomerLocationData {
  locality?: string;
  city: string;
  state: string;
  pincode: string;
  formattedAddress: string;
  isGpsAccurate?: boolean;
}

const STORAGE_KEY = "rp_sports_customer_location";

export function useCustomerLocation() {
  const [location, setLocation] = useState<CustomerLocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to save and update state
  const saveLocation = useCallback((data: CustomerLocationData) => {
    setLocation(data);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // 1. IP-Based Auto Detection (Instant & No-Permission)
  const detectByIp = useCallback(async () => {
    try {
      // Try free reverse client geocoder
      const res = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client", {
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || "Kolkata";
        const state = data.principalSubdivision || "West Bengal";
        const pincode = data.postcode || "700028";
        const locality = data.locality || "";

        const formatted = locality && locality !== city
          ? `${locality}, ${city}, ${state} - ${pincode}`
          : `${city}, ${state} - ${pincode}`;

        const locData: CustomerLocationData = {
          locality,
          city,
          state,
          pincode,
          formattedAddress: formatted,
          isGpsAccurate: false,
        };

        saveLocation(locData);
        return locData;
      }
    } catch {
      // Fallback to IPAPI if BigDataCloud fails
      try {
        const res2 = await fetch("https://ipapi.co/json/", {
          signal: AbortSignal.timeout(3000),
        });
        if (res2.ok) {
          const data2 = await res2.json();
          const city = data2.city || "Kolkata";
          const state = data2.region || "West Bengal";
          const pincode = data2.postal || "700028";

          const locData: CustomerLocationData = {
            city,
            state,
            pincode,
            formattedAddress: `${city}, ${state} - ${pincode}`,
            isGpsAccurate: false,
          };
          saveLocation(locData);
          return locData;
        }
      } catch {
        // Safe default
      }
    }

    // Default fallback
    const fallback: CustomerLocationData = {
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700028",
      formattedAddress: "Kolkata, West Bengal - 700028",
      isGpsAccurate: false,
    };
    saveLocation(fallback);
    return fallback;
  }, [saveLocation]);

  // 2. High-Accuracy GPS Detection (Triggered by user click)
  const detectGpsLocation = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocode lat/lng
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            { signal: AbortSignal.timeout(5000) }
          );

          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || "Kolkata";
            const state = data.principalSubdivision || "West Bengal";
            const pincode = data.postcode || "700028";
            const locality = data.locality || "";

            const formatted = locality && locality !== city
              ? `${locality}, ${city}, ${state} - ${pincode}`
              : `${city}, ${state} - ${pincode}`;

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
            await detectByIp();
          }
        } catch {
          await detectByIp();
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.warn("GPS Geolocation error:", err.message);
        // If GPS permission denied or timed out, fallback gracefully to IP
        detectByIp().finally(() => setIsLoading(false));
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [detectByIp, saveLocation]);

  // 3. Set Manual Pincode / City Lookup
  const setPincodeManual = useCallback(async (newPincode: string) => {
    const clean = newPincode.replace(/\D/g, "");
    if (clean.length !== 6) return;

    setIsLoading(true);
    try {
      // Indian Postal API lookup
      const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`, {
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const city = po.District || po.Division || po.Block || "India";
          const state = po.State || "";
          const locality = po.Name || "";

          const formatted = locality && locality !== city
            ? `${locality}, ${city}, ${state} - ${clean}`
            : `${city}, ${state} - ${clean}`;

          const locData: CustomerLocationData = {
            locality,
            city,
            state,
            pincode: clean,
            formattedAddress: formatted,
            isGpsAccurate: false,
          };
          saveLocation(locData);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Fallback if API is offline
    const isKolkata = clean.startsWith("700");
    const locData: CustomerLocationData = {
      city: isKolkata ? "Kolkata" : "Delivery Destination",
      state: isKolkata ? "West Bengal" : "India",
      pincode: clean,
      formattedAddress: isKolkata ? `Kolkata, West Bengal - ${clean}` : `Pincode: ${clean}`,
      isGpsAccurate: false,
    };
    saveLocation(locData);
    setIsLoading(false);
  }, [saveLocation]);

  // Initial load
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.pincode && parsed?.formattedAddress) {
          setLocation(parsed);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Ignore parse error
    }

    // Otherwise detect via IP automatically
    detectByIp().finally(() => setIsLoading(false));
  }, [detectByIp]);

  return {
    location,
    pincode: location?.pincode || "700028",
    formattedAddress: location?.formattedAddress || "Kolkata, West Bengal - 700028",
    city: location?.city || "Kolkata",
    state: location?.state || "West Bengal",
    isGpsAccurate: location?.isGpsAccurate || false,
    isLoading,
    error,
    detectGpsLocation,
    setPincodeManual,
  };
}
