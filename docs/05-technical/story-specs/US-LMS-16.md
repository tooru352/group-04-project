# Story Spec

Story ID: US-LMS-16
Requirement IDs: REQ-LMS-19
Design link: S08 - Submission Result (Figma frame `10:13`), S11 - Feedback (Figma frame `10:16`)

Goal:
Allow a Learner to view their Grade and Feedback after their Submission has been assessed.

Preconditions:
Learner is logged in.
Submission exists and has been graded (GradeFeedback record exists).

Happy path:
1. Learner opens Submission Result (S08) or navigates to Feedback (S11).
2. System fetches the GradeFeedback for the Learner's Submission.
3. Grade value and Feedback text are displayed clearly.

Alternate/error paths:
- Submission not yet graded → show "Awaiting Grading" state (not an error).
- Learner attempts to view another Learner's feedback → 403 Forbidden.
- API error → show retry option.

Data read/write:
- Read: GradeFeedback (grade, feedback, reviewerId), Submission (submissionId, status)

API contract:
- GET `/api/submissions/:id/feedback`
- Response: `{ submissionId, grade, feedback, reviewerId, gradedAt }`

Authorization:
- Learner must own the Submission (BR-LMS-11).

Validation/business rules:
- Feedback is only visible to the Learner who submitted and authorized Instructors/Reviewers.
- No feedback is shown if grading is not complete.

Observability/logging:
- Log feedback view (learnerId, submissionId, timestamp).

Test plan:
- Integration test: Learner fetches their own feedback → success; another's → 403.
- E2E test: after grading, verify grade and feedback display on S08/S11.

Definition of Done:
- Learner can see their grade and feedback after grading is complete.
- "Awaiting Grading" is shown when not yet graded.
- Another Learner's feedback is inaccessible.
