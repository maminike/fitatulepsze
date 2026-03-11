// Typy zgodne z mock-data, mapowane na tabele Supabase

export type MacroKey = "protein" | "carbs" | "fat";

export type MacroEntry = {
  name: string;
  key: MacroKey;
  target: number;
  consumed: number;
};

export type MealEntry = {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type ProductEntry = {
  id: string;
  name: string;
  category: "Nabial" | "Mieso" | "Warzywa" | "Przekaski" | "Napoje";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type WeightEntry = {
  date: string;
  weight: number;
};
