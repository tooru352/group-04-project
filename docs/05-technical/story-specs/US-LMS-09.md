# Story Spec

Story ID: US-LMS-09
Requirement IDs: REQ-LMS-21
Design link: S04 - Course Detail (Figma frame `10:9`)

Goal:
The system recognizes Course Completion when all required Lessons and Assignments are fulfilled.

Preconditions:
Learner is enrolled in the Course.
All required Lessons and Assignments are defined in the Course.

Happy path:
1. Learner completes the last required Lesson or Assignment.
2. System evaluates the completion rule (BR-LMS-12, BR-LMS-13).
3. All required items are complete → system marks Course as "Completed".
4. Course Detail (S04) shows "Completed" badge/status.

Alternate/error paths:
- Not all required items complete → Course remains "In Progress"; no Completed status shown.
- Completion trigger fails → log anomaly; Course status stays unchanged.

Data read/write:
- Read: Course, Lesson, LessonCompletion, Assignment, Submission, Enrollment
- Write: Enrollment or CourseCompletion record (status → "completed")

API contract:
- Completion check is triggered automatically after POST `/api/lessons/:id/complete` or POST `/api/submissions`.
- GET `/api/courses/:id/progress` reflects completion status.
- Response: `{ ..., isCompleted: true/false }`

Authorization:
- Learner must be enrolled in the Course.
- System evaluates completion server-side; Learner cannot self-declare completion.

Validation/business rules:
- Course Completed = all required Lessons completed AND all required Assignments submitted (BR-LMS-12, BR-LMS-13).
- A single missing required item prevents Completed status.

Observability/logging:
- Log course completion event (userId, courseId, completedAt).

Test plan:
- Unit test completion rule with various lesson/assignment states.
- Integration test: completing last required item triggers completed status.
- E2E test: verify "Completed" badge appears only after all required items done.

Definition of Done:
- Course Completed status is set only when all required items are done.
- Partial completion does not show Completed state.
