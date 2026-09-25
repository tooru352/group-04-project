# 18.26. Output #26 - Bug Log & Defect Tracking Report (Sổ Nhật ký Lỗi & Kiểm chứng Khắc phục)

> **Mã Output**: Output #26 - Bug Log & Defect Tracking Report  
> **Đường dẫn file**: `docs/08-quality/bug-log.md`  
> **Dự án**: Micro-learning / LMS Course Platform System (Group 04)  
> **Quy trình áp dụng**: `REPRODUCE → LOG → FIX → VERIFY REGRESSION → CLOSE`  
> **Link Commit Source Code Fix (Do Thi Kim Yen)**: [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73)  
> **Link Commit Source Code Fix (Doan Xuan Toan)**: [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0)  
> **Trạng thái Gate Quality**: PASS (100% Closure có Evidence & 200/200 Automated Tests Passed)  

---

## 1. Quality & Defect Tracking Overview

Tài liệu **Bug Log** ghi nhận chi tiết các lỗi hệ thống phát hiện trong quá trình phát triển và kiểm thử tự động của hệ thống Micro-learning LMS. Mọi lỗi đều phải có đầy đủ các trường thông tin tối thiểu theo chuẩn ISO/IEC 25010: **Severity**, **Steps to Reproduce**, **Expected Result**, **Actual Result**, **Evidence**, **Owner**, và **Status**.

### Bảng Phân tích Kết quả Test Ban đầu (Initial Test Suite Breakdown: 192 PASSED / 8 FAILED)

Khi thực thi bộ kiểm thử tự động 200 Test Cases lần đầu tiên trước khi khắc phục mã nguồn:
- **Tổng số Test Cases**: `200`
- **Số Test Passed ban đầu**: `192 PASSED` (96%)
- **Số Test Failed ban đầu**: `8 FAILED` (4%) — Các test case này tương ứng với các lỗi logic, bảo mật và ràng buộc dữ liệu được phát hiện.

| STT | Mã Test Case Failed | Tên Kiểm thử (Test Function Name) | Lỗi phát hiện (Defect Summary) | Trạng thái sau Fix | Bug ID liên kết |
| :---: | :--- | :--- | :--- | :---: | :---: |
| 1 | **`TC-098`** | `test_tc_098_duplicate_submission_prevention` | Nộp bài trùng lặp khi click đúp nhanh nút Submit | **PASSED** | **`BUG-01`** |
| 2 | **`TC-166`** | `test_tc_166_rbac_instructor_endpoint_protection` | Bypass quyền truy cập REST API Instructor mà không cần role | **PASSED** | **`BUG-02`** |
| 3 | **`TC-130`** | `test_tc_130_persistent_session_localstorage` | Mất phiên làm việc khi reload trang F5 | **PASSED** | **`BUG-03`** |
| 4 | **`TC-042`** | `test_tc_042_lesson_sort_order_increment` | Thứ tự bài học mới nhảy vị trí ngẫu nhiên thay vì `+1` | **PASSED** | **`BUG-04`** |
| 5 | **`TC-102`** | `test_tc_102_aitutor_enrolled_context_check` | AI Tutor trả lời sai lệch cho learner chưa ghi danh | **PASSED** | **`BUG-05`** |
| 6 | **`TC-115`** | `test_tc_115_submission_grade_out_of_bound_validation` | Điểm số ngoài thang 0 - 100 vẫn được API chấp nhận | **PASSED** | **`BUG-06`** |
| 7 | **`TC-175`** | `test_tc_175_delete_course_with_active_enrolled_learners` | Thiếu ràng buộc chặn xóa khóa học khi đang có sinh viên học | **PASSED** | **`BUG-07`** |
| 8 | **`TC-182`** | `test_tc_182_block_self_demotion_of_last_system_admin` | Admin cuối cùng có thể tự hạ quyền gây khóa hệ thống | **PASSED** | **`BUG-08`** |

---

### Bảng Tổng hợp Nhật ký Lỗi (Defect Summary Table)

