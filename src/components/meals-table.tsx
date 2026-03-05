import { Clock3, Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MealEntry } from "@/lib/mock-data";

type MealsTableProps = {
  meals: MealEntry[];
};

export function MealsTable({ meals }: MealsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dziennik posilkow</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Posilek</TableHead>
              <TableHead>Godzina</TableHead>
              <TableHead>B/T/W</TableHead>
              <TableHead className="text-right">Kalorie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meals.map((meal) => (
              <TableRow key={meal.id}>
                <TableCell className="font-medium">{meal.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    {meal.time}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {meal.protein}/{meal.fat}/{meal.carbs} g
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Flame className="size-3.5 text-orange-500" />
                    {meal.calories}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {!meals.length && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Brak wpisow. Dodaj pierwszy posilek.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
