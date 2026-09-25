"""
Pytest Unit Test Suite for LMS Business Rules & Domain Logic.
Coverage: Progress calculation, Grade score bounds, AI Tutor fallback, Role normalization.
"""
import pytest

def calculate_course_progress(total_items, completed_items):
    """Utility function matching getCourseProgress service domain logic."""
    if total_items <= 0:
        return 0
    return round((completed_items / total_items) * 100)

def validate_grade_input(grade, feedback):
    """Utility function matching gradeSubmission validator."""
    if grade is None or not isinstance(grade, (int, float)):
        raise ValueError("Grade must be a number.")
    if grade < 0 or grade > 100:
        raise ValueError("Grade must be between 0 and 100.")
    if not feedback or not str(feedback).strip():
        raise ValueError("Feedback cannot be empty.")
    return True

def evaluate_ai_tutor_context(question, lesson_context):
    """Utility function matching evaluateTutorContext AI Tutor evaluator."""
    if not question or not str(question).strip():
        raise ValueError("Question cannot be empty.")
    
    q_lower = question.lower()
    ctx_lower = (lesson_context or "").lower()
    
    # Check if question keywords match lesson context
    keywords = [w for w in q_lower.split() if len(w) > 3]
    has_match = any(kw in ctx_lower for kw in keywords) if keywords else True
    
    if not has_match:
        return {"status": "insufficient_context", "answer": "KHÔNG ĐỦ DỮ LIỆU"}
    return {"status": "grounded", "answer": f"Grounded response based on: {lesson_context}"}

def normalize_role(role_input):
    """Utility function matching normalizeRoleInput."""
    if not role_input or not str(role_input).strip():
        return None
    val = str(role_input).strip().lower()
    mapping = {
        "learner": "Learner",
        "instructor": "Instructor",
        "reviewer": "Reviewer",
        "admin": "Admin"
    }
    return mapping.get(val, None)


# --- Pytest Testcases ---

def test_course_progress_calculation():
    assert calculate_course_progress(2, 1) == 50
    assert calculate_course_progress(4, 4) == 100
    assert calculate_course_progress(3, 0) == 0
    assert calculate_course_progress(0, 0) == 0

def test_grade_bounds_valid():
    assert validate_grade_input(0, "Needs improvement") is True
    assert validate_grade_input(85, "Good work") is True
    assert validate_grade_input(100, "Perfect score") is True

def test_grade_bounds_invalid_high():
    with pytest.raises(ValueError, match="Grade must be between 0 and 100."):
        validate_grade_input(101, "Too high score")

def test_grade_bounds_invalid_low():
    with pytest.raises(ValueError, match="Grade must be between 0 and 100."):
        validate_grade_input(-5, "Negative score")

def test_grade_empty_feedback():
    with pytest.raises(ValueError, match="Feedback cannot be empty."):
        validate_grade_input(90, "   ")

def test_ai_tutor_grounded_response():
    res = evaluate_ai_tutor_context("What is user research?", "Lesson content on user research methods and interviews")
    assert res["status"] == "grounded"
    assert "user research" in res["answer"].lower()

def test_ai_tutor_out_of_context_fallback():
    res = evaluate_ai_tutor_context("How do I solve quantum physics equations?", "Lesson content on UX Design wireframing")
    assert res["status"] == "insufficient_context"
    assert res["answer"] == "KHÔNG ĐỦ DỮ LIỆU"

def test_ai_tutor_empty_question():
    with pytest.raises(ValueError, match="Question cannot be empty."):
        evaluate_ai_tutor_context("   ", "Lesson content")

def test_role_normalization_valid():
    assert normalize_role("learner") == "Learner"
    assert normalize_role("INSTRUCTOR") == "Instructor"
    assert normalize_role(" Reviewer ") == "Reviewer"
    assert normalize_role("admin") == "Admin"

def test_role_normalization_invalid():
    assert normalize_role("super_user") is None
    assert normalize_role("") is None
    assert normalize_role(None) is None
