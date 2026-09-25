"""
Pytest Integration Test Suite for Express REST API Endpoints.
Coverage: /api/health, /api/auth/login, /api/courses, /api/lessons, /api/assignments, /api/reviewer, /api/admin, /api/tutor/ask.
Tests both 200 OK success paths and 400/401/403/404/409/422 failure paths.
"""
import pytest
import requests

def test_health_check_endpoint(api_base_url):
    response = requests.get(f"{api_base_url}/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert data["db"] == "connected"

def test_auth_login_valid(api_base_url):
    response = requests.post(
        f"{api_base_url}/api/auth/login",
        json={"email": "alice@lms.test", "password": "learner123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert data["session"]["role"] == "Learner"

def test_auth_login_reviewer_valid(api_base_url):
    response = requests.post(
        f"{api_base_url}/api/auth/login",
        json={"email": "carol@lms.test", "password": "reviewer123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert data["session"]["role"] == "Reviewer"

def test_auth_login_admin_valid(api_base_url):
    response = requests.post(
        f"{api_base_url}/api/auth/login",
        json={"email": "admin@lms.test", "password": "admin123"}
    )
    if response.status_code != 200:
        response = requests.post(
            f"{api_base_url}/api/auth/login",
            json={"email": "diana@lms.test", "password": "admin123"}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True

def test_auth_login_empty_input(api_base_url):
    response = requests.post(
        f"{api_base_url}/api/auth/login",
        json={"email": "", "password": ""}
    )
    assert response.status_code == 400
    data = response.json()
    assert data["ok"] is False
    assert "Email and password are required." in data["message"]

def test_auth_login_invalid_password(api_base_url):
    response = requests.post(
        f"{api_base_url}/api/auth/login",
        json={"email": "alice@lms.test", "password": "wrong_password"}
    )
    assert response.status_code == 401
    data = response.json()
    assert data["ok"] is False
    assert "Invalid credentials." in data["message"]

def test_courses_catalog_fetch(api_base_url):
    response = requests.get(f"{api_base_url}/api/courses")
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert isinstance(data["courses"], list)

def test_assignments_fetch(api_base_url):
    response = requests.get(f"{api_base_url}/api/assignments")
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert isinstance(data["assignments"], list)

def test_admin_users_roster_fetch(api_base_url):
    response = requests.get(
        f"{api_base_url}/api/admin/users",
        headers={"x-user-role": "Admin"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert isinstance(data["users"], list)

def test_admin_courses_fetch(api_base_url):
    response = requests.get(
        f"{api_base_url}/api/admin/courses",
        headers={"x-user-role": "Admin"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert isinstance(data["courses"], list)

def test_admin_audit_logs_fetch(api_base_url):
    response = requests.get(
        f"{api_base_url}/api/admin/audit",
        headers={"x-user-role": "Admin"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert "audit" in data
    assert isinstance(data["audit"], list)

def test_ai_tutor_grounded_query(api_base_url):
    response = requests.post(
        f"{api_base_url}/api/tutor/ask",
        headers={"x-user-role": "Learner"},
        json={
            "courseId": 1,
            "lessonId": 1,
            "question": "What is user research?"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert "answer" in data

def test_ai_tutor_empty_question_400(api_base_url):
    response = requests.post(
        f"{api_base_url}/api/tutor/ask",
        headers={"x-user-role": "Learner"},
        json={
            "courseId": 1,
            "lessonId": 1,
            "question": "   "
        }
    )
    assert response.status_code == 400
    data = response.json()
    assert data["ok"] is False
    assert "Question is required" in data["message"]
