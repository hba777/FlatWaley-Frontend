'use client';

import { useEffect, useRef } from 'react';
import { RoomListing } from '@/lib/types';

interface InteractiveMapProps {
  listing: RoomListing;
  className?: string;
}

export function InteractiveMap({ listing, className = '' }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !listing.coordinates) return;

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = await import('leaflet');
      
      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Create map instance
      const map = L.map(mapRef.current!).setView(
        [listing.coordinates!.lat, listing.coordinates!.lng], 
        15
      );

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add marker for the listing
      const marker = L.marker([listing.coordinates!.lat, listing.coordinates!.lng])
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${listing.title}</h3>
            <p class="text-xs text-gray-600">${listing.location}</p>
            <p class="text-xs font-medium">$${listing.rent}/month</p>
          </div>
        `);

      // Open popup by default
      marker.openPopup();

      mapInstanceRef.current = map;
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listing]);

  if (!listing.coordinates) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">Map not available for this location</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute top-2 right-2 bg-card px-2 py-1 rounded shadow-sm text-xs text-muted-foreground border">
        Drag to explore • Scroll to zoom
      </div>
    </div>
  );
}
