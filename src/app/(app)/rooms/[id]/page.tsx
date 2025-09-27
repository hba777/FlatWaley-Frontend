import { notFound } from 'next/navigation';
import { roomListings } from '@/lib/data';
import { ListingDetails } from '@/components/listing-details';

interface ListingPageProps {
  params: {
    id: string;
  };
}

export default function ListingPage({ params }: ListingPageProps) {
  const listingId = parseInt(params.id);
  const listing = roomListings.find(l => l.id === listingId);

  if (!listing) {
    notFound();
  }

  return <ListingDetails listing={listing} />;
}

export function generateStaticParams() {
  return roomListings.map((listing) => ({
    id: listing.id.toString(),
  }));
}
