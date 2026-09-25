# Release Notes

## Version
v1.0.0-final

## Scope
This release delivers the first complete functional baseline of the LMS project, covering authentication, role-based dashboards, course and lesson management, assignment and submission workflows, reviewer grading, and AI tutor support.

## Features
- Role-based access for Learner, Instructor, Reviewer, and Admin.
- Secure login flow using seeded local dev accounts.
- Course catalog and course detail discovery.
- Lesson listing and completion tracking.
- Enrollment management for learners.
- Assignment creation and management for instructors.
- Learner submissions and review status tracking.
- Reviewer grading workflow with score and feedback validation.
- Admin user management and oversight.
- Database bootstrap with schema creation and seed data.
- AI Tutor route and UI integration for learner support.
- Frontend role shell with dashboard-driven navigation.

## Fixes
- Fixed stale server and port conflicts during local startup.
- Hardened validation to reject blank or whitespace-only values.
- Added and enforced role-based access rules on protected endpoints.
- Corrected instructor/reviewer access control and route protection.
- Prevented invalid business flows such as invalid submission data and out-of-range grades.
- Improved database initialization and seed consistency for local development.
- Corrected documentation and QA evidence to match actual verified behavior.

## Known issues
- Local development still depends on a valid PostgreSQL/Supabase connection string in `.env`.
- Browser or environment differences may affect UI behavior in the frontend shell.
- AI Tutor responses depend on the configured runtime backend and model availability.
- Seeded credentials are intended for local/dev testing only and should not be used in production.

## Upgrade notes
- Copy `.env.example` to `.env` and fill in the real database and secret values before running the app.
- Ensure the DB is reachable before starting the API.
- Run the backend once to initialize schemas and seed records automatically.
- Validate core user flows after deployment: login, role access, course load, lesson completion, submissions, and reviewer grading.
- Do not downgrade schema when a migration has already affected live data; use a forward fix instead.

## Release status
- Status: Final release baseline
- Test evidence: Python automation suite passed in the verified environment
