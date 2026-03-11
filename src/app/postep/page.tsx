"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { BarChart3, Flame, Target, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { MealEntry } from "@/lib/database.types";
import {
  computeBarHeight,
  computeDayProgress,
  computeMacroPercentages,
  computeWeightAverage,
  computeWeightRange,
  computeWeightTrend,
  computeWeeklyAverage,
  computeWeeklyMax,
  countDaysWithData,
  countSuccessfulDays,
  enrichWeeklyWithGoal,
  getBarColor,
} from "@/lib/progress-utils";
import { MacroPieChart } from "@/components/postep/macro-pie-chart";
import { ProgressStreakCard } from "@/components/postep/progress-streak-card";
import { ProgressWeeklyGoalCard } from "@/components/postep/progress-weekly-goal-card";
import { calculateNutritionTotals } from "@/lib/nutrition-utils";
import { fetchMealsForDate, fetchWeeklyCalories, fetchWeightHistory } from "@/lib/supabase/queries";
const GOAL = 2300;

export default function PostepPage() {
  const [weeklyCalories, setWeeklyCalories] = useState<{ day: string; value: number }[]>(
    () => ["Pon", "Wt", "Sr", "Czw", "Pt", "Sob", "Ndz"].map((day) => ({ day, value: 0 }))
  );
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);
  const [weightHistory, setWeightHistory] = useState<{ date: string; weight: number }[]>([]);

  const loadData = useCallback(async () => {
    const [weekly, meals, weight] = await Promise.all([
      fetchWeeklyCalories(),
      fetchMealsForDate(format(new Date(), "yyyy-MM-dd")),
      fetchWeightHistory(),
    ]);
    setWeeklyCalories(weekly);
    setTodayMeals(meals);
    setWeightHistory(weight);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totals = calculateNutritionTotals(todayMeals);

  const macroPercents = computeMacroPercentages(totals.protein, totals.carbs, totals.fat);
  const maxBar = computeWeeklyMax(weeklyCalories, GOAL);
  const weeklyAvg = computeWeeklyAverage(weeklyCalories);
  const daysWithData = countDaysWithData(weeklyCalories);
  const successfulDays = countSuccessfulDays(weeklyCalories, GOAL);
  const weightTrend = computeWeightTrend(weightHistory);
  const weightAvg = computeWeightAverage(weightHistory);
  const weightRange = computeWeightRange(weightHistory);
  const dayProgress = computeDayProgress(totals.calories, GOAL);
  const enriched = enrichWeeklyWithGoal(weeklyCalories, GOAL);
  const daysWithGoal = weeklyCalories.map((d) => ({
    date: d.day,
    consumed: d.value,
    goal: GOAL,
  }));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Postęp</h1>
        <p className="text-sm text-muted-foreground">
          Wykresy i statystyki Twojego odżywiania i wagi.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="size-4 text-blue-500" />
              Kalorie w tygodniu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 items-end gap-2">
              {enriched.map((item) => {
                const height = computeBarHeight(item.value, maxBar);
                const color = getBarColor(item.value, GOAL);
                const bg =
                  color === "good"
                    ? "bg-emerald-500"
                    : color === "over"
                      ? "bg-amber-500"
                      : "bg-muted";
                return (
                  <div key={item.day} className="space-y-1 text-center">
                    <div className="mx-auto flex h-28 w-full max-w-8 items-end rounded bg-muted/50 p-0.5">
                      <div
                        className={`w-full rounded ${bg}`}
                        style={{ height: `${height}%` }}
                        title={`${item.value} kcal (${item.percentOfGoal.toFixed(0)}% celu)`}
                      />
                    </div>
                    <p className="text-[10px] font-medium">{item.day}</p>
                    <p className="text-[9px] text-muted-foreground">{item.value || "-"}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Średnia: {Math.round(weeklyAvg)} kcal/dzień · Dni z danymi: {daysWithData} · W normie: {successfulDays}/7
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="size-4 text-violet-500" />
              Makroskładniki dziś
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <MacroPieChart macroPercents={macroPercents} size={100} />
              <div className="flex-1 space-y-3">
              {macroPercents.map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{m.label}</span>
                    <span className="text-muted-foreground">
                      {m.value.toFixed(1)} g ({m.percent.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={Math.min(m.percent, 100)} className="h-2" />
                </div>
              ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Suma: {totals.protein + totals.carbs + totals.fat} g
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="size-4 text-orange-500" />
              Dziś
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totals.calories} kcal</p>
            <p className="text-sm text-muted-foreground">
              z celu {GOAL} kcal ({dayProgress.toFixed(0)}%)
            </p>
            <Progress value={Math.min(dayProgress, 100)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {weightTrend <= 0 ? (
                <TrendingDown className="size-4 text-emerald-500" />
              ) : (
                <TrendingUp className="size-4 text-amber-500" />
              )}
              Trend wagi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weightHistory.length >= 2 ? (
              <>
                <p className="text-2xl font-bold">
                  {weightTrend > 0 ? "+" : ""}
                  {weightTrend.toFixed(1)} kg
                </p>
                <p className="text-sm text-muted-foreground">
                  Średnia: {weightAvg.toFixed(1)} kg · Zakres: {weightRange.min.toFixed(1)}–{weightRange.max.toFixed(1)} kg
                </p>
                <p className="text-xs text-muted-foreground">
                  {weightHistory.length} pomiarów
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Dodaj min. 2 pomiary wagi w profilu.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Podsumowanie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Średnia tygodniowa: {Math.round(weeklyAvg)} kcal</p>
            <p>Dni z wpisami: {daysWithData}/7</p>
            <p>Dni w normie kalorii: {successfulDays}/7</p>
          </CardContent>
        </Card>

        <ProgressStreakCard daysWithGoal={daysWithGoal} />
        <ProgressWeeklyGoalCard weekly={weeklyCalories} dailyGoal={GOAL} />
      </div>
    </section>
  );
}
