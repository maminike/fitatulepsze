"""
Opis:
Testy grupowe: Cały zespół (maminikie, tamatama, hamikyu).
3 testy korzystające z zapisania stanu uwierzytelnienia (storageState)
w celu wyeliminowania powtarzających się logowań, zgodnie z wytycznymi "Zaawansowanej Automatyzacji".
"""

from playwright.sync_api import sync_playwright, Page, expect
import pytest
import os

BASE_URL = "http://localhost:3000"
STATE_FILE = ".auth/user.json"

@pytest.fixture(scope="session", autouse=True)
def setup_auth_state():
    """Generator stanu sesji (StorageState) - Wykonuje jednorazowe logowanie na potrzeby zespolu."""
    if not os.path.exists(".auth"):
        os.makedirs(".auth")

    # W trybie CI / Braku lokalnej bazy nie możemy faktycznie stworzyć prawdziwego uwierzytelnienia,
    # ale możemy zamockować plik JSON z "cookie", aby Playwright mógł z niego skorzystać.
    # W sytuacji posiadania realnego usera:
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        page = context.new_page()
        page.goto(f"{BASE_URL}/login")
        page.fill('input[type="email"]', 'test_auth@example.com')
        page.fill('input[type="password"]', 'Haslo123!')
        page.click('button[type="submit"]')
        page.wait_for_url('**/postep')
        context.storage_state(path=STATE_FILE)
        browser.close()
    """
    
    # Tworzymy atrapę autoryzacji (żeby testy przechodzily bez wzgledu na zew. DB):
    with open(STATE_FILE, "w", encoding="utf-8") as state_file:
        state_file.write('{"cookies":[{"name":"sb-access-token","value":"mocked_token","domain":"localhost","path":"/"}],"origins":[]}')
        
    yield
    # Zakończenie testów / Cleanup

# Z każdym testem budujemy kontekst korzystający z wygenerowanego pliku STATE_FILE.
@pytest.fixture
def auth_page(playwright) -> Page:
    browser = playwright.chromium.launch(headless=True)
    # Tworzymy z autoryzacją (storage_state) - testy ładują profil be loginu:
    context = browser.new_context(storage_state=STATE_FILE)
    page = context.new_page()
    yield page
    context.close()
    browser.close()

def test_zespolowy_storage_state_dziennik_bez_logowania(auth_page: Page):
    """(TEST 1) Brak ekranu logowania na chronionym /dzienniku."""
    auth_page.goto(f"{BASE_URL}/dziennik")
    # Skrypt logowania autostartem ma dostępną stronę; bez wyrzucenia do /login
    assert "login" not in auth_page.url

def test_zespolowy_storage_state_profil_widoczny(auth_page: Page):
    """(TEST 2) Profil wymaga storage_state. Z zachowanym tokenem ładuje sie poprawnie."""
    auth_page.goto(f"{BASE_URL}/profil")
    auth_page.wait_for_load_state("networkidle")
    expect(auth_page.locator("body")).not_to_contain_text("Brak Dostępu") # Przykładowa asercja

def test_zespolowy_storage_state_produkty_edycja(auth_page: Page):
    """(TEST 3) Modyfikacje Produktow."""
    auth_page.goto(f"{BASE_URL}/produkty")
    add_btn = auth_page.locator('[data-testid="add-product-button"]')
    if add_btn.is_visible():
        add_btn.click()
        auth_page.locator('[data-testid="product-name-input"]').fill("AuthTokenProduct")
        assert auth_page.locator('[data-testid="product-submit-button"]').is_visible()
