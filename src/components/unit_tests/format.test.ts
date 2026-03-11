import { formatCalories, formatGrams } from "@/lib/format-utils";

describe("format-utils cases", () => {
  test("formatCalories adds kcal suffix and formats numbers", () => {
    expect(formatCalories(0)).toBe("0 kcal");
    expect(formatCalories(1234)).toBe("1234 kcal");
  });

  test("formatGrams uses default precision and rounds", () => {
    expect(formatGrams(12.345)).toBe("12.3 g");
    expect(formatGrams(0)).toBe("0 g");
  });

  test("formatGrams supports custom precision", () => {
    expect(formatGrams(12.346, 2)).toBe("12.35 g");
  });


  test("formatCalories handles fractional values by rounding", () => {
    expect(formatCalories(1234.6)).toMatch(/1235/);
  });

  test("formatGrams trims trailing zeros when precision 1", () => {
    expect(formatGrams(10.0, 1)).toBe("10 g");
  });

  test("format functions are stable across many inputs", () => {
    for (let i = 0; i < 50; i++) {
      const val = Math.round(Math.random() * 5000);
      expect(() => formatCalories(val)).not.toThrow();
      expect(() => formatGrams(val / 10, 1)).not.toThrow();
    }
  });
});
