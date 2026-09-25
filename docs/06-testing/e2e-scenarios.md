# 18.27. Output #27 - E2E Scenarios (Kịch bản Kiểm thử Toàn trình Hệ thống LMS)

> **Artifact / Output**: E2E Scenarios Document  
> **Mã Output**: Output #27 - E2E Scenarios  
> **Đường dẫn file**: `docs/06-testing/e2e-scenarios.md`  
> **Định dạng**: Standard Gherkin Syntax (`Scenario` / `Given` / `When` / `Then` / `And`)  
> **Dự án áp dụng**: Hệ thống Quản lý Học tập LMS (Learner, Instructor, Reviewer, Admin, AI Tutor)  

---

## Scenario 1: Learner completes AI-assisted course study and assignment submission

```gherkin
Scenario: Learner completes AI-assisted course study and assignment submission
Given learner "Alice" (email: "alice@lms.test") is logged into the LMS SPA
And course "UX Design Fundamentals" is published with active enrollment
When learner searches "UX" in the course catalog and selects "UX Design Fundamentals"
Then app displays course progress as "0%" with 2 required lessons and 1 assignment
When learner clicks "Start Lesson 1: User Research Methods"
Then app renders lesson content and video embed container
When learner clicks "Ask AI Tutor" floating button and submits question "Explain user interviews simply"
Then AI Tutor returns a grounded response with source reference "Lesson 1: User Research Methods"
When learner clicks "Mark Lesson Complete"
Then course progress updates dynamically to "50%" without full page reload
When learner navigates to "Assignment 1: Research Plan Document"
And submits answer text "My research plan focuses on interviewing 5 target personas..."
Then server records submission timestamp and sets is_late = false
And submission status changes to "Submitted (Awaiting Grading)"
And audit log records event SUBMISSION_CREATED with learnerId "learner-1"
```

---

## Scenario 2: Instructor creates ordered lesson and assignment with deadline policy

```gherkin
Scenario: Instructor creates ordered lesson and assignment with deadline policy
Given instructor "Bob" (email: "bob@lms.test") is logged into the LMS SPA
And instructor manages course "Advanced Data Storytelling"
When instructor navigates to "Managed Courses" and selects "Advanced Data Storytelling"
Then app renders course management dashboard with existing 2 lessons
When instructor clicks "Add New Lesson" modal button
And fills lesson title "Stakeholder Interviews" and duration "15 min"
Then app automatically pre-fills position index sort_order = 3 (COALESCE MAX + 1)
When instructor clicks "Save Lesson"
Then new lesson is inserted at position 3 behind existing lessons
When instructor navigates to "Assignment Manager" and clicks "Create Assignment"
And inputs title "Data Storytelling Pitch Deck", deadline "2026-10-01T23:59:00Z", and disallows resubmission
Then server creates assignment record with resubmission_allowed = false
And success toast "Assignment created successfully" displays for 3 seconds
And audit log records events LESSON_CREATED and ASSIGNMENT_CREATED
```

---

## Scenario 3: Reviewer evaluates assigned submission with score and required feedback

```gherkin
Scenario: Reviewer evaluates assigned submission with score and required feedback
Given reviewer "Charlie" (email: "charlie@lms.test") is logged into the LMS SPA
And instructor "Bob" assigned submission "submission-2" of learner "Alice" to reviewer "Charlie"
When reviewer opens "Assigned Queue" drawer
Then app displays submission "submission-2" with status "Assigned / Awaiting Grading"
When reviewer clicks "Grade Submission" to open evaluation drawer
And inputs grade score "92" (validated strictly within 0-100 range)
And inputs feedback text "Clear, thoughtful analysis with strong persona evidence."
And selects evaluation status "Passed"
When reviewer clicks "Submit Grade & Feedback"
Then server updates submission status to "Graded", grade = 92, reviewerId = "reviewer-1"
And learner "Alice" receives grade update notification in SPA
And audit log records event SUBMISSION_GRADED with reviewerId "reviewer-1"
```

---

## Scenario 4: Admin manages user roles, blocks last admin demotion, and inspects audit trail

```gherkin
Scenario: Admin manages user roles, blocks last admin demotion, and inspects audit trail
Given admin "Dave" (email: "admin@lms.test") is logged into the LMS SPA
And "admin@lms.test" is the sole remaining active Admin in the system
When admin navigates to "User Management Console"
Then app displays user roster with role color badges (Admin=Purple, Instructor=Blue, Learner=Gray)
When admin selects learner "Alice" and updates role to "Instructor"
Then server updates role to "Instructor" and returns success status 200
When admin attempts to change own role "Dave" from "Admin" to "Learner"
Then server rejects request with HTTP 422 Unprocessable Entity and message "Cannot remove the last admin."
And app displays error alert banner "Cannot remove the last admin."
When admin navigates to "Audit Logs Console" and filters by action "USER_ROLE_UPDATE"
Then app displays append-only audit trail entries tracking previous role change for "Alice"
And audit log records event ROLE_UPDATE_ATTEMPT_BLOCKED for self-demotion
```

---

## Scenario 5: Learner encounters out-of-context AI Tutor fallback response

```gherkin
Scenario: Learner encounters out-of-context AI Tutor fallback response
Given learner "Alice" (email: "alice@lms.test") is enrolled in course "UX Design Fundamentals"
And learner is currently viewing "Lesson 1: User Research Methods"
When learner opens AI Tutor chat modal
And submits an out-of-context question "How do I calculate quantum physics equations?"
Then AI Tutor evaluator classifies intent and detects question is outside lesson scope
And AI Tutor returns response text "KHÔNG ĐỦ DỮ LIỆU" with status "insufficient_context"
And app displays yellow warning badge "Out-of-context Question"
And no hallucinated answer is generated or saved
```
