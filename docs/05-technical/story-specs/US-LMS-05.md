# Story Spec

Story ID: US-LMS-05
Requirement IDs: REQ-LMS-04
Design link: S04 - Course Detail (`10:9`)

Goal:
Learner enrolls in a course to access its learning content.

Preconditions:
Learner is logged in.
Learner is viewing a Course they have not enrolled in yet.

Happy path:
1. Learner clicks "Enroll" on the Course Detail screen.
2. System validates that the Learner is not already enrolled.
3. System creates an Enrollment record.
4. Screen updates to show "Enrolled" status and unlocks lesson contents.

Alternate/error paths:
- Already enrolled -> Ignore or show "Already enrolled".
- Network error -> Show error message, allow retry.
- Missing permissions (not a Learner) -> Deny action.

Data read/write:
- Read: User, Course, Enrollment
- Write: Enrollment

API contract:
- POST `/api/enrollments`
- Request: `{ courseId }`
- Response: `{ id, courseId, userId, status, createdAt }`

Authorization:
- Must have `CUSTOMER`/Learner role.

Validation/business rules:
- One active enrollment per user per course.

Observability/logging:
- Log enrollment action with `userId` and `courseId`.

Test plan:
- Unit test enrollment duplication check.
- API integration test for role validation.
- E2E flow: view course -> enroll -> view lessons.

Definition of Done:
- UI correctly toggles from Enroll to Enrolled.
- DB stores enrollment record properly.
- Learner can access lessons post-enrollment.
