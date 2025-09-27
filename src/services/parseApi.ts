import api from "@/utils/api";

export interface ParseProfileRequest {
  raw_profile_text: string;
}

export interface ParseProfileResponse {
  raw_profile_text: string;
  city: string;
  area: string;
  budget_PKR: number;
  sleep_schedule: string;
  cleanliness: string;
  noise_tolerance: string;
  study_habits: string;
  food_pref: string;
}

export interface ProfileCreateRequest {
  raw_profile_text: string;
  city: string;
  area: string;
  budget_PKR: number;
  sleep_schedule: string;
  cleanliness: string;
  noise_tolerance: string;
  study_habits: string;
  food_pref: string;
}

export interface ProfileResponse {
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
}

class ParseApiService {
  async parseProfile(text: string): Promise<ParseProfileResponse> {
    try {
      const response = await api.post<ParseProfileResponse>(
        "/ai/parse-profile",
        {
          raw_profile_text: text,
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Profile parsing failed";
      throw new Error(errorMessage);
    }
  }

  async createProfile(
    profileData: ProfileCreateRequest
  ): Promise<ProfileResponse> {
    try {
      const response = await api.post<ProfileResponse>(
        "/profiles",
        profileData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Profile creation failed";
      throw new Error(errorMessage);
    }
  }
}

export const parseApi = new ParseApiService();
