# Story Spec

Story ID: US-LMS-23
Requirement IDs: REQ-LMS-26
Design link: S14 - Admin Console (Figma frame `10:19`)

Goal:
Allow an Admin to manage Users and their Roles so that LMS access remains accurate and up to date.

Preconditions:
Admin is logged in.
User management area is accessible.

Happy path:
1. Admin navigates to the Admin Console (S14).
2. Views the User list.
3. Creates a new User or updates an existing User's role.
4. System saves the change.
5. The User's role is updated immediately for subsequent logins.

Alternate/error paths:
- Non-Admin user attempts to manage Users/Roles → 403 Forbidden (BR-LMS-17).
- Invalid role value → validation error; no save.
- Attempting to remove the last Admin → reject with policy error.

Data read/write:
- Read: User (id, email, role, created_at)
- Write: User (role update), AuditEvent

API contract:
- GET `/api/admin/users`
- Response: `[{ id, email, role, createdAt }]`
- PATCH `/api/admin/users/:id/role`
- Request: `{ role }`
- Response: `{ id, email, role }`

Authorization:
- Must have ADMIN role (BR-LMS-01, BR-LMS-17).

Validation/business rules:
- Role must be one of: LEARNER, INSTRUCTOR, REVIEWER, ADMIN.
- Cannot self-demote the last Admin account.

Observability/logging:
- Audit log: role change event (adminId, targetUserId, oldRole, newRole, timestamp).

Test plan:
- Integration test: Admin updates user role → success; non-Admin attempt → 403.
- Integration test: invalid role value → 422 validation error.
- E2E test: change role → verify user sees new role on next login.

Definition of Done:
- Admin can view and update User roles.
- Role changes are audited and take effect immediately.
- Non-Admin access is blocked.