| Bug ID | Tên Lỗi / Mô tả (Title) | Mức độ (Severity) | Người xử lý (Owner) | Trạng thái (Status) | GitHub Fix Commit Link | Regression Test Case |
| :---: | :--- | :---: | :---: | :---: | :--- | :--- |
| **`BUG-01`** | Duplicate assignment submission on fast double-click submit button | **Major** | Do Thi Kim Yen | **CLOSED** | [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73) | `test_tc_098_duplicate_submission_prevention` |
| **`BUG-02`** | Role authorization bypass on `/api/instructor/*` REST endpoints | **Blocker** | Do Thi Kim Yen | **CLOSED** | [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73) | `test_tc_166_rbac_instructor_endpoint_protection` |
| **`BUG-03`** | Session state loss upon window reload during course management | **Blocker** | Do Thi Kim Yen | **CLOSED** | [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73) | `test_tc_130_persistent_session_localstorage` |
| **`BUG-04`** | New lesson `sort_order` assigned randomly instead of incremental position | **Major** | Do Thi Kim Yen | **CLOSED** | [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73) | `test_tc_042_lesson_sort_order_increment` |
| **`BUG-05`** | AI Tutor generates out-of-context response for un-enrolled learners | **Major** | Doan Xuan Toan | **CLOSED** | [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0) | `test_tc_102_aitutor_enrolled_context_check` |
| **`BUG-06`** | Grade out-of-bounds (`score > 100` or `< 0`) accepted by Reviewer API | **Minor** | Doan Xuan Toan | **CLOSED** | [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0) | `test_tc_115_submission_grade_out_of_bound_validation` |
| **`BUG-07`** | Unhandled course deletion when active learners are currently enrolled | **Major** | Doan Xuan Toan | **CLOSED** | [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0) | `test_tc_175_delete_course_with_active_enrolled_learners` |
| **`BUG-08`** | Missing guard condition preventing self-demotion of last system admin | **Blocker** | Doan Xuan Toan | **CLOSED** | [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0) | `test_tc_182_block_self_demotion_of_last_system_admin` |

---

## 2. Chi tiết Bug Log & Bằng chứng Kiểm chứng (Detailed Bug Logs & Closure Evidence)

### 📌 BUG-01 - Duplicate Assignment Submission on Fast Double-Click Submit Button

- **Bug ID**: `BUG-01`
- **Mức độ (Severity)**: **Major**
- **Môi trường (Environment)**: Chrome 128 / Staging / `learner-assignment-submission` flow
- **Người chịu trách nhiệm (Owner)**: Do Thi Kim Yen (`dothikimyen8883@gmail.com`)
- **Trạng thái (Status)**: **CLOSED (Verified Fixed with Regression Test)**

#### 1. Mô tả & Các bước Tái hiện Bug (Steps to Reproduce):
1. Đăng nhập vào hệ thống LMS dưới vai trò học viên (`Learner`).
2. Mở một bài học có bài tập tự luận (Assignment).
3. Nhập nội dung câu trả lời vào vùng text editor.
4. Nhấn chuột nhanh 2 lần liên tiếp (< 200ms) vào nút **"Nộp bài"** (Submit Assignment).
5. Kiểm tra danh sách bài nộp của học viên trong CSDL hoặc giao diện Reviewer.

#### 2. Kết quả Mong đợi vs Kết quả Thực tế:
- **Kết quả Mong đợi (Expected Result)**:
  - Khi click lần 1, nút "Nộp bài" lập tức bị vô hiệu hóa (`disabled`) và hiển thị trạng thái đang gửi (`isSubmitting = true`).
  - Hệ thống chỉ tạo đúng **1 bản ghi bài nộp** (submission) duy nhất cho học viên đối với bài tập đó.
- **Kết quả Thực tế (Actual Result)**:
  - Client gửi 2 HTTP `POST /api/submissions` requests đồng thời trong khoảng thời gian < 150ms.
  - Server xử lý cả 2 requests, làm sinh ra 2 bản ghi bài nộp trùng lặp (`duplicate submission record`) trong cơ sở dữ liệu với 2 ID khác nhau nhưng cùng nội dung và timestamp.

#### 3. Nguyên nhân Gốc rễ (Root Cause):
- Phía Client (`LearnerModuleView.jsx`): Handler chưa khóa cờ trạng thái `isSubmitting` trước khi gọi hàm bất đồng bộ `fetch()`, cho phép sự kiện click đúp kích hoạt request thứ 2.
- Phía Server (`server/index.js`): REST API Endpoint chưa cài đặt `Idempotency Key` / Unique Constraint theo cặp khóa `(user_id, assignment_id)`.

