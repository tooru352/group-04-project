# Story Spec

Story ID: US-LMS-17
Requirement IDs: REQ-LMS-16
Design link: S09 - Instructor Dashboard (Figma frame `10:14`)

Goal:
Allow an Instructor or Admin to assign a Reviewer to a Submission so it can be evaluated by the responsible reviewer.

Preconditions:
Instructor or Admin is logged in.
Submission exists and is in "Submitted" state.
Target Reviewer has a Reviewer role in the system.

Happy path:
1. Instructor/Admin views a Submission in their scope.
2. Selects a Reviewer from the available list.
3. System assigns the Reviewer to the Submission.
4. Submission shows "Assigned to [Reviewer]" status.

Alternate/error paths:
- Target user is not a Reviewer → reject with validation error.
- User is not Instructor/Admin → 403 Forbidden (BR-LMS-09).
- Submission already assigned → overwrite or show confirmation.

Data read/write:
- Read: Submission, User (Reviewer candidates)
- Write: Submission (reviewerId, status → "assigned")

API contract:
- PATCH `/api/submissions/:id/assign`
- Request: `{ reviewerId }`
- Response: `{ submissionId, reviewerId, status }`

Authorization:
- Must have INSTRUCTOR or ADMIN role.

Validation/business rules:
- reviewerId must reference a User with role = REVIEWER.
- Instructor can only assign within their Course scope (BR-LMS-09).

Observability/logging:
- Log assignment action (actorId, submissionId, reviewerId, timestamp).

Test plan:
- Integration test: Instructor assigns valid reviewer → success; non-reviewer user → error.
- Integration test: non-Instructor attempts assignment → 403.
- E2E test: verify reviewer appears on submission detail after assignment.

Definition of Done:
- Submission is correctly linked to the assigned Reviewer.
- Only Instructor/Admin can perform this action.
