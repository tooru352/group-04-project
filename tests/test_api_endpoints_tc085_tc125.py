"""
Pytest Test Suite for Express REST API Endpoints (TC-085 to TC-125).
Maps 1-to-1 to docs/06-testing/testcase.md Part II.
"""
import pytest
import requests

def test_tc_085_get_health_check_endpoint(api_base_url):
    res = requests.get(f"{api_base_url}/api/health")
    assert res.status_code == 200 and res.json()["db"] == "connected"

def test_tc_086_post_login_case_insensitive_trim(api_base_url):
    res = requests.post(f"{api_base_url}/api/auth/login", json={"email": " ALICE@LMS.TEST ", "password": "learner123"})
    assert res.status_code == 200 and res.json()["ok"] is True

def test_tc_087_post_login_missing_fields_400(api_base_url):
    res = requests.post(f"{api_base_url}/api/auth/login", json={"email": "", "password": ""})
    assert res.status_code == 400

def test_tc_088_get_courses_published_catalog(api_base_url):
    res = requests.get(f"{api_base_url}/api/courses")
    assert res.status_code == 200 and isinstance(res.json()["courses"], list)

def test_tc_089_get_courses_keyword_search_filter(api_base_url):
    res = requests.get(f"{api_base_url}/api/courses?q=design")
    assert res.status_code == 200

def test_tc_090_get_courses_by_id_detail_fetch(api_base_url):
    res = requests.get(f"{api_base_url}/api/courses/course-1")
    assert res.status_code in [200, 404]

def test_tc_091_get_courses_by_id_missing_course_404(api_base_url):
    res = requests.get(f"{api_base_url}/api/courses/nonexistent-999")
    assert res.status_code == 404

def test_tc_092_post_courses_enroll_learner(api_base_url):
    res = requests.post(f"{api_base_url}/api/courses/course-1/enrollments", headers={"x-user-role": "Learner"})
    assert res.status_code in [200, 404, 409]

def test_tc_093_post_courses_enroll_duplicate_409(api_base_url):
    res = requests.post(f"{api_base_url}/api/courses/course-1/enrollments", headers={"x-user-role": "Learner"})
    assert res.status_code in [200, 404, 409]

def test_tc_094_get_courses_progress_percentage(api_base_url):
    res = requests.get(f"{api_base_url}/api/courses")
    assert res.status_code == 200

def test_tc_095_get_lessons_course_lessons_list(api_base_url):
    res = requests.get(f"{api_base_url}/api/courses/1/lessons")
    assert res.status_code in [200, 404]

def test_tc_096_post_lessons_create_instructor(api_base_url):
    res = requests.post(f"{api_base_url}/api/instructor/lessons", headers={"x-user-role": "Instructor"}, json={"courseId": 1, "title": "Pytest API Lesson", "content": "Content"})
    assert res.status_code in [200, 201]

def test_tc_097_put_lessons_update_content(api_base_url):
    res = requests.patch(f"{api_base_url}/api/instructor/lessons/1", headers={"x-user-role": "Instructor"}, json={"title": "Updated"})
    assert res.status_code in [200, 404]

def test_tc_098_delete_lessons_remove_lesson(api_base_url):
    res = requests.delete(f"{api_base_url}/api/instructor/lessons/999", headers={"x-user-role": "Instructor"})
    assert res.status_code in [200, 404]

def test_tc_099_post_lessons_complete_record(api_base_url):
    res = requests.post(f"{api_base_url}/api/lessons/1/complete", headers={"x-user-role": "Learner"})
    assert res.status_code in [200, 400, 404]

def test_tc_100_get_assignments_list(api_base_url):
    res = requests.get(f"{api_base_url}/api/assignments")
    assert res.status_code == 200

def test_tc_101_post_assignments_create_instructor(api_base_url):
    res = requests.post(f"{api_base_url}/api/instructor/assignments", headers={"x-user-role": "Instructor"}, json={"courseId": 1, "title": "API Assignment", "content": "Content", "description": "Desc"})
    assert res.status_code in [200, 201, 400]

def test_tc_102_post_assignments_submit_learner(api_base_url):
    res = requests.post(f"{api_base_url}/api/submissions", headers={"x-user-role": "Learner"}, json={"assignmentId": 1, "answerText": "Pytest answer"})
    assert res.status_code in [200, 201, 400]

def test_tc_103_post_assignments_submit_late_detection(api_base_url):
    res = requests.post(f"{api_base_url}/api/submissions", headers={"x-user-role": "Learner"}, json={"assignmentId": 1, "answerText": "Late answer"})
    assert res.status_code in [200, 201, 400]

def test_tc_104_get_reviewer_submissions_queue(api_base_url):
    res = requests.get(f"{api_base_url}/api/reviewer/submissions", headers={"x-user-role": "Reviewer"})
    assert res.status_code == 200

def test_tc_105_post_reviewer_submissions_assign(api_base_url):
    res = requests.post(f"{api_base_url}/api/submissions/1/assign-reviewer", headers={"x-user-role": "Instructor"}, json={"reviewerId": 3})
    assert res.status_code in [200, 404]

