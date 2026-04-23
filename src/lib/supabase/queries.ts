import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import type { MealEntry, ProductEntry, WeightEntry } from "@/lib/database.types";

export async function insertProduct(product: Omit<ProductEntry, "id">) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error("Nie jesteś zalogowany") };

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      category: product.category,
      calories: product.calories,
      protein: product.protein,
      carbs: product.carbs,
      fat: product.fat,
    })
    .select("id, name, category, calories, protein, carbs, fat")
    .single();

  if (error) return { error };
  return {
    data: {
      id: data.id,
      name: data.name,
      category: data.category as ProductEntry["category"],
      calories: Number(data.calories),
      protein: Number(data.protein),
      carbs: Number(data.carbs),
      fat: Number(data.fat),
    },
  };
}

export async function fetchProducts(): Promise<ProductEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, category, calories, protein, carbs, fat")
    .order("name");
  if (error) return [];
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category as ProductEntry["category"],
    calories: Number(r.calories),
    protein: Number(r.protein),
    carbs: Number(r.carbs),
    fat: Number(r.fat),
  }));
}

export async function fetchMealsForDate(date: string): Promise<MealEntry[]> {
  if (typeof window !== "undefined" && window.location.search.includes("e2e=1")) {
    const { todayMeals } = await import("@/lib/mock-data");
    return todayMeals;
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("meals")
    .select("id, name, time, calories, protein, carbs, fat")
    .eq("user_id", user.id)
    .eq("meal_date", date)
    .order("time", { ascending: true });

  if (error) return [];
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    time: r.time,
    calories: Number(r.calories),
    protein: Number(r.protein),
    carbs: Number(r.carbs),
    fat: Number(r.fat),
  }));
}

export async function insertMeal(meal: Omit<MealEntry, "id"> & { date: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error("Nie jesteś zalogowany") };

  const { data, error } = await supabase
    .from("meals")
    .insert({
      user_id: user.id,
      name: meal.name,
      meal_date: meal.date,
      time: meal.time,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    })
    .select("id, name, time, calories, protein, carbs, fat")
    .single();

  if (error) return { error };
  return {
    data: {
      id: data.id,
      name: data.name,
      time: data.time,
      calories: Number(data.calories),
      protein: Number(data.protein),
      carbs: Number(data.carbs),
      fat: Number(data.fat),
    },
  };
}

export async function deleteMeal(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error("Nie jesteś zalogowany") };

  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error };
  return { data: true };
}

export async function insertWeight(date: string, weight: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error("Nie jesteś zalogowany") };

  const { error } = await supabase
    .from("weight_history")
    .upsert({ user_id: user.id, date, weight }, { onConflict: "user_id,date" });

  if (error) return { error };
  return { data: { date, weight } };
}

export async function fetchWeightHistory(): Promise<WeightEntry[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("weight_history")
    .select("date, weight")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (error) return [];
  return (data ?? []).map((r) => ({
    date: format(new Date(r.date), "dd.MM", { locale: pl }),
    weight: Number(r.weight),
  }));
}

const DAY_LABELS = ["Pon", "Wt", "Sr", "Czw", "Pt", "Sob", "Ndz"] as const;
const DAY_INDEX = [1, 2, 3, 4, 5, 6, 0]; // Pon=1, Wt=2, ..., Ndz=0 (getDay())

export async function fetchWeeklyCalories(): Promise<{ day: string; value: number }[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return DAY_LABELS.map((day) => ({ day, value: 0 }));
  }

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("meals")
    .select("meal_date, calories")
    .eq("user_id", user.id)
    .gte("meal_date", format(startOfWeek, "yyyy-MM-dd"))
    .lte("meal_date", format(today, "yyyy-MM-dd"));

  if (error) return DAY_LABELS.map((day) => ({ day, value: 0 }));

  const byDay: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const row of data ?? []) {
    const d = new Date(row.meal_date).getDay();
    byDay[d] = (byDay[d] ?? 0) + Number(row.calories);
  }

  return DAY_LABELS.map((day, i) => ({
    day,
    value: byDay[DAY_INDEX[i]] ?? 0,
  }));
}
