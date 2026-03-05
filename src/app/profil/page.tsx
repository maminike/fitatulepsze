import type { ComponentType } from "react";
import { Dumbbell, Goal, MoonStar, Scale, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { weightHistory } from "@/lib/mock-data";

export default function ProfilPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
        <p className="text-sm text-muted-foreground">Ustawienia celu i preferencji uzytkownika.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dane uzytkownika</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback>MK</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Mateusz K.</p>
              <p className="text-sm text-muted-foreground">Cel: recomposition</p>
            </div>
            <Badge className="ml-auto">Premium</Badge>
          </div>
          <Separator />
          <div className="grid gap-3 sm:grid-cols-2">
            <ProfileItem icon={Goal} label="Cel kalorii" value="2300 kcal" />
            <ProfileItem icon={Dumbbell} label="Treningi tygodniowo" value="4 sesje" />
            <ProfileItem icon={MoonStar} label="Tryb" value="Jasny" />
            <ProfileItem icon={UserRound} label="Wzrost / masa" value="182 cm / 83 kg" />
          </div>
          <Button className="w-full sm:w-auto">Zapisz zmiany</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-base">
            <Scale className="size-4 text-emerald-600" />
            Zmiana masy ciala
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <WeightChart />
          <p className="text-xs text-muted-foreground">
            Ostatni pomiar: {weightHistory[weightHistory.length - 1]?.weight ?? "-"} kg
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function WeightChart() {
  const width = 560;
  const height = 180;
  const paddingX = 24;
  const paddingY = 20;

  const minWeight = Math.min(...weightHistory.map((item) => item.weight));
  const maxWeight = Math.max(...weightHistory.map((item) => item.weight));
  const spread = Math.max(maxWeight - minWeight, 0.2);

  const points = weightHistory.map((item, index) => {
    const x =
      paddingX +
      (index / Math.max(weightHistory.length - 1, 1)) * (width - paddingX * 2);
    const y =
      height -
      paddingY -
      ((item.weight - minWeight) / spread) * (height - paddingY * 2);
    return { ...item, x, y };
  });

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="rounded-lg border p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          points={polylinePoints}
          className="text-emerald-600"
        />
        {points.map((point) => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="4" className="fill-emerald-600" />
            <text
              x={point.x}
              y={height - 4}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {point.date}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Min: {minWeight.toFixed(1)} kg</span>
        <span>Max: {maxWeight.toFixed(1)} kg</span>
      </div>
    </div>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="mb-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
