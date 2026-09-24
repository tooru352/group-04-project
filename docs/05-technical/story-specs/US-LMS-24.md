# Story Spec

Story ID: US-LMS-24
Requirement IDs: REQ-LMS-27
Design link: S14 - Admin Console (Figma frame `10:19`)

Goal:
Allow an Admin to manage Courses and required operational data so the LMS can operate reliably.

Preconditions:
Admin is logged in.
Course and operational data are defined within the Admin Console scope.

Happy path:
1. Admin navigates to the Admin Console (S14).
2. Views all Courses on the system (not limited to Instructor scope).
3. Edits a Course or operational configuration (status, metadata).
4. System saves changes.
5. Changes are reflected immediately for all users.

Alternate/error paths:
- Non-Admin user attempts this action → 403 Forbidden (BR-LMS-17).
- Invalid field values → validation error; no save.
- Attempting to delete a Course with active Enrollments → reject with policy error.

Data read/write:
- Read: Course, operational config data
- Write: Course (update/status toggle), AuditEvent

API contract:
- GET `/api/admin/courses`
- Response: `[{ id, title, category, status }]`
- PATCH `/api/admin/courses/:id`
- Request: `{ title?, category?, status? }`
- Response: `{ id, title, category, status }`

Authorization:
- Must have ADMIN role (BR-LMS-17).

Validation/business rules:
- Admin can manage all Courses system-wide (not limited to own scope).
- Course status changes should not break active enrollments without warning.

Observability/logging:
- Audit log: admin course change event (adminId, courseId, action, timestamp).

Test plan:
- Integration test: Admin updates any course → success; non-Admin → 403.
- E2E test: Admin changes course status → verify Learner sees updated state.

Definition of Done:
- Admin can view and manage all Courses system-wide.
- All changes are audited.
- Non-Admin access is blocked.
