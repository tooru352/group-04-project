# Story Spec

Story ID: US-LMS-14
Requirement IDs: REQ-LMS-14
Design link: S09 - Instructor Dashboard (Figma frame `10:14`)

Goal:
Allow an Instructor to view Learner Submissions for Courses they manage, so they can assess submitted work.

Preconditions:
Instructor is logged in.
Instructor is assigned to manage at least one Course.
Learners have submitted Assignments in that Course.

Happy path:
1. Instructor opens the Instructor Dashboard (S09).
2. System fetches all Submissions for Courses within the Instructor's scope.
3. Submissions are listed with: Learner name, Assignment name, submitted-at, status.
4. Learner with no submission is visible and differentiated as "Not Submitted".

Alternate/error paths:
- Instructor not assigned to any Course → show empty state.
- Instructor attempts to view Submissions for a Course outside their scope → 403 Forbidden.
- API error → show retry option.

Data read/write:
- Read: Submission (filtered by courseId ∈ Instructor's scope), Assignment, User (Learner info)

API contract:
- GET `/api/instructor/courses/:courseId/submissions`
- Response: `[{ submissionId, learnerId, learnerName, assignmentId, assignmentTitle, submittedAt, status }]`

Authorization:
- Must have INSTRUCTOR role.
- Scope limited to Courses the Instructor manages (BR-LMS-06, BR-LMS-07).

Validation/business rules:
- Instructor cannot see Submissions from Courses they do not manage.
- Submissions from other Instructors' courses are excluded.

Observability/logging:
- Log submission list fetch (instructorId, courseId, count returned).

Test plan:
- Integration test: Instructor fetches submissions for own course → success; for another course → 403.
- E2E test: verify submission list and "Not Submitted" differentiation on S09.

Definition of Done:
- Instructor sees only their Course's submissions.
- "Not Submitted" state is clearly shown for pending Learners.
