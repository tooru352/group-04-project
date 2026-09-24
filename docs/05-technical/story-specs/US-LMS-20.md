# Story Spec

Story ID: US-LMS-20
Requirement IDs: REQ-LMS-11
Design link: S14 - Admin Console (Figma frame `10:19`)

Goal:
Allow an Instructor to create, edit, and manage Courses within their authorized scope.

Preconditions:
Instructor is logged in.
Instructor has been granted scope over at least one Course.

Happy path:
1. Instructor navigates to Course management area.
2. Creates a new Course (title, category, description, status) or edits an existing one.
3. System validates the data and saves the Course.
4. Course appears in the Course List for Learners.

Alternate/error paths:
- Instructor attempts to edit a Course outside their scope → 403 Forbidden (BR-LMS-06).
- Missing required fields (title) → validation error; no save.
- API error → show retry; unsaved changes preserved in form.

Data read/write:
- Read: Course (within Instructor scope)
- Write: Course (create/update)

API contract:
- POST `/api/courses` (create)
- Request: `{ title, category, description, status }`
- Response: `{ id, title, category, description, status }`
- PATCH `/api/courses/:id` (update)
- Request: `{ title?, category?, description?, status? }`
- Response: `{ id, title, category, description, status }`

Authorization:
- Must have INSTRUCTOR role.
- Can only create/edit Courses within their assigned scope (BR-LMS-06).

Validation/business rules:
- Course title must not be empty.
- Status must be one of: active, inactive.

Observability/logging:
- Log course create/update (instructorId, courseId, action, timestamp).

Test plan:
- Integration test: Instructor creates course → appears in GET /api/courses.
- Integration test: Instructor edits course outside scope → 403.
- E2E test: create course form → save → verify in course list.

Definition of Done:
- Instructor can create and edit Courses in their scope.
- Out-of-scope edits are rejected.
