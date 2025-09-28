"use client";

import { useEffect, useRef } from "react";
import { HousingMatch } from "@/services/userApi";

interface InteractiveMapProps {
  listing: HousingMatch;
  className?: string;
}

export function InteractiveMap({
  listing,
  className = "",
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (
      !mapRef.current ||
      listing.latitude == null ||
      listing.longitude == null
    )
      return;

    const initMap = async () => {
      const L = await import("leaflet");

      // Fix default marker icons for Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Create map instance
      const map = L.map(mapRef.current!).setView(
        [listing.latitude!, listing.longitude!],
        15
      );

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Add marker
      const marker = L.marker([listing.latitude!, listing.longitude!]).addTo(
        map
      ).bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${listing.city}, ${
        listing.area
      }</h3>
            <p class="text-xs text-gray-600">Rent: ${listing.monthly_rent_PKR.toLocaleString()} PKR/month</p>
          </div>
        `);
      marker.openPopup();

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listing]);

  if (listing.latitude == null || listing.longitude == null) {
    return (
      <div
        className={`bg-muted rounded-lg flex items-center justify-center ${className}`}
      >
        <p className="text-muted-foreground">
          Map not available for this location
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: "400px" }}
      />
      <div className="absolute top-2 right-2 bg-card px-2 py-1 rounded shadow-sm text-xs text-muted-foreground border">
        Drag to explore • Scroll to zoom
      </div>
    </div>
  );
}
