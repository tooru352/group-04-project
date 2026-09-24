# Story Spec

Story ID: US-LMS-13
Requirement IDs: REQ-LMS-10
Design link: S06 - Assignment Detail (Figma frame `10:11`)

Goal:
Allow a Learner to resubmit an Assignment before the Deadline when the Assignment is configured to allow resubmission.

Preconditions:
Learner has already submitted at least once.
Assignment has `allowsResubmission = true`.
Current time is before the Assignment deadline.

Happy path:
1. Learner opens Assignment Detail (S06).
2. System shows a "Resubmit" option because `allowsResubmission = true` and deadline not passed.
3. Learner edits and clicks Submit.
4. System creates a new Submission record and invalidates or supersedes the previous one.
5. Submission Result (S08) reflects the latest submission.

Alternate/error paths:
- `allowsResubmission = false` → "Resubmit" option is hidden; attempting via API returns 422 RESUBMISSION_NOT_ALLOWED.
- Deadline has passed → option hidden; API returns 422 PAST_DEADLINE.
- Empty answer → validation error, no submission created.

Data read/write:
- Read: Assignment (allowsResubmission, deadline), previous Submission
- Write: Submission (new record; previous marked as superseded)

API contract:
- POST `/api/submissions` (same endpoint, idempotent per policy)
- Response: `{ id, assignmentId, status, submittedAt, isLate, attempt }`

Authorization:
- Learner must own the original submission and be enrolled in the Course.

Validation/business rules:
- Resubmission only allowed when `allowsResubmission=true` AND `now < deadline` (BR-LMS-05).

Observability/logging:
- Log resubmission attempt (userId, assignmentId, attempt count, isAllowed).

Test plan:
- Unit test: resubmission policy enforcement (allowed/not allowed, deadline).
- Integration test: resubmit when allowed → new submission created.
- E2E test: resubmit flow; verify new submission reflected on S08.

Definition of Done:
- Resubmission is only possible when policy permits.
- Previous submission is superseded properly.
- Disallowed attempts return clear error without creating a record.
