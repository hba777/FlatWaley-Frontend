"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Match, UserProfile } from "@/lib/types";
import {
  explainConflicts,
  ExplainConflictsOutput,
} from "@/services/explainConflicts";
import { userApi } from "@/services/userApi";

const iconMap = {
  strong: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  partial: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  conflict: <XCircle className="h-5 w-5 text-red-500" />,
};

export function CompatibilityExplainer({ match }: { match: Match }) {
  const [explanationData, setExplanationData] =
    useState<ExplainConflictsOutput | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await userApi.getUserProfile();
        setCurrentUser(profile);
      } catch (err) {
        console.error("Failed to get user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const getExplanation = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    setExplanationData(null);

    try {
      // Profile B is hardcoded
      const profileB = {
        id: "68d7cbda8196edd4fae7a2fb",
        raw_profile_text:
          "Hostel seat available Gulshan-e-Iqbal, Karachi. Budget no issue. Want Messy banda, prefer Late-night study, Quiet ok.",
        city: "Karachi",
        area: "Gulshan-e-Iqbal",
        budget_PKR: 14000,
        sleep_schedule: "Night owl",
        cleanliness: "Messy",
        noise_tolerance: "Quiet",
        study_habits: "Late-night study",
        food_pref: "Flexible",
      };

      const token = currentUser.token || "";

      const result = await explainConflicts.generateExplanation({
        pair_id: `${currentUser.profile_id || currentUser.id}_${profileB.id}`,
        red_flags: [
          {
            evidence: `${currentUser.cleanliness} vs ${profileB.cleanliness}`,
            severity: "HIGH",
            type: "Cleanliness",
          },
          {
            evidence: `${currentUser.study_habits} vs ${profileB.study_habits}`,
            severity: "MEDIUM",
            type: "Study",
          },
        ],
        access_token: token,
      });

      setExplanationData(result);
    } catch (error) {
      console.error("Failed to get explanation:", error);
      setExplanationData({
        summary_explanation:
          "Sorry, we couldn't generate an explanation at this time.",
        negotiation_checklist: [],
      });
    }

    setIsLoading(false);
  };

  const scoreColor =
    match.compatibilityScore > 75
      ? "bg-green-500"
      : match.compatibilityScore > 50
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compatibility Breakdown</CardTitle>
        <CardDescription>
          How you and {match.user.name} match up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Compatibility Score */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-primary">
                Compatibility Score
              </span>
              <span className="text-lg font-bold">
                {match.compatibilityScore}%
              </span>
            </div>
            <Progress
              value={match.compatibilityScore}
              className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary/70 [&>div]:to-primary"
            />
          </div>
        </div>

        {/* Compatibility Aspects */}
        <div className="space-y-4 mb-6">
          {match.compatibilityAspects.map((item) => (
            <div key={item.aspect} className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {iconMap[item.match]}
                <div>
                  <p className="font-semibold">{item.aspect}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.user1Value} vs {item.user2Value}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  item.match === "strong"
                    ? "default"
                    : item.match === "partial"
                    ? "secondary"
                    : "destructive"
                }
                className="capitalize text-xs"
              >
                {item.match}
              </Badge>
            </div>
          ))}
        </div>

        {/* Generate Explanation Button */}
        <Button
          onClick={getExplanation}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Generating..." : "Get AI Explanation"}
        </Button>

        {/* Explanation */}
        {explanationData && (
          <div className="mt-4 p-4 bg-secondary rounded-lg space-y-3">
            <p className="text-sm text-secondary-foreground font-medium">
              {explanationData.summary_explanation}
            </p>
            <ul className="space-y-2">
              {explanationData.negotiation_checklist.map((item, idx) => (
                <li key={idx} className="text-sm text-secondary-foreground">
                  <strong>{item.category}:</strong> {item.suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
