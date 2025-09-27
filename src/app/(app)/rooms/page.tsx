import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Bath, BedDouble, DollarSign } from 'lucide-react';
import { roomListings } from '@/lib/data';

export default function RoomsPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">Room Hunter</h1>
        <p className="text-muted-foreground">Find your next home.</p>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full md:w-1/3 lg:w-1/4 p-4 border-r overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="city">City</Label>
              <Select>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="palo-alto">Palo Alto</SelectItem>
                  <SelectItem value="berkeley">Berkeley</SelectItem>
                  <SelectItem value="san-jose">San Jose</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Max Budget</Label>
              <Input id="budget" type="number" placeholder="e.g., 1500" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Amenities</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="laundry" />
                  <Label htmlFor="laundry" className="font-normal">In-unit laundry</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="parking" />
                  <Label htmlFor="parking" className="font-normal">Parking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="furnished" />
                  <Label htmlFor="furnished" className="font-normal">Furnished</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="pets" />
                  <Label htmlFor="pets" className="font-normal">Pet friendly</Label>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {roomListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{listing.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    {listing.location}
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <DollarSign className="mr-2 h-4 w-4" />
                    ${listing.rent}/month
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <BedDouble className="mr-2 h-4 w-4" />
                    {listing.availableRooms} room(s) available
                  </div>
                   <div className="flex flex-wrap gap-2 pt-2">
                    {listing.amenities.slice(0, 3).map(amenity => (
                        <Badge key={amenity} variant="secondary">{amenity}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                    <Link href={`/rooms/${listing.id}`} className="w-full">
                        <Button className="w-full">View Details</Button>
                    </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
