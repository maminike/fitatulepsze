"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, LogOut, Menu, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/dziennik", label: "Dziennik" },
  { href: "/postep", label: "Postęp" },
  { href: "/produkty", label: "Produkty" },
  { href: "/profil", label: "Profil" },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Flame className="size-5 text-orange-500" />
          FitatuLepsze
        </Link>

        {user && (
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-[140px] truncate text-sm text-muted-foreground sm:inline">
                {user.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Wyloguj">
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/login" className="gap-2">
                <User className="size-4" />
                Zaloguj
              </Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Nawigacja</SheetTitle>
                <SheetDescription>Przelaczaj widoki aplikacji.</SheetDescription>
              </SheetHeader>
              <div className="mt-6 grid gap-2">
                {user ? (
                  <>
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Button
                          key={item.href}
                          asChild
                          variant={isActive ? "default" : "outline"}
                          className="justify-start"
                        >
                          <Link href={item.href}>{item.label}</Link>
                        </Button>
                      );
                    })}
                    <Button variant="outline" className="justify-start gap-2" onClick={handleLogout}>
                      <LogOut className="size-4" />
                      Wyloguj
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="justify-start gap-2">
                      <Link href="/login">Zaloguj się</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start gap-2">
                      <Link href="/rejestracja">Zarejestruj się</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
