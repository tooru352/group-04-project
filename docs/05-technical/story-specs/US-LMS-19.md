# Story Spec

Story ID: US-LMS-19
Requirement IDs: REQ-LMS-18
Design link: S10 - Submission Review / Grading (Figma frame `10:15`)

Goal:
Allow a Reviewer to grade and provide Feedback on Submissions assigned to them.

Preconditions:
Reviewer is logged in.
Submission has been assigned to this Reviewer (US-LMS-17, US-LMS-18 satisfied).

Happy path:
1. Reviewer opens an assigned Submission from S13.
2. Reviews the Learner's work on S10.
3. Enters Grade (numeric) and Feedback (text).
4. Clicks Save/Submit Grade.
5. GradeFeedback record is created and linked to the Submission.
6. Submission status updates to "Graded".

Alternate/error paths:
- Missing grade or feedback → show validation error; do not save.
- Invalid grade value (out of range) → show validation error.
- Reviewer not assigned to this Submission → 403 Forbidden (BR-LMS-08).

Data read/write:
- Read: Submission, Assignment (grade range)
- Write: GradeFeedback, Submission (status → "graded")

API contract:
- POST `/api/submissions/:id/grade`
- Request: `{ grade, feedback }`
- Response: `{ id, submissionId, grade, feedback, reviewerId, gradedAt }`

Authorization:
- Must have REVIEWER role AND `submission.reviewerId = current user` (BR-LMS-08, BR-LMS-10).

Validation/business rules:
- Grade must be within the Assignment's allowed range (e.g., 0–100).
- Feedback text must not be empty.

Observability/logging:
- Log grading action (reviewerId, submissionId, grade, timestamp).
- Do not log full feedback text in plain logs.

Test plan:
- Unit test grade range validation.
- Integration test: reviewer grades their assigned submission → success; unassigned → 403.
- E2E test: grade submission → verify status changes to "Graded".

Definition of Done:
- Reviewer can save grade and feedback for assigned submissions.
- Submission status updates to "Graded" after save.
- Unauthorized grading attempts are rejected.
