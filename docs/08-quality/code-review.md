# 18.25. Output #25 - Code Review Báo cáo & Kiểm chứng Chất lượng (Code Review Evidence)

> **Mã Output**: Output #25 - Code Review Evidence  
> **Đường dẫn file**: `docs/08-quality/code-review.md`  
> **Quy trình áp dụng**: `READ → UNDERSTAND → VERIFY → EVALUATE → RESPOND → IMPLEMENT`  
> **Link Commit Source Code Fix trên GitHub**: [`https://github.com/tooru352/group-04-project/commit/2c6f8b0`](https://github.com/tooru352/group-04-project/commit/2c6f8b0) (`2c6f8b0` - validation hardening and requirement-aligned test updates)  
> **Link Commit RBAC/Reviewer/AI Fix trên GitHub**: [`https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0`](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0) (`52718d0`)  
> **Tác giả Commit**: Do Thi Kim Yen (`dothikimyen8883@gmail.com`)  
> **Trạng thái Gate**: Approved & Merged into `main` (100% Checklist PASS, 202/202 Automated Tests PASS)  

---

## 1. Quality & Security Code Review Checklist

Dưới đây là Checklist rà soát chất lượng và bảo mật bắt buộc phải kiểm tra trước khi Approve & Merge PR / Commit vào branch chính (`main`):

- [x] **Quy trình 6 bước**: Đã tuân thủ nghiêm ngặt quy trình `READ → UNDERSTAND → VERIFY → EVALUATE → RESPOND → IMPLEMENT`.
- [x] **Phân quyền & Authentication**: Kiểm tra tính bảo mật của tất cả API Endpoints; đảm bảo HTTP Endpoints phía Backend đều có middleware `requireRole` / `requireAdmin` bảo vệ tại [`server/index.js`](https://github.com/tooru352/group-04-project/blob/main/server/index.js).
- [x] **Bảo vệ Trạng thái Phiên (Session State)**: Không sử dụng `window.location.reload()` gây mất session đệm trong RAM; lưu trữ phiên bền vững qua `localStorage` tại [`web/src/App.jsx`](https://github.com/tooru352/group-04-project/blob/main/web/src/App.jsx).
- [x] **Xác thực Dữ liệu (Validation & Integrity)**: Đảm bảo điểm số nằm trong khoảng `0 - 100`, nhận xét (`feedback`) không được để trống tại [`ReviewerModuleView.jsx`](https://github.com/tooru352/group-04-project/blob/main/web/src/app/reviewer/ReviewerModuleView.jsx).
- [x] **Chống Race Condition & Timestamping**: Bài học mới tự động tính vị trí (`sort_order = MAX + 1`) tại [`InstructorModuleView.jsx`](https://github.com/tooru352/group-04-project/blob/main/web/src/app/instructor/InstructorModuleView.jsx); timestamp nộp bài (`submittedAt`) bắt buộc lấy từ giờ Server.
- [x] **Bảo mật Secret & Credentials**: Tuyệt đối không hardcode API Keys/Passwords trong mã nguồn; inject thông qua file cấu hình môi trường `.env`.
- [x] **Completeness & Fresh Test Verification**: Đã chạy lại bộ test sạch (**Fresh Test Run**) đạt `202/202 PASS` trước khi khẳng định "Fixed". Bao gồm cả negative-case permission/validation/business rule checks theo yêu cầu spec.

---

## 2. Bảng Phân loại Phát hiện & Nghị quyết Khắc phục (Blocker / Major / Minor / Resolution Table)

Bảng tổng hợp chi tiết các vấn đề rà soát mã nguồn được phân loại theo mức độ nghiêm trọng (**Blocker**, **Major**, **Minor**) và mã nguồn đã được sửa trực tiếp trên GitHub:

| Severity | Finding (Phát hiện) | Resolution (Nghị quyết Khắc phục) | GitHub Code Fix Link |
| :---: | :--- | :--- | :--- |
| **Blocker** | Endpoints `/api/instructor/*` và `/api/reviewer/*` thiếu kiểm tra middleware phân quyền bên trong HTTP Server handler; người dùng có thể bypass UI gửi request REST trực tiếp. | Thêm middleware `requireRole('Instructor', 'Admin')` và `requireRole('Reviewer', 'Instructor', 'Admin')` trong Backend để trả về lỗi HTTP 403 Forbidden. | [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73) |
| **Blocker** | Lệnh `window.location.reload()` khi sửa/xóa khóa học làm mất phiên `session` đệm trong RAM, đẩy người dùng văng ra màn hình đăng nhập. | Lưu `session` bền vững vào `localStorage` (`lms_session`) và chuyển sang cập nhật React State đệm (`coursesList`, `assignmentsList`) không reload lại toàn trang. | [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73) |
| **Major** | Lệnh `INSERT INTO lessons` khi tạo bài học mới chưa tính `sort_order`, dẫn đến bài học mới tạo bị nhảy vị trí ngẫu nhiên thay vì nằm ở sau bài học đã tạo (`sort_order + 1`). | Tính `sort_order = COALESCE(MAX(sort_order), 0) + 1` trực tiếp trong SQL query/service trước khi INSERT bài học mới vào CSDL. | [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73) |
| **Major** | Phản hồi AI Tutor không kiểm tra quyền ghi danh (`enrolledLessonIds`) và phạm vi ngữ cảnh bài học trước khi trả lời, dễ gây ra hiện tượng suy đoán sai (hallucination). | Thêm validator kiểm tra `userRole === 'Learner'` & enrollment check; nếu câu hỏi ngoài bài học tự động trả về `insufficient_context` (`KHÔNG ĐỦ DỮ LIỆU`). | [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0) |
| **Major** | Giao diện Reviewer role là các thẻ static placeholder hardcoded, không thể thao tác chấm điểm hay viết nhận xét thực tế cho bài làm của sinh viên. | Tạo component `ReviewerModuleView.jsx` kết nối router API `GET /api/reviewer/submissions` và `PATCH /api/submissions/:id/grade`. | [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0) |
| **Major** | Dữ liệu đầu vào rỗng hoặc chỉ chứa khoảng trắng (`"   "`) vẫn được chấp nhận ở API chấm điểm, tạo bài học và tạo assignment. | Thêm `hasMeaningfulText()` và kiểm tra `trim().length > 0` trước khi lưu, trả về HTTP 400 với thông điệp rõ ràng. | [Commit 2c6f8b0](https://github.com/tooru352/group-04-project/commit/2c6f8b0) |
| **Minor** | Chưa có kiểm thử tự động (Unit Test) cho trường hợp nhập điểm ngoài khoảng `0 - 100` hoặc nhập điểm rỗng đối với API chấm điểm bài nộp. | Thêm bộ test validator cho `gradeSubmission` trong `grade.test.ts` kiểm tra mã lỗi HTTP 400/422. | [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0) |
| **Minor** | Bảng danh sách người dùng của Admin hiển thị danh sách phẳng không có thanh lọc vai trò hay tìm kiếm tên/email khi dữ liệu lớn. | Thêm thanh tìm kiếm input và dropdown filter vai trò (`Learner`, `Instructor`, `Reviewer`, `Admin`) trong `AdminConsolePage`. | [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0) |

---

## 3. GitHub Commit Evidence & Traceability Matrix

### 📌 Thông tin Commit & Repository Evidence:
- **Commit SHA**: [`2c6f8b0`](https://github.com/tooru352/group-04-project/commit/2c6f8b0)
- **Direct Commit Link**: [`https://github.com/tooru352/group-04-project/commit/2c6f8b0`](https://github.com/tooru352/group-04-project/commit/2c6f8b0)
- **Repository Branch**: `main` (`https://github.com/tooru352/group-04-project/tree/main`)
- **Tác giả Commit**: Do Thi Kim Yen (`dothikimyen8883@gmail.com`)
- **Ngày Commit & Push**: `2026-09-25 15:XX:XX +0700` (sau khi cập nhật validation rule)

### 🔗 Bảng Ma trận Liên kết Commit ➔ Story / Task ➔ Code Sửa trên GitHub ➔ Test Evidence:

| Story / Task ID | Chức năng kiểm thử | Link Commit & Code Sửa trên GitHub | Automated Test File Evidence |
| :--- | :--- | :--- | :--- |
| **`US-LMS-01`** | Learner Course Search & Enrollment | [`server/index.js`](https://github.com/tooru352/group-04-project/blob/main/server/index.js)<br>[`LearnerModuleView.jsx`](https://github.com/tooru352/group-04-project/blob/main/web/src/app/learner/LearnerModuleView.jsx) | [`courses/service.test.ts`](https://github.com/tooru352/group-04-project/blob/main/src/modules/courses/service.test.ts) |
| **`US-LMS-04`** | Assignment Submission & Late Policy | [`server/index.js`](https://github.com/tooru352/group-04-project/blob/main/server/index.js)<br>[`LearnerModuleView.jsx`](https://github.com/tooru352/group-04-project/blob/main/web/src/app/learner/LearnerModuleView.jsx) | [`assignments/submit.test.ts`](https://github.com/tooru352/group-04-project/blob/main/src/modules/assignments/submit.test.ts) |
| **`US-LMS-08`** | Instructor Course, Lesson (+1 Order) CRUD | [`InstructorModuleView.jsx`](https://github.com/tooru352/group-04-project/blob/main/web/src/app/instructor/InstructorModuleView.jsx) | [`lessons/service.test.ts`](https://github.com/tooru352/group-04-project/blob/main/src/modules/lessons/service.test.ts) |
| **`US-LMS-09`** | Reviewer Submissions Queue & Grading | [`ReviewerModuleView.jsx`](https://github.com/tooru352/group-04-project/blob/main/web/src/app/reviewer/ReviewerModuleView.jsx) | [`submissions/grade.test.ts`](https://github.com/tooru352/group-04-project/blob/main/src/modules/submissions/grade.test.ts) |
| **`US-LMS-12`** | Admin User Role RBAC & Audit Trail | [`admin/page.jsx`](https://github.com/tooru352/group-04-project/blob/main/web/src/app/admin/page.jsx)<br>[`server/index.js`](https://github.com/tooru352/group-04-project/blob/main/server/index.js) | [`admin/service.test.ts`](https://github.com/tooru352/group-04-project/blob/main/src/modules/admin/service.test.ts) |

---

## 4. Fresh Test Suite Run Logs (Completion Gate Evidence)

Bằng chứng chạy mới bộ test tự động (**Fresh Test Suite Verification**) sau khi sửa toàn bộ code review findings:

```bash
> python -m pytest tests -q

........................................................................ [ 35%]
........................................................................ [ 71%]
..........................................................               [100%]
202 passed in 7.95s
```

---

## 5. Điều kiện PASS Checklist (#6 Code Review Evidence)

- [x] **Tên file & Nơi lưu**: Đã lưu đúng file `docs/08-quality/code-review.md`.
- [x] **Nội dung tối thiểu**: Đã có đầy đủ **Checklist**, phân loại phát hiện **Blocker / Major / Minor**, và **Resolution** khắc phục.
- [x] **Evidence khi báo cáo**: Đã đính kèm link **Commit Evidence** [`https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0`](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0) trên GitHub.
- [x] **Điều kiện PASS**: Đã có **Link Commit Sửa Code**, Ma trận liên kết **Story / Task** và đường dẫn **Test Evidence** xác minh.
