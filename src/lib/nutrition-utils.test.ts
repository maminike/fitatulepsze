import { todayMeals } from "@/lib/mock-data";
import { calculateCaloriesLeft, calculateNutritionTotals } from "@/lib/nutrition-utils";

describe("calculateNutritionTotals", () => {
  it("returns totals for provided meals", () => {
    const totals = calculateNutritionTotals(todayMeals);

    expect(totals).toEqual({
      calories: 1640,
      protein: 122,
      carbs: 178,
      fat: 50,
    });
  });

  it("returns zeros for empty array", () => {
    expect(calculateNutritionTotals([])).toEqual({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
  });

  it("returns same values for a single meal", () => {
    const [meal] = todayMeals;
    const totals = calculateNutritionTotals([meal]);

    expect(totals).toEqual({
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    });
  });

  it("sums decimal values correctly", () => {
    const totals = calculateNutritionTotals([
      { calories: 100.5, protein: 10.2, carbs: 15.1, fat: 3.3 },
      { calories: 99.5, protein: 4.8, carbs: 9.9, fat: 1.7 },
    ]);

    expect(totals.calories).toBeCloseTo(200);
    expect(totals.protein).toBeCloseTo(15);
    expect(totals.carbs).toBeCloseTo(25);
    expect(totals.fat).toBeCloseTo(5);
  });

  it("does not mutate input meals array", () => {
    const snapshot = JSON.parse(JSON.stringify(todayMeals));
    calculateNutritionTotals(todayMeals);
    expect(todayMeals).toEqual(snapshot);
  });
});

describe("calculateCaloriesLeft", () => {
  it("subtracts consumed calories and adds burned calories", () => {
    expect(calculateCaloriesLeft(2300, 1640, 320)).toBe(980);
  });

  it("handles zero burned calories by default", () => {
    expect(calculateCaloriesLeft(2000, 1900)).toBe(100);
  });

  it("returns negative number when consumed exceeds goal", () => {
    expect(calculateCaloriesLeft(2000, 2300, 0)).toBe(-300);
  });

  it("can return exactly zero calories left", () => {
    expect(calculateCaloriesLeft(2200, 2400, 200)).toBe(0);
  });
});
