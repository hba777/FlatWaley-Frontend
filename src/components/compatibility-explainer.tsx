"use client";

import { useState } from "react";
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
import type { Match } from "@/lib/types";
import {
  explainConflicts,
  ExplainConflictsOutput,
} from "@/services/explainConflicts";
import { useUser } from "@/context/UserContext";

const iconMap = {
  strong: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  partial: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  conflict: <XCircle className="h-5 w-5 text-red-500" />,
};

export function CompatibilityExplainer({ 
  match 
}: { 
  match: Match;
}) {
  const { user: currentUser } = useUser();
  const [explanationData, setExplanationData] =
    useState<ExplainConflictsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getExplanation = async () => {
    if (!currentUser || !match) return;

    setIsLoading(true);
    setExplanationData(null);

    try {
      // Use the match data from profile card
      const profileB = {
        id: match.user.profile_id || match.user.id.toString(), // Use original profile_id
        raw_profile_text: match.profileData?.raw_profile_text || match.user.bio,
        city: match.profileData?.city || match.user.university,
        area: match.profileData?.area || match.user.university,
        budget_PKR: match.profileData?.budget_PKR || 0,
        sleep_schedule: match.profileData?.sleep_schedule || match.user.preferences.sleepSchedule,
        cleanliness: match.profileData?.cleanliness || match.user.preferences.cleanliness,
        noise_tolerance: match.profileData?.noise_tolerance || match.user.preferences.socialHabits,
        study_habits: match.profileData?.study_habits || match.user.preferences.studyHabits,
        food_pref: match.profileData?.food_pref || "Flexible",
      };

      const token = currentUser.token || "";

      const result = await explainConflicts.generateExplanation({
        pair_id: `${currentUser.profile_id || currentUser.id}_${profileB.id}`,
        red_flags: [
          {
            evidence: `${currentUser.profileData?.cleanliness || 'Your cleanliness preference'} vs ${profileB.cleanliness}`,
            severity: "HIGH",
            type: "Cleanliness",
          },
          {
            evidence: `${currentUser.profileData?.study_habits || 'Your study habits'} vs ${profileB.study_habits}`,
            severity: "MEDIUM",
            type: "Study",
          },
          {
            evidence: `${currentUser.profileData?.sleep_schedule || 'Your sleep schedule'} vs ${profileB.sleep_schedule}`,
            severity: "MEDIUM",
            type: "Sleep",
          },
          {
            evidence: `${currentUser.profileData?.noise_tolerance || 'Your noise tolerance'} vs ${profileB.noise_tolerance}`,
            severity: "MEDIUM",
            type: "Noise",
          },
          {
            evidence: `Budget: ${currentUser.profileData?.budget_PKR || 'Your budget'} PKR vs ${profileB.budget_PKR} PKR`,
            severity: "HIGH",
            type: "Budget",
          },
        ],
        match_score: match.compatibilityScore,
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
