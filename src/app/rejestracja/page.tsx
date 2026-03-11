"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function RejestracjaPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setError("Brak konfiguracji Supabase. Sprawdź .env (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).");
      setLoading(false);
      return;
    }

    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (err) {
        let msg = err.message;
        if (msg.toLowerCase().includes("redirect") || msg.toLowerCase().includes("url")) {
          msg += " W Supabase: Authentication → URL Configuration → dodaj " + window.location.origin + "/auth/callback do Redirect URLs.";
        }
        setError(msg);
        return;
      }

      if (data?.user && !data?.session) {
        setError("Sprawdź email – wysłaliśmy link do potwierdzenia konta.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Wystąpił błąd.";
      if (msg === "Failed to fetch" || msg.includes("fetch")) {
        setError(
          "Brak połączenia z Supabase. Sprawdź: 1) Czy projekt nie jest wstrzymany (Dashboard → Restore)? 2) Czy URL " +
            url +
            " działa w przeglądarce? 3) Spróbuj w trybie incognito (bez rozszerzeń)."
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center">
      <Card>
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 font-semibold">
            <Flame className="size-6 text-orange-500" />
            FitatuLepsze
          </Link>
          <CardTitle className="text-xl">Zarejestruj się</CardTitle>
          <CardDescription>Utwórz konto, aby śledzić posiłki i wagę.</CardDescription>
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
              placeholder="Hasło (min. 6 znaków)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Rejestracja..." : "Zarejestruj się"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Masz już konto?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Zaloguj się
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
