import { todayMeals } from "@/lib/mock-data";
import { calculateCaloriesLeft, calculateNutritionTotals } from "@/lib/nutrition-utils";

describe("calculateNutritionTotals", () => {
  it("zwraca sumy dla podanych posiłków", () => {
    const totals = calculateNutritionTotals(todayMeals);

    expect(totals).toEqual({
      calories: 1640,
      protein: 122,
      carbs: 178,
      fat: 50,
    });
  });

  it("zwraca zera dla pustej tablicy", () => {
    expect(calculateNutritionTotals([])).toEqual({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
  });

  it("zwraca te same wartości dla jednego posiłku", () => {
    const [meal] = todayMeals;
    const totals = calculateNutritionTotals([meal]);

    expect(totals).toEqual({
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    });
  });

  it("sumuje wartości dziesiętne poprawnie", () => {
    const totals = calculateNutritionTotals([
      { calories: 100.5, protein: 10.2, carbs: 15.1, fat: 3.3 },
      { calories: 99.5, protein: 4.8, carbs: 9.9, fat: 1.7 },
    ]);

    expect(totals.calories).toBeCloseTo(200);
    expect(totals.protein).toBeCloseTo(15);
    expect(totals.carbs).toBeCloseTo(25);
    expect(totals.fat).toBeCloseTo(5);
  });

  it("nie modyfikuje oryginalnej tablicy posiłków", () => {
    const snapshot = JSON.parse(JSON.stringify(todayMeals));
    calculateNutritionTotals(todayMeals);
    expect(todayMeals).toEqual(snapshot);
  });
});

describe("calculateCaloriesLeft", () => {
  it("odejmuje zużyte kalorie i dodaje spalone kalorie", () => {
    expect(calculateCaloriesLeft(2300, 1640, 320)).toBe(980);
  });

  it("nie wywala się jak coś ma 0 kcal", () => {
    expect(calculateCaloriesLeft(2000, 2000, 0)).toBe(0);
  });

  it("zwraca ujemną wartość gdy zużyte kalorie przekraczają cel", () => {
    expect(calculateCaloriesLeft(2000, 2300, 0)).toBe(-300);
  });

  it("może zwracać dokładnie zero kalorii", () => {
    expect(calculateCaloriesLeft(2200, 2400, 200)).toBe(0);
  });
});
