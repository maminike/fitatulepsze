import re
from datetime import date
from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:3000"

def go_e2e(page: Page, path: str) -> None:
    odzielnik = "&" if "?" in path else "?"
    page.goto(f"{BASE_URL}{path}{odzielnik}e2e=1", wait_until="domcontentloaded", timeout=30_000)

def test_auth_flow(page: Page) -> None:
    page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
    
    page.get_by_role("link", name=re.compile("Zarejestruj", re.IGNORECASE)).click()
    expect(page).to_have_url(re.compile(r"/rejestracja"))
    
    mejl = page.get_by_placeholder(re.compile("Email", re.IGNORECASE))
    mejl.fill("test_e2e@example.com")
    
    haslo_min = page.get_by_placeholder(re.compile("Hasło.*min", re.IGNORECASE))
    haslo_min.fill("123")
    
    guzik_rejestracij = page.get_by_role("button", name=re.compile("Zarejestruj", re.IGNORECASE))
    guzik_rejestracij.click()
    
    page.wait_for_timeout(1000)
    expect(page).to_have_url(re.compile(r"/rejestracja"))

def test_product_catalog(page: Page) -> None:
    go_e2e(page, "/produkty")
    expect(page.get_by_role("heading", name=re.compile("Produkt|Baza", re.IGNORECASE)).first).to_be_visible()
    
    szukajka = page.get_by_role("textbox").first
    expect(szukajka).to_be_visible()
    szukajka.fill("Banan")
    page.wait_for_timeout(500)
    
    wiersze = page.locator("table tbody tr")
    if wiersze.count() > 0:
        expect(wiersze.first).to_be_visible()

def test_profile_date(page: Page) -> None:
    go_e2e(page, "/profil")
    
    data_input = page.locator('input[type="date"]').first
    expect(data_input).to_be_visible()
    
    assert data_input.input_value() == date.today().strftime("%Y-%m-%d")
