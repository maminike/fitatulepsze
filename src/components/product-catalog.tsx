"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductEntry } from "@/lib/database.types";
import { fetchProducts, insertProduct } from "@/lib/supabase/queries";

const categories = ["Wszystkie", "Nabial", "Mieso", "Warzywa", "Przekaski", "Napoje"] as const;
const productCategories = ["Nabial", "Mieso", "Warzywa", "Przekaski", "Napoje"] as const;

export function ProductCatalog() {
  const [products, setProducts] = useState<ProductEntry[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Wszystkie");
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    category: "Nabial" as (typeof productCategories)[number],
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const [addError, setAddError] = useState<string | null>(null);
  const [addSaving, setAddSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    const data = await fetchProducts();
    setProducts(data);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleAddProduct(e: FormEvent) {
    e.preventDefault();
    const name = addForm.name.trim();
    if (!name) {
      setAddError("Podaj nazwe produktu");
      return;
    }
    const calories = parseFloat(addForm.calories.replace(",", ".")) || 0;
    const protein = parseFloat(addForm.protein.replace(",", ".")) || 0;
    const carbs = parseFloat(addForm.carbs.replace(",", ".")) || 0;
    const fat = parseFloat(addForm.fat.replace(",", ".")) || 0;

    setAddError(null);
    setAddSaving(true);
    const res = await insertProduct({
      name,
      category: addForm.category,
      calories,
      protein,
      carbs,
      fat,
    });
    setAddSaving(false);
    if (res.error) {
      setAddError(res.error.message);
      return;
    }
    if (res.data) {
      setProducts((prev) => [res.data!, ...prev]);
      setAddForm({ name: "", category: "Nabial", calories: "", protein: "", carbs: "", fat: "" });
      setAddOpen(false);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase().trim());
      const matchesCategory = category === "Wszystkie" || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Szukaj produktu..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={category} onValueChange={(value) => setCategory(value as (typeof categories)[number])}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet open={addOpen} onOpenChange={setAddOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Dodaj produkt
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Dodaj produkt</SheetTitle>
              <SheetDescription>Produkt zostanie zapisany w bazie (kcal i makro na 100g).</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleAddProduct} className="mt-6 grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nazwa</label>
                <Input
                  placeholder="np. Jogurt naturalny"
                  value={addForm.name}
                  onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Kategoria</label>
                <Select
                  value={addForm.category}
                  onValueChange={(v) => setAddForm((p) => ({ ...p, category: v as (typeof productCategories)[number] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Kalorie (na 100g)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0"
                  value={addForm.calories}
                  onChange={(e) => setAddForm((p) => ({ ...p, calories: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">Bialko</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={addForm.protein}
                    onChange={(e) => setAddForm((p) => ({ ...p, protein: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Tluscze</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={addForm.fat}
                    onChange={(e) => setAddForm((p) => ({ ...p, fat: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Wegle</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={addForm.carbs}
                    onChange={(e) => setAddForm((p) => ({ ...p, carbs: e.target.value }))}
                  />
                </div>
              </div>
              {addError && <p className="text-sm text-destructive">{addError}</p>}
              <Button type="submit" disabled={addSaving}>
                {addSaving ? "Zapisywanie…" : "Dodaj produkt"}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produkt</TableHead>
              <TableHead>Kategoria</TableHead>
              <TableHead className="text-right">kcal / 100g</TableHead>
              <TableHead className="text-right">B</TableHead>
              <TableHead className="text-right">T</TableHead>
              <TableHead className="text-right">W</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">{product.calories}</TableCell>
                <TableCell className="text-right">{product.protein}</TableCell>
                <TableCell className="text-right">{product.fat}</TableCell>
                <TableCell className="text-right">{product.carbs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
