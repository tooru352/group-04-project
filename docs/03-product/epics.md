## 18.13. Output #13 - Epics và User Stories

# Epics - AI Learning Management System

## 1. Mục đích

Các Epic nhóm những Requirement đã xác nhận theo capability và giá trị người dùng/business. Epic và User Story không tạo Requirement hoặc Business Rule mới. Mã trong cột `Requirement IDs` là mapping tới source-of-truth hiện có.

**Lưu ý:** `Pts` là story point ước lượng để lập kế hoạch, không phải Requirement. Cách chia story và điểm cần được nhóm xác nhận.

## 2. Epic và User Stories

| Epic | Capability | Story | Title | Pts | Requirement IDs |
|---|---|---|---|---:|---|
| EP1 | Identity & Access | US-LMS-01 | Đăng nhập bằng tài khoản hợp lệ | 2 | REQ-LMS-01 |
| EP1 | Identity & Access | US-LMS-02 | Nhận diện role Learner, Instructor, Reviewer và Admin | 3 | REQ-LMS-02 |
| EP1 | Identity & Access | US-LMS-03 | Kiểm soát quyền truy cập và bảo vệ dữ liệu học tập | 3 | NFR-LMS-01, NFR-LMS-02, NFR-LMS-04 |
| EP2 | Course Discovery & Enrollment | US-LMS-04 | Xem danh sách Course | 2 | REQ-LMS-03 |
| EP2 | Course Discovery & Enrollment | US-LMS-05 | Đăng ký tham gia Course | 2 | REQ-LMS-04 |
| EP3 | Learning Content & Progress | US-LMS-06 | Xem Lesson của Course đã đăng ký | 2 | REQ-LMS-05 |
| EP3 | Learning Content & Progress | US-LMS-07 | Đánh dấu Lesson hoàn thành | 2 | REQ-LMS-06 |
| EP3 | Learning Content & Progress | US-LMS-08 | Xem Learning Progress trong Course | 3 | REQ-LMS-20 |
| EP3 | Learning Content & Progress | US-LMS-09 | Ghi nhận Course Completed khi đủ điều kiện | 3 | REQ-LMS-21 |
| EP4 | Assignment & Submission | US-LMS-10 | Xem yêu cầu và Deadline của Assignment | 2 | REQ-LMS-07 |
| EP4 | Assignment & Submission | US-LMS-11 | Submit Assignment | 3 | REQ-LMS-08 |
| EP4 | Assignment & Submission | US-LMS-12 | Ghi nhận thời gian và Late Submission | 3 | REQ-LMS-09 |
| EP4 | Assignment & Submission | US-LMS-13 | Submit lại trước Deadline khi được phép | 2 | REQ-LMS-10 |
| EP5 | Assessment & Feedback | US-LMS-14 | Instructor xem Submission của Learner | 3 | REQ-LMS-14 |
| EP5 | Assessment & Feedback | US-LMS-15 | Instructor Grade và đưa Feedback | 3 | REQ-LMS-15 |
| EP5 | Assessment & Feedback | US-LMS-16 | Learner xem Grade và Feedback của Submission | 2 | REQ-LMS-19 |
| EP6 | Reviewer Workflow | US-LMS-17 | Phân công Reviewer cho Submission | 2 | REQ-LMS-16 |
| EP6 | Reviewer Workflow | US-LMS-18 | Reviewer xem Submission được phân công | 2 | REQ-LMS-17 |
| EP6 | Reviewer Workflow | US-LMS-19 | Reviewer Grade và đưa Feedback | 3 | REQ-LMS-18 |
| EP7 | Course & System Administration | US-LMS-20 | Instructor quản lý Course | 3 | REQ-LMS-11 |
| EP7 | Course & System Administration | US-LMS-21 | Instructor quản lý Lesson thuộc Course | 3 | REQ-LMS-12 |
| EP7 | Course & System Administration | US-LMS-22 | Instructor quản lý Assignment thuộc Course | 3 | REQ-LMS-13 |
| EP7 | Course & System Administration | US-LMS-23 | Admin quản lý User và Role | 3 | REQ-LMS-26 |
| EP7 | Course & System Administration | US-LMS-24 | Admin quản lý Course và dữ liệu quản trị | 3 | REQ-LMS-27 |
| EP8 | Grounded AI Tutor | US-LMS-25 | Learner đặt câu hỏi cho AI Tutor | 2 | REQ-LMS-22 |
| EP8 | Grounded AI Tutor | US-LMS-26 | AI Tutor trả lời theo Course/Lesson context | 3 | REQ-LMS-23 |
| EP8 | Grounded AI Tutor | US-LMS-27 | AI Tutor giải thích nội dung hoặc đưa ví dụ liên quan | 3 | REQ-LMS-24 |
| EP8 | Grounded AI Tutor | US-LMS-28 | AI Tutor báo thiếu dữ liệu thay vì suy đoán | 3 | REQ-LMS-25, NFR-LMS-05 |
| EP8 | Grounded AI Tutor | US-LMS-29 | Hiển thị trạng thái và nguồn context của AI Tutor | 2 | NFR-LMS-06 |

