import api from '@/utils/api';

export interface MatchResult {
  id: string;
  profile_id: string;
  raw_profile_text: string;
  city: string;
  area: string;
  budget_PKR: number;
  sleep_schedule?: string;
  cleanliness?: string;
  noise_tolerance?: string;
  study_habits?: string;
  food_pref?: string;
  compatibility_score: number;
  compatibility_explanation: string;
}

class MatcherApiService {
  async getBestMatches(topN: number = 5): Promise<MatchResult[]> {
    try {
      const response = await api.get<MatchResult[]>(`/ai/best_matches?top_n=${topN}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to get matches';
      throw new Error(errorMessage);
    }
  }
}

export const matcherApi = new MatcherApiService();