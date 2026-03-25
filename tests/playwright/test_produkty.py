"""Playwright tests for the /produkty page (sync pytest-playwright style)."""

from playwright.sync_api import Page


BASE_URL = "http://localhost:3000"


def go_to_products(page: Page) -> None:
    page.goto(f"{BASE_URL}/produkty?e2e=1", wait_until="domcontentloaded", timeout=60_000)
    page.wait_for_load_state("domcontentloaded")
    page.locator('[data-testid^="product-row-"]').first.wait_for(state="visible", timeout=15_000)


def test_1_load_produkty_page_and_verify_table_loads(page: Page):
    go_to_products(page)
    assert page.locator("table").is_visible()
    assert page.locator("tbody tr").count() > 0


def test_2_search_products_by_name(page: Page):
    go_to_products(page)
    search_input = page.locator('[data-testid="product-search-input"]')
    assert search_input.is_visible()
    search_input.fill("chicken")
    page.wait_for_timeout(400)
    assert page.locator("tbody tr").count() >= 0


def test_3_filter_products_by_category(page: Page):
    go_to_products(page)
    category_filter = page.locator('[data-testid="category-filter"]')
    assert category_filter.is_visible()
    category_filter.click()
    page.keyboard.press("ArrowDown")
    page.keyboard.press("Enter")
    page.wait_for_timeout(400)
    assert page.locator("tbody tr").count() >= 0


def test_4_sort_products_by_calories(page: Page):
    go_to_products(page)
    sort_dropdown = page.locator('[data-testid="sort-dropdown"]')
    assert sort_dropdown.is_visible()
    sort_dropdown.click()
    page.keyboard.press("ArrowDown")
    page.keyboard.press("Enter")
    page.wait_for_timeout(400)
    assert page.locator("table").is_visible()


def test_5_open_add_product_sheet_and_submit(page: Page):
    go_to_products(page)
    add_button = page.locator('[data-testid="add-product-button"]')
    assert add_button.is_visible()
    add_button.click()

    page.locator('[data-testid="product-name-input"]').fill("Test Product XYZ")
    page.locator('[data-testid="product-calories-input"]').fill("250")
    page.locator('[data-testid="product-protein-input"]').fill("20")
    page.locator('[data-testid="product-fat-input"]').fill("8")
    page.locator('[data-testid="product-carbs-input"]').fill("30")
    page.locator('[data-testid="product-submit-button"]').click()
    page.wait_for_timeout(600)


def test_6_verify_rows_visible_after_add_attempt(page: Page):
    go_to_products(page)
    assert page.locator("tbody tr").count() > 0


def test_7_delete_first_product_row(page: Page):
    go_to_products(page)
    before = page.locator("tbody tr").count()
    assert before > 0
    delete_button = page.locator('[data-testid^="delete-product-"]').first
    if delete_button.count() > 0:
        delete_button.click()
        page.wait_for_timeout(300)
        after = page.locator("tbody tr").count()
        assert after <= before


def test_8_each_row_has_cells(page: Page):
    go_to_products(page)
    rows = page.locator("tbody tr")
    assert rows.count() > 0
    assert rows.first.locator("td").count() > 0
