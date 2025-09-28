"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  BedDouble,
  Phone,
  MessageCircle,
  Heart,
  Share2,
} from "lucide-react";
import { InteractiveMap } from "./interactive-map";
import { UserProfileData, HousingMatch } from "@/services/userApi";

interface ListingDetailsProps {
  listing: HousingMatch;
  profileA?: UserProfileData | null;
  profileB?: UserProfileData | null;
}

export function ListingDetails({ listing, profileA, profileB }: ListingDetailsProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBack = () => router.back();
  const handleWhatsApp = () => {
    // Create detailed message with match and listing information
    let message = "Hi — I'm interested in this room.\n\n";
    
    // Add listing details
    message += `🏠 *Property Details:*\n`;
    message += `📍 Location: ${listing.city}, ${listing.area}\n`;
    message += `💰 Rent: ${listing.monthly_rent_PKR.toLocaleString()} PKR/month\n`;
    message += `🛏️ Rooms Available: ${listing.rooms_available}\n`;
    message += `✅ Amenities: ${listing.amenities.join(', ')}\n\n`;
    
    // Add match details if available
    if (profileA && profileB) {
      message += `👥 *Roommate Match Details:*\n`;
      message += `👤 Profile A: ${profileA.city}, ${profileA.area} (Budget: ${profileA.budget_PKR.toLocaleString()} PKR)\n`;
      message += `👤 Profile B: ${profileB.city}, ${profileB.area} (Budget: ${profileB.budget_PKR.toLocaleString()} PKR)\n`;
      
      if (profileA.sleep_schedule) message += `🌙 Sleep Schedule: ${profileA.sleep_schedule}\n`;
      if (profileA.cleanliness) message += `🧹 Cleanliness: ${profileA.cleanliness}\n`;
      if (profileA.study_habits) message += `📚 Study Habits: ${profileA.study_habits}\n`;
      if (profileA.food_pref) message += `🍽️ Food Preference: ${profileA.food_pref}\n`;
    }
    
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/923345098296?text=${encodedMsg}`, '_blank');
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${listing.city}, ${listing.area}`,
        text: `Room in ${listing.city}, ${listing.area} - ${listing.monthly_rent_PKR.toLocaleString()} PKR/month`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6 order-1">

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rent & Rooms */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rent</p>
                    <p className="font-semibold text-card-foreground">
                      {listing.monthly_rent_PKR.toLocaleString()} PKR/month
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BedDouble className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rooms</p>
                    <p className="font-semibold text-card-foreground">
                      {listing.rooms_available}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <h3 className="font-semibold mb-2 text-card-foreground">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="text-sm"
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map & Contact */}
        <div className="lg:col-span-3 space-y-6 order-2">
          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Landlord</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={handleWhatsApp}>
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp Call
              </Button>
              <Button variant="outline" className="w-full" onClick={handleWhatsApp}>
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Message
              </Button>
            </CardContent>
          </Card>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {listing.city}, {listing.area}
                </span>
              </div>
              <InteractiveMap
                listing={listing}
                className="h-64 w-full rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
