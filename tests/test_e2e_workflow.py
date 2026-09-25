"""
Pytest End-to-End (E2E) Workflow Test Suite.
Simulates complete multi-role user journeys: Learner, Instructor, Reviewer, Admin.
"""
import pytest
import requests

def test_full_learner_workflow(api_base_url):
    # 1. Login Learner
    login_res = requests.post(f"{api_base_url}/api/auth/login", json={"email": "alice@lms.test", "password": "learner123"})
    assert login_res.status_code == 200
    
    # 2. Browse published courses
    catalog_res = requests.get(f"{api_base_url}/api/courses")
    assert catalog_res.status_code == 200
    
    # 3. Ask AI Tutor
    ai_res = requests.post(
        f"{api_base_url}/api/tutor/ask",
        headers={"x-user-role": "Learner"},
        json={"courseId": 1, "lessonId": 1, "question": "What is user research?"}
    )
    assert ai_res.status_code == 200

def test_full_instructor_workflow(api_base_url):
    # 1. Login Instructor
    login_res = requests.post(f"{api_base_url}/api/auth/login", json={"email": "bob@lms.test", "password": "instructor123"})
    assert login_res.status_code == 200
    
    # 2. Fetch instructor submissions
    sub_res = requests.get(
        f"{api_base_url}/api/instructor/submissions",
        headers={"x-user-role": "Instructor"}
    )
    assert sub_res.status_code == 200

def test_full_reviewer_workflow(api_base_url):
    # 1. Login Reviewer
    login_res = requests.post(f"{api_base_url}/api/auth/login", json={"email": "carol@lms.test", "password": "reviewer123"})
    assert login_res.status_code == 200
    
    # 2. Fetch assigned queue
    queue_res = requests.get(f"{api_base_url}/api/reviewer/submissions", headers={"x-user-role": "Reviewer"})
    assert queue_res.status_code == 200

def test_full_admin_workflow(api_base_url):
    # 1. Login Admin
    login_res = requests.post(f"{api_base_url}/api/auth/login", json={"email": "diana@lms.test", "password": "admin123"})
    assert login_res.status_code == 200
    
    # 2. Fetch users roster
    roster_res = requests.get(f"{api_base_url}/api/admin/users", headers={"x-user-role": "Admin"})
    assert roster_res.status_code == 200
    
    # 3. Query audit trail
    audit_res = requests.get(f"{api_base_url}/api/admin/audit", headers={"x-user-role": "Admin"})
    assert audit_res.status_code == 200
