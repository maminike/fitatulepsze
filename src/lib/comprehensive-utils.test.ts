import { calculateCaloriesLeft, calculateNutritionTotals } from "@/lib/nutrition-utils";
import { calculateProgressPercent, formatCalories, formatGrams } from "@/lib/format-utils";
import { computeBarHeight, computeMacroPercentages } from "@/lib/progress-utils";

describe("comprehensive utils - 10 test cases", () => {
  it("1) sums nutrition totals from meals", () => {
    const meals = [
      { calories: 250, protein: 15, carbs: 30, fat: 8 },
      { calories: 300, protein: 20, carbs: 40, fat: 10 },
    ];

    expect(calculateNutritionTotals(meals)).toEqual({
      calories: 550,
      protein: 35,
      carbs: 70,
      fat: 18,
    });
  });

  it("2) returns zero totals for empty meals", () => {
    expect(calculateNutritionTotals([])).toEqual({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
  });

  it("3) calculates calories left", () => {
    expect(calculateCaloriesLeft(2300, 1800)).toBe(500);
  });

  it("4) calculates calories left with burned calories", () => {
    expect(calculateCaloriesLeft(2300, 1800, 300)).toBe(800);
  });

  it("5) computes bar height for regular values", () => {
    expect(computeBarHeight(500, 2300)).toBeCloseTo(21.739, 2);
  });

  it("6) computes min bar height for very small positive value", () => {
    expect(computeBarHeight(1, 10000)).toBe(4);
  });

  it("7) computes macro percentages", () => {
    const result = computeMacroPercentages(160, 240, 80);

    expect(result).toHaveLength(3);
    expect(result[0].percent).toBeCloseTo(33.33, 1);
    expect(result[1].percent).toBeCloseTo(50, 1);
    expect(result[2].percent).toBeCloseTo(16.67, 1);
  });

  it("8) formats calories", () => {
    expect(formatCalories(250.7)).toBe("251 kcal");
  });

  it("9) formats grams with precision", () => {
    expect(formatGrams(125.456, 2)).toBe("125.46 g");
  });

  it("10) calculates progress percent with clamping", () => {
    expect(calculateProgressPercent(3000, 2300)).toBe(100);
    expect(calculateProgressPercent(0, 2300)).toBe(0);
  });
});
