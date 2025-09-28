// src/app/rooms/details/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { ListingDetails } from "@/components/listing-details";
import { HousingMatch } from "@/services/userApi";
import { UserProfileData } from "@/services/userApi";

interface CombinedData {
  listing: HousingMatch;
  profileA: UserProfileData | null;
  profileB: UserProfileData | null;
}

export default function RoomDetailPage() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");

  if (!dataParam) {
    return <div className="text-center py-16">No data provided</div>;
  }

  const combinedData: CombinedData = JSON.parse(decodeURIComponent(dataParam));

  return <ListingDetails 
    listing={combinedData.listing} 
    profileA={combinedData.profileA}
    profileB={combinedData.profileB}
  />;
}
