/**
 * Funkcje czyste do obliczeń dla widoku Postęp (wykresy, statystyki).
 * Testowalne bez Supabase.
 */

export type DayCalories = { day: string; value: number };

export type MacroPercent = {
  label: "Białko" | "Węgle" | "Tłuszcze";
  value: number;
  percent: number;
};

export type DayWithGoal = {
  date: string;
  consumed: number;
  goal: number;
};

export type WeightEntry = { date: string; weight: number };

/** Wysokość słupka w % (min 4, max 100) */
export function computeBarHeight(value: number, maxValue: number): number {
  if (maxValue <= 0) return 4;
  const raw = (value / maxValue) * 100;
  return Math.max(Math.min(raw, 100), value > 0 ? 4 : 0);
}

/** Procenty makro (protein, carbs, fat) z sumy gramów */
export function computeMacroPercentages(
  protein: number,
  carbs: number,
  fat: number
): MacroPercent[] {
  const total = protein + carbs + fat;
  if (total <= 0) {
    return [
      { label: "Białko", value: 0, percent: 0 },
      { label: "Węgle", value: 0, percent: 0 },
      { label: "Tłuszcze", value: 0, percent: 0 },
    ];
  }
  return [
    { label: "Białko", value: protein, percent: (protein / total) * 100 },
    { label: "Węgle", value: carbs, percent: (carbs / total) * 100 },
    { label: "Tłuszcze", value: fat, percent: (fat / total) * 100 },
  ];
}

/** Seria dni z celem – ile kolejnych dni osiągnęło cel (w granicach ±10%) */
export function computeStreak(days: DayWithGoal[], tolerancePercent = 10): number {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const { consumed, goal } = days[i];
    if (goal <= 0) break;
    const diff = Math.abs(consumed - goal) / goal;
    if (diff <= tolerancePercent / 100) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/** Procent realizacji celu dla dnia */
export function computeDayProgress(consumed: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min((consumed / goal) * 100, 150);
}

/** Kolor słupka: w normie, poniżej, powyżej */
export function getBarColor(value: number, goal: number): "good" | "under" | "over" {
  if (goal <= 0) return "good";
  const ratio = value / goal;
  if (ratio >= 0.9 && ratio <= 1.1) return "good";
  if (ratio < 0.9) return "under";
  return "over";
}

/** Średnia kalorii z tygodnia */
export function computeWeeklyAverage(weekly: DayCalories[]): number {
  if (weekly.length === 0) return 0;
  const sum = weekly.reduce((acc, d) => acc + d.value, 0);
  return sum / weekly.length;
}

/** Maksymalna wartość z tygodnia (do skali wykresu) */
export function computeWeeklyMax(weekly: DayCalories[], minBase = 2300): number {
  const maxValue = Math.max(...weekly.map((d) => d.value), 0);
  return Math.max(maxValue, minBase);
}

/** Liczba dni z wpisami (value > 0) */
export function countDaysWithData(weekly: DayCalories[]): number {
  return weekly.filter((d) => d.value > 0).length;
}

/** Trend wagi: ostatnia - pierwsza (ujemny = spadek) */
export function computeWeightTrend(history: WeightEntry[]): number {
  if (history.length < 2) return 0;
  const first = history[0].weight;
  const last = history[history.length - 1].weight;
  return last - first;
}

/** Średnia wagi z historii */
export function computeWeightAverage(history: WeightEntry[]): number {
  if (history.length === 0) return 0;
  const sum = history.reduce((acc, w) => acc + w.weight, 0);
  return sum / history.length;
}

/** Min i max waga z historii */
export function computeWeightRange(history: WeightEntry[]): { min: number; max: number } {
  if (history.length === 0) return { min: 0, max: 0 };
  const weights = history.map((w) => w.weight);
  return { min: Math.min(...weights), max: Math.max(...weights) };
}

/** Procent realizacji celu tygodniowego (suma vs 7*cel) */
export function computeWeeklyGoalProgress(
  weekly: DayCalories[],
  dailyGoal: number
): number {
  const total = weekly.reduce((acc, d) => acc + d.value, 0);
  const target = dailyGoal * 7;
  if (target <= 0) return 0;
  return Math.min((total / target) * 100, 150);
}

/** Kąt dla pie chart (stopnie, 0-360) */
export function macroToPieAngle(percent: number): number {
  return Math.min(Math.max(percent, 0), 100) * 3.6;
}

/** Dni tygodnia z wartością i procentem celu */
export function enrichWeeklyWithGoal(
  weekly: DayCalories[],
  goal: number
): (DayCalories & { percentOfGoal: number })[] {
  return weekly.map((d) => ({
    ...d,
    percentOfGoal: goal > 0 ? (d.value / goal) * 100 : 0,
  }));
}

/** Czy dzień jest „udany” (w granicach ±15% celu) */
export function isDaySuccessful(consumed: number, goal: number, tolerance = 15): boolean {
  if (goal <= 0) return false;
  const ratio = consumed / goal;
  return ratio >= 1 - tolerance / 100 && ratio <= 1 + tolerance / 100;
}

/** Liczba udanych dni w tygodniu */
export function countSuccessfulDays(weekly: DayCalories[], goal: number): number {
  return weekly.filter((d) => isDaySuccessful(d.value, goal)).length;
}
