// src/app/rooms/details/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { ListingDetails } from "@/components/listing-details";
import { HousingMatch } from "@/lib/types";

export default function RoomDetailPage() {
  const searchParams = useSearchParams();
  const listingParam = searchParams.get("listing");

  if (!listingParam) {
    return <div className="text-center py-16">No listing data provided</div>;
  }

  const listing: HousingMatch = JSON.parse(decodeURIComponent(listingParam));

  return <ListingDetails listing={listing} />;
}
