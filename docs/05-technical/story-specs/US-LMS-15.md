# Story Spec

Story ID: US-LMS-15
Requirement IDs: REQ-LMS-15
Design link: S10 - Submission Review / Grading (`10:15`)

Goal:
Instructor or Reviewer provides a grade and feedback for a Learner's submission.

Preconditions:
User is logged in as Instructor or Reviewer.
Submission exists and is in "Submitted" state.

Happy path:
1. Instructor opens the submission on S10.
2. Enters numeric grade and text feedback.
3. Clicks Save/Submit Grade.
4. System validates inputs.
5. GradeFeedback record is created.
6. Submission status updates to "Graded".

Alternate/error paths:
- Missing grade or feedback -> show validation error.
- Invalid grade format (e.g., negative or above max) -> show error.
- Unauthorized access -> 403 Forbidden.

Data read/write:
- Read: Submission, User
- Write: GradeFeedback, Submission (update status)

API contract:
- POST `/api/submissions/:id/grade`
- Request: `{ grade, feedback }`
- Response: `{ id, submissionId, grade, feedback, reviewerId }`

Authorization:
- Must have `ADMIN` or `INSTRUCTOR`/Reviewer role associated with the course.

Validation/business rules:
- Grade must be within allowed range (e.g., 0-100).
- Feedback text cannot be empty.

Observability/logging:
- Log grading action (who graded what, without exposing full feedback text in plain logs).

Test plan:
- Unit test for grade bounds validation.
- Integration test for unauthorized grade attempt.
- E2E flow: load submission -> grade -> verify status change.

Definition of Done:
- Instructor can save grades.
- Learner can subsequently see the saved grade and feedback.
