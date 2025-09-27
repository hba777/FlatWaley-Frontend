'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { matcherApi } from '@/services/matcherApi';
import { OnboardingQuiz } from "@/components/onboarding-quiz";

export default function OnboardingPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!loading && user) {
        try {
          // Try to fetch matches - if this succeeds, user has a profile
          await matcherApi.getBestMatches(1);
          // If successful, user has a profile, redirect to dashboard
          router.push('/dashboard');
        } catch (error) {
          // If this fails with 404, user doesn't have a profile yet
          console.log('User does not have a profile yet, showing onboarding');
          setCheckingProfile(false);
        }
      }
    };

    checkUserProfile();
  }, [user, loading, router]);

  // Show loading while checking user status
  if (loading || checkingProfile) {
    return (
      <main className="container flex min-h-screen items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Checking your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <OnboardingQuiz />
    </main>
  );
}
