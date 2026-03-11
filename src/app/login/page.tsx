"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (err) {
      let msg = err.message;
      if (msg === "Invalid login credentials") msg = "Nieprawidłowy email lub hasło.";
      else if (msg.toLowerCase().includes("email") && msg.toLowerCase().includes("confirm")) {
        msg = "Potwierdź email – sprawdź skrzynkę i kliknij link z Supabase.";
      }
      setError(msg);
      return;
    }

    const safeRedirect = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
    router.push(safeRedirect);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center">
      <Card>
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 font-semibold">
            <Flame className="size-6 text-orange-500" />
            FitatuLepsze
          </Link>
          <CardTitle className="text-xl">Zaloguj się</CardTitle>
          <CardDescription>Wprowadź email i hasło, aby kontynuować.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Nie masz konta?{" "}
            <Link href="/rejestracja" className="font-medium text-primary underline-offset-4 hover:underline">
              Zarejestruj się
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center text-muted-foreground">Ładowanie…</div>}>
      <LoginForm />
    </Suspense>
  );
}