#### 4. Giải pháp Khắc phục (Solution & Code Fix):
- **Client Fix**: Bổ sung state `isSubmitting` để vô hiệu hóa nút submit ngay khi bắt đầu gửi request trong [LearnerModuleView.jsx](https://github.com/tooru352/group-04-project/blob/main/web/src/app/learner/LearnerModuleView.jsx).
- **Server Fix**: Thêm Idempotency check và kiểm tra bản ghi bài nộp đã tồn tại trước khi chèn mới trong [server/index.js](https://github.com/tooru352/group-04-project/blob/main/server/index.js).

```javascript
// Phía Server: Idempotency & Duplicate Check
app.post('/api/submissions', requireRole('Learner', 'Admin'), (req, res) => {
  const { assignmentId, answerText } = req.body;
  const existing = db.prepare('SELECT * FROM submissions WHERE user_id = ? AND assignment_id = ?').get(req.user.id, assignmentId);
  if (existing) {
    return res.status(409).json({ error: 'Bài làm đã được nộp trước đó, không thể nộp trùng lặp.' });
  }
  // Chèn bản ghi duy nhất...
});
```

#### 5. Bằng chứng Báo cáo & Kiểm chứng Đóng Bug (Closure Evidence & Regression Test):
- **Commit GitHub Tái hiện Lỗi**: [Commit 7f2156c](https://github.com/tooru352/group-04-project/commit/7f2156ceec55b40cfeb5ca5657efea4b16259e88)
- **Commit GitHub Fix Code**: [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73)
- **File Regression Test**: [tests/test_api_endpoints_tc085_tc125.py](https://github.com/tooru352/group-04-project/blob/main/tests/test_api_endpoints_tc085_tc125.py)
- **Hàm Test Khắc phục Bug**: `test_tc_098_duplicate_submission_prevention` & `test_tc_099_submit_assignment`
- **Kết quả Pytest Run**: **`PASSED`**

---

### 📌 BUG-02 - Role Authorization Bypass on Instructor API Endpoints

- **Bug ID**: `BUG-02`
- **Mức độ (Severity)**: **Blocker**
- **Môi trường (Environment)**: Staging / Backend REST API (`/api/instructor/*`)
- **Người chịu trách nhiệm (Owner)**: Do Thi Kim Yen (`dothikimyen8883@gmail.com`)
- **Trạng thái (Status)**: **CLOSED (Verified Fixed)**

#### 1. Các bước Tái hiện (Steps to Reproduce):
1. Đăng nhập tài khoản vai trò `Learner`.
2. Sử dụng Postman / cURL gửi HTTP POST request trực tiếp đến endpoint `/api/instructor/lessons`.
3. Đính kèm payload tạo bài học mới.

#### 2. Expected vs Actual:
- **Expected**: Server từ chối request và trả về mã lỗi `HTTP 403 Forbidden`.
- **Actual**: Server nhận request và chèn bài học mới vào CSDL do thiếu middleware kiểm tra quyền hạn.

#### 3. Root Cause & Solution:
- Phía Backend HTTP handler chưa bọc middleware `requireRole`.
- **Code Fix**: Thêm middleware `requireRole('Instructor', 'Admin')` tại [server/index.js](https://github.com/tooru352/group-04-project/blob/main/server/index.js).

#### 4. Evidence & Regression Test:
- **Commit GitHub Tái hiện Lỗi**: [Commit 7f2156c](https://github.com/tooru352/group-04-project/commit/7f2156ceec55b40cfeb5ca5657efea4b16259e88)
- **Commit GitHub Fix Code**: [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73)
- **Automated Regression Test**: `test_tc_166_rbac_instructor_endpoint_protection` trong [tests/test_security_edgecases_tc166_tc200.py](https://github.com/tooru352/group-04-project/blob/main/tests/test_security_edgecases_tc166_tc200.py) (`PASSED`).

---

### 📌 BUG-03 - Session State Loss Upon Window Reload During Course Management

- **Bug ID**: `BUG-03`
- **Mức độ (Severity)**: **Blocker**
- **Môi trường (Environment)**: Frontend Client (`web/src/App.jsx`)
- **Người chịu trách nhiệm (Owner)**: Do Thi Kim Yen (`dothikimyen8883@gmail.com`)
- **Trạng thái (Status)**: **CLOSED (Verified Fixed)**

#### 1. Các bước Tái hiện (Steps to Reproduce):
1. Đăng nhập hệ thống dưới vai trò `Admin` hoặc `Instructor`.
2. Truy cập trang quản lý khóa học.
3. Thực hiện sửa thông tin một khóa học và ấn nút `F5` / Reload trình duyệt.

#### 2. Expected vs Actual:
- **Expected**: Phiên đăng nhập được duy trì, dữ liệu được giữ nguyên.
- **Actual**: Mất dữ liệu bộ nhớ đệm RAM, người dùng bị đẩy văng ra màn hình Đăng nhập.

#### 3. Root Cause & Solution:
- Ứng dụng lạm dụng `window.location.reload()`, làm mất biến State đệm trong RAM.
- **Code Fix**: Chuyển sang lưu trữ token & session bền vững vào `localStorage` (`lms_session`) và cập nhật React State trong [web/src/App.jsx](https://github.com/tooru352/group-04-project/blob/main/web/src/App.jsx).

#### 4. Evidence & Regression Test:
- **Commit GitHub Tái hiện Lỗi**: [Commit 7f2156c](https://github.com/tooru352/group-04-project/commit/7f2156ceec55b40cfeb5ca5657efea4b16259e88)
- **Commit GitHub Fix Code**: [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73)
- **Automated Regression Test**: `test_tc_130_persistent_session_localstorage` trong [tests/test_frontend_ui_tc126_tc165.py](https://github.com/tooru352/group-04-project/blob/main/tests/test_frontend_ui_tc126_tc165.py) (`PASSED`).

---

### 📌 BUG-04 - New Lesson `sort_order` Assigned Randomly Instead of Incremental Position

- **Bug ID**: `BUG-04`
- **Mức độ (Severity)**: **Major**
- **Môi trường (Environment)**: Backend Database Service (`InstructorModuleView.jsx`)
- **Người chịu trách nhiệm (Owner)**: Do Thi Kim Yen (`dothikimyen8883@gmail.com`)
- **Trạng thái (Status)**: **CLOSED (Verified Fixed)**

#### 1. Các bước Tái hiện (Steps to Reproduce):
1. Chọn một khóa học đã có sẵn 3 bài học (`sort_order` từ 1 đến 3).
2. Tạo thêm 1 bài học mới.
3. Tải lại danh sách bài học.

#### 2. Expected vs Actual:
- **Expected**: Bài học mới tự động có `sort_order = 4` (nằm ở cuối khóa học).
- **Actual**: Bài học mới có `sort_order` bị gán bằng `0` hoặc nhảy thứ tự ngẫu nhiên.

#### 3. Root Cause & Solution:
- Câu lệnh SQL INSERT bài học chưa tính toán giá trị vị trí lớn nhất hiện tại.
- **Code Fix**: Tính toán `sort_order = COALESCE(MAX(sort_order), 0) + 1` trực tiếp trước khi INSERT bài học mới trong [InstructorModuleView.jsx](https://github.com/tooru352/group-04-project/blob/main/web/src/app/instructor/InstructorModuleView.jsx).

#### 4. Evidence & Regression Test:
- **Commit GitHub Tái hiện Lỗi**: [Commit 7f2156c](https://github.com/tooru352/group-04-project/commit/7f2156ceec55b40cfeb5ca5657efea4b16259e88)
- **Commit GitHub Fix Code**: [Commit 24588d1](https://github.com/tooru352/group-04-project/commit/24588d18dc73)
- **Automated Regression Test**: `test_tc_042_lesson_sort_order_increment` trong [tests/test_backend_unit_tc001_tc084.py](https://github.com/tooru352/group-04-project/blob/main/tests/test_backend_unit_tc001_tc084.py) (`PASSED`).

---

### 📌 BUG-05 - AI Tutor Generates Out-of-Context Response for Un-enrolled Learners

- **Bug ID**: `BUG-05`
- **Mức độ (Severity)**: **Major**
- **Môi trường (Environment)**: AI Assistant Component (`AiTutorChatBox.jsx`)
- **Người chịu trách nhiệm (Owner)**: Doan Xuan Toan (`doanxuantoan@gmail.com`)
- **Trạng thái (Status)**: **CLOSED (Verified Fixed)**

#### 1. Các bước Tái hiện (Steps to Reproduce):
1. Đăng nhập tài khoản `Learner` chưa ghi danh khóa học.
2. Mở khung chat AI Tutor và đặt câu hỏi chuyên sâu về nội dung bài học trong khóa đó.

#### 2. Expected vs Actual:
- **Expected**: AI Tutor kiểm tra quyền ghi danh và thông báo `KHÔNG ĐỦ DỮ LIỆU` (`insufficient_context`).
- **Actual**: AI Tutor vẫn đưa ra câu trả lời dựa trên suy đoán ngẫu nhiên (Hallucination).

#### 3. Root Cause & Solution:
- Thiếu bước xác thực danh sách `enrolledLessonIds` trước khi truyền ngữ cảnh vào mô hình AI.
- **Code Fix**: Thêm validator kiểm tra enrollment và vai trò người dùng trong [AiTutorChatBox.jsx](https://github.com/tooru352/group-04-project/blob/main/web/src/app/learner/AiTutorChatBox.jsx).

#### 4. Evidence & Regression Test:
- **GitHub Commit**: [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0)
- **Automated Regression Test**: `test_tc_102_aitutor_enrolled_context_check` trong [tests/test_api_endpoints_tc085_tc125.py](https://github.com/tooru352/group-04-project/blob/main/tests/test_api_endpoints_tc085_tc125.py) (`PASSED`).

---

### 📌 BUG-06 - Grade Out-of-Bounds (`score > 100` or `< 0`) Accepted by Reviewer API

- **Bug ID**: `BUG-06`
- **Mức độ (Severity)**: **Minor**
- **Môi trường (Environment)**: Reviewer Module (`ReviewerModuleView.jsx`)
- **Người chịu trách nhiệm (Owner)**: Doan Xuan Toan (`doanxuantoan@gmail.com`)
- **Trạng thái (Status)**: **CLOSED (Verified Fixed)**

#### 1. Các bước Tái hiện (Steps to Reproduce):
1. Đăng nhập vai trò `Reviewer`.
2. Mở bài làm của học viên và nhập điểm số `-15` hoặc `150`.
3. Nhấn lưu kết quả chấm điểm.

#### 2. Expected vs Actual:
- **Expected**: Giao diện hiển thị cảnh báo lỗi và API trả về `HTTP 400 Bad Request`.
- **Actual**: Hệ thống chấp nhận điểm số nằm ngoài thang 0 - 100.

#### 3. Root Cause & Solution:
- Hàm xử lý chấm điểm thiếu câu lệnh kiểm tra hợp lệ khoảng giá trị điểm (`0 <= score <= 100`).
- **Code Fix**: Thêm validation check bắt buộc tại [ReviewerModuleView.jsx](https://github.com/tooru352/group-04-project/blob/main/web/src/app/reviewer/ReviewerModuleView.jsx).

#### 4. Evidence & Regression Test:
- **GitHub Commit**: [Commit 52718d0](https://github.com/tooru352/group-04-project/commit/52718d06b724f590dd174cd59db7d8df5caf7eb0)
- **Automated Regression Test**: `test_tc_115_submission_grade_out_of_bound_validation` trong [tests/test_api_endpoints_tc085_tc125.py](https://github.com/tooru352/group-04-project/blob/main/tests/test_api_endpoints_tc085_tc125.py) (`PASSED`).

---

### 📌 BUG-07 - Unhandled Course Deletion When Active Learners Are Enrolled

- **Bug ID**: `BUG-07`
- **Mức độ (Severity)**: **Major**
- **Môi trường (Environment)**: Course Management API (`server/index.js`)
- **Người chịu trách nhiệm (Owner)**: Doan Xuan Toan (`doanxuantoan@gmail.com`)
- **Trạng thái (Status)**: **CLOSED (Verified Fixed)**

#### 1. Các bước Tái hiện (Steps to Reproduce):
1. Đăng nhập với vai trò `Admin`.
2. Chọn xóa một khóa học đang có 15 học viên ghi danh hoạt động.

#### 2. Expected vs Actual:
- **Expected**: Server từ chối xóa và trả về lỗi `HTTP 400 Bad Request` yêu cầu hủy ghi danh/lưu trữ trước.
- **Actual**: Khóa học bị xóa lập tức, gây ra rác CSDL (orphaned enrollments).

#### 3. Root Cause & Solution:
- Thêm kiểm tra đếm số bản ghi `enrollments` hoạt động trước khi thực hiện DELETE query trong [server/index.js](https://github.com/tooru352/group-04-project/blob/main/server/index.js).

#### 4. Evidence & Regression Test:
- **Automated Regression Test**: `test_tc_175_delete_course_with_active_enrolled_learners` trong [tests/test_security_edgecases_tc166_tc200.py](https://github.com/tooru352/group-04-project/blob/main/tests/test_security_edgecases_tc166_tc200.py) (`PASSED`).

---

### 📌 BUG-08 - Missing Guard Condition Preventing Self-Demotion of Last System Admin

- **Bug ID**: `BUG-08`
- **Mức độ (Severity)**: **Blocker**
- **Môi trường (Environment)**: Admin User Management (`server/index.js`)
- **Người chịu trách nhiệm (Owner)**: Doan Xuan Toan (`doanxuantoan@gmail.com`)
- **Trạng thái (Status)**: **CLOSED (Verified Fixed)**

#### 1. Các bước Tái hiện (Steps to Reproduce):
1. Hệ thống chỉ còn 1 tài khoản `Admin` duy nhất.
2. Admin này thực hiện đổi vai trò của chính mình thành `Learner`.

#### 2. Expected vs Actual:
- **Expected**: Hệ thống ngăn chặn hạ quyền và hiển thị lỗi "Không thể tự hạ quyền Admin cuối cùng của hệ thống".
- **Actual**: Thay đổi quyền thành công, làm hệ thống rơi vào trạng thái không còn Admin nào quản trị.

#### 3. Root Cause & Solution:
- Đã thêm kiểm tra đếm tổng số Admin hệ thống trước khi cho phép thay đổi role trong [server/index.js](https://github.com/tooru352/group-04-project/blob/main/server/index.js).

#### 4. Evidence & Regression Test:
- **Automated Regression Test**: `test_tc_182_block_self_demotion_of_last_system_admin` trong [tests/test_security_edgecases_tc166_tc200.py](https://github.com/tooru352/group-04-project/blob/main/tests/test_security_edgecases_tc166_tc200.py) (`PASSED`).

---

## 3. Bằng chứng Xác nhận & Chạy Regression Test (Fresh Test Verification Evidence)

Bằng chứng chạy mới bộ test tự động Pytest toàn diện (**200/200 Test Cases**) xác nhận không gây ảnh hưởng tác động phụ (**Zero Regression**):

```bash
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.1.1, pluggy-1.6.0
rootdir: D:\MIS3032\finall1000
collected 200 items

tests\test_api_endpoints_tc085_tc125.py ................................ [ 16%]
.........                                                                [ 20%]
tests\test_backend_unit_tc001_tc084.py ................................. [ 37%]
...................................................                      [ 62%]
tests\test_frontend_ui_tc126_tc165.py .................................. [ 79%]
......                                                                   [ 82%]
tests\test_security_edgecases_tc166_tc200.py ........................... [ 96%]
........                                                                 [100%]

============================= 200 passed in 8.51s =============================
```

> **Xác nhận Đạt Tiêu chuẩn Output (Gate Acceptance Criteria)**:
> - [x] **File Path**: Đã tạo đúng tại `docs/08-quality/bug-log.md`.
> - [x] **Link Clickable**: Tất cả các đường dẫn GitHub Commit đều tuân thủ chuẩn Markdown link không bị lỗi thẻ code đè lên.
> - [x] **Phân tích 192 Pass / 8 Fail**: Đã có bảng kê chi tiết 8 Test Cases bị Fail ban đầu và giải pháp khắc phục triệt để.
> - [x] **Evidence khi báo cáo**: Đã ghi nhận toàn bộ 8 bug đã fix (`BUG-01` đến `BUG-08`) kèm theo bằng chứng GitHub commit và kết quả chạy regression test.
> - [x] **Điều kiện PASS**: Bug tái hiện rõ ràng; thủ tục đóng bug (`closure`) có đầy đủ bằng chứng kiểm thử tự động đạt **200/200 PASSED**.
