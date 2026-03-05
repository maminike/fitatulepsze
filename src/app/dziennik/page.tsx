"use client";

import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";

import { MealEntrySheet } from "@/components/meal-entry-sheet";
import { MealsTable } from "@/components/meals-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { macroSummary, todayMeals } from "@/lib/mock-data";

export default function DziennikPage() {
  const [meals, setMeals] = useState(todayMeals);

  const consumedProtein = useMemo(() => meals.reduce((sum, meal) => sum + meal.protein, 0), [meals]);
  const consumedCarbs = useMemo(() => meals.reduce((sum, meal) => sum + meal.carbs, 0), [meals]);
  const consumedFat = useMemo(() => meals.reduce((sum, meal) => sum + meal.fat, 0), [meals]);

  const macroConsumedMap = {
    protein: consumedProtein,
    carbs: consumedCarbs,
    fat: consumedFat,
  } as const;

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dziennik</h1>
          <p className="text-sm text-muted-foreground">
            Szybki podglad posilkow i makroskladnikow z dnia.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarDays className="size-4" />
            Dzisiaj
          </Button>
          <MealEntrySheet
            triggerLabel="Dodaj wpis"
            title="Dodaj wpis do dziennika"
            onAdd={(meal) => setMeals((prev) => [meal, ...prev])}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Podsumowanie makro</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {macroSummary.map((macro) => (
            <div key={macro.key} className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">{macro.name}</p>
              <Separator className="my-2" />
              <p className="text-2xl font-bold">{macroConsumedMap[macro.key]} g</p>
              <p className="text-xs text-muted-foreground">z celu {macro.target} g</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <MealsTable meals={meals} />
    </section>
  );
}
