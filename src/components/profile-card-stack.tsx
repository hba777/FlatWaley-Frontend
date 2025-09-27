"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from 'react';
import {
  BedDouble,
  BookOpen,
  CircleDollarSign,
  Sparkles,
  Users,
  X,
  Heart,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CompatibilityExplainer } from "./compatibility-explainer";
import { matcherApi, type MatchResult } from '@/services/matcherApi';
import { userApi, type UserProfileData } from '@/services/userApi';
import { useUser } from "@/context/UserContext";
import type { UserProfile, CompatibilityAspect } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap = {
  budget: CircleDollarSign,
  sleepSchedule: BedDouble,
  cleanliness: Sparkles,
  studyHabits: BookOpen,
  socialHabits: Users,
};

// Convert MatchResult to UserProfile for compatibility with existing UI
function convertMatchToUserProfile(match: MatchResult): UserProfile {
  return {
    id: parseInt(match.profile_id.slice(-4), 16) || Math.random() * 1000, // Convert string ID to number
    name: `User ${match.profile_id.slice(-4)}`, // Generate a name from ID
    age: 22, // Default age
    university: 'University', // Default university
    bio: "Looking for a compatible roommate!",
    avatarUrl: '', // No avatar
    preferences: {
      budget: 'Flexible', // Default budget
      sleepSchedule: 'Flexible',
      cleanliness: 'Average',
      studyHabits: 'Library',
      socialHabits: 'Moderate',
    },
    profile_id: match.profile_id, // Store original profile_id without slicing
  };
}

// Create compatibility aspects from match data
function createCompatibilityAspects(match: MatchResult, currentUser: any, profileData?: any): CompatibilityAspect[] {
  const aspects: CompatibilityAspect[] = [];
  
  // Map reasons to compatibility aspects
  match.reasons.forEach(reason => {
    if (reason.toLowerCase().includes('budget')) {
      aspects.push({
        aspect: 'Budget',
        user1Value: currentUser?.profileData?.budget_PKR ? `${currentUser.profileData.budget_PKR} PKR` : 'Your budget',
        user2Value: profileData?.budget_PKR ? `${profileData.budget_PKR} PKR` : 'Similar budget',
        match: 'strong'
      });
    }
    if (reason.toLowerCase().includes('sleep')) {
      aspects.push({
        aspect: 'Sleep Schedule',
        user1Value: currentUser?.profileData?.sleep_schedule || 'Your schedule',
        user2Value: profileData?.sleep_schedule || 'Compatible schedule',
        match: 'strong'
      });
    }
    if (reason.toLowerCase().includes('cleanliness')) {
      aspects.push({
        aspect: 'Cleanliness',
        user1Value: currentUser?.profileData?.cleanliness || 'Your preference',
        user2Value: profileData?.cleanliness || 'Compatible preference',
        match: 'strong'
      });
    }
    if (reason.toLowerCase().includes('noise')) {
      aspects.push({
        aspect: 'Social Habits',
        user1Value: currentUser?.profileData?.noise_tolerance || 'Your tolerance',
        user2Value: profileData?.noise_tolerance || 'Compatible tolerance',
        match: 'strong'
      });
    }
    if (reason.toLowerCase().includes('study')) {
      aspects.push({
        aspect: 'Study Habits',
        user1Value: currentUser?.profileData?.study_habits || 'Your habits',
        user2Value: profileData?.study_habits || 'Compatible habits',
        match: 'strong'
      });
    }
  });
  
  return aspects;
}

function calculateCompatibility(user1: UserProfile, user2: UserProfile): { score: number, aspects: CompatibilityAspect[] } {
    const aspects: CompatibilityAspect[] = [];
    let score = 100;

  const budget1 = parseInt(
    user1.preferences.budget.split("-")[0].replace("$", "")
  );
  const budget2 = parseInt(
    user2.preferences.budget.split("-")[0].replace("$", "")
  );
  const budgetDiff = Math.abs(budget1 - budget2);

  let budgetMatch: "strong" | "partial" | "conflict" = "strong";
  if (budgetDiff > 400) {
    score -= 25;
    budgetMatch = "conflict";
  } else if (budgetDiff > 0) {
    score -= 10;
    budgetMatch = "partial";
  }
  aspects.push({
    aspect: "Budget",
    user1Value: user1.preferences.budget,
    user2Value: user2.preferences.budget,
    match: budgetMatch,
  });

  let sleepMatch: "strong" | "partial" | "conflict" = "strong";
  if (
    user1.preferences.sleepSchedule !== user2.preferences.sleepSchedule &&
    user1.preferences.sleepSchedule !== "Flexible" &&
    user2.preferences.sleepSchedule !== "Flexible"
  ) {
    score -= 20;
    sleepMatch = "conflict";
  } else if (
    user1.preferences.sleepSchedule !== user2.preferences.sleepSchedule
  ) {
    score -= 5;
    sleepMatch = "partial";
  }
  aspects.push({
    aspect: "Sleep Schedule",
    user1Value: user1.preferences.sleepSchedule,
    user2Value: user2.preferences.sleepSchedule,
    match: sleepMatch,
  });

    const cleanlinessLevels: Record<string, number> = {'Very Tidy': 3, 'Moderately Tidy': 2, 'Relaxed': 1};
    const cleanDiff = Math.abs((cleanlinessLevels[user1.preferences.cleanliness] || 2) - (cleanlinessLevels[user2.preferences.cleanliness] || 2));
    let cleanMatch: 'strong' | 'partial' | 'conflict' = 'strong';
    if (cleanDiff > 1) {
        score -= 25;
        cleanMatch = 'conflict';
    } else if (cleanDiff === 1) {
        score -= 10;
        cleanMatch = 'partial';
    }
     aspects.push({ aspect: 'Cleanliness', user1Value: user1.preferences.cleanliness, user2Value: user2.preferences.cleanliness, match: cleanMatch });

  return { score: Math.max(0, score), aspects };
}