## 3. Giá trị theo Epic

| Epic | Giá trị người dùng/business |
|---|---|
| EP1 | Đúng người dùng, đúng quyền; giảm truy cập trái phép và bảo vệ dữ liệu học tập. |
| EP2 | Learner tìm thấy Course và bắt đầu hành trình học. |
| EP3 | Learner biết nội dung đã học, tiến độ hiện tại và điều kiện hoàn thành Course. |
| EP4 | Quy trình giao/nộp bài minh bạch về yêu cầu, Deadline, timestamp và Late status. |
| EP5 | Tạo vòng phản hồi giữa người dạy và người học thông qua Grade/Feedback. |
| EP6 | Phân phối công việc đánh giá đúng Submission và đúng Reviewer. |
| EP7 | Bảo đảm nội dung, người dùng và dữ liệu vận hành được quản lý trong phạm vi phù hợp. |
| EP8 | Hỗ trợ tự học bằng câu trả lời có căn cứ, đồng thời hạn chế hallucination của AI. |

## 4. Business Rules liên quan

| Epic | Business Rules áp dụng |
|---|---|
| EP1 | BR-LMS-01, BR-LMS-17 |
| EP2 | BR-LMS-02, BR-LMS-03 |
| EP3 | BR-LMS-02, BR-LMS-03, BR-LMS-12, BR-LMS-13 |
| EP4 | BR-LMS-04, BR-LMS-05 |
| EP5 | BR-LMS-06, BR-LMS-07, BR-LMS-10, BR-LMS-11 |
| EP6 | BR-LMS-08, BR-LMS-09 |
| EP7 | BR-LMS-01, BR-LMS-06, BR-LMS-17 |
| EP8 | BR-LMS-14, BR-LMS-15, BR-LMS-16 |

## 5. Non-functional Requirements liên quan

| NFR ID | Epic liên quan | Giá trị business |
|---|---|---|
| NFR-LMS-01 | EP1 | Kiểm tra quyền trước chức năng được bảo vệ. |
| NFR-LMS-02 | EP1, EP7 | Ngăn truy cập/chỉnh sửa ngoài quyền. |
| NFR-LMS-03 | EP3, EP4, EP5 | Dữ liệu học tập được lưu trữ nhất quán. |
| NFR-LMS-04 | EP1 | Bảo vệ thông tin học tập Learner. |
| NFR-LMS-05 | EP8 | AI không suy đoán ngoài Course/Lesson context. |
| NFR-LMS-06 | EP3, EP4, EP8 | Hiển thị rõ trạng thái học tập, bài tập, Deadline, Progress và AI. |
| NFR-LMS-07 | EP5, EP7 | Có khả năng truy vết các thao tác quan trọng. |

## 6. Coverage check

- `REQ-LMS-01` đến `REQ-LMS-27`: được mapping vào ít nhất một User Story.
- `NFR-LMS-01` đến `NFR-LMS-07`: được mapping vào ít nhất một Epic/User Story.
- `BR-LMS-01` đến `BR-LMS-17`: được tham chiếu trong phạm vi Epic tương ứng.
- Các User Story mô tả cách deliver value; không thay thế nội dung Requirement hoặc Business Rule source-of-truth.
