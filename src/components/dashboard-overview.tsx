"use client";

import { useMemo, useState } from "react";
import { Activity, Droplets, Flame, Footprints } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealEntrySheet } from "@/components/meal-entry-sheet";
import { Progress } from "@/components/ui/progress";
import { calculateProgressPercent, formatCalories, formatGrams } from "@/lib/format-utils";
import { dailySummary, macroSummary, todayMeals } from "@/lib/mock-data";
import { calculateCaloriesLeft, calculateNutritionTotals } from "@/lib/nutrition-utils";

export function DashboardOverview() {
  const [meals, setMeals] = useState(todayMeals);

  const nutritionTotals = useMemo(() => calculateNutritionTotals(meals), [meals]);

  const macroConsumedMap = {
    protein: nutritionTotals.protein,
    carbs: nutritionTotals.carbs,
    fat: nutritionTotals.fat,
  } as const;

  const caloriesLeft = calculateCaloriesLeft(
    dailySummary.goal,
    nutritionTotals.calories,
    dailySummary.burned,
  );
  const progressValue = calculateProgressPercent(nutritionTotals.calories, dailySummary.goal);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="xl:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="size-4 text-orange-500" />
            Budzet kalorii
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">{formatCalories(caloriesLeft)}</p>
              <p className="text-sm text-muted-foreground">Pozostalo na dzisiaj</p>
            </div>
            <MealEntrySheet
              triggerLabel="Dodaj posilek"
              onAdd={(meal) => setMeals((prev) => [meal, ...prev])}
            />
          </div>
          <Progress value={progressValue} />
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Stat label="Cel" value={formatCalories(dailySummary.goal)} />
            <Stat label="Zjedzone" value={formatCalories(nutritionTotals.calories)} />
            <Stat label="Spalone" value={formatCalories(dailySummary.burned)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Droplets className="size-4 text-cyan-500" />
            Nawodnienie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-3xl font-bold">{dailySummary.waterMl} ml</p>
          <p className="text-sm text-muted-foreground">Z celu 2500 ml</p>
          <Progress value={(dailySummary.waterMl / 2500) * 100} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Footprints className="size-4 text-emerald-500" />
            Aktywnosc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-3xl font-bold">{dailySummary.steps}</p>
          <p className="text-sm text-muted-foreground">Kroki z celu 10 000</p>
          <Progress value={(dailySummary.steps / 10000) * 100} />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="size-4 text-violet-500" />
            Makroskladniki
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {macroSummary.map((macro) => (
            <div key={macro.key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{macro.name}</span>
                <span className="text-muted-foreground">
                  {formatGrams(macroConsumedMap[macro.key])} / {formatGrams(macro.target)}
                </span>
              </div>
              <Progress value={calculateProgressPercent(macroConsumedMap[macro.key], macro.target)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ostatnie posilki</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {meals.slice(0, 3).map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <div>
                <p className="font-medium">{meal.name}</p>
                <p className="text-muted-foreground">{meal.time}</p>
              </div>
              <p className="font-semibold">{formatCalories(meal.calories)}</p>
            </div>
          ))}
          {!meals.length && (
            <p className="rounded-lg border p-3 text-sm text-muted-foreground">
              Brak posilkow. Dodaj pierwszy wpis.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
