"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  BedDouble,
  BookOpen,
  CircleDollarSign,
  Sparkles,
  Users,
  X,
  Heart,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CompatibilityExplainer } from './compatibility-explainer';
import { potentialMatches, currentUser } from '@/lib/data';
import type { UserProfile, CompatibilityAspect } from '@/lib/types';
import { cn } from '@/lib/utils';

const iconMap = {
  budget: CircleDollarSign,
  sleepSchedule: BedDouble,
  cleanliness: Sparkles,
  studyHabits: BookOpen,
  socialHabits: Users,
};

function calculateCompatibility(user1: UserProfile, user2: UserProfile): { score: number, aspects: CompatibilityAspect[] } {
    const aspects: CompatibilityAspect[] = [];
    let score = 100;

    const budget1 = parseInt(user1.preferences.budget.split('-')[0].replace('$', ''));
    const budget2 = parseInt(user2.preferences.budget.split('-')[0].replace('$', ''));
    const budgetDiff = Math.abs(budget1 - budget2);
    
    let budgetMatch: 'strong' | 'partial' | 'conflict' = 'strong';
    if (budgetDiff > 400) {
        score -= 25;
        budgetMatch = 'conflict';
    } else if (budgetDiff > 0) {
        score -= 10;
        budgetMatch = 'partial';
    }
    aspects.push({ aspect: 'Budget', user1Value: user1.preferences.budget, user2Value: user2.preferences.budget, match: budgetMatch });

    let sleepMatch: 'strong' | 'partial' | 'conflict' = 'strong';
    if (user1.preferences.sleepSchedule !== user2.preferences.sleepSchedule && (user1.preferences.sleepSchedule !== 'Flexible' && user2.preferences.sleepSchedule !== 'Flexible')) {
        score -= 20;
        sleepMatch = 'conflict';
    } else if (user1.preferences.sleepSchedule !== user2.preferences.sleepSchedule) {
        score -= 5;
        sleepMatch = 'partial';
    }
     aspects.push({ aspect: 'Sleep Schedule', user1Value: user1.preferences.sleepSchedule, user2Value: user2.preferences.sleepSchedule, match: sleepMatch });

    const cleanlinessLevels = {'Very Tidy': 3, 'Moderately Tidy': 2, 'Relaxed': 1};
    const cleanDiff = Math.abs(cleanlinessLevels[user1.preferences.cleanliness] - cleanlinessLevels[user2.preferences.cleanliness]);
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
  const [profiles, setProfiles] = useState(potentialMatches);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [action, setAction] = useState<'like' | 'dislike' | null>(null);

  const currentProfile = profiles[currentIndex];

  const handleAction = (newAction: 'like' | 'dislike') => {
    setAction(newAction);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length);
      setAction(null);
    }, 500); // match animation duration
  };
  
  const matchData = useMemo(() => {
      if (!currentProfile) return null;
      const {score, aspects} = calculateCompatibility(currentUser, currentProfile);
      return {
          user: currentProfile,
          compatibilityScore: score,
          compatibilityAspects: aspects
      };
  }, [currentProfile]);


  if (!currentProfile || !matchData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold">No more profiles</h2>
        <p className="text-muted-foreground mt-2">Check back later for new potential roommates!</p>
      </div>
    );
  }

  const getCardStatus = (index: number) => {
    if (index < currentIndex) return 'gone';
    if (index === currentIndex) {
      if (action === 'like') return 'exiting-right';
      if (action === 'dislike') return 'exiting-left';
      return 'active';
    }
    if (index === currentIndex + 1) return 'next';
    return 'inactive';
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="relative w-full max-w-sm h-[450px]">
        {profiles.map((profile, index) => {
          const status = getCardStatus(index);
          if (index < currentIndex -1 || index > currentIndex + 2) return null;

          return (
             <Card
              key={profile.id}
              data-status={status}
              className={cn(
                "absolute w-full h-full transition-all duration-500 ease-in-out transform-gpu",
                status === 'active' && 'z-10',
                status === 'next' && 'z-0 scale-95 -translate-y-4',
                status === 'inactive' && 'opacity-0',
                status === 'exiting-left' && '-translate-x-full rotate-[-12deg] opacity-0',
                status === 'exiting-right' && 'translate-x-full rotate-[12deg] opacity-0',
                status === 'gone' && 'hidden'
              )}
            >
              <CardContent className="p-4 h-full flex flex-col">
                <div className="relative h-1/2 w-full mb-4">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                   <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold">{profile.name}, {profile.age}</h3>
                   </div>
                  <p className="text-sm text-muted-foreground">{profile.university}</p>
                  <p className="my-3 text-sm flex-1">{profile.bio}</p>
                  <div className="flex flex-wrap gap-2">
                      {Object.keys(profile.preferences).map((key) => {
                          const prefKey = key as keyof typeof iconMap;
                          const Icon = iconMap[prefKey];
                          return (
                            <Badge key={key} variant="secondary" className="flex items-center gap-1">
                                <Icon className="h-3 w-3" />
                                {profile.preferences[prefKey]}
                            </Badge>
                          )
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-500" onClick={() => handleAction('dislike')}>
          <X className="h-8 w-8" />
        </Button>
        <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-500" onClick={() => handleAction('like')}>
          <Heart className="h-8 w-8" />
        </Button>
      </div>

      <div className="w-full max-w-md">
        <CompatibilityExplainer match={matchData} currentUser={currentUser} />
      </div>

    </div>
  );
}
