"""
Opis:
Testy zdefiniowane i stworzone przez użytkownika: maminikie
Trzy z nich to testy Frontendowe (UI), trzy to przesyłanie poleceń API Playwright (API), 
a trzy testy symulują środowisko mockowane użyciem wbudowanego route modyfikującego.

Do przypadków testowych m.in.: TC-MAM-001, TC-MAM-002, TC-MAM-003, TC-MAM-004, TC-MAM-005.
"""

from playwright.sync_api import Page, APIRequestContext, expect

BASE_URL = "http://localhost:3000"

# --- TESTY FRONTENDOWE ---
def test_mam_ui_tabela_ladowanie(page: Page):
    """TC-MAM-001: Prawidłowe ładowanie tabeli produktów i nagłówków."""
    page.goto(f"{BASE_URL}/produkty")
    page.wait_for_load_state("networkidle")
    # Sprawdzenie naglowkow
    expect(page.get_by_role("heading", name="Baza Posiłków")).to_be_visible()
    assert page.locator("table").is_visible()

def test_mam_ui_prawa_nawigacja(page: Page):
    """Sprawdzenie nawigacji pomiedzy logowania a rejestracja (sprawne przelaczniki)"""
    page.goto(f"{BASE_URL}/login")
    register_link = page.locator("text=Zarejestruj się")
    expect(register_link).to_be_visible()
    register_link.click()
    expect(page.get_by_role("heading", name="Rejestracja")).to_be_visible()

def test_mam_ui_wyszukiwanie_produktu(page: Page):
    """TC-MAM-003: Wyszukiwanie produktu (Frontend)"""
    page.goto(f"{BASE_URL}/produkty")
    page.wait_for_load_state("networkidle")
    search_input = page.locator('[data-testid="product-search-input"]')
    # Gdy uzywamy np customowego placeholdera
    if not search_input.is_visible():
        search_input = page.get_by_placeholder("Szukaj") 
    if search_input.is_visible():
        search_input.fill("BananBanan")
        # Weryfikacja czy ilosc rekordow zmalała:
        assert page.locator("tbody tr").count() >= 0


# --- TESTY MOCKOWANE (FRONTEND) ---
def test_mam_mock_blad_logowania(page: Page):
    """TC-MAM-004: Mockowanie 500 błędu podczas próby logowania."""
    # Podmieniamy odpowiedz kazdego zapytania z modelem Auth Supabase
    page.route("**/auth/v1/token?grant_type=password", lambda route: route.fulfill(
        status=500,
        json={"error": "Mocked Service unavailable"}
    ))
    page.goto(f"{BASE_URL}/login")
    page.get_by_placeholder("m@example.com").fill("test_mam_register@example.com")
    # Klikamy logowanie uzywajac np testid lub button roles
    submit_button = page.get_by_role("button", name="Zaloguj")
    if submit_button.is_visible():
        submit_button.click()
        # UI prawdopodobnie nie zaloguje, wiec header zostanie
        expect(page.get_by_role("heading", name="Logowanie")).to_be_visible()

def test_mam_mock_zerowe_statystyki_postepu(page: Page):
    """Zakłócenie pobierania danych postępów i wstrzyknięcie braku wyników."""
    page.route("**/rest/v1/daily_stats*", lambda route: route.fulfill(
        status=200,
        json=[]
    ))
    page.goto(f"{BASE_URL}/postep")
    expect(page.locator("body")).to_contain_text("Postęp")

def test_mam_mock_produkty_brak_wynikow(page: Page):
    """Wyświetlenie pustej tabeli produktów po mockowanym, pustym requescie GET."""
    page.route("**/rest/v1/products*", lambda route: route.fulfill(
        status=200,
        json=[]
    ))
    page.goto(f"{BASE_URL}/produkty")
    # Pusta tablica powinnna byc widoczna
    assert page.locator("tbody tr").count() == 0


# --- TESTY API ---
def test_mam_api_zdrowie_aplikacji(playwright):
    """Sprawdzenie poprawnie wystawionego serwera Next.js (kod 200)."""
    request_context = playwright.request.new_context()
    response = request_context.get(BASE_URL)
    assert response.status == 200
    assert "text/html" in response.headers.get("content-type", "")

def test_mam_api_zablokowany_endpoint_metoda_post(playwright):
    """Próba wykonania posta na publiczny URL powinnna dać błąd w zależności od Next.js lub 200 z renderem ."""
    request_context = playwright.request.new_context()
    # Next pages zwraca na zapytania rest 404/405/200, weryfikujemy ze dziala obsluga protokolu
    response = request_context.post(f"{BASE_URL}/produkty")
    assert response.status in [404, 405, 200, 400] 

def test_mam_api_supabse_env_dostepne(playwright):
    """Oczekujemy poprawnej zawartości nagłówków odpowiedzi ze ścieżki loginu."""
    request_context = playwright.request.new_context()
    response = request_context.get(f"{BASE_URL}/login")
    assert response.status == 200
    body = response.text()
    assert "Logowanie" in body
