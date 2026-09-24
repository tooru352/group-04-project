# Story Spec

Story ID: US-LMS-01
Requirement IDs: REQ-LMS-01
Design link: S01 - Login (Figma frame `10:6`)

Goal:
Allow a user to log in with a valid account to access the LMS according to their role.

Preconditions:
User has a pre-registered account in the system.
Login screen is accessible without authentication.

Happy path:
1. User navigates to the Login screen (S01).
2. User enters valid credentials (email + password).
3. User clicks Login.
4. System validates credentials against the user store.
5. System creates a session and associates the correct role.
6. User is redirected to their role-specific dashboard.

Alternate/error paths:
- Invalid credentials → system does not create session; show error message.
- Empty fields → show validation error, prevent submit.
- Account does not exist → show generic "invalid credentials" (do not reveal whether email exists).

Data read/write:
- Read: User (email, hashed password, role)
- Write: Session/token record

API contract:
- POST `/api/auth/login`
- Request: `{ email, password }`
- Response: `{ token, role, userId }`

Authorization:
- Public endpoint (no auth required to access).

Validation/business rules:
- Email and password must not be empty.
- Credentials must match stored user record.
- Do not expose whether the email exists on failure.

Observability/logging:
- Log login attempt (userId or email hash, success/failure, timestamp).
- Do not log raw passwords.

Test plan:
- Unit test credential validation logic.
- Integration test: valid login returns token; invalid login returns 401.
- E2E test: login flow with valid and invalid credentials.

Definition of Done:
- Valid login creates session and redirects to dashboard.
- Invalid login shows error without exposing user existence.
- Session/token is returned for subsequent authenticated calls.
