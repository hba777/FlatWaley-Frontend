'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, XCircle, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Match, UserProfile } from '@/lib/types';
import { explainCompatibilityScores } from '@/ai/flows/explain-compatibility-scores';

const iconMap = {
  strong: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  partial: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  conflict: <XCircle className="h-5 w-5 text-red-500" />,
};

export function CompatibilityExplainer({ match, currentUser }: { match: Match; currentUser: UserProfile }) {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getExplanation = async () => {
    setIsLoading(true);
    setExplanation('');
    try {
      const result = await explainCompatibilityScores({
        userProfile1: {
            name: currentUser.name,
            university: currentUser.university,
            budget: currentUser.preferences.budget,
            sleepSchedule: currentUser.preferences.sleepSchedule,
            cleanliness: currentUser.preferences.cleanliness,
            studyHabits: currentUser.preferences.studyHabits,
            foodPreferences: 'Not specified', // This was not in the quiz but is in the AI model
        },
        userProfile2: {
            name: match.user.name,
            university: match.user.university,
            budget: match.user.preferences.budget,
            sleepSchedule: match.user.preferences.sleepSchedule,
            cleanliness: match.user.preferences.cleanliness,
            studyHabits: match.user.preferences.studyHabits,
            foodPreferences: 'Not specified',
        },
        compatibilityScore: match.compatibilityScore,
      });
      setExplanation(result.explanation);
    } catch (error) {
      console.error('Failed to get explanation:', error);
      setExplanation('Sorry, we couldn\'t generate an explanation at this time.');
    }
    setIsLoading(false);
  };
  
  const scoreColor = match.compatibilityScore > 75 ? 'bg-green-500' : match.compatibilityScore > 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compatibility Breakdown</CardTitle>
        <CardDescription>How you and {match.user.name} match up.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
            <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-primary">Compatibility Score</span>
                    <span className="text-lg font-bold">{match.compatibilityScore}%</span>
                </div>
                <Progress value={match.compatibilityScore} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary/70 [&>div]:to-primary" />
            </div>
        </div>
        
        <div className="space-y-4 mb-6">
          {match.compatibilityAspects.map((item) => (
            <div key={item.aspect} className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {iconMap[item.match]}
                <div>
                  <p className="font-semibold">{item.aspect}</p>
                  <p className="text-sm text-muted-foreground">{item.user1Value} vs {item.user2Value}</p>
                </div>
              </div>
              <Badge variant={item.match === 'strong' ? 'default' : item.match === 'partial' ? 'secondary' : 'destructive' } className="capitalize text-xs">
                {item.match}
              </Badge>
            </div>
          ))}
        </div>

        <Button onClick={getExplanation} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {isLoading ? 'Generating...' : 'Get AI Explanation'}
        </Button>

        {explanation && (
          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <p className="text-sm text-secondary-foreground">{explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
