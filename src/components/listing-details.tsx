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
import { RoomListing } from "@/lib/types";
import { InteractiveMap } from "./interactive-map";

interface ListingDetailsProps {
  listing: RoomListing;
}

export function ListingDetails({ listing }: ListingDetailsProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBack = () => router.back();
  const handleContact = () => console.log("Contact landlord:", listing.id);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
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
          {/* Image Gallery */}
          {listing.images?.length > 0 && (
            <Card>
              <CardContent className="p-0 relative h-96">
                <Image
                  src={listing.images[selectedImageIndex]}
                  alt={listing.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                {listing.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    {listing.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-3 h-3 rounded-full ${
                          selectedImageIndex === idx
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
              <Button className="w-full" onClick={handleContact}>
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
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
