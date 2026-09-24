# Story Spec

Story ID: US-LMS-06
Requirement IDs: REQ-LMS-05
Design link: S05 - Lesson Detail (Figma frame `10:10`)

Goal:
Allow a Learner to view Lessons within an enrolled Course.

Preconditions:
Learner is logged in.
Learner has enrolled in the Course (US-LMS-05 satisfied).
Lesson exists and is part of the Course.

Happy path:
1. Learner opens an enrolled Course (S04).
2. Learner selects a Lesson from the list.
3. System fetches and displays the Lesson content (S05).
4. Lesson content, title, and duration are visible.

Alternate/error paths:
- Learner not enrolled in Course → 403 Forbidden; show enrollment prompt.
- Lesson not found → 404; show error screen.
- API error → show retry option.

Data read/write:
- Read: Course (enrollment check), Lesson (id, title, content, duration, status)

API contract:
- GET `/api/lessons/:id`
- Response: `{ id, courseId, title, content, duration, status }`

Authorization:
- Learner must be enrolled in the Course that owns the Lesson.

Validation/business rules:
- Lesson must belong to a Course the Learner is enrolled in (BR-LMS-02, BR-LMS-03).
- Inactive/unpublished Lessons are not accessible to Learners.

Observability/logging:
- Log lesson view (userId, lessonId, courseId, timestamp).

Test plan:
- Integration test: enrolled Learner can fetch lesson; non-enrolled returns 403.
- E2E test: navigate from course to lesson; verify content renders.

Definition of Done:
- Enrolled Learner can view Lesson content.
- Non-enrolled Learner is denied access with a clear message.
