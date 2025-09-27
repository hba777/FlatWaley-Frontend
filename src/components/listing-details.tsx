'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Bath, 
  Square, 
  Calendar,
  Phone,
  MessageCircle,
  Heart,
  Share2
} from 'lucide-react';
import { RoomListing } from '@/lib/types';
import { InteractiveMap } from './interactive-map';

interface ListingDetailsProps {
  listing: RoomListing;
}

export function ListingDetails({ listing }: ListingDetailsProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleContact = () => {
    // TODO: Implement contact functionality
    console.log('Contact landlord for listing:', listing.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-card-foreground">{listing.title}</h1>
                <p className="text-sm text-muted-foreground">{listing.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 w-full">
                  <Image
                    src={listing.images[selectedImageIndex]}
                    alt={listing.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  {listing.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 flex space-x-2">
                      {listing.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rent</p>
                      <p className="font-semibold text-card-foreground">${listing.rent}/month</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BedDouble className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rooms</p>
                      <p className="font-semibold text-card-foreground">{listing.availableRooms}</p>
                    </div>
                  </div>
                  {listing.size && (
                    <div className="flex items-center space-x-2">
                      <Square className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Size</p>
                        <p className="font-semibold text-card-foreground">{listing.size}</p>
                      </div>
                    </div>
                  )}
                  {listing.deposit && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Deposit</p>
                        <p className="font-semibold text-card-foreground">${listing.deposit}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {listing.description && (
                  <div>
                    <h3 className="font-semibold mb-2 text-card-foreground">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-sm">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
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

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.location}</span>
                  </div>
                  <InteractiveMap 
                    listing={listing} 
                    className="h-64 w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {listing.propertyType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-card-foreground">{listing.propertyType}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-medium text-card-foreground">{listing.availableRooms} room(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rent</span>
                  <span className="font-medium text-card-foreground">${listing.rent}/month</span>
                </div>
                {listing.deposit && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit</span>
                    <span className="font-medium text-card-foreground">${listing.deposit}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
