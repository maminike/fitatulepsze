"""Pytest configuration and fixtures for Playwright tests."""

import os
import pytest


@pytest.fixture(scope="session")
def base_url() -> str:
    """Return the base URL for the application."""
    return os.getenv("BASE_URL", "http://localhost:3000")
