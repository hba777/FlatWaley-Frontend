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
  age: number;
  university: string;
  avatarUrl: string;
  preferences: UserPreferences;
  bio: string;
};

export type RoomListing = {
  id: number;
  title: string;
  location: string;
  rent: number;
  availableRooms: number;
  amenities: string[];
  images: string[];
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
};
