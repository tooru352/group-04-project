# Story Spec

Story ID: US-LMS-12
Requirement IDs: REQ-LMS-09
Design link: S08 - Submission Result (Figma frame `10:13`)

Goal:
Record the submission timestamp and flag submissions made after the deadline as "Late".

Preconditions:
A Submission has been created (US-LMS-11 satisfied).
Assignment has a defined Deadline.

Happy path:
1. Learner submits Assignment (US-LMS-11).
2. System captures the server-side `submittedAt` timestamp.
3. System compares `submittedAt` with Assignment `deadline`.
4. If `submittedAt` ≤ `deadline` → status = "submitted" (on-time).
5. If `submittedAt` > `deadline` → status = "late"; Late badge shown on S08.

Alternate/error paths:
- Clock skew between client and server → always use server timestamp.
- Deadline not set on Assignment → treat as no deadline (no late flag).
- Assignment does not allow late submission → reject and return 422 PAST_DEADLINE.

Data read/write:
- Read: Assignment (deadline), Submission
- Write: Submission (submittedAt, isLate, status)

API contract:
- Handled internally as part of POST `/api/submissions`.
- Response includes: `{ submittedAt, isLate, status }`

Authorization:
- Only the submitting Learner is involved; server enforces timestamp.

Validation/business rules:
- `submittedAt` must be the server-authoritative time (BR-LMS-04).
- `isLate = submittedAt > deadline`.
- Client-provided timestamps must be ignored.

Observability/logging:
- Log late status decision (assignmentId, deadline, submittedAt, isLate).

Test plan:
- Unit test: submittedAt before deadline → isLate = false; after → isLate = true.
- Integration test: submit after deadline → response contains isLate=true.
- E2E test: verify Late badge appears on S08 for a late submission.

Definition of Done:
- submittedAt is always server-generated.
- Late submissions are correctly flagged and displayed.
