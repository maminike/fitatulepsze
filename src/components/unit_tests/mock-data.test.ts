import { weeklyCalories, products, todayMeals, macroSummary, dailySummary } from "@/lib/mock-data";

describe("mock-data tests", () => {
  test("weeklyCalories has 7 entries", () => {
    expect(Array.isArray(weeklyCalories)).toBe(true);
    expect(weeklyCalories.length).toBe(7);
  });

  test("each weeklyCalories value is a number", () => {
    weeklyCalories.forEach((w) => {
      expect(typeof w.value).toBe("number");
    });
  });

  test("products contain allowed categories", () => {
    const allowed = ["Nabial", "Mieso", "Warzywa", "Przekaski", "Napoje"];
    products.forEach((p) => expect(allowed.includes(p.category)).toBeTruthy());
  });

  test("products have unique ids", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("todayMeals have ids and numeric calories", () => {
    todayMeals.forEach((m) => {
      expect(typeof m.id).toBe("string");
      expect(typeof m.calories).toBe("number");
    });
  });

  test("macroSummary keys present and targets numeric", () => {
    macroSummary.forEach((m) => {
      expect(["protein", "carbs", "fat"].includes(m.key)).toBeTruthy();
      expect(typeof m.target).toBe("number");
    });
  });

  test("dailySummary numeric fields", () => {
    expect(typeof dailySummary.goal).toBe("number");
    expect(typeof dailySummary.consumed).toBe("number");
    expect(typeof dailySummary.burned).toBe("number");
    expect(typeof dailySummary.waterMl).toBe("number");
    expect(typeof dailySummary.steps).toBe("number");
  });

  test("simple sanity: products + todayMeals non-empty", () => {
    expect(products.length + todayMeals.length).toBeGreaterThan(0);
  });
});
