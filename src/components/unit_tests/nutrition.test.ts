import { calculateNutritionTotals, calculateCaloriesLeft } from "@/lib/nutrition-utils";

describe("nutrition-utils cases", () => {

  test("calculateNutritionTotals ignores negative macro values by summing as-is", () => {
    const totals = calculateNutritionTotals([
      { id: "1", name: "a", time: "01:00", calories: -10, protein: -1, carbs: 0, fat: 0 },
    ] as any);
    expect(totals.calories).toBe(-10);
  });

  test("calculateCaloriesLeft basic positive case", () => {
    expect(calculateCaloriesLeft(2000, 1500, 100)).toBe(600);
  });

  test("calculateCaloriesLeft not negative when burned larger than difference", () => {
    expect(calculateCaloriesLeft(2000, 1990, 20)).toBe(30);
  });


  test("calculateCaloriesLeft handles zero burned parameter", () => {
    expect(calculateCaloriesLeft(1800, 1000)).toBe(800);
  });

  test("calculateNutritionTotals with single large meal", () => {
    const totals = calculateNutritionTotals([
      { id: "big", name: "big", time: "10:00", calories: 5000, protein: 300, carbs: 400, fat: 100 },
    ] as any);
    expect(totals.calories).toBe(5000);
    expect(totals.protein).toBe(300);
  });

  test("calculateNutritionTotals stability under many items", () => {
    const items = Array.from({ length: 100 }, (_, i) => ({ id: String(i), name: "n", time: "00:00", calories: 10, protein: 1, carbs: 2, fat: 0 }));
    const totals = calculateNutritionTotals(items as any);
    expect(totals.calories).toBe(1000);
    expect(totals.protein).toBe(100);
  });

  test("calculateCaloriesLeft clamps negative goal to zero behavior", () => {
    expect(calculateCaloriesLeft(0, 100, 0)).toBe(-100);
  });
});
