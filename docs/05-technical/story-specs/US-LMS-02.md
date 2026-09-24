# Story Spec

Story ID: US-LMS-02
Requirement IDs: REQ-LMS-02
Design link: S01 - Login (Figma frame `10:6`)

Goal:
The system identifies the logged-in user's role so that the correct functions and views are displayed.

Preconditions:
User has successfully logged in (US-LMS-01 satisfied).
User account has exactly one assigned role: Learner, Instructor, Reviewer, or Admin.

Happy path:
1. After login, system reads role from the user's session/token.
2. System routes the user to the role-specific workspace.
3. Role-scoped UI elements and navigation are shown.
4. Actions not belonging to the user's role are hidden or disabled.

Alternate/error paths:
- Role not found in token → deny access, show permission-denied feedback.
- Invalid/unknown role → deny access, log anomaly.
- User attempts to access a role-restricted route manually → 403 Forbidden.

Data read/write:
- Read: User (role field), Session/token

API contract:
- Resolved from auth token on every protected request (middleware layer).
- Role is embedded in JWT/session; no separate role-fetch endpoint needed.

Authorization:
- Role is determined server-side from the authenticated session.
- Client must not be trusted to declare its own role.

Validation/business rules:
- Role must be one of: LEARNER, INSTRUCTOR, REVIEWER, ADMIN.
- Role check happens before any protected action.

Observability/logging:
- Log role resolution per request (userId, role, endpoint) for audit.

Test plan:
- Unit test role-check middleware with each valid role.
- Integration test: each role sees only permitted routes.
- E2E test: login as each role, verify correct dashboard is shown.

Definition of Done:
- Each role sees only its authorized views and actions.
- Unauthorized role access returns 403 without exposing protected data.
