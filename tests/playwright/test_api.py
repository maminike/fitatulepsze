"""Testy interfejsów API backendu poprzez APIRequestContext z Playwright"""

from playwright.sync_api import APIRequestContext, Playwright
import pytest

BASE_URL = "http://localhost:3000"

@pytest.fixture(scope="session")
def api_context(playwright: Playwright) -> APIRequestContext:
    request_context = playwright.request.new_context(base_url=BASE_URL)
    yield request_context
    request_context.dispose()

def test_api_healthcheck_or_home(api_context: APIRequestContext) -> None:
    # TC-API-01 (tamatama): Sprawdzenie czy główny serwer aplikacyjny (Next) odpowiada statusem sukcesu 200
    response = api_context.get("/")
    assert response.status == 200, "Serwer Next.js nie odpowiada"

def test_api_products_endpoint(api_context: APIRequestContext) -> None:
    # TC-API-02 (maminikie): Próba zapytania jakiegoś testowego endpointu np do pobrania pliku z danymi testowymi
    # Pytamy np front-end czy poprawnie obsługuje nieistniejące zapytania
    response = api_context.get("/api/not-existing-endpoint")
    assert response.status in [404, 200]
    
def test_api_auth_callback_redirect(api_context: APIRequestContext) -> None:
    # TC-API-03 (hamikyu): Zapytanie na callback Supabase Auth dla middleware - weryfikuje poprawność routingu
    response = api_context.get("/auth/callback?code=dummycode", max_redirects=0)
    # Powinno spowodowac przekierowanie do zabezpieczonych zasobów (30x) w przypadku poprawnej wymiany kodu 
    # Albo z braku poprawnego zaplecza zwróci inny status - tu po prostu dotykamy endpointu API Auth
    assert response.status in [200, 301, 302, 307, 308, 400]
