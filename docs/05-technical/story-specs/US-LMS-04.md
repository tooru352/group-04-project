# Story Spec

Story ID: US-LMS-04
Requirement IDs: REQ-LMS-03
Design link: S03 - Course List (Figma frame `10:8`)

Goal:
Allow a Learner to view all available Courses on the system so they can choose what to learn.

Preconditions:
Learner is logged in.
At least one Course exists in the system (or empty state is handled).

Happy path:
1. Learner opens the Course List screen (S03).
2. System fetches and displays all available Courses.
3. Each course card shows: title, category, description summary, status.

Alternate/error paths:
- No courses available → display empty state with a helpful message.
- API error/timeout → show loading error and allow retry.

Data read/write:
- Read: Course (id, title, category, description, status)

API contract:
- GET `/api/courses`
- Query: `?category=&q=`
- Response: `[{ id, title, category, description, status }]`

Authorization:
- Learner role required (US-LMS-03 middleware applies).

Validation/business rules:
- Only active courses should be displayed to Learners.
- Empty state is a valid system state (not an error).

Observability/logging:
- Log course list fetch (userId, filter params, count returned).

Test plan:
- Unit test course filtering logic (active only).
- Integration test: GET /api/courses returns correct shape.
- E2E test: course list renders correctly; empty state renders when no courses.

Definition of Done:
- Course list displays all active courses.
- Empty state is shown when no courses are available.
- Learner cannot access the list without authentication.
