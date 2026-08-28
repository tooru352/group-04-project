## 18.12. Output #12 - PRD
# PRD - AI Learning Management System
Status: Draft from confirmed requirements

## 0. Prototype Assumptions

Các mục dưới đây chỉ là assumption để prototype có thể hoạt động; không phải confirmed requirement hoặc business rule.

- PA-001: Prototype sử dụng sample account cho Learner và Instructor thay vì authentication thật.
- PA-002: Prototype dùng sample data cố định cho Course, Lesson, Assignment, Submission, Grade, Feedback và Progress.
- PA-003: Prototype dùng text response để mô phỏng bài nộp; upload file thật chưa được đặc tả.
- PA-004: AI Tutor dùng sample response theo Lesson context, không gọi AI/LLM thật.
- PA-005: Nguồn AI được hiển thị bằng tên Lesson và nội dung tham chiếu.
- PA-006: Loading, empty, error và permission denied được mô phỏng bằng trạng thái hoặc control trong prototype.
- PA-007: Deadline và thời gian Submit là sample data; prototype có thể mô phỏng cả đúng hạn và Late.
- PA-008: Progress percentage được minh họa dựa trên các Lesson và Assignment bắt buộc; công thức chi tiết chưa được source-of-truth quy định.
- PA-009: Prototype responsive cho desktop và mobile; breakpoint cụ thể là quyết định UI của prototype.

## 1. Problem

Learner cần một nơi rõ ràng để theo dõi nhiều Course, Lesson và Assignment, hoàn thành nội dung học, Submit bài và xem kết quả. Instructor cần nhìn thấy Submission của từng Learner, phân biệt người đã nộp/chưa nộp, Grade và Feedback. AI Tutor cần hỗ trợ học tập dựa trên nội dung Course/Lesson mà không tự suy đoán ngoài context.

## 2. Goals

G1. Cung cấp nền tảng học tập cho Learner: đăng nhập, xem/enroll Course, học Lesson, làm Assignment và theo dõi Progress.
G2. Cung cấp quy trình Submission có Deadline, Late detection, resubmission theo điều kiện, Grade và Feedback.
G3. Cho phép Instructor quản lý Course, Lesson, Assignment và đánh giá Submission trong phạm vi được phân quyền.
G4. Hỗ trợ Reviewer đánh giá Submission được phân công và Admin quản lý User, Role, Course cùng dữ liệu quản trị.
G5. Cung cấp AI Tutor grounded trong Course/Lesson context, giải thích nội dung và từ chối khi context không đủ.
G6. Bảo đảm authorization, consistency, privacy và auditability theo các NFR đã xác nhận.

## 3. Non-goals

Thanh toán; livestream; video call; realtime chat; AI Study Plan; Lesson Summary; AI Learning Suggestions; advanced analytics; notification system nâng cao. Các mục này không nằm trong confirmed requirements hiện tại.

## 4. Users

Learner: người học có nhiều Course, Lesson và Assignment cần theo dõi, Submit và xem Grade/Feedback.

Instructor: giáo viên quản lý Course, Lesson, Assignment, Submission, Grade và Feedback trong phạm vi được phân quyền.

Reviewer: người đánh giá các Submission được phân công. Admin: người quản lý User, Role, Course và dữ liệu cần thiết cho vận hành hệ thống.

## 5. Functional Scope

PRD này bắt nguồn từ toàn bộ confirmed Requirement Inventory. Prototype chỉ kiểm chứng một release slice của các requirement đó.

- REQ-LMS-01, REQ-LMS-02: Login mẫu và phân biệt role Learner/Instructor.
- REQ-LMS-03, REQ-LMS-04: Course list và Learner enrollment.
- REQ-LMS-05, REQ-LMS-06: Xem Lesson và ghi nhận Lesson hoàn thành.
- REQ-LMS-07, REQ-LMS-08, REQ-LMS-09, REQ-LMS-10: Assignment, Deadline, Submit, Late và Submit lại trước Deadline khi được phép.
- REQ-LMS-14, REQ-LMS-15: Instructor xem Submission, Grade và Feedback.
- REQ-LMS-11, REQ-LMS-12, REQ-LMS-13: Instructor tạo, chỉnh sửa và quản lý Course, Lesson và Assignment trong phạm vi được phân quyền.
- REQ-LMS-16: Instructor hoặc Admin phân công Reviewer cho Submission.
- REQ-LMS-17, REQ-LMS-18: Reviewer xem, Grade và Feedback Submission được phân công.
- REQ-LMS-19: Learner xem Grade và Feedback sau đánh giá.
- REQ-LMS-20, REQ-LMS-21: Learning Progress và Course Completion.
- REQ-LMS-22, REQ-LMS-23, REQ-LMS-24, REQ-LMS-25: AI Tutor theo Course/Lesson context, giải thích/gợi ý và báo thiếu dữ liệu.
- REQ-LMS-26, REQ-LMS-27: Admin quản lý User/Role, Course và dữ liệu quản trị.
- NFR-LMS-01, NFR-LMS-02: Kiểm tra quyền và permission denied.
- NFR-LMS-03, NFR-LMS-04: Dữ liệu học tập nhất quán và được bảo vệ trong hệ thống thật.
- NFR-LMS-05: AI không tạo thông tin ngoài context.
- NFR-LMS-06: Hiển thị rõ Lesson, Assignment, Deadline và Learning Progress.
- NFR-LMS-07: Thao tác Grade, Feedback và thay đổi quyền có khả năng truy vết trong hệ thống thật.

## 6. Business Rules

