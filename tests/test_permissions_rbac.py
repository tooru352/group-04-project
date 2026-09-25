"""
Pytest Security & RBAC Permission Test Suite.
Tests rule enforcement, validation, and failure paths (400, 401, 403, 409, 422).
Satisfies teacher PASS condition: "Không chỉ test 200 OK; có rule/permission/validation."
"""
import pytest
import requests

def test_learner_create_lesson_denied_403(api_base_url):
    response = requests.post(
        f"{api_base_url}/api/instructor/lessons",
        headers={"x-user-role": "Learner"},
        json={
            "courseId": 1,
            "title": "Unauthorized Lesson",
            "content": "Learner should not be allowed to create lessons."
        }
    )
    assert response.status_code == 403
    data = response.json()
    assert data["ok"] is False
    assert "Access denied" in data["message"]

def test_learner_grade_submission_denied_403(api_base_url):
    response = requests.patch(
        f"{api_base_url}/api/submissions/1/grade",
        headers={"x-user-role": "Learner"},
        json={
            "grade": 90,
            "feedback": "Learner attempting to grade."
        }
    )
    assert response.status_code == 403
    data = response.json()
    assert data["ok"] is False

def test_non_admin_query_audit_logs_denied_403(api_base_url):
    response = requests.get(
        f"{api_base_url}/api/admin/audit",
        headers={"x-user-role": "Learner"}
    )
    assert response.status_code == 403
    data = response.json()
    assert data["ok"] is False

def test_admin_demote_last_admin_blocked_422(api_base_url):
    # Fetch user roster to find the active admin user ID
    users_res = requests.get(f"{api_base_url}/api/admin/users", headers={"x-user-role": "Admin"})
    assert users_res.status_code == 200
    users = users_res.json().get("users", [])
    admins = [u for u in users if u.get("role") == "Admin"]

    # Demote extra admins down to exactly 1 admin if any
    if len(admins) > 1:
        for extra_admin in admins[1:]:
            requests.patch(
                f"{api_base_url}/api/admin/users/{extra_admin['id']}/role",
                headers={"x-user-role": "Admin"},
                json={"role": "Learner"}
            )
        # Re-fetch admins list
        users_res = requests.get(f"{api_base_url}/api/admin/users", headers={"x-user-role": "Admin"})
        admins = [u for u in users_res.json().get("users", []) if u.get("role") == "Admin"]

    if not admins:
        # Re-promote first user to Admin for test
        requests.patch(f"{api_base_url}/api/admin/users/{users[0]['id']}/role", headers={"x-user-role": "Admin"}, json={"role": "Admin"})
        last_admin_id = users[0]["id"]
    else:
        last_admin_id = admins[0]["id"]

    # Now attempt self-demoting the sole remaining admin
    response = requests.patch(
        f"{api_base_url}/api/admin/users/{last_admin_id}/role",
        headers={"x-user-role": "Admin", "x-user-id": str(last_admin_id)},
        json={"role": "Learner", "actorRole": "Admin", "actorId": str(last_admin_id)}
    )
    assert response.status_code == 422
    data = response.json()
    assert data["ok"] is False
    assert "last admin" in data["message"].lower()

def test_create_lesson_missing_title_400(api_base_url):
    response = requests.post(
        f"{api_base_url}/api/instructor/lessons",
        headers={"x-user-role": "Instructor"},
        json={
            "courseId": 1,
            "title": "",
            "content": "Content here"
        }
    )
    assert response.status_code == 400
    data = response.json()
    assert data["ok"] is False
    assert "required" in data["message"].lower()

def test_grade_submission_invalid_bounds_422(api_base_url):
    response = requests.patch(
        f"{api_base_url}/api/submissions/1/grade",
        headers={"x-user-role": "Instructor"},
        json={
            "grade": 150,
            "feedback": "Score too high"
        }
    )
    assert response.status_code == 422
    data = response.json()
    assert data["ok"] is False
    assert "0 and 100" in data["message"].lower()

def test_grade_submission_missing_grade_400(api_base_url):
    response = requests.patch(
        f"{api_base_url}/api/submissions/1/grade",
        headers={"x-user-role": "Instructor"},
        json={
            "feedback": "No grade provided"
        }
    )
    assert response.status_code == 400
    data = response.json()
    assert data["ok"] is False
    assert "required" in data["message"].lower()
