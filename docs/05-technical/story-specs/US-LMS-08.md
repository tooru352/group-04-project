# Story Spec

Story ID: US-LMS-08
Requirement IDs: REQ-LMS-20, NFR-LMS-06
Design link: S02 - Learner Dashboard (Figma frame `10:7`), S04 - Course Detail (Figma frame `10:9`)

Goal:
Allow a Learner to see their progress in each enrolled Course so they know what is completed and what remains.

Preconditions:
Learner is logged in and enrolled in at least one Course.
At least one Lesson has been marked complete or an Assignment submitted.

Happy path:
1. Learner opens their Dashboard (S02) or a Course Detail (S04).
2. System calculates progress: (completed required items / total required items) × 100%.
3. Progress is displayed per Course as a percentage and/or visual bar.
4. Individual Lesson statuses (complete/incomplete) are visible in Course Detail.

Alternate/error paths:
- No progress yet → display 0% progress (not an error).
- API error → show loading error and allow retry.
- Inconsistent state (partial write) → display last confirmed state; log anomaly.

Data read/write:
- Read: Course, Lesson, LessonCompletion, Assignment, Submission, Enrollment

API contract:
- GET `/api/courses/:id/progress`
- Response: `{ courseId, totalItems, completedItems, percentage, lessonStatuses: [...] }`

Authorization:
- Learner must be enrolled in the Course.

Validation/business rules:
- Progress is derived from LessonCompletion and Submission records (BR-LMS-13).
- Only required items count toward progress percentage.

Observability/logging:
- Log progress fetch (userId, courseId, percentage returned).

Test plan:
- Unit test progress calculation for various completion states.
- Integration test: progress endpoint returns correct value after lesson completion.
- E2E test: complete a lesson → verify dashboard progress updates.

Definition of Done:
- Progress reflects real-time completion state.
- Progress is displayed consistently across Dashboard and Course Detail.
