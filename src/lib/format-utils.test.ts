import {
  calculateProgressPercent,
  formatCalories,
  formatGrams,
} from "@/lib/format-utils";

describe("formatCalories", () => {
  it("rounds and adds kcal suffix", () => {
    expect(formatCalories(123.6)).toBe("124 kcal");
  });

  it("rounds down when decimal part is below .5", () => {
    expect(formatCalories(123.4)).toBe("123 kcal");
  });

  it("handles negative values", () => {
    expect(formatCalories(-12.2)).toBe("-12 kcal");
  });
});

describe("formatGrams", () => {
  it("formats with default precision and strips trailing zeroes", () => {
    expect(formatGrams(12.0)).toBe("12 g");
    expect(formatGrams(12.34)).toBe("12.3 g");
  });

  it("supports custom precision", () => {
    expect(formatGrams(12.34, 2)).toBe("12.34 g");
  });

  it("supports zero precision", () => {
    expect(formatGrams(12.6, 0)).toBe("13 g");
  });

  it("rounds small decimal values to one decimal by default", () => {
    expect(formatGrams(0.05)).toBe("0.1 g");
  });
});

describe("calculateProgressPercent", () => {
  it("calculates progress for a valid target", () => {
    expect(calculateProgressPercent(50, 200)).toBe(25);
  });

  it("clamps result to 0-100", () => {
    expect(calculateProgressPercent(300, 200)).toBe(100);
    expect(calculateProgressPercent(-20, 200)).toBe(0);
  });

  it("returns 0 when target is zero or below", () => {
    expect(calculateProgressPercent(50, 0)).toBe(0);
    expect(calculateProgressPercent(50, -10)).toBe(0);
  });

  it("returns decimal percentage for partial progress", () => {
    expect(calculateProgressPercent(25, 80)).toBeCloseTo(31.25);
  });
});
