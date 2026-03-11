"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCurrentTime } from "@/lib/date-time-utils";
import type { MealEntry } from "@/lib/mock-data";

type FormState = {
  name: string;
  time: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

type MealEntrySheetProps = {
  title?: string;
  description?: string;
  triggerLabel: string;
  onAdd: (meal: MealEntry) => void;
};

function getDefaultForm(): FormState {
  return {
    name: "",
    time: getCurrentTime(),
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  };
}

export function MealEntrySheet({
  title = "Dodaj posilek",
  description = "Wpis zostanie dodany lokalnie (tylko w tej sesji).",
  triggerLabel,
  onAdd,
}: MealEntrySheetProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => getDefaultForm());

  const isValid = useMemo(() => {
    return form.name.trim().length > 0 && form.time.trim().length > 0;
  }, [form.name, form.time]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    onAdd({
      id: `meal-${Date.now()}`,
      name: form.name.trim(),
      time: form.time.trim(),
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    });

    setForm(getDefaultForm());
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">{triggerLabel}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid gap-3 p-4">
          <Input
            placeholder="Nazwa posilku"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
          <Input
            type="time"
            value={form.time}
            onChange={(event) => updateField("time", event.target.value)}
          />
          <Input
            type="number"
            min="0"
            placeholder="Kalorie"
            value={form.calories}
            onChange={(event) => updateField("calories", event.target.value)}
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              min="0"
              placeholder="Bialko"
              value={form.protein}
              onChange={(event) => updateField("protein", event.target.value)}
            />
            <Input
              type="number"
              min="0"
              placeholder="Tluscze"
              value={form.fat}
              onChange={(event) => updateField("fat", event.target.value)}
            />
            <Input
              type="number"
              min="0"
              placeholder="Wegle"
              value={form.carbs}
              onChange={(event) => updateField("carbs", event.target.value)}
            />
          </div>
          <Button type="submit" disabled={!isValid}>
            Zapisz wpis
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
