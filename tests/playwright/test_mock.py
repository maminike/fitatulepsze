"""Testy z uzyciem mockowania odpowiedzi sieciowych by Playwright page.route()"""

import re
from playwright.sync_api import Page, Route, expect

BASE_URL = "http://localhost:3000"

def test_mock_empty_dashboard(page: Page) -> None:
    # TC-MOCK-01 (tamatama): Mockowanie pustego stanu kalorii na dashboardzie
    def handle_route(route: Route):
        # Symulujemy zwrotkę z pustymi sumami np z wlasnego api / supabase
        route.fulfill(
            status=200,
            content_type="application/json",
            body='[]'
        )
    # mockujemy byle jaki endpoint zewnetrzny
    page.route("**/rest/v1/food_diary*", handle_route)
    page.goto(f"{BASE_URL}/?e2e=1", wait_until="domcontentloaded")
    
    # Skoro api zwrocilo nic (0 wpisow), "Budzet kalorii" nadal dziala jako naglowek
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()

def test_mock_product_search_error(page: Page) -> None:
    # TC-MOCK-02 (maminikie): Symulacja awarii serwera API (500) podczasa pobierania produktów
    def handle_route_fail(route: Route):
        route.fulfill(
            status=500,
            content_type="application/json",
            body='{"error": "Internal Server Error"}'
        )
    page.route("**/rest/v1/products*", handle_route_fail)
    page.goto(f"{BASE_URL}/produkty?e2e=1", wait_until="domcontentloaded")
    
    # Sprawdzenie czy aplikacja nie wykopuje krytycznego błędu na sam interfejs tabeli i ładuje stronę
    expect(page.get_by_role("heading", name="Baza")).to_be_visible()

def test_mock_progress_fake_data(page: Page) -> None:
    # TC-MOCK-03 (hamikyu): Wstrzyknięcie zmockowanej odp dla wykresów by wyswietlic testowy stan i streak
    def handle_route_prog(route: Route):
        route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"calories": 2000, "protein": 150, "carbs": 250, "fat": 50}]'
        )
    page.route("**/rest/v1/daily_stats*", handle_route_prog)
    page.goto(f"{BASE_URL}/postep?e2e=1", wait_until="domcontentloaded")
    
    expect(page.get_by_role("heading", name="Postep")).to_be_visible()
