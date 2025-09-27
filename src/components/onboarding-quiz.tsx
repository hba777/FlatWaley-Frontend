"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Sparkles,
  MapPin,
  DollarSign,
  Moon,
  Volume2,
  BookOpen,
  Utensils,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { parseApi, type ParseProfileResponse } from "@/services/parseApi";

type OnboardingStep = 'text' | 'review' | 'success';

const categoryOptions = {
  sleep_schedule: ['Night owl', 'Early riser', 'Flexible'],
  cleanliness: ['Tidy', 'Average', 'Messy'],
  noise_tolerance: ['Quiet', 'Moderate', 'Loud ok'],
  study_habits: ['Online classes', 'Late-night study', 'Room study', 'Library'],
  food_pref: ['Flexible', 'Non-veg', 'Veg'],
};

export function OnboardingQuiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('text');
  const [profileText, setProfileText] = useState('');
  const [parsedProfile, setParsedProfile] = useState<ParseProfileResponse | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Partial<ParseProfileResponse>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const progress = currentStep === 'text' ? 33 : currentStep === 'review' ? 66 : 100;

  const handleParseProfile = async () => {
    if (!profileText.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await parseApi.parseProfile(profileText);
      setParsedProfile(result);
      setSelectedProfile(result);
      setCurrentStep('review');
    } catch (error) {
      console.error('Failed to parse profile:', error);
      // You might want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!parsedProfile) return;
    
    setIsCreating(true);
    try {
      await parseApi.createProfile(selectedProfile as ParseProfileResponse);
      setCurrentStep('success');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to create profile:', error);
      // You might want to show an error message to the user
    } finally {
      setIsCreating(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'review') {
      setCurrentStep('text');
    }
  };

  if (currentStep === 'success') {
    return (
      <Card className="w-full max-w-lg mx-auto my-12 text-center">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-2">
            <CheckCircle className="text-green-500" />
            Profile Created!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">We're finding the best matches for you...</p>
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto my-12">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          {currentStep === 'review' && (
            <Button variant="ghost" size="icon" onClick={handlePrevious}>
              <ArrowLeft />
            </Button>
          )}
          <Progress value={progress} className="w-full" />
        </div>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <FileText className="h-8 w-8 text-primary" />
          {currentStep === 'text' ? 'Tell us about yourself' : 'Review your profile'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentStep === 'text' ? (
          <div className="space-y-6">
            <div>
              <Label htmlFor="profile-text" className="text-base font-medium">
                Describe your living habits and preferences
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Tell us about your daily routine, study habits, cleanliness preferences, budget, and what you're looking for in a roommate.
              </p>
              <Textarea
                id="profile-text"
                placeholder="I'm a computer science student who studies late at night. I keep my room clean and organized. I prefer quiet environments for studying. My budget is around 25,000 PKR per month. I'm looking for someone who respects study time and keeps shared spaces tidy..."
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                className="min-h-[200px] text-base"
              />
            </div>
            <Button 
              onClick={handleParseProfile} 
              disabled={!profileText.trim() || isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing your profile...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Parse My Profile
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Review your parsed profile</h3>
              <p className="text-muted-foreground">
                We've analyzed your text and extracted these details. You can modify them if needed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City and Area */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  City
                </Label>
                <Input
                  value={selectedProfile.city || ''}
                  onChange={(e) => setSelectedProfile(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Area
                </Label>
                <Input
                  value={selectedProfile.area || ''}
                  onChange={(e) => setSelectedProfile(prev => ({ ...prev, area: e.target.value }))}
                />
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget (PKR)
                </Label>
                <Input
                  type="number"
                  value={selectedProfile.budget_PKR || ''}
                  onChange={(e) => setSelectedProfile(prev => ({ ...prev, budget_PKR: parseInt(e.target.value) || 0 }))}
                />
              </div>

              {/* Sleep Schedule */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Sleep Schedule
                </Label>
                <Select
                  value={selectedProfile.sleep_schedule || ''}
                  onValueChange={(value) => setSelectedProfile(prev => ({ ...prev, sleep_schedule: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sleep schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.sleep_schedule.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cleanliness */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Cleanliness
                </Label>
                <Select
                  value={selectedProfile.cleanliness || ''}
                  onValueChange={(value) => setSelectedProfile(prev => ({ ...prev, cleanliness: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cleanliness level" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.cleanliness.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Noise Tolerance */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Noise Tolerance
                </Label>
                <Select
                  value={selectedProfile.noise_tolerance || ''}
                  onValueChange={(value) => setSelectedProfile(prev => ({ ...prev, noise_tolerance: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select noise tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.noise_tolerance.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Study Habits */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Study Habits
                </Label>
                <Select
                  value={selectedProfile.study_habits || ''}
                  onValueChange={(value) => setSelectedProfile(prev => ({ ...prev, study_habits: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select study habits" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.study_habits.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Food Preference */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Food Preference
                </Label>
                <Select
                  value={selectedProfile.food_pref || ''}
                  onValueChange={(value) => setSelectedProfile(prev => ({ ...prev, food_pref: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select food preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.food_pref.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleCreateProfile} 
              disabled={isCreating}
              size="lg"
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating your profile...
                </>
              ) : (
                'Create My Profile'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
