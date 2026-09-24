# Story Spec

Story ID: US-LMS-11
Requirement IDs: US-LMS-11, NFR-LMS-06
Design link: S07 - Submit Assignment (`10:12`)

Goal:
Learner submits assignment and receives confirmation.

Preconditions:
Learner is enrolled and assignment content is available.

Happy path:
1. Learner inputs answer text/file.
2. Clicks Submit.
3. System shows confirmation modal.
4. User confirms.
5. Submission persists in DB.
6. User is redirected to Submission Result screen (S08).

Alternate/error paths:
- Empty answer -> show error and keep draft.
- Late submission -> accept but mark as "Late".
- Failed save -> show retry message and keep draft.

Data read/write:
- Read: Course, Lesson, Assignment, Enrollment
- Write: Submission, AuditEvent

API contract:
- POST `/api/submissions`
- Request: `{ assignmentId, answerContent }`
- Response: `{ id, assignmentId, status, submittedAt, isLate }`

Authorization:
- Must be the Learner enrolled in the specific course.

Validation/business rules:
- Assignment answer must not be empty.
- Compare `submittedAt` with Assignment `deadline` to flag `isLate`.

Observability/logging:
- Audit event with action, user, status, latency.

Test plan:
- Unit test validation (empty answer, deadline logic).
- Integration test API contract.
- UI test happy, error, and late submission flows.

Definition of Done:
- Submission success, error, and confirm flows tested.
