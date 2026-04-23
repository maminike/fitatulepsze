import re
from playwright.sync_api import Page, expect, BrowserContext

BASE_URL = "http://localhost:3000"

def go_e2e(page: Page, path: str) -> None:
    znak = "&" if "?" in path else "?"
    page.goto(f"{BASE_URL}{path}{znak}e2e=1", wait_until="domcontentloaded", timeout=30_000)

def test_onboarding(page: Page) -> None:
    go_e2e(page, "/profil")
    expect(page.locator("body")).to_contain_text(re.compile("Waga|Profil", re.IGNORECASE))
    
    link_dziennik = page.get_by_role("link", name=re.compile("Dziennik", re.IGNORECASE)).first
    if link_dziennik.is_visible():
        link_dziennik.click()
        expect(page).to_have_url(re.compile(r"/dziennik"))
    
    page.get_by_role("link", name=re.compile("Fitatu|Lepsze", re.IGNORECASE)).first.click()
    expect(page).to_have_url(re.compile(r"/$|\?"))
    expect(page.get_by_text(re.compile("Cel", re.IGNORECASE)).first).to_be_visible()

def test_diet_day(page: Page) -> None:
    go_e2e(page, "/dziennik")
    
    przyciski_dodaj = page.get_by_role("button", name=re.compile("Dodaj", re.IGNORECASE))
    if przyciski_dodaj.count() > 0:
        przyciski_dodaj.first.click()
        
        pole_szukaj = page.get_by_placeholder(re.compile("Szukaj", re.IGNORECASE)).first
        expect(pole_szukaj).to_be_visible()
        
        page.keyboard.press("Escape")
        
    page.goto(f"{BASE_URL}/", wait_until="domcontentloaded")
    
    wykres = page.locator("svg, .recharts-surface").first
    if wykres.count() > 0:
        expect(wykres).to_be_visible()

def test_error_handling(page: Page, context: BrowserContext) -> None:
    page.route("**/api/auth/**", lambda r: r.fulfill(
        status=500,
        body="Internal Server Error"
    ))
    
    page.goto(f"{BASE_URL}/login")
    
    e_mail = page.get_by_placeholder(re.compile("Email", re.IGNORECASE)).first
    expect(e_mail).to_be_visible()
    
    e_mail.fill("fake@fitatu.test")
    haslo_pole = page.locator("input[type='password']").first
    if haslo_pole.is_visible():
        haslo_pole.fill("supersecret")
    
    try:
        page.get_by_role("button", name=re.compile("zaloguj|Zaloguj", re.IGNORECASE)).click(timeout=1000)
    except:
        pass
    
    expect(page).to_have_url(re.compile(r"/login"))
    expect(e_mail).to_be_visible()
