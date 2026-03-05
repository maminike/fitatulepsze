export function formatCalories(value: number): string {
  return `${Math.round(value)} kcal`;
}

export function formatGrams(value: number, precision = 1): string {
  const formatted = value.toFixed(precision);
  return `${Number(formatted)} g`;
}

export function calculateProgressPercent(consumed: number, target: number): number {
  if (target <= 0) {
    return 0;
  }

  const rawPercent = (consumed / target) * 100;
  return Math.min(Math.max(rawPercent, 0), 100);
}
