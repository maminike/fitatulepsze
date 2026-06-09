import type { MealEntry, ProductEntry, WeightEntry } from "@/lib/database.types";

export interface IMealRepository {
  fetchForDate(date: string): Promise<MealEntry[]>;
  insert(meal: Omit<MealEntry, "id"> & { date: string }): Promise<{ data?: MealEntry; error?: Error }>;
  delete(id: string): Promise<{ data?: boolean; error?: Error }>;
}

export interface IProductRepository {
  fetchAll(): Promise<ProductEntry[]>;
  insert(product: Omit<ProductEntry, "id">): Promise<{ data?: ProductEntry; error?: Error }>;
}

export interface IWeightRepository {
  fetchHistory(): Promise<WeightEntry[]>;
  upsert(date: string, weight: number): Promise<{ data?: WeightEntry; error?: Error }>;
}

export interface ICaloriesRepository {
  fetchWeekly(): Promise<{ day: string; value: number }[]>;
}
