import re
from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:3000"

def go_e2e(page: Page, path: str) -> None:
    lacznik = "&" if "?" in path else "?"
    page.goto(f"{BASE_URL}{path}{lacznik}e2e=1", wait_until="domcontentloaded", timeout=30_000)

def test_dziennik_view(page: Page) -> None:
    go_e2e(page, "/dziennik")
    
    sniadanko = page.get_by_text(re.compile("Śniadanie", re.IGNORECASE)).first
    expect(sniadanko).to_be_visible()

def test_postep_streak(page: Page) -> None:
    go_e2e(page, "/postep")
    
    kartka_postepu = page.locator("text=/Dni z rzędu|Cel tygodniowy|Tygodniowy/i").first
    expect(kartka_postepu).to_be_visible()

def test_dashboard_math(page: Page) -> None:
    go_e2e(page, "/")
    expect(page.get_by_text(re.compile("Pozostalo", re.IGNORECASE)).first).to_be_visible()
    
    def statystyka(label: str) -> int:
        rodzic = page.get_by_text(label, exact=True).locator("..")
        tekst = rodzic.inner_text()
        em = re.search(r"(\d+)\s*kcal", tekst, re.IGNORECASE)
        return int(em.group(1)) if em else 0

    cel = statystyka("Cel")
    zjedzono = statystyka("Zjedzone")
    spalone = statystyka("Spalone")

    reszta_tekst = page.get_by_text(re.compile("Pozostalo", re.IGNORECASE)).locator("..").inner_text()
    em_dwa = re.search(r"(\d+)\s*kcal", reszta_tekst, re.IGNORECASE)
    pozostal = int(em_dwa.group(1)) if em_dwa else 0

    oszacowanie = cel - zjedzono + spalone
    assert pozostal == oszacowanie, f"Błąd w matmie: {oszacowanie} != {pozostal}"
