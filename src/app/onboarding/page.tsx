'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { OnboardingQuiz } from "@/components/onboarding-quiz";

export default function OnboardingPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.profile_id) {
      // User already has a profile, redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading while checking user status
  if (loading) {
    return (
      <main className="container flex min-h-screen items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  // If user has a profile, don't render onboarding (will redirect)
  if (user?.profile_id) {
    return null;
  }

  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <OnboardingQuiz />
    </main>
  );
}
