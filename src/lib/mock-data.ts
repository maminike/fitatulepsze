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

export const dailySummary = {
  goal: 2300,
  consumed: 1640,
  burned: 320,
  waterMl: 1900,
  steps: 8462,
};

export const macroSummary: MacroEntry[] = [
  { name: "Bialko", key: "protein", target: 160, consumed: 122 },
  { name: "Wegle", key: "carbs", target: 240, consumed: 153 },
  { name: "Tluscze", key: "fat", target: 75, consumed: 58 },
];

export const todayMeals: MealEntry[] = [
  {
    id: "meal-1",
    name: "Owsianka z bananem",
    time: "07:30",
    calories: 430,
    protein: 21,
    carbs: 62,
    fat: 11,
  },
  {
    id: "meal-2",
    name: "Kurczak z ryzem i brokulem",
    time: "12:45",
    calories: 620,
    protein: 49,
    carbs: 71,
    fat: 17,
  },
  {
    id: "meal-3",
    name: "Skyr + orzechy",
    time: "16:10",
    calories: 280,
    protein: 24,
    carbs: 19,
    fat: 12,
  },
  {
    id: "meal-4",
    name: "Tortilla z tunczykiem",
    time: "19:20",
    calories: 310,
    protein: 28,
    carbs: 26,
    fat: 10,
  },
];

export const weeklyCalories = [
  { day: "Pon", value: 2140 },
  { day: "Wt", value: 2260 },
  { day: "Sr", value: 1970 },
  { day: "Czw", value: 1640 },
  { day: "Pt", value: 0 },
  { day: "Sob", value: 0 },
  { day: "Ndz", value: 0 },
];

export const products: ProductEntry[] = [
  {
    id: "product-1",
    name: "Skyr naturalny",
    category: "Nabial",
    calories: 63,
    protein: 11,
    carbs: 3.6,
    fat: 0.2,
  },
  {
    id: "product-2",
    name: "Filet z kurczaka",
    category: "Mieso",
    calories: 120,
    protein: 23,
    carbs: 0,
    fat: 2.2,
  },
  {
    id: "product-3",
    name: "Papryka czerwona",
    category: "Warzywa",
    calories: 31,
    protein: 1,
    carbs: 6,
    fat: 0.3,
  },
  {
    id: "product-4",
    name: "Baton proteinowy",
    category: "Przekaski",
    calories: 190,
    protein: 20,
    carbs: 16,
    fat: 5.5,
  },
  {
    id: "product-5",
    name: "Napoj izotoniczny",
    category: "Napoje",
    calories: 22,
    protein: 0,
    carbs: 5.3,
    fat: 0,
  },
  {
    id: "product-6",
    name: "Jogurt grecki light",
    category: "Nabial",
    calories: 75,
    protein: 8.6,
    carbs: 4.5,
    fat: 2.3,
  },
];

export const weightHistory: WeightEntry[] = [
  { date: "06.02", weight: 84.1 },
  { date: "13.02", weight: 83.7 },
  { date: "20.02", weight: 83.5 },
  { date: "27.02", weight: 83.2 },
  { date: "05.03", weight: 82.9 },
];
