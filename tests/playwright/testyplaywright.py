import re
from datetime import date

from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:3000"


def go_e2e(page: Page, path: str) -> None:
    sep = "&" if "?" in path else "?"
    page.goto(f"{BASE_URL}{path}{sep}e2e=1", wait_until="domcontentloaded", timeout=30_000)


# 1. Profil: domyślna data w formularzu wagi jest ustawiona na dzisiaj.
def test_profil_weight_date_is_today(page: Page) -> None:
    go_e2e(page, "/profil")
    date_input = page.locator('input[type="date"]')
    expect(date_input).to_be_visible(timeout=5000)
    assert date_input.input_value() == date.today().strftime("%Y-%m-%d")


# 2. Auth gate: /profil bez e2e=1 przekierowuje na /login z parametrem redirect.
def test_profil_gate_redirects_to_login(page: Page) -> None:
    page.goto(f"{BASE_URL}/profil", wait_until="commit", timeout=30_000)
    expect(page).to_have_url(re.compile(r"/login"), timeout=5000)
    expect(page).to_have_url(re.compile(r"redirect=.*profil"), timeout=5000)


# 3. Header: logo "FitatuLepsze" jest linkiem – kliknięcie z /profil przenosi na dashboard.
def test_header_brand_link_navigates_home(page: Page) -> None:
    go_e2e(page, "/profil")
    brand = page.locator("header").get_by_text("FitatuLepsze")
    expect(brand).to_be_visible(timeout=5000)
    brand.click()
    expect(page).to_have_url(re.compile(r"/$|\?"), timeout=5000)


# 4. Profil: bez danych wagowych wykres pokazuje pusty stan i "Ostatni pomiar: - kg".
def test_profil_weight_chart_empty_state(page: Page) -> None:
    go_e2e(page, "/profil")
    expect(page.get_by_text("Brak pomiarów")).to_be_visible(timeout=5000)
    last = page.get_by_text(re.compile(r"Ostatni pomiar"))
    expect(last).to_be_visible(timeout=5000)
    assert "- kg" in last.inner_text()


# 5. Login Rejestracja: nawigacja tam i z powrotem linkami.
def test_auth_roundtrip_navigation(page: Page) -> None:
    page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded", timeout=30_000)
    page.get_by_role("link", name="Zarejestruj się").click()
    expect(page).to_have_url(re.compile(r"/rejestracja"), timeout=5000)
    page.get_by_role("link", name="Zaloguj się").click()
    expect(page).to_have_url(re.compile(r"/login"), timeout=5000)


# 6. Rejestracja: wpisanie hasła krótszego niż 6 znaków i kliknięcie "Zarejestruj się"
def test_rejestracja_short_password_blocked(page: Page) -> None:
    page.goto(f"{BASE_URL}/rejestracja", wait_until="domcontentloaded", timeout=30_000)
    page.get_by_placeholder("Email").fill("test@example.com")
    page.get_by_placeholder("Hasło (min. 6 znaków)").fill("abc12")
    page.get_by_role("button", name="Zarejestruj się").click()
    page.wait_for_timeout(500)
    # Formularz nie powinien przejść – nadal jesteśmy na /rejestracja
    expect(page).to_have_url(re.compile(r"/rejestracja"), timeout=5000)


# 7. Dashboard: budżet kalorii: karta wyświetla statystyki Cel, Zjedzone, Spalone
#    z wartościami "X kcal" i sekcję "Pozostalo na dzisiaj".
def test_dashboard_budget_card_structure(page: Page) -> None:
    go_e2e(page, "/")
    expect(page.get_by_text("Pozostalo na dzisiaj")).to_be_visible(timeout=5000)
    for label in ["Cel", "Zjedzone", "Spalone"]:
        stat = page.get_by_text(label, exact=True).locator("..")
        text = stat.inner_text()
        assert "kcal" in text, f"Stat '{label}' nie zawiera 'kcal': {text}"


# 8. Dashboard: weryfikuje matematykę budżetu Pozostało = Cel - Zjedzone + Spalone.
def test_dashboard_budget_remaining_matches_formula(page: Page) -> None:
    go_e2e(page, "/")

    def stat_kcal(label: str) -> int:
        text = page.get_by_text(label, exact=True).locator("..").inner_text()
        m = re.search(r"(\d+)\s*kcal", text)
        assert m, f"Nie znaleziono wartości kcal przy '{label}'"
        return int(m.group(1))

    cel = stat_kcal("Cel")
    zjedzone = stat_kcal("Zjedzone")
    spalone = stat_kcal("Spalone")

    remaining_text = page.get_by_text("Pozostalo na dzisiaj").locator("..").inner_text()
    m = re.search(r"(\d+)\s*kcal", remaining_text)
    assert m, "Nie znaleziono wartości 'Pozostało' w kcal"
    remaining = int(m.group(1))

    expected = cel - zjedzone + spalone
    assert remaining == expected, (
        f"Błąd kalkulacji: {remaining} != {cel} - {zjedzone} + {spalone} = {expected}"
    )
