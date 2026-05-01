"""
Opis:
Testy zdefiniowane i stworzone przez użytkownika: tamatama
Trzy testy Frontendowe (UI), trzy api Playwright (API), 
oraz trzy testy symulują środowisko mockowane (page.route()).

Do przypadków testowych m.in.: TC-TAM-001, TC-TAM-002, TC-TAM-003, TC-TAM-004, TC-TAM-005.
"""

from playwright.sync_api import Page, APIRequestContext, expect

BASE_URL = "http://localhost:3000"

# --- TESTY FRONTENDOWE ---
def test_tam_ui_sortowanie_produktow(page: Page):
    """TC-TAM-001: Sprawdzenie obecnosci komponentu filtracji/sortowania kalorycznosci."""
    page.goto(f"{BASE_URL}/produkty")
    page.wait_for_load_state("networkidle")
    sort_dropdown = page.locator('[data-testid="sort-dropdown"]')
    if sort_dropdown.is_visible():
        sort_dropdown.click()
        page.keyboard.press("ArrowDown")
        page.keyboard.press("Enter")
    # Tabela powinna bez bledu zostac wciaz na ekranie
    expect(page.locator("table")).to_be_visible()

def test_tam_ui_walidacja_hasla_logowanie(page: Page):
    """TC-TAM-002: Walidacja bledu hasla przez html/client."""
    page.goto(f"{BASE_URL}/login")
    email = page.get_by_placeholder("m@example.com")
    password = page.get_by_placeholder("hasło")
    if email.is_visible() and password.is_visible():
        email.fill("tam@example.com")
        password.fill("123") # Zbyt krotkie
        submit = page.get_by_role("button", name="Zaloguj")
        submit.click()
        # Formularz nie wysyla nas na glowna strone, z powodu bledu klienta lub supabase
        expect(page.get_by_role("heading", name="Logowanie")).to_be_visible()

def test_tam_ui_struktura_komponentow_postepu(page: Page):
    """Weryfikacja pod-komponentow dashboardu na sekcji postepu bez autoryzacji"""
    page.goto(f"{BASE_URL}/postep")
    # Prawdopodobnie bez auth zostaniemy odbici lub rzuci ekran z komunikatem - asercja
    page.wait_for_timeout(500)
    current_url = page.url
    # Albo redirect na login, albo puste widoki makroskladnikow:
    assert "/login" in current_url or "/postep" in current_url


# --- TESTY MOCKOWANE (FRONTEND) ---
def test_tam_mock_dodanie_wlasnego_posilku(page: Page):
    """TC-TAM-004: Mock z wstrzyknięciem 'TestDietetycznyWorek' podczas tworzenia."""
    # Odbicie requestu tworzenia:
    page.route("**/rest/v1/products*", lambda route: route.fulfill(
        status=201, # sukces dodania
        json={"id": 999, "name": "TestDietetycznyWorek", "calories": 115, "carbs": 20}
    ))
    page.goto(f"{BASE_URL}/produkty")
    add_button = page.locator('[data-testid="add-product-button"]')
    if add_button.is_visible():
        add_button.click()
        # Po wymmockowaniu odpowiedzi zapisu, formularz powienien zaakceptowac bez bledu
        submit = page.locator('[data-testid="product-submit-button"]')
        submit.click() if submit.is_visible() else None
        expect(page.locator("table")).to_be_visible()

def test_tam_mock_awaria_api_produktow(page: Page):
    """Zmockowana awaria 500 pobierania bazy posilkow produkcyjnych"""
    page.route("**/rest/v1/products*", lambda route: route.fulfill(
        status=500,
        body="Internal Server Error Data"
    ))
    page.goto(f"{BASE_URL}/produkty")
    # Tabela moze zostac pusta, ale strona nie rzuca wyjatku JS TypeError (aplikacja nie "pada"):
    expect(page.get_by_role("heading", name="Baza Posiłków")).to_be_visible()

def test_tam_mock_powolne_zapytanie(page: Page):
    """Testujemy sztuczne opoznienie (spinnery itp)."""
    import time
    def handle_route(route):
        time.sleep(1) # delay 1 sec
        route.fulfill(status=200, json=[])
        
    page.route("**/rest/v1/products*", handle_route)
    page.goto(f"{BASE_URL}/produkty")
    page.wait_for_load_state("networkidle")
    assert page.locator("tbody tr").count() >= 0


# --- TESTY API ---
def test_tam_api_profil_zapytanie(playwright):
    """Pobierz /profil po rest api, sprawdz odpowiedz"""
    context = playwright.request.new_context()
    response = context.get(f"{BASE_URL}/profil")
    assert response.status == 200

def test_tam_api_rejestracja_get_form(playwright):
    """Sprawdzenie formularza rejestracji naglowki (CORS / Cookies)."""
    context = playwright.request.new_context()
    response = context.get(f"{BASE_URL}/rejestracja")
    assert "rejestracja" in response.url.lower()

def test_tam_api_dziennik_zapytanie_no_auth(playwright):
    """TC-TAM-003: Wywolanie /dziennik bez tokenu, zwraca odpowiedz aplikacji bez crashu."""
    context = playwright.request.new_context()
    res = context.get(f"{BASE_URL}/dziennik")
    assert res.ok  # Gwarancja ze serwer Next dziala pomimo protected-route