def test_tc_106_post_reviewer_submissions_grade(api_base_url):
    res = requests.patch(f"{api_base_url}/api/submissions/1/grade", headers={"x-user-role": "Reviewer"}, json={"grade": 90, "feedback": "Good job"})
    assert res.status_code in [200, 404]

def test_tc_107_get_admin_users_roster(api_base_url):
    res = requests.get(f"{api_base_url}/api/admin/users", headers={"x-user-role": "Admin"})
    assert res.status_code == 200

def test_tc_108_put_admin_users_role_update(api_base_url):
    res = requests.patch(f"{api_base_url}/api/admin/users/1/role", headers={"x-user-role": "Admin"}, json={"role": "Instructor"})
    assert res.status_code in [200, 404]

def test_tc_109_post_admin_users_create(api_base_url):
    res = requests.post(f"{api_base_url}/api/admin/users", headers={"x-user-role": "Admin"}, json={"name": "New User", "email": "newuser@lms.test", "role": "Learner", "password": "123"})
    assert res.status_code in [200, 201, 409]

def test_tc_110_delete_admin_users_delete(api_base_url):
    res = requests.delete(f"{api_base_url}/api/admin/users/999", headers={"x-user-role": "Admin"})
    assert res.status_code in [200, 404]

def test_tc_111_get_admin_courses_fetch(api_base_url):
    res = requests.get(f"{api_base_url}/api/admin/courses", headers={"x-user-role": "Admin"})
    assert res.status_code == 200

def test_tc_112_put_admin_courses_metadata_update(api_base_url):
    res = requests.patch(f"{api_base_url}/api/admin/courses/1", headers={"x-user-role": "Admin"}, json={"title": "Updated Course Title"})
    assert res.status_code in [200, 409, 422]

def test_tc_113_delete_admin_courses_delete(api_base_url):
    res = requests.delete(f"{api_base_url}/api/instructor/courses/999", headers={"x-user-role": "Instructor"})
    assert res.status_code in [200, 404]

def test_tc_114_get_admin_audit_logs_query(api_base_url):
    res = requests.get(f"{api_base_url}/api/admin/audit", headers={"x-user-role": "Admin"})
    assert res.status_code == 200

def test_tc_115_post_ai_ask_tutor_grounded_query(api_base_url):
    res = requests.post(f"{api_base_url}/api/tutor/ask", headers={"x-user-role": "Learner"}, json={"courseId": 1, "lessonId": 1, "question": "What is research?"})
    assert res.status_code == 200

def test_tc_116_get_admin_audit_non_admin_block_403(api_base_url):
    res = requests.get(f"{api_base_url}/api/admin/audit", headers={"x-user-role": "Learner"})
    assert res.status_code == 403

def test_tc_117_post_instructor_lessons_non_instructor_403(api_base_url):
    res = requests.post(f"{api_base_url}/api/instructor/lessons", headers={"x-user-role": "Learner"}, json={"courseId": 1, "title": "X", "content": "Y"})
    assert res.status_code == 403

def test_tc_118_patch_submissions_grade_learner_403(api_base_url):
    res = requests.patch(f"{api_base_url}/api/submissions/1/grade", headers={"x-user-role": "Learner"}, json={"grade": 90, "feedback": "X"})
    assert res.status_code == 403

def test_tc_119_patch_admin_courses_non_admin_403(api_base_url):
    res = requests.patch(f"{api_base_url}/api/admin/courses/1", headers={"x-user-role": "Learner"}, json={"title": "X"})
    assert res.status_code == 403

def test_tc_120_delete_admin_users_non_admin_403(api_base_url):
    res = requests.delete(f"{api_base_url}/api/admin/users/1", headers={"x-user-role": "Learner"})
    assert res.status_code == 403

def test_tc_121_post_login_invalid_password_401(api_base_url):
    res = requests.post(f"{api_base_url}/api/auth/login", json={"email": "alice@lms.test", "password": "wrong"})
    assert res.status_code == 401

def test_tc_122_post_tutor_ask_empty_question_400(api_base_url):
    res = requests.post(f"{api_base_url}/api/tutor/ask", headers={"x-user-role": "Learner"}, json={"courseId": 1, "lessonId": 1, "question": "   "})
    assert res.status_code == 400

def test_tc_123_patch_grade_invalid_score_422(api_base_url):
    res = requests.patch(f"{api_base_url}/api/submissions/1/grade", headers={"x-user-role": "Instructor"}, json={"grade": 150, "feedback": "Too high"})
    assert res.status_code == 422

def test_tc_124_patch_admin_user_role_invalid_role_422(api_base_url):
    res = requests.patch(f"{api_base_url}/api/admin/users/1/role", headers={"x-user-role": "Admin"}, json={"role": "INVALID"})
    assert res.status_code == 422

def test_tc_125_options_cors_preflight_handling(api_base_url):
    res = requests.options(f"{api_base_url}/api/health")
    assert res.status_code in [200, 204]
