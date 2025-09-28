"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, DollarSign } from "lucide-react";
import { userApi, type UserProfileData } from "@/services/userApi";
import { HousingMatch } from "@/services/userApi";

export default function RoomsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [matches, setMatches] = useState<HousingMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const profileAParam = searchParams.get("profileA");
      const profileBParam = searchParams.get("profileB");

      if (!profileAParam || !profileBParam) return;

      try {
        setLoading(true);

        const profileA: UserProfileData = JSON.parse(
          decodeURIComponent(profileAParam)
        );
        const profileB: UserProfileData = JSON.parse(
          decodeURIComponent(profileBParam)
        );

        const results: HousingMatch[] = await userApi.findHousingMatches({
          profileA,
          profileB,
          top_n: 10,
        });

        setMatches(results);
      } catch (error) {
        console.error("Failed to fetch housing matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [searchParams]);

  const handleViewDetails = (listing: HousingMatch) => {
    // Get profile data from URL params
    const profileAParam = searchParams.get("profileA");
    const profileBParam = searchParams.get("profileB");
    
    const profileA: UserProfileData = profileAParam ? JSON.parse(decodeURIComponent(profileAParam)) : null;
    const profileB: UserProfileData = profileBParam ? JSON.parse(decodeURIComponent(profileBParam)) : null;
    
    // Create combined data object
    const combinedData = {
      listing,
      profileA,
      profileB
    };
    
    console.log("Sending combined data:", combinedData);
    const serialized = encodeURIComponent(JSON.stringify(combinedData));
    router.push(`/rooms/details?data=${serialized}`);
  };

  if (loading) return <div className="text-center py-16">Loading rooms...</div>;

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">Flat Pakro</h1>
        <p className="text-xl italic font-serif text-muted-foreground  mb-8">
          Explore your top housing matches.
        </p>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        {matches.length === 0 ? (
          <div className="text-center py-16">No matches found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Card
                key={match.listing_id}
                className="overflow-hidden cursor-pointer"
                onClick={() => handleViewDetails(match)}
              >
                <CardHeader>
                  <CardTitle>
                    {match.city}, {match.area}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    {match.city}, {match.area}
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <DollarSign className="mr-2 h-4 w-4" />
                    {match.monthly_rent_PKR.toLocaleString()} PKR/month
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <BedDouble className="mr-2 h-4 w-4" />
                    {match.rooms_available} room(s)
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {match.amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleViewDetails(match)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
