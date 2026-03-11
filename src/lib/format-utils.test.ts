import {
  calculateProgressPercent,
  formatCalories,
  formatGrams,
} from "@/lib/format-utils";

describe("formatCalories", () => {
  it("zwraca zaokraglone kalorie z sufiksem kcal", () => {
    expect(formatCalories(123.6)).toBe("124 kcal");
  });

  it("zaokragla w dół gdy część dziesiętna jest poniżej 0.5", () => {
    expect(formatCalories(123.4)).toBe("123 kcal");
  });

  it("zwraca ujemne kalorie dla ujemnych wartości", () => {
    expect(formatCalories(-12.2)).toBe("-12 kcal");
  });
});

describe("formatGrams", () => {
  it("zwraca zaokraglone gramy z sufiksem g", () => {
    expect(formatGrams(12.0)).toBe("12 g");
    expect(formatGrams(12.34)).toBe("12.3 g");
  });

  it("zwraca gramy z określoną precyzją", () => {
    expect(formatGrams(12.34, 2)).toBe("12.34 g");
  });

  it("zaokragla do najbliższej liczby całkowitej dla precyzji 0", () => {
    expect(formatGrams(12.6, 0)).toBe("13 g");
  });

  it("zaokragla małe wartości dziesiętne do jednego miejsca po przecinku domyślnie", () => {
    expect(formatGrams(0.05)).toBe("0.1 g");
  });
});

describe("calculateProgressPercent", () => {
  it("zwraca procent postępu dla poprawnego celu", () => {
    expect(calculateProgressPercent(50, 200)).toBe(25);
  });

  it("ogranicza wynik do 0-100", () => {
    expect(calculateProgressPercent(300, 200)).toBe(100);
    expect(calculateProgressPercent(-20, 200)).toBe(0);
  });

  it("zwraca 0 gdy cel jest równy zero lub mniejszy", () => {
    expect(calculateProgressPercent(50, 0)).toBe(0);
    expect(calculateProgressPercent(50, -10)).toBe(0);
  });

  it("zwraca procent dziesiętny dla częściowego postępu", () => {
    expect(calculateProgressPercent(25, 80)).toBeCloseTo(31.25);
  });
});
