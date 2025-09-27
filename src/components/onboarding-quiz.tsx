"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircleDollarSign,
  BedDouble,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { preferenceOptions } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { UserPreferences } from "@/lib/types";

const quizSteps = [
  {
    key: "budget" as keyof UserPreferences,
    question: "What's your monthly budget?",
    icon: CircleDollarSign,
  },
  {
    key: "sleepSchedule" as keyof UserPreferences,
    question: "What's your sleep schedule like?",
    icon: BedDouble,
  },
  {
    key: "cleanliness" as keyof UserPreferences,
    question: "How tidy do you keep your space?",
    icon: Sparkles,
  },
  {
    key: "studyHabits" as keyof UserPreferences,
    question: "What are your study habits?",
    icon: BookOpen,
  },
  {
    key: "socialHabits" as keyof UserPreferences,
    question: "How social are you at home?",
    icon: Users,
  },
];

export function OnboardingQuiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});

  const totalSteps = quizSteps.length;
  const progress = ((currentStep + 1) / (totalSteps + 1)) * 100;

  const handleSelect = (key: keyof UserPreferences, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }, 300);
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
    }
  }

  const handleSubmit = () => {
    // Here you would typically save the user's preferences
    console.log("Final Preferences:", preferences);
    setCurrentStep(currentStep + 1);
    setTimeout(() => {
        router.push("/dashboard");
    }, 2000);
  };

  if (currentStep > totalSteps) {
     return (
        <Card className="w-full max-w-lg mx-auto my-12 text-center">
            <CardHeader>
                <CardTitle className="flex justify-center items-center gap-2">
                    <CheckCircle className="text-green-500" />
                    All Set!
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">We're finding the best matches for you...</p>
                <div className="flex justify-center">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
                </div>
            </CardContent>
        </Card>
     )
  }

  const { key, question, icon: Icon } = quizSteps[currentStep] || {};
  const options = key ? preferenceOptions[key as keyof typeof preferenceOptions] : [];

  return (
    <Card className="w-full max-w-lg mx-auto my-12">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
            {currentStep > 0 && <Button variant="ghost" size="icon" onClick={handlePrevious}><ArrowLeft/></Button>}
            <Progress value={progress} className="w-full" />
        </div>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Icon className="h-8 w-8 text-primary" />
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentStep < totalSteps ? (
          <div className="grid grid-cols-1 gap-4">
            {options.map((option) => (
              <Button
                key={option}
                variant="outline"
                size="lg"
                className={cn(
                  "justify-start text-base h-14",
                  preferences[key] === option &&
                    "border-primary ring-2 ring-primary"
                )}
                onClick={() => handleSelect(key, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
             <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to find your match?</h3>
                <p className="text-muted-foreground mb-6">
                    We'll use these preferences to connect you with the most compatible roommates.
                </p>
                <Button size="lg" onClick={handleSubmit}>
                    Create My Profile
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
