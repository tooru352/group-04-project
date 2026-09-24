# Story Spec

Story ID: US-LMS-07
Requirement IDs: REQ-LMS-06
Design link: S05 - Lesson Detail (Figma frame `10:10`)

Goal:
Allow a Learner to mark a Lesson as complete so that their learning activity is recorded.

Preconditions:
Learner is logged in and enrolled in the Course.
Learner is viewing the Lesson (US-LMS-06 satisfied).
Lesson has not yet been marked complete by this Learner.

Happy path:
1. Learner reads the Lesson content.
2. Learner clicks "Mark as Complete".
3. System records a LessonCompletion record for this Learner + Lesson.
4. Lesson status indicator updates to "Completed".

Alternate/error paths:
- Lesson already marked complete → show "Already completed" state; no duplicate record created.
- Network error → show retry option; do not show success prematurely.

Data read/write:
- Read: LessonCompletion (check existing), Lesson
- Write: LessonCompletion (userId, lessonId, completedAt)

API contract:
- POST `/api/lessons/:id/complete`
- Request: (no body required)
- Response: `{ lessonId, userId, completedAt, status: "completed" }`

Authorization:
- Learner must be enrolled in the Course containing the Lesson.

Validation/business rules:
- One completion record per Learner per Lesson.
- Completion must not be created without enrollment.

Observability/logging:
- Log completion event (userId, lessonId, courseId, timestamp).

Test plan:
- Unit test duplicate completion prevention.
- Integration test: POST completion → verify record exists.
- E2E test: mark lesson complete → verify indicator changes.

Definition of Done:
- Completion persists and is shown on subsequent Lesson views.
- Duplicate completion attempts are safely ignored.
