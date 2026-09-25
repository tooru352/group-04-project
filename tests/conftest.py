"""
Pytest configuration and global fixtures for LMS Automated Test Suite.
"""
import pytest
import requests

BASE_URL = "http://localhost:4000"

@pytest.fixture(scope="session")
def api_base_url():
    return BASE_URL

@pytest.fixture(scope="session")
def session_requests():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s
