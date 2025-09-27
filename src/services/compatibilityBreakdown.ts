// services/compatibilityBreakdown.ts
import api from "@/utils/api";

export interface RedFlag {
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  evidence: string;
}

export interface CompatibilityBreakdownInput {
  profile_a: {
    id: string;
    raw_profile_text: string;
    city: string;
    area: string;
    budget_PKR: number;
    sleep_schedule: string;
    cleanliness: string;
    noise_tolerance: string;
    study_habits: string;
    food_pref: string;
  };
  profile_b: {
    id: string;
    raw_profile_text: string;
    city: string;
    area: string;
    budget_PKR: number;
    sleep_schedule: string;
    cleanliness: string;
    noise_tolerance: string;
    study_habits: string;
    food_pref: string;
  };
}

export interface CompatibilityBreakdownOutput {
  pair_id: string;
  red_flags: RedFlag[];
}

class CompatibilityBreakdownService {
  async generateBreakdown(
    input: CompatibilityBreakdownInput
  ): Promise<CompatibilityBreakdownOutput> {
    const pair_id = `${input.profile_a.id}_${input.profile_b.id}`;

    // Dynamically generate red flags based on differences
    const red_flags: RedFlag[] = [];

    if (input.profile_a.cleanliness !== input.profile_b.cleanliness) {
      red_flags.push({
        type: "Cleanliness",
        severity: "HIGH",
        evidence: `Profile A prefers ${input.profile_a.cleanliness}, Profile B prefers ${input.profile_b.cleanliness}`,
      });
    }

    if (input.profile_a.study_habits !== input.profile_b.study_habits) {
      red_flags.push({
        type: "Study",
        severity: "MEDIUM",
        evidence: `Profile A prefers ${input.profile_a.study_habits}, Profile B prefers ${input.profile_b.study_habits}`,
      });
    }

    if (input.profile_a.sleep_schedule !== input.profile_b.sleep_schedule) {
      red_flags.push({
        type: "Sleep Schedule",
        severity: "LOW",
        evidence: `Profile A prefers ${input.profile_a.sleep_schedule}, Profile B prefers ${input.profile_b.sleep_schedule}`,
      });
    }

    if (input.profile_a.noise_tolerance !== input.profile_b.noise_tolerance) {
      red_flags.push({
        type: "Noise Tolerance",
        severity: "LOW",
        evidence: `Profile A prefers ${input.profile_a.noise_tolerance}, Profile B prefers ${input.profile_b.noise_tolerance}`,
      });
    }

    if (input.profile_a.budget_PKR !== input.profile_b.budget_PKR) {
      red_flags.push({
        type: "Budget",
        severity: "MEDIUM",
        evidence: `Profile A budget ${input.profile_a.budget_PKR}, Profile B budget ${input.profile_b.budget_PKR}`,
      });
    }

    return { pair_id, red_flags };
  }
}

export const compatibilityBreakdown = new CompatibilityBreakdownService();
