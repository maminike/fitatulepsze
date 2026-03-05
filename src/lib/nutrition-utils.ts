import type { MealEntry } from "@/lib/mock-data";

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function calculateNutritionTotals(
  meals: Pick<MealEntry, "calories" | "protein" | "carbs" | "fat">[],
): NutritionTotals {
  return meals.reduce<NutritionTotals>(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  );
}

export function calculateCaloriesLeft(goal: number, consumed: number, burned = 0): number {
  return goal - consumed + burned;
}
