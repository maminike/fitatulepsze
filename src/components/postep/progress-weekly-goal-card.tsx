"use client";

import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { computeWeeklyGoalProgress } from "@/lib/progress-utils";
import type { DayCalories } from "@/lib/progress-utils";

type Props = {
  weekly: DayCalories[];
  dailyGoal: number;
};

export function ProgressWeeklyGoalCard({ weekly, dailyGoal }: Props) {
  const progress = computeWeeklyGoalProgress(weekly, dailyGoal);
  const total = weekly.reduce((acc, d) => acc + d.value, 0);
  const target = dailyGoal * 7;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="size-4 text-blue-500" />
          Postęp tygodniowy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{Math.round(progress)}%</p>
        <p className="text-sm text-muted-foreground">
          {Math.round(total)} / {target} kcal
        </p>
        <Progress value={Math.min(progress, 100)} className="mt-2" />
      </CardContent>
    </Card>
  );
}
