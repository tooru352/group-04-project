# Story Spec

Story ID: US-LMS-21
Requirement IDs: REQ-LMS-12
Design link: S14 - Admin Console (Figma frame `10:19`)

Goal:
Allow an Instructor to create, edit, and manage Lessons within their Courses.

Preconditions:
Instructor is logged in.
Instructor manages the Course that the Lesson belongs to (US-LMS-20 satisfied).

Happy path:
1. Instructor navigates to a Course they manage.
2. Creates a new Lesson (title, content, duration, status) or edits an existing one.
3. System validates and saves the Lesson under the Course.
4. Lesson is visible to enrolled Learners in Course/Lesson views.

Alternate/error paths:
- Instructor attempts to edit a Lesson in a Course outside their scope → 403 Forbidden (BR-LMS-06).
- Missing required fields (title, content) → validation error; no save.
- API error → show retry; form data preserved.

Data read/write:
- Read: Course (scope check), Lesson
- Write: Lesson (create/update)

API contract:
- POST `/api/courses/:courseId/lessons` (create)
- Request: `{ title, content, duration, status }`
- Response: `{ id, courseId, title, content, duration, status }`
- PATCH `/api/lessons/:id` (update)
- Request: `{ title?, content?, duration?, status? }`
- Response: `{ id, courseId, title, content, duration, status }`

Authorization:
- Must have INSTRUCTOR role AND manage the parent Course (BR-LMS-06).

Validation/business rules:
- Lesson title and content must not be empty.
- Lesson must be associated with a valid courseId.

Observability/logging:
- Log lesson create/update (instructorId, courseId, lessonId, action, timestamp).

Test plan:
- Integration test: Instructor creates lesson under their course → success.
- Integration test: Instructor edits lesson under another's course → 403.
- E2E test: create lesson → verify it appears in Course Detail.

Definition of Done:
- Instructor can manage Lessons within their Course scope.
- Lessons are visible to enrolled Learners after creation.
