export type PreferenceOptions = {
  budget: readonly string[];
  sleepSchedule: readonly string[];
  cleanliness: readonly string[];
  studyHabits: readonly string[];
  socialHabits: readonly string[];
};

export type UserPreferences = {
  budget: string;
  sleepSchedule: string;
  cleanliness: string;
  studyHabits: string;
  socialHabits: string;
};

export type UserProfile = {
  id: number;
  name: string;
  age?: number;
  university: string;
  avatarUrl: string;
  preferences: UserPreferences;
  bio: string;
  profile_id?: string;
  token?: string;
  cleanliness?: string;
  study_habits?: string;
};

export type RoomListing = {
  id: number;
  title: string;
  location: string;
  rent: number;
  availableRooms: number;
  amenities: string[];
  images: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  description?: string;
  propertyType?: string;
  size?: string;
  deposit?: number;
};

export type CompatibilityAspect = {
  aspect: string;
  user1Value: string;
  user2Value: string;
  match: 'strong' | 'partial' | 'conflict';
};

export type Match = {
  user: UserProfile;
  compatibilityScore: number;
  compatibilityAspects: CompatibilityAspect[];
  profileData?: {
    id: string;
    raw_profile_text: string;
    city: string;
    area: string;
    budget_PKR: number;
    sleep_schedule?: string;
    cleanliness?: string;
    noise_tolerance?: string;
    study_habits?: string;
    food_pref?: string;
  };
  rawMatch?: {
    profile_id: string;
    score: number;
    reasons: string[];
  };
};
