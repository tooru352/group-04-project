# Traceability Matrix

This document maps every User Story to its Acceptance Criteria (AC), Screen(s), API(s), Data Model(s), and Task — ensuring no story is "orphan".

| Story ID | AC Summary | Screen | API | Data Model | Task |
| --- | --- | --- | --- | --- | --- |
| **US-LMS-01** | Login with valid credentials | S01 - Login | `POST /api/auth/login` | User | TASK-01: Build login UI & auth API |
| **US-LMS-02** | Identify user role on login | S01 - Login | Role middleware (all protected routes) | User | TASK-02: Role middleware & session wiring |
| **US-LMS-03** | Protect all resources by role/ownership | All protected screens | All protected APIs (401/403) | User (role) | TASK-03: Implement auth middleware |
| **US-LMS-04** | View available Courses | S03 - Course List | `GET /api/courses` | Course | TASK-04: Course list UI & API |
| **US-LMS-05** | Enroll in a Course | S04 - Course Detail | `POST /api/enrollments` | Enrollment, Course | TASK-05: Enrollment action & API |
| **US-LMS-06** | View Lessons in enrolled Course | S05 - Lesson Detail | `GET /api/lessons/:id` | Lesson, Enrollment | TASK-06: Lesson detail UI & API |
| **US-LMS-07** | Mark Lesson as complete | S05 - Lesson Detail | `POST /api/lessons/:id/complete` | LessonCompletion | TASK-07: Lesson completion API |
| **US-LMS-08** | View learning progress | S02 - Dashboard, S04 - Course Detail | `GET /api/courses/:id/progress` | LessonCompletion, Submission | TASK-08: Progress calculation & UI |
| **US-LMS-09** | System recognizes Course Completed | S04 - Course Detail | Triggered by lesson/submission endpoints | LessonCompletion, Submission | TASK-09: Course completion rule engine |
| **US-LMS-10** | View Assignment instructions & deadline | S06 - Assignment Detail | `GET /api/assignments/:id` | Assignment | TASK-10: Assignment detail UI & API |
| **US-LMS-11** | Submit Assignment | S07 - Submit Assignment | `POST /api/submissions` | Submission, Assignment | TASK-11: Submission flow, validation, modal |
| **US-LMS-12** | Record timestamp & late flag | S08 - Submission Result | Internal (within POST /api/submissions) | Submission (isLate, submittedAt) | TASK-12: Server-side late detection |
| **US-LMS-13** | Resubmit before deadline | S06 - Assignment Detail | `POST /api/submissions` | Submission, Assignment | TASK-13: Resubmission policy enforcement |
| **US-LMS-14** | Instructor views Submissions | S09 - Instructor Dashboard | `GET /api/instructor/courses/:id/submissions` | Submission, Assignment, User | TASK-14: Instructor dashboard UI & API |
| **US-LMS-15** | Instructor grades & gives feedback | S10 - Submission Review | `POST /api/submissions/:id/grade` | GradeFeedback, Submission | TASK-15: Grading UI & backend save |
| **US-LMS-16** | Learner views Grade & Feedback | S08 - Submission Result, S11 - Feedback | `GET /api/submissions/:id/feedback` | GradeFeedback | TASK-16: Feedback view UI & API |
| **US-LMS-17** | Assign Reviewer to Submission | S09 - Instructor Dashboard | `PATCH /api/submissions/:id/assign` | Submission, User | TASK-17: Reviewer assignment UI & API |
| **US-LMS-18** | Reviewer views assigned Submissions | S13 - Reviewer Dashboard | `GET /api/reviewer/submissions` | Submission, Assignment | TASK-18: Reviewer queue UI & API |
| **US-LMS-19** | Reviewer grades assigned Submission | S10 - Submission Review | `POST /api/submissions/:id/grade` | GradeFeedback, Submission | TASK-19: Reviewer grading flow |
| **US-LMS-20** | Instructor manages Courses | S14 - Admin Console | `POST /api/courses`, `PATCH /api/courses/:id` | Course | TASK-20: Course management UI & API |
| **US-LMS-21** | Instructor manages Lessons | S14 - Admin Console | `POST /api/courses/:id/lessons`, `PATCH /api/lessons/:id` | Lesson | TASK-21: Lesson management UI & API |
| **US-LMS-22** | Instructor manages Assignments | S14 - Admin Console | `POST /api/courses/:id/assignments`, `PATCH /api/assignments/:id` | Assignment | TASK-22: Assignment management UI & API |
| **US-LMS-23** | Admin manages Users & Roles | S14 - Admin Console | `GET /api/admin/users`, `PATCH /api/admin/users/:id/role` | User, AuditEvent | TASK-23: User/role management UI & API |
| **US-LMS-24** | Admin manages Courses & operational data | S14 - Admin Console | `GET /api/admin/courses`, `PATCH /api/admin/courses/:id` | Course, AuditEvent | TASK-24: Admin course management |
| **US-LMS-25** | Ask AI Tutor a question | S12 - AI Tutor | `POST /api/tutor/ask` | VoiceSession, VoiceTurn | TASK-25: AI Tutor input UI & LLM integration |
| **US-LMS-26** | AI Tutor answers from context | S12 - AI Tutor | `POST /api/tutor/ask` | VoiceTurn, Lesson | TASK-26: Context-grounded LLM response pipeline |
| **US-LMS-27** | AI Tutor explains or gives examples | S12 - AI Tutor | `POST /api/tutor/ask` | VoiceTurn, Lesson | TASK-27: Explain/example intent handler |
| **US-LMS-28** | AI Tutor reports KHÔNG ĐỦ DỮ LIỆU | S12 - AI Tutor | `POST /api/tutor/ask` | VoiceTurn | TASK-28: Context sufficiency check & fallback |
| **US-LMS-29** | Learning data stays consistent | All write screens | All write APIs (transactional) | All domain entities | TASK-29: Transaction boundary & optimistic locking |
| **US-LMS-30** | Trace important actions in audit log | All critical action screens | `GET /api/admin/audit` (read), internal write | AuditEvent | TASK-30: Audit log write & Admin query API |
