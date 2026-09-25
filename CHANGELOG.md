# Changelog

All notable changes for this project are documented here.

## [v1.0.0-final] - 2026-09-26

### Added
- Role-based login and user access flow for Learner, Instructor, Reviewer, and Admin.
- Course listing and lesson tracking functionality.
- Enrollment and completion management.
- Assignment and submission workflows.
- Reviewer grading and feedback flow.
- Admin management support.
- AI Tutor backend endpoint and frontend integration.
- Database bootstrap with automatic schema initialization and seeded test data.
- Frontend role-based dashboard structure.

### Changed
- Base API and frontend behavior aligned to the project requirement and role rules.
- Validation tightened to reject blank and whitespace-only inputs.
- Access control tightened for protected routes and sensitive actions.
- QA, security, and release documentation updated to match observed product behavior.

### Fixed
- Stale startup issues related to old server processes and port collisions.
- Missing or weak role enforcement on instructor/reviewer/admin actions.
- Invalid data acceptance for grade, comments, and title/content fields.
- Inconsistencies between test evidence and documentation.
- Bootstrap and seed data reliability for local environment setup.

### Known issues
- Production environment requires valid `.env` configuration.
- AI Tutor behavior depends on backend service availability and runtime configuration.
- Browser differences may affect the exact front-end experience.

### Upgrade notes
- Use `.env.example` as the basis for local configuration.
- Ensure the database is reachable before starting the API.
- Validate login, role routes, and core workflows after deployment.
- If a migration has already been applied, prefer a forward fix over a blind schema rollback.

## Previous state
- Project was initialized as a scaffold and evolved into the first working role-based LMS release.
