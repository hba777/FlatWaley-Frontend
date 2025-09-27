import api from "@/utils/api";

export interface ConflictDetectionRequest {
  profile_a: Record<string, any>;
  profile_b: Record<string, any>;
}

export interface ConflictDetectionResponse {
  has_conflicts: boolean;
  conflicts: string[];
  severity: "low" | "medium" | "high";
  explanation: string;
}

class RedFlagApiService {
  async detectConflicts(
    profileA: Record<string, any>,
    profileB: Record<string, any>
  ): Promise<ConflictDetectionResponse> {
    try {
      const response = await api.post<ConflictDetectionResponse>(
        "/ai/detect-conflicts",
        {
          profile_a: profileA,
          profile_b: profileB,
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to detect conflicts";
      throw new Error(errorMessage);
    }
  }
}

export const redFlagApi = new RedFlagApiService();
