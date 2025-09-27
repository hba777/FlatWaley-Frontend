import api from '@/utils/api';

export interface MatchResult {
  profile_id: string;
  score: number;
  reasons: string[];
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