import api from "@/utils/api";

// --- Types ---
export interface NegotiationSuggestion {
  category: string;
  suggestion: string;
}

export interface ExplainConflictsOutput {
  negotiation_checklist: NegotiationSuggestion[];
  summary_explanation: string;
}

export interface ExplainConflictsRequest {
  pair_id: string;
  red_flags: {
    evidence: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    type: string;
  }[];
  match_score: number;
  access_token: string;
}

// --- Hardcoded fallback example ---
export const exampleOutput: ExplainConflictsOutput = {
  negotiation_checklist: [
    {
      category: "Cleanliness",
      suggestion:
        "Create a mutually agreed cleaning schedule and define shared spaces where both can maintain the preferred level of tidiness.",
    },
    {
      category: "Study Habits",
      suggestion:
        "Establish quiet hours and separate study zones to accommodate online class needs and late-night study sessions without disturbing each other.",
    },
  ],
  summary_explanation:
    "The compatibility score is 0/100, indicating no overall match. The main concerns are a HIGH severity conflict over cleanliness (one prefers tidy, the other messy) and a MEDIUM severity clash in study habits (online classes vs. late-night studying). These differences suggest potential friction in daily living and study environments.",
};

// --- Service class ---
class ExplainConflictsService {
  async generateExplanation(
    data: ExplainConflictsRequest
  ): Promise<ExplainConflictsOutput> {
    try {
      const response = await api.post<ExplainConflictsOutput>(
        "/ai/generate-explanation",
        {
          pair_id: data.pair_id,
          red_flags: data.red_flags,
          match_score: data.match_score,
        },
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error generating explanation:", error);
      // fallback to hardcoded example output
      return exampleOutput;
    }
  }
}

// --- Export instance ---
export const explainConflicts = new ExplainConflictsService();
