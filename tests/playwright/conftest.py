"""Pytest configuration and fixtures for Playwright tests."""

import pytest


@pytest.fixture(scope="session")
def base_url() -> str:
    """Adres dev-serwera Next (testy zakładają `npm run dev` na porcie 3000)."""
    return "http://localhost:3000"
