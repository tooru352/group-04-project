# Story Spec

Story ID: US-LMS-03
Requirement IDs: NFR-LMS-01, NFR-LMS-02, NFR-LMS-04
Design link: All protected screens

Goal:
Ensure access is checked before every protected action so that learning data is not accessed or changed by unauthorized users.

Preconditions:
User is authenticated (has a valid session/token).
Protected resources have defined ownership/role requirements.

Happy path:
1. User sends a request to a protected endpoint.
2. Authorization middleware checks the user's role and resource ownership.
3. If authorized, the request is processed and data is returned.

Alternate/error paths:
- No valid token → 401 Unauthorized; redirect to login.
- Valid token but insufficient role → 403 Forbidden; show permission-denied feedback.
- Valid token but wrong ownership (e.g., viewing another user's submission) → 403 Forbidden.
- Mutation attempted without permission → reject without changing data.

Data read/write:
- Read: User (role), resource ownership metadata
- Write: None (this story governs the middleware, not domain writes)

API contract:
- Authorization header: `Bearer <token>` on all protected requests.
- 401 response: `{ error: "UNAUTHORIZED", message: "Authentication required" }`
- 403 response: `{ error: "FORBIDDEN", message: "Access denied" }`

Authorization:
- Cross-cutting: applies to every protected endpoint.
- Role-based (RBAC) and ownership-based checks.

Validation/business rules:
- Token must be valid, not expired, and contain a recognized role.
- Resource ownership must be verified for user-scoped data.

Observability/logging:
- Log all access-denied events (userId, endpoint, reason, timestamp).
- Do not log protected data in denial messages.

Test plan:
- Unit test authorization middleware for each role/resource combination.
- Integration test: request with no token → 401; wrong role → 403.
- E2E test: attempt to access another user's submission → denied.

Definition of Done:
- Every protected endpoint returns 401/403 without exposing data when unauthorized.
- Authorized requests proceed normally.
