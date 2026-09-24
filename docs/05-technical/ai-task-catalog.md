# AI Task Catalog - LMS

Tài liệu này tổng hợp đầy đủ các task triển khai theo story spec trong repo, để dùng cho backlog, planning và AI implementation.

## 1. Mục tiêu

- Mỗi task tương ứng 1 Story ID.
- Mỗi task có module chủ sở hữu rõ ràng.
- Mỗi task mô tả mục tiêu, API chính, business rules quan trọng và module liên quan.
- Không tạo task mới ngoài các Story spec đã có trong repo.

## 2. Task Inventory

Bản này là source-of-truth cho 30 story LMS trong repo, đồng bộ với TRACEABILITY và story-specs. Mỗi story tương ứng với một task duy nhất theo định dạng TASK-01..TASK-30.

| Task ID | Story ID | Epic | Module | API / Entry | Mô tả ngắn |
|---|---|---|---|---|---|
| TASK-01 | US-LMS-01 | EP1 | auth | POST /api/auth/login | Người dùng đăng nhập bằng email/password, tạo session/token và role-aware redirect. |
| TASK-02 | US-LMS-02 | EP1 | auth | Middleware role resolution | Xác định role từ token/session và chặn route không phù hợp. |
| TASK-03 | US-LMS-03 | EP1 | auth | Authorization middleware | Kiểm tra 401/403 trước protected resource, bao gồm ownership và RBAC. |
| TASK-04 | US-LMS-04 | EP2 | courses | GET /api/courses | Hiển thị danh sách Course active cho Learner. |
| TASK-05 | US-LMS-05 | EP2 | courses | POST /api/enrollments | Learner enroll vào course, tránh duplicate enrollment. |
| TASK-06 | US-LMS-06 | EP3 | lessons | GET /api/lessons/:id | Cho phép Learner xem Lesson trong course đã enroll. |
| TASK-07 | US-LMS-07 | EP3 | lessons | POST /api/lessons/:id/complete | Ghi nhận LessonCompletion và tránh duplicate. |
| TASK-08 | US-LMS-08 | EP3 | dashboard | GET /api/courses/:id/progress | Tính và trả về tiến độ course dựa trên LessonCompletion + Submission. |
| TASK-09 | US-LMS-09 | EP3 | courses | Auto completion evaluation | Đánh dấu Course completed chỉ khi đủ tất cả required lessons + assignments. |
| TASK-10 | US-LMS-10 | EP4 | assignments | GET /api/assignments/:id | Learner xem Assignment detail, deadline, status. |
| TASK-11 | US-LMS-11 | EP4 | submissions | POST /api/submissions | Learner submit assignment với validation và lưu submission. |
| TASK-12 | US-LMS-12 | EP4 | submissions | Internal submission logic | Tạo submittedAt server-side và flag isLate khi chậm deadline. |
| TASK-13 | US-LMS-13 | EP4 | submissions | POST /api/submissions | Hỗ trợ resubmission khi phép và trước deadline. |
| TASK-14 | US-LMS-14 | EP5 | submissions | GET /api/instructor/courses/:courseId/submissions | Instructor xem danh sách submission của course họ quản lý. |
| TASK-15 | US-LMS-15 | EP5 | submissions | POST /api/submissions/:id/grade | Instructor/Reviewer grade submission và cập nhật trạng thái. |
| TASK-16 | US-LMS-16 | EP5 | submissions | GET /api/submissions/:id/feedback | Learner xem feedback/grade của submission của mình. |
| TASK-17 | US-LMS-17 | EP6 | submissions | PATCH /api/submissions/:id/assign | Gán reviewer cho submission. |
| TASK-18 | US-LMS-18 | EP6 | reviewer | GET /api/reviewer/submissions | Reviewer xem queue submission được assign cho họ. |
| TASK-19 | US-LMS-19 | EP6 | submissions | POST /api/submissions/:id/grade | Reviewer grade submission gán cho mình. |
| TASK-20 | US-LMS-20 | EP7 | courses | POST /api/courses + PATCH /api/courses/:id | Instructor quản lý Course trong scope. |
| TASK-21 | US-LMS-21 | EP7 | lessons | POST /api/courses/:courseId/lessons + PATCH /api/lessons/:id | Instructor quản lý Lesson trong course họ quản lý. |
| TASK-22 | US-LMS-22 | EP7 | assignments | POST /api/courses/:courseId/assignments + PATCH /api/assignments/:id | Instructor quản lý Assignment trong course họ quản lý. |
| TASK-23 | US-LMS-23 | EP7 | admin | GET /api/admin/users + PATCH /api/admin/users/:id/role | Admin quản lý user và role. |
| TASK-24 | US-LMS-24 | EP7 | admin | GET /api/admin/courses + PATCH /api/admin/courses/:id | Admin quản lý toàn bộ course trên hệ thống. |
| TASK-25 | US-LMS-25 | EP8 | ai-tutor | POST /api/tutor/ask | Learner hỏi câu hỏi cho AI Tutor theo context. |
| TASK-26 | US-LMS-26 | EP8 | ai-tutor | POST /api/tutor/ask | AI Tutor trả lời dựa trên Course/Lesson context, có source references. |
| TASK-27 | US-LMS-27 | EP8 | ai-tutor | POST /api/tutor/ask | AI Tutor giải thích / ví dụ theo course context. |
| TASK-28 | US-LMS-28 | EP8 | ai-tutor | POST /api/tutor/ask | AI Tutor trả lời KHÔNG ĐỦ DỮ LIỆU khi context không đủ. |
| TASK-29 | US-LMS-29 | EP8 | shared/domain | Transactional consistency guardrails | Bảo đảm state giữa lesson, submission, completion, progress nhất quán. |
| TASK-30 | US-LMS-30 | EP7 | admin | GET /api/admin/audit | Audit trail cho hành động quan trọng và truy vấn admin. |

