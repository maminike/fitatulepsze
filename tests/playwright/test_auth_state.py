"""Testy stanu uwierzytelnienia z zapisywalna pomiecia context.storage_state() """

import pytest
from playwright.sync_api import Page, expect, Browser, Playwright
import os

BASE_URL = "http://localhost:3000"
STORAGE_STATE_PATH = "playwright/.auth/state.json"

@pytest.fixture(scope="session")
def auth_storage_state(playwright: Playwright) -> str:
    # Uzupełnij i przygotuj stan, gdy jeszcze go nie ma 
    os.makedirs(os.path.dirname(STORAGE_STATE_PATH), exist_ok=True)
    
    browser = playwright.chromium.launch()
    context = browser.new_context()
    page = context.new_page()
    
    # Przechodzimy testowe wejście autoryzacyjne. FitaTu przez ?e2e=1 nie potrzebuje wprawywania hasla
    # lub dodamy fejkowy cookie symulujacy bycie uzytkonwiekiem:
    page.goto(f"{BASE_URL}/login")
    context.add_cookies([
        {
            "name": "sb-test-auth-token",
            "value": "authenticated-dummy-token",
            "domain": "localhost",
            "path": "/",
        }
    ])
    page.goto(f"{BASE_URL}/dziennik?e2e=1")
    
    context.storage_state(path=STORAGE_STATE_PATH)
    context.close()
    browser.close()
    return STORAGE_STATE_PATH

@pytest.fixture
def auth_page(playwright: Playwright, auth_storage_state: str) -> Page:
    browser = playwright.chromium.launch()
    context = browser.new_context(storage_state=auth_storage_state)
    page = context.new_page()
    yield page
    context.close()
    browser.close()


def test_auth_dziennik_access(auth_page: Page) -> None:
    # TC-AUTH-STATE-01 (Zespolowy): Jako uwierzytelniony, uzytkownik wchodzi od razu na chroniony Dziennik
    auth_page.goto(f"{BASE_URL}/dziennik") # Brak e2e bypass
    expect(auth_page.get_by_role("heading", name="Dziennik")).to_be_visible()

def test_auth_profil_access(auth_page: Page) -> None:
    # TC-AUTH-STATE-02 (Zespolowy): Jako uwierzytelniony, użytkownik wchodzi w Profil
    auth_page.goto(f"{BASE_URL}/profil") 
    expect(auth_page.get_by_role("heading", name="Profil")).to_be_visible()
    
def test_auth_postep_access(auth_page: Page) -> None:
    # TC-AUTH-STATE-03 (Zespolowy): Sprawdza wejście na postep z zachowanym statem (ciasteczka/localStorage session)
    auth_page.goto(f"{BASE_URL}/postep")
    expect(auth_page.get_by_role("heading", name="Postep")).to_be_visible()
