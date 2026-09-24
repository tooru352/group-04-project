# Story Spec

Story ID: US-LMS-22
Requirement IDs: REQ-LMS-13
Design link: S14 - Admin Console (Figma frame `10:19`)

Goal:
Allow an Instructor to create, edit, and manage Assignments within their Courses.

Preconditions:
Instructor is logged in.
Instructor manages the Course that the Assignment belongs to (US-LMS-20 satisfied).

Happy path:
1. Instructor navigates to a Course they manage.
2. Creates a new Assignment (title, description, deadline, maxAttempts, allowsResubmission) or edits an existing one.
3. System validates and saves the Assignment.
4. Assignment is visible to enrolled Learners in Assignment Detail (S06).

Alternate/error paths:
- Instructor edits an Assignment outside their Course scope → 403 Forbidden (BR-LMS-06).
- Missing required fields (title, deadline) → validation error; no save.
- Invalid deadline (past date on creation) → warning or reject depending on policy.

Data read/write:
- Read: Course (scope check), Assignment
- Write: Assignment (create/update)

API contract:
- POST `/api/courses/:courseId/assignments` (create)
- Request: `{ title, description, deadline, maxAttempts, allowsResubmission }`
- Response: `{ id, courseId, title, description, deadline, maxAttempts, allowsResubmission }`
- PATCH `/api/assignments/:id` (update)
- Request: `{ title?, description?, deadline?, maxAttempts?, allowsResubmission? }`
- Response: `{ id, courseId, title, deadline, maxAttempts, allowsResubmission }`

Authorization:
- Must have INSTRUCTOR role AND manage the parent Course (BR-LMS-06).

Validation/business rules:
- Title must not be empty.
- Deadline must be a valid future timestamp on creation.
- maxAttempts must be ≥ 1.

Observability/logging:
- Log assignment create/update (instructorId, courseId, assignmentId, action, timestamp).

Test plan:
- Integration test: Instructor creates assignment in own course → success.
- Integration test: Instructor edits assignment in another course → 403.
- E2E test: create assignment → verify appears in Course Detail for Learner.

Definition of Done:
- Instructor can manage Assignments in their Course scope.
- Assignment is accessible to Learners after creation.
