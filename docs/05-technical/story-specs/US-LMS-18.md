# Story Spec

Story ID: US-LMS-18
Requirement IDs: REQ-LMS-17
Design link: S13 - Reviewer Dashboard (Figma frame `10:18`), S10 - Submission Review (Figma frame `10:15`)

Goal:
Allow a Reviewer to view the Submissions assigned to them so they can evaluate their assigned work.

Preconditions:
Reviewer is logged in.
At least one Submission has been assigned to this Reviewer (US-LMS-17 satisfied).

Happy path:
1. Reviewer opens Reviewer Dashboard (S13).
2. System fetches all Submissions assigned to this Reviewer.
3. Queue is displayed with: Learner name, Assignment name, submitted-at, status.
4. Reviewer selects a Submission to open S10 for review.

Alternate/error paths:
- No Submissions assigned → show empty queue state.
- Reviewer attempts to view an unassigned Submission → 403 Forbidden (BR-LMS-08).
- API error → show retry option.

Data read/write:
- Read: Submission (filtered by reviewerId = current user), Assignment, User (Learner info)

API contract:
- GET `/api/reviewer/submissions`
- Response: `[{ submissionId, learnerId, learnerName, assignmentTitle, submittedAt, status }]`

Authorization:
- Must have REVIEWER role.
- Scope limited to Submissions where `reviewerId = current user` (BR-LMS-08).

Validation/business rules:
- Reviewer cannot see Submissions not assigned to them.

Observability/logging:
- Log reviewer queue fetch (reviewerId, count returned, timestamp).

Test plan:
- Integration test: Reviewer fetches their queue → success; unassigned submission → 403.
- E2E test: verify reviewer queue shows only assigned submissions.

Definition of Done:
- Reviewer sees only their assigned submissions.
- Empty queue state is shown correctly.
- Unassigned submissions are inaccessible.
