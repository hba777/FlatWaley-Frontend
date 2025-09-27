"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trash2,
  Home,
  BedDouble,
  BookOpen,
  CircleDollarSign,
  Sparkles,
  Users,
} from "lucide-react";
import { userApi, type UserProfileData } from "@/services/userApi";
import { cn } from "@/lib/utils";

const iconMap = {
  budget_PKR: CircleDollarSign,
  sleep_schedule: BedDouble,
  cleanliness: Sparkles,
  study_habits: BookOpen,
  noise_tolerance: Users,
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<UserProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const likedIds: string[] = await userApi.getLikedProfiles();
      const profiles: UserProfileData[] = await Promise.all(
        likedIds.map((id) => userApi.getUserProfileData(id))
      );
      setMatches(profiles);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleUnlike = async (profileId: string) => {
    try {
      await userApi.unlikeProfile(profileId);
      setMatches((prev) => prev.filter((m) => m.id !== profileId));
    } catch (error) {
      console.error("Failed to unlike profile:", error);
    }
  };

  if (loading)
    return <div className="text-center py-16">Loading matches...</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Your Matches</h1>
      <p className="text-muted-foreground mb-8">
        Explore your matches and find the perfect room together!
      </p>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matches.map((user) => (
            <Card
              key={user.id}
              className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-6 flex-1 flex flex-col items-center text-center">
                <Avatar className="w-28 h-28 mb-4">
                  <AvatarImage src={user.avatarUrl || ""} alt={user.city} />
                  <AvatarFallback>{user.city?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">
                  {user.city}, {user.area}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {user.bio || "No bio available"}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {Object.keys(iconMap).map((key) => {
                    const Icon = iconMap[key as keyof typeof iconMap];
                    const value = (user as any)[key] || "N/A";
                    return (
                      <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 cursor-default"
                        disabled
                      >
                        <Icon className="h-4 w-4" />
                        {value}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t flex gap-2">
                <Button className="flex-1" asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Find Home
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => handleUnlike(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold">No matches yet</h2>
          <p className="text-muted-foreground text-center">
            Keep swiping on the dashboard to find your perfect roommate.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Find Room
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
