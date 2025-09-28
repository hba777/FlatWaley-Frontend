"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  DollarSign,
  Moon,
  Sparkles,
  Volume2,
  BookOpen,
  Utensils,
  Save,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userApi, type UserProfileData } from "@/services/userApi";
import { parseApi, type ProfileCreateRequest } from "@/services/parseApi";
import { useUser } from "@/context/UserContext";

const categoryOptions = {
  sleep_schedule: ['Night owl', 'Early riser', 'Flexible'],
  cleanliness: ['Tidy', 'Average', 'Messy'],
  noise_tolerance: ['Quiet', 'Moderate', 'Loud ok'],
  study_habits: ['Online classes', 'Late-night study', 'Room study', 'Library'],
  food_pref: ['Flexible', 'Non-veg', 'Veg'],
};

export default function SettingsPage() {
  const router = useRouter();
  const { user: currentUser, fetchUserProfileData } = useUser();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      console.log(currentUser);
      
      // Use profile_id from user context
      if (!currentUser?.profile_id) {
        throw new Error("No profile found for this user");
      }
      
      // If profile data is already available in user context, use it
      if (currentUser.profileData) {
        setProfileData(currentUser.profileData);
      } else {
        // Otherwise fetch it from the API
        const data = await userApi.getUserProfileData(currentUser.profile_id);
        setProfileData(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileData) return;
    
    setIsUpdating(true);
    try {
      const updateData: Partial<ProfileCreateRequest> = {
        raw_profile_text: profileData.raw_profile_text,
        city: profileData.city,
        area: profileData.area,
        budget_PKR: profileData.budget_PKR,
        sleep_schedule: profileData.sleep_schedule || '',
        cleanliness: profileData.cleanliness || '',
        noise_tolerance: profileData.noise_tolerance || '',
        study_habits: profileData.study_habits || '',
        food_pref: profileData.food_pref || '',
      };

      // Call the update API
      await parseApi.updateProfile(profileData.id, updateData);
      
      // Update user data in context with fresh profile data
      await fetchUserProfileData();
      
      setIsUpdated(true);
      setTimeout(() => setIsUpdated(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFieldChange = (field: keyof UserProfileData, value: string | number) => {
    if (!profileData) return;
    setProfileData(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No profile data found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Save className="h-8 w-8 text-primary" />
            Profile Settings
          </CardTitle>
          <p className="text-muted-foreground">
            Update your profile information and preferences.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isUpdated && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                Profile updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City and Area */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  City
                </Label>
                <Input
                  value={profileData.city || ''}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Area
                </Label>
                <Input
                  value={profileData.area || ''}
                  onChange={(e) => handleFieldChange('area', e.target.value)}
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
                  value={profileData.budget_PKR || ''}
                  onChange={(e) => handleFieldChange('budget_PKR', parseInt(e.target.value) || 0)}
                />
              </div>

              {/* Sleep Schedule */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Sleep Schedule
                </Label>
                <Select
                  value={profileData.sleep_schedule || ''}
                  onValueChange={(value) => handleFieldChange('sleep_schedule', value)}
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
                  value={profileData.cleanliness || ''}
                  onValueChange={(value) => handleFieldChange('cleanliness', value)}
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
                  value={profileData.noise_tolerance || ''}
                  onValueChange={(value) => handleFieldChange('noise_tolerance', value)}
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
                  value={profileData.study_habits || ''}
                  onValueChange={(value) => handleFieldChange('study_habits', value)}
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
                  value={profileData.food_pref || ''}
                  onValueChange={(value) => handleFieldChange('food_pref', value)}
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
              onClick={handleUpdateProfile} 
              disabled={isUpdating}
              size="lg"
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating profile...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
