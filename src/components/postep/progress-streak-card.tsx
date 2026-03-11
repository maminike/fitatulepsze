"use client";

import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeStreak } from "@/lib/progress-utils";
import type { DayWithGoal } from "@/lib/progress-utils";

type Props = {
  daysWithGoal: DayWithGoal[];
};

export function ProgressStreakCard({ daysWithGoal }: Props) {
  const streak = computeStreak(daysWithGoal);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Flame className="size-4 text-orange-500" />
          Seria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{streak} dni</p>
        <p className="text-sm text-muted-foreground">
          Kolejne dni w normie kalorii (±10% celu)
        </p>
      </CardContent>
    </Card>
  );
}