Sản phẩm phải tuân thủ toàn bộ Business Rule đã xác định, không tạo rule mới:

- BR-LMS-01: Hệ thống có Learner, Instructor, Reviewer và Admin.
- BR-LMS-02, BR-LMS-03: Learner phải enroll trước khi học và chỉ xem Course đã enroll.
- BR-LMS-04, BR-LMS-05: Submit sau Deadline là Late; Submit lại trước Deadline chỉ khi Assignment cho phép.
- BR-LMS-06, BR-LMS-07: Instructor chỉ quản lý phạm vi được phân quyền và được xem/Grade/Feedback Submission thuộc Course quản lý.
- BR-LMS-08, BR-LMS-09: Reviewer chỉ xem Submission được phân công; Instructor/Admin có thể phân công Reviewer.
- BR-LMS-10, BR-LMS-11: Grade gắn với Submission/người đánh giá; Learner chỉ xem kết quả của mình.
- BR-LMS-12, BR-LMS-13: Course completion và Learning Progress dựa trên Lesson/Assignment bắt buộc đã hoàn thành.
- BR-LMS-14, BR-LMS-15: AI chỉ dùng Course/Lesson context; thiếu context phải báo không đủ dữ liệu.
- BR-LMS-16: AI ưu tiên giải thích, hướng dẫn và gợi ý, không tự cung cấp đáp án hoàn chỉnh cho Assignment.
- BR-LMS-17: Người dùng không truy cập hoặc chỉnh sửa dữ liệu ngoài quyền.

## 7. UX Principles

- Course, Lesson, Assignment, Deadline và Progress luôn nhìn thấy trong đúng context.
- Navigation giữa Dashboard, Course, Lesson, Assignment, Submission và Instructor review phải rõ ràng.
- Trạng thái Lesson, Submission, Late, Grade, Feedback và Progress không chỉ dùng màu để truyền tải.
- Critical action như Enroll, Mark complete, Submit và Save Grade/Feedback có confirmation hoặc success feedback rõ.
- Error phải nói điều gì xảy ra và cách thử lại.
- AI Tutor là thành phần trong Lesson/Course, không phải chatbot độc lập.
- AI hỏi lại hoặc hiển thị `KHÔNG ĐỦ DỮ LIỆU` khi context không đủ, không đoán.
- Layout responsive cho desktop/mobile và không che khuất nội dung học hoặc thao tác chính.

## 8. Metrics / Acceptance Signals

### Product acceptance

- 100% confirmed functional requirements có implementation owner, acceptance test và authorization rule tương ứng trước release.
- 100% Submission có timestamp; Submission sau Deadline được xác định là Late.
- 100% Grade gắn với đúng Submission và người đánh giá; Learner chỉ xem được kết quả của mình.
- 100% Course Completion chỉ được ghi nhận khi hoàn thành Lesson bắt buộc và Assignment bắt buộc.
- 0 câu trả lời AI trong test set được tạo từ ngoài Course/Lesson context; câu hỏi thiếu context trả về thông báo không đủ dữ liệu.
- Không có test case cho phép user truy cập hoặc chỉnh sửa dữ liệu ngoài quyền.

### Prototype validation signals

- 4 critical flows pass end-to-end trong prototype: Learn & Progress; Assignment Submission; Instructor Grading/Feedback; AI Tutor.
- Các màn hình và required states được mô tả trong `prototype-brief.md` và `screen-flow.md` có thể được kiểm chứng bằng sample data.
- Prototype hoạt động trên viewport desktop và mobile mà không làm mất critical action hoặc thông tin trạng thái.

## 9. Risks

Responsive layout có thể làm giảm khả năng quét Deadline, Progress và trạng thái trên mobile; cần kiểm tra bằng viewport thực tế.

Sample data có thể không phản ánh đầy đủ các trường hợp nhiều Submission, Submit lại và Course Completion.

Việc mô phỏng AI response có thể che khuất vấn đề latency, retrieval và context validation của hệ thống thật.

Quy tắc tính Progress và hành vi một số Assignment chưa được đặc tả đầy đủ; phải giữ dưới dạng ASSUMPTION cho đến khi được xác nhận.

Permission boundary giữa Learner, Instructor, Reviewer và Admin cần được kiểm tra thêm khi phát triển backend thật.

## 10. Release Slice

MVP-1 product: Authentication và authorization; Course/Lesson/Assignment management; enrollment và learning; Submission/Deadline/Late; Grade/Feedback; Progress/Course Completion; Reviewer assignment/evaluation; Admin User/Role/Course management; AI Tutor grounded context.

MVP-1 prototype validation: Login mẫu; Learner Dashboard; Course List/Detail; Enrollment; Lesson Detail và completion; Learning Progress; Assignment Detail; Submit đúng hạn/Late; Submission Result; Instructor Dashboard; Submission Review; Grade và Feedback; AI Tutor sample response và insufficient-context.

MVP-2 (nếu còn thời gian): Submission history; Deadline reminder; Instructor progress dashboard; AI Tutor navigation tới Lesson liên quan; các state gallery phục vụ usability test.

## 11. Prototype Deliverable

Prototype web responsive là artifact validation, được triển khai bằng HTML/CSS/JavaScript thuần tại `docs/03-product/prototype-URL/`, không kết nối database/API/AI thật. Dữ liệu Course, Lesson, Assignment, Submission, Grade, Feedback và Progress là sample data. `prototype-brief.md` và `screen-flow.md` mô tả cách prototype kiểm chứng PRD, không phải nguồn tạo ra PRD.
