"""Playwright: strony inne niż /produkty (dashboard, dziennik, postęp, profil, auth, middleware)."""

import re

from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:3000"


def goto_e2e(page: Page, path: str) -> None:
    sep = "&" if "?" in path else "?"
    page.goto(f"{BASE_URL}{path}{sep}e2e=1", wait_until="domcontentloaded", timeout=60_000)
    page.wait_for_load_state("domcontentloaded")


# sprawdza czy glowna ma budzet i ten wykres tygodniowy wogole sie wyswietla
def test_dash_budget(page: Page) -> None:
    goto_e2e(page, "/")
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()
    expect(page.get_by_text("Budzet kalorii")).to_be_visible()
    expect(page.get_by_text("Kalorie w tygodniu", exact=True)).to_be_visible()


# dziennik: naglowek, makro i ta tabela z posilkami jest na ekranie
def test_dziennik_tabela(page: Page) -> None:
    goto_e2e(page, "/dziennik")
    expect(page.get_by_role("heading", name="Dziennik")).to_be_visible()
    expect(page.get_by_text("Podsumowanie makro")).to_be_visible()
    expect(page.get_by_text("Dziennik posilkow")).to_be_visible()


# klika dodaj wpis i patrzy czy wysunal sie sheet z zapisz
def test_dziennik_sheet(page: Page) -> None:
    goto_e2e(page, "/dziennik")
    page.get_by_role("button", name="Dodaj wpis").click()
    expect(page.locator('[data-slot="sheet-title"]').filter(has_text="Dodaj wpis do dziennika")).to_be_visible()
    expect(page.get_by_role("button", name="Zapisz wpis")).to_be_visible()


# postep strona laduje sie i sa te karty z kaloriami itd
def test_postep_widok(page: Page) -> None:
    goto_e2e(page, "/postep")
    expect(page.get_by_role("heading", name="Postęp")).to_be_visible()
    expect(page.get_by_text("Kalorie w tygodniu", exact=True)).to_be_visible()
    expect(page.get_by_text("Makroskładniki dziś")).to_be_visible()


# jak sie wpisze cos niefajnego jako wage to powinien byc komunikat ze zle
def test_profil_waga_blad(page: Page) -> None:
    goto_e2e(page, "/profil")
    expect(page.get_by_role("heading", name="Profil")).to_be_visible()
    page.get_by_placeholder("np. 82.5").fill("xyz")
    page.get_by_role("button", name="Dodaj pomiar").click()
    expect(page.get_by_text(re.compile(r"Podaj poprawna wage"))).to_be_visible()


# login forma jest i link do rejestracji zeby mozna bylo przejsc
def test_login_okno(page: Page) -> None:
    page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded", timeout=60_000)
    expect(page.locator('[data-slot="card-title"]').filter(has_text="Zaloguj się")).to_be_visible()
    page.get_by_placeholder("Email").fill("test@example.com")
    page.get_by_placeholder("Hasło").fill("secret")
    expect(page.get_by_role("button", name="Zaloguj się")).to_be_enabled()
    expect(page.get_by_role("link", name="Zarejestruj się")).to_be_visible()


# rejestracja to samo w druga strone prawie, pola i link z powrotem
def test_rejestr_okno(page: Page) -> None:
    page.goto(f"{BASE_URL}/rejestracja", wait_until="domcontentloaded", timeout=60_000)
    expect(page.locator('[data-slot="card-title"]').filter(has_text="Zarejestruj się")).to_be_visible()
    page.get_by_placeholder("Email").fill("new@example.com")
    page.get_by_placeholder("Hasło (min. 6 znaków)").fill("abcdef")
    expect(page.get_by_role("button", name="Zarejestruj się")).to_be_enabled()
    expect(page.get_by_role("link", name="Zaloguj się")).to_be_visible()


# bez e2e=1 to cie powinno wyrzucic na login z redirectem w url
def test_gate_login(page: Page) -> None:
    page.goto(f"{BASE_URL}/dziennik", wait_until="commit", timeout=60_000)
    expect(page).to_have_url(re.compile(r"/login"))
    expect(page).to_have_url(re.compile(r"redirect=.*dziennik"))
