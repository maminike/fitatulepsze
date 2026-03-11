"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchWeeklyCalories } from "@/lib/supabase/queries";

export function WeeklyCalories() {
  const [weeklyCalories, setWeeklyCalories] = useState<{ day: string; value: number }[]>(
    () => [{ day: "Pon", value: 0 }, { day: "Wt", value: 0 }, { day: "Sr", value: 0 }, { day: "Czw", value: 0 }, { day: "Pt", value: 0 }, { day: "Sob", value: 0 }, { day: "Ndz", value: 0 }]
  );

  useEffect(() => {
    fetchWeeklyCalories().then(setWeeklyCalories);
  }, []);

  const maxValue = Math.max(...weeklyCalories.map((item) => item.value), 2300);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Kalorie w tygodniu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 items-end gap-3">
          {weeklyCalories.map((item) => {
            const height = `${Math.max((item.value / maxValue) * 100, 4)}%`;

            return (
              <div key={item.day} className="space-y-2 text-center">
                <div className="mx-auto flex h-32 w-full max-w-10 items-end rounded-md bg-muted/60 p-1">
                  <div
                    className="w-full rounded-sm bg-primary/80"
                    style={{ height }}
                    title={`${item.value} kcal`}
                  />
                </div>
                <p className="text-xs font-medium">{item.day}</p>
                <p className="text-[11px] text-muted-foreground">{item.value || "-"}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