export function ProfileCardStack() {
  const { user: currentUser } = useUser();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [action, setAction] = useState<'like' | 'dislike' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentMatchProfileData, setCurrentMatchProfileData] = useState<UserProfileData | null>(null);

  const currentProfile = profiles[currentIndex];
  const currentMatch = matches[currentIndex];

  // Load matches on component mount
  useEffect(() => {
    loadMatches();
  }, []);

  // Fetch profile data for current match when it changes
  useEffect(() => {
    if (currentMatch) {
      const fetchCurrentMatchProfile = async () => {
        try {
          const profileData = await userApi.getUserProfileData(currentMatch.profile_id);
          setCurrentMatchProfileData(profileData);
        } catch (error) {
          console.error('Failed to fetch profile data:', error);
          setCurrentMatchProfileData(null);
        }
      };
      fetchCurrentMatchProfile();
    } else {
      setCurrentMatchProfileData(null);
    }
  }, [currentMatch]);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const newMatches = await matcherApi.getBestMatches(10);
      setMatches(newMatches);
      setProfiles(newMatches.map(convertMatchToUserProfile));
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadMatches();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAction = async (newAction: 'like' | 'dislike') => {
    setAction(newAction);
    
    // Always fetch the profile data for the current match to show in compatibility explainer
    if (currentMatch) {
      try {
        const profileData = await userApi.getUserProfileData(currentMatch.profile_id);
        setCurrentMatchProfileData(profileData);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        setCurrentMatchProfileData(null);
      }
    }
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setAction(null);
      setDragOffset({ x: 0, y: 0 });
    }, 500);
  };

  // Drag handlers for swipe functionality
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStart) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStart.x;
    const deltaY = Math.abs(deltaX) > 50 ? 0 : (clientX - dragStart.x) * 0.1; // Slight vertical movement
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!dragStart) return;
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      handleAction(dragOffset.x > 0 ? 'like' : 'dislike');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    setDragStart(null);
  };

  const matchData = useMemo(() => {
    if (!currentProfile || !currentMatch) return null;
    
    return {
      user: currentProfile,
      compatibilityScore: currentMatch.score,
      compatibilityAspects: createCompatibilityAspects(currentMatch, currentUser, currentMatchProfileData),
      profileData: currentMatchProfileData || undefined
    };
  }, [currentProfile, currentMatch, currentUser, currentMatchProfileData]);


  // Loading state
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Finding your matches...</h2>
        <p className="text-muted-foreground mt-2">We're analyzing profiles to find the best roommates for you!</p>
      </div>
    );
  }

  // Empty state - no more profiles
  if (currentIndex >= profiles.length) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold">No more profiles</h2>
        <p className="text-muted-foreground mt-2 mb-6">You've seen all available matches! Check back later for new potential roommates.</p>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Finding more matches...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Find More Matches
            </>
          )}
        </Button>
      </div>
    );
  }

  // No current profile or match data
  if (!currentProfile || !matchData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold">No profiles available</h2>
        <p className="text-muted-foreground mt-2">Unable to load matches at the moment.</p>
      </div>
    );
  }

  const getCardStatus = (index: number) => {
    if (index < currentIndex) return "gone";
    if (index === currentIndex) {
      if (action === "like") return "exiting-right";
      if (action === "dislike") return "exiting-left";
      return "active";
    }
    if (index === currentIndex + 1) return "next";
    return "inactive";
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="relative w-full max-w-sm h-[450px]">
        {profiles.map((profile, index) => {
          const status = getCardStatus(index);
          if (index < currentIndex - 1 || index > currentIndex + 2) return null;

          return (
            <Card
              key={profile.id}
              data-status={status}
              className={cn(
                "absolute w-full h-full transition-all duration-500 ease-in-out transform-gpu cursor-grab active:cursor-grabbing",
                status === 'active' && 'z-10',
                status === 'next' && 'z-0 scale-95 -translate-y-4',
                status === 'inactive' && 'opacity-0',
                status === 'exiting-left' && '-translate-x-full rotate-[-12deg] opacity-0',
                status === 'exiting-right' && 'translate-x-full rotate-[12deg] opacity-0',
                status === 'gone' && 'hidden'
              )}
              style={status === 'active' ? {
                transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`
              } : undefined}
              onMouseDown={status === 'active' ? handleDragStart : undefined}
              onMouseMove={status === 'active' ? handleDragMove : undefined}
              onMouseUp={status === 'active' ? handleDragEnd : undefined}
              onMouseLeave={status === 'active' ? handleDragEnd : undefined}
              onTouchStart={status === 'active' ? handleDragStart : undefined}
              onTouchMove={status === 'active' ? handleDragMove : undefined}
              onTouchEnd={status === 'active' ? handleDragEnd : undefined}
            >
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex-1 flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">
                      {profile.name}, {profile.age}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {profile.university}
                  </p>
                  <p className="my-3 text-sm flex-1">{profile.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(profile.preferences).map((key) => {
                      const prefKey = key as keyof typeof iconMap;
                      const Icon = iconMap[prefKey];
                      return (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Icon className="h-3 w-3" />
                          {profile.preferences[prefKey]}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-500"
          onClick={() => handleAction("dislike")}
        >
          <X className="h-8 w-8" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-500"
          onClick={() => handleAction("like")}
        >
          <Heart className="h-8 w-8" />
        </Button>
      </div>

      {matchData && currentUser && (
        <div className="w-full max-w-md">
          <CompatibilityExplainer 
            match={matchData} 
          />
        </div>
      )}

    </div>
  );
}
