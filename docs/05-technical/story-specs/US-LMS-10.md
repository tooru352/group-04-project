# Story Spec

Story ID: US-LMS-10
Requirement IDs: REQ-LMS-07, NFR-LMS-06
Design link: S06 - Assignment Detail (Figma frame `10:11`)

Goal:
Allow a Learner to view the Assignment instructions and deadline so they can prepare and submit correctly.

Preconditions:
Learner is logged in and enrolled in the Course.
Assignment exists and is linked to the Course.

Happy path:
1. Learner opens a Course and selects an Assignment.
2. System fetches and displays the Assignment Detail screen (S06).
3. Assignment title, description/instructions, deadline, and current status are displayed.

Alternate/error paths:
- Assignment not found → 404; show error.
- Learner not enrolled in the Course → 403 Forbidden.
- API error → show retry option.

Data read/write:
- Read: Assignment (id, courseId, lessonId, title, description, deadline, maxAttempts), Submission status for this Learner

API contract:
- GET `/api/assignments/:id`
- Response: `{ id, courseId, title, description, deadline, maxAttempts, submissionStatus }`

Authorization:
- Learner must be enrolled in the Course containing the Assignment.

Validation/business rules:
- Assignment data is read-only for Learners (no write on this story).
- Deadline is displayed in the Learner's local timezone (display concern).

Observability/logging:
- Log assignment detail view (userId, assignmentId, timestamp).

Test plan:
- Integration test: enrolled Learner can fetch assignment; non-enrolled returns 403.
- E2E test: navigate from Course to Assignment Detail; verify all fields render.

Definition of Done:
- Assignment instructions and deadline are clearly displayed.
- Non-enrolled Learner is denied access.