## 3. Mapping theo Module

### Auth
- TASK-01, TASK-02, TASK-03

### Courses
- TASK-04, TASK-05, TASK-09, TASK-20, TASK-24

### Lessons
- TASK-06, TASK-07, TASK-08, TASK-21

### Assignments
- TASK-10, TASK-11, TASK-12, TASK-13, TASK-22

### Submissions
- TASK-11, TASK-12, TASK-13, TASK-14, TASK-15, TASK-16, TASK-17, TASK-18, TASK-19

### Reviewer / Review
- TASK-17, TASK-18, TASK-19

### Admin
- TASK-23, TASK-24, TASK-30

### AI Tutor
- TASK-25, TASK-26, TASK-27, TASK-28

### Shared / Domain Consistency
- TASK-29

## 4. Task Priority đề xuất

### P0 - Core Learning Flow
- TASK-01, TASK-02, TASK-03
- TASK-04, TASK-05, TASK-06, TASK-07, TASK-08, TASK-09
- TASK-10, TASK-11, TASK-12, TASK-13

### P1 - Assessment & Review
- TASK-14, TASK-15, TASK-16, TASK-17, TASK-18, TASK-19
- TASK-20, TASK-21, TASK-22

### P2 - Admin & AI Safety
- TASK-23, TASK-24, TASK-25, TASK-26, TASK-27, TASK-28, TASK-29, TASK-30

## 5. Quy tắc triển khai theo task catalog

- Mỗi task chỉ sửa module chủ sở hữu và các file liên quan trực tiếp.
- Trước khi code, AI phải nêu plan, file dự kiến sửa, test case và rủi ro.
- Sau khi code, bắt buộc chạy lint, typecheck, targeted tests và build.
- Không được nói “done” nếu chưa có output thực tế.
- Không làm refactor không liên quan.

## 6. Ghi chú

- Task ID trong file này map trực tiếp với Story Spec trong thư mục story-specs.
- Bản này là “catalog” để dùng như source của backlog / AI prompt generation / sprint planning.
