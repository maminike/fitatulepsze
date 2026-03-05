import { DashboardOverview } from "@/components/dashboard-overview";
import { WeeklyCalories } from "@/components/weekly-calories";

export default function Home() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Podglad kalorii, makro i aktywnosci na dzisiejszy dzien.
        </p>
      </div>
      <DashboardOverview />
      <WeeklyCalories />
    </section>
  );
}
