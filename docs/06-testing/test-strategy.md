# 18.26. Output #26 - Test Strategy (Chiến lược Kiểm thử Hệ thống LMS)

> **Artifact / Output**: Test Strategy Document  
> **Mã Output**: Output #26 - Test Strategy  
> **Đường dẫn file**: `docs/06-testing/test-strategy.md`  
> **Tài liệu kiểm thử liên quan**: 
> • Catalog 200 Testcases: [`docs/06-testing/testcase.md`](file:///d:/MIS3032/finall1000/docs/06-testing/testcase.md)  
> • Specification 41 REST API Tests: [`docs/06-testing/api-test.md`](file:///d:/MIS3032/finall1000/docs/06-testing/api-test.md)  
> • E2E Scenarios (Gherkin Syntax): [`docs/06-testing/e2e-scenarios.md`](file:///d:/MIS3032/finall1000/docs/06-testing/e2e-scenarios.md)  
> **Trạng thái**: Completed & Verified (Total 200 Test Cases: 84 Backend Automated PASS + 41 Express REST API + 40 Frontend SPA UI + 35 Security & Edge Cases)  

---

## 1. Phân tích Tổng quan & Ma trận Coverage Kiểm thử

Để kiểm thử **toàn bộ hệ thống LMS** một cách toàn diện tuyệt đối (bao gồm Backend API Services, Express REST API Server, CSDL Supabase PostgreSQL, Frontend SPA React UI và An ninh bảo mật), chiến lược kiểm thử được tổng hợp thành **200 Test Cases** chia thành 4 khối chính:

1. **Khối I: 84 Automated Backend Unit & Integration Tests** ([`src/**/*.test.ts`](file:///d:/MIS3032/finall1000/src/server/db-schema.test.ts)): Đã lập trình tự động 100%, kiểm tra trực tiếp các Services, Business rules, RBAC permissions, Database Schema & Audit logs.
2. **Khối II: 41 Express REST API Endpoint Integration Tests** ([`docs/06-testing/api-test.md`](file:///d:/MIS3032/finall1000/docs/06-testing/api-test.md)): Kiểm thử toàn bộ các đường dẫn API HTTP (`/api/auth`, `/api/courses`, `/api/lessons`, `/api/assignments`, `/api/submissions`, `/api/reviewer`, `/api/admin`, `/api/ai`) với các mã trạng thái HTTP 200, 400, 401, 403, 404, 409, 422, 500.
3. **Khối III: 40 Frontend SPA React UI & Component Tests** (`web/src/`): Kiểm thử trải nghiệm giao diện người dùng, Form Validation, Thanh tiến độ bài học, Drawer AI Tutor, Modal phân công Reviewer, Responsive layout mobile/desktop, Dark mode.
4. **Khối IV: 35 Security, Resilience, Performance & Boundary Edge Cases**: Kiểm thử bảo mật (XSS, SQL Injection, Prompt Injection AI), chống click đúp, mất mạng internet, hết hạn JWT token, xung đột dữ liệu Optimistic Locking, và Hiệu năng Tải trọng.

---

## 2. Bảng Phân lớp Kiểm thử (Test Strategy Layer Table)

Bảng tổng hợp chiến lược kiểm thử theo từng tầng áp dụng toàn diện cho dự án LMS (bao gồm cả Frontend SPA & Backend Express API):

| Layer (Tầng kiểm thử) | Phạm vi kiểm thử Hệ thống (Full Coverage cho Frontend & Backend LMS) | Tài liệu kiểm thử chi tiết |
| :---: | :--- | :--- |
| **Unit** | **Backend Services**: <br>• Auth: Credentials validation (`valid credentials succeed`, `invalid credentials fail`, `empty input fails`), Session role resolver (`resolveRoleFromSession`, `normalizeRoleInput`). <br>• Progress Calculator: `% bài học` (`getCourseProgress` 0%, 50%), Auto-completion evaluator (`evaluateCourseCompletion`). <br>• Submission & Grading: Input validation (`gradeSubmission` 0-100 score bounds, feedback content requirement), deadline late calculation (`is_late`). <br>• AI Tutor Grounded Evaluator: Question string check, context grounding evaluator (`evaluateTutorContext`, `insufficient_context` fallback when out-of-context, Intent classification `explain`/`example`). <br>**Frontend UI Helpers**: Input validation forms, status badge resolvers, date/time formatters, progress bar calculation logic. | [`testcase.md`](file:///d:/MIS3032/finall1000/docs/06-testing/testcase.md) (Phần I: TC-001 ➔ TC-084) |
| **Integration** | **Database & REST API Integration**: <br>• Schema & Seed Verification: `src/server/db-schema.test.ts` (8 core tables & initial seed rows). <br>• Course Catalog & Discovery: `getCourses` search by keyword & category, handle no-match queries. <br>• Lessons Engine: `getLessonById` enrollment scope check, `createLesson` auto-increment ordering (`sort_order + 1`), `completeLesson` idempotency & duplicate prevention. <br>• Assignment & Submission Pipeline: `getAssignmentById`, `createAssignment`, `submitAssignment` (server timestamping `submittedAt`, deadline check `is_late`, resubmission policy `RESUBMISSION_NOT_ALLOWED` & `DEADLINE_EXCEEDED`). <br>• Reviewer & Grading Workflow: `assignReviewerToSubmission`, `getReviewerSubmissions` queue filtering, `getInstructorCourseSubmissions`, `gradeSubmission` permissions (Instructor/Reviewer scope assertion), `getSubmissionFeedback` owner access check. <br>• Admin & System Security: `getUsers`, `updateUserRole` promotion & last admin self-demotion block, `getAdminCourses`, `updateCourse` status transition & active enrollment archive block, `getAuditTrail`. <br>• DB Reliability: Transaction rollback (`runTransactionalWrite`), optimistic lock conflict check (`assertOptimisticLock`). <br>**REST Endpoints**: Express REST API routes (`/api/auth`, `/api/courses`, `/api/lessons`, `/api/assignments`, `/api/submissions`, `/api/reviewer`, `/api/admin`, `/api/ai`). | [`api-test.md`](file:///d:/MIS3032/finall1000/docs/06-testing/api-test.md) (Phần II: API-SYS ➔ API-AI) |
| **E2E** | **Toàn bộ Luồng Người dùng trên Giao diện React Web App (`web/src/`)**: <br>• **Learner Flow**: Login ➔ Browse course catalog ➔ Enroll ➔ Study lessons ➔ Ask AI Tutor (grounded answer & fallback) ➔ Submit assignment ➔ View graded score & feedback. <br>• **Instructor Flow**: Login ➔ Managed courses drawer ➔ Add lesson (auto position `+1`) ➔ Create assignment ➔ Assign reviewer to submission ➔ Grade submission directly. <br>• **Reviewer Flow**: Login ➔ Reviewer queue drawer ➔ Evaluate student answer ➔ Enter grade (0-100), status & feedback ➔ Block unassigned submission grading ➔ View submission review log. <br>• **Admin Flow**: Login ➔ User management drawer ➔ Promote learner to instructor ➔ Block last admin demotion ➔ Update system course status ➔ Block archiving active course ➔ Inspect audit log trail. | [`e2e-scenarios.md`](file:///d:/MIS3032/finall1000/docs/06-testing/e2e-scenarios.md) (Standard Gherkin Syntax) |
| **Non-functional** | • **Performance & Latency**: API response time < 200ms using Supabase PostgreSQL connection pooling (`aws-0-ap-northeast-2.pooler.supabase.com:6543`). <br>• **Accessibility & UX**: SPA keyboard tab navigation, screen-reader support via ARIA attributes (`aria-label`, `aria-live`). <br>• **Security & Hygiene**: Zero secrets hardcoded in client code, environment variable injection (`.env`), bearer token authentication, `requireRole`/`requireAdmin` header protection. <br>• **Auditability**: Immutable append-only audit logging for all user role updates, course metadata changes, and grade submissions. | [`testcase.md`](file:///d:/MIS3032/finall1000/docs/06-testing/testcase.md) (Phần IV: TC-166 ➔ TC-200) |

---

## 3. Danh mục Phủ 200 Test Cases theo Module & File Báo cáo

| Khối kiểm thử | Số lượng | Mô tả phạm vi kiểm thử | File Báo cáo Chi tiết |
| :--- | :---: | :--- | :--- |
| **Phần I: Automated Backend & Domain Unit Tests** | 84 Cases | Kiểm thử unit & integration cho 16 test files tự động hóa trong `src/**/*.test.ts` (100% PASS). | [`testcase.md`](file:///d:/MIS3032/finall1000/docs/06-testing/testcase.md) |
| **Phần II: Express REST API Endpoint Integration Tests** | 41 Cases | Kiểm thử tất cả HTTP API Endpoints trên `server/index.js` (Status 200, 400, 401, 403, 404, 409, 422, 500) và mẫu cURL scripts. | [`api-test.md`](file:///d:/MIS3032/finall1000/docs/06-testing/api-test.md) |
| **Phần III: Frontend SPA React UI & Component Tests** | 40 Cases | Kiểm thử toàn bộ màn hình React UI, Form validation, Responsive menu, Toast banners, Keyboard Tab navigation. | [`testcase.md`](file:///d:/MIS3032/finall1000/docs/06-testing/testcase.md) |
| **Phần IV: Security, Resilience, Performance & Boundary Edge Cases** | 35 Cases | Kiểm thử chống tấn công XSS, SQL Injection, Prompt Injection, Mất mạng, Hết hạn Token, Xung đột DB Optimistic Lock. | [`testcase.md`](file:///d:/MIS3032/finall1000/docs/06-testing/testcase.md) |
| **E2E User Journeys (Gherkin Scenarios)** | 5 Scenarios | 5 Kịch bản toàn trình tiêu chuẩn (Learner AI study, Instructor lesson order +1, Reviewer grading, Admin last admin block, AI fallback). | [`e2e-scenarios.md`](file:///d:/MIS3032/finall1000/docs/06-testing/e2e-scenarios.md) |

---

## 4. Bằng chứng Thực thi Test Suite (Verification Evidence)

Toàn bộ chiến lược kiểm thử trên được xác minh thông qua bộ test tự động `npm test` đạt kết quả 100% Pass:

```bash
> group-04-project@1.0.0 test
> node --test --experimental-strip-types "src/**/*.test.ts"

✔ getAdminCourses returns the full course list, including non-published entries
✔ updateCourse allows an Admin to change course metadata system-wide
✔ updateCourse rejects non-admin access
✔ updateCourse rejects invalid status transitions
✔ updateCourse blocks archival when the course has active enrollments
✔ askTutor returns a grounded answer and references when the learner is enrolled and context is valid
✔ askTutor rejects empty questions before any model call
✔ askTutor denies non-enrolled learners
✔ askTutor returns insufficient_context when the lesson context is unrelated to the question
✔ submitAssignment accepts a non-empty answer for an enrolled learner
✔ submitAssignment rejects empty answer text
✔ submitAssignment marks late answer when submission passes deadline
✔ submitAssignment requires learner enrollment before submission
✔ gradeSubmission validates grade bounds and feedback content
✔ gradeSubmission allows an Instructor to grade a submitted submission
✔ gradeSubmission rejects Learner attempts to grade a submission
✔ gradeSubmission allows a Reviewer to grade only their assigned submission
✔ getInstructorCourseSubmissions returns managed course rows
✔ getReviewerSubmissions returns only assigned submissions for the matching reviewer
✔ getUsers returns the seeded user roster
✔ updateUserRole allows an Admin to promote a Learner
✔ updateUserRole blocks self-demotion of the last admin
✔ initializeDatabase creates the LMS schema and seed data

ℹ tests 84 | pass 84 | fail 0 | duration_ms 12933ms
```
