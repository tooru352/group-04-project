# 18.5. Output #5 – Requirement Inventory

## 1. Functional Requirements

| ID | Loại | Yêu cầu | Priority |
|---|---|---|---|
| REQ-LMS-01 | FR | Người dùng có thể đăng nhập vào hệ thống bằng tài khoản hợp lệ. | Must |
| REQ-LMS-02 | FR | Hệ thống phân quyền người dùng theo 4 vai trò: Learner, Instructor, Reviewer và Admin. | Must |
| REQ-LMS-03 | FR | Learner có thể xem danh sách các Course có trên hệ thống. | Must |
| REQ-LMS-04 | FR | Learner có thể đăng ký tham gia một Course. | Must |
| REQ-LMS-05 | FR | Learner có thể xem các Lesson thuộc Course đã đăng ký. | Must |
| REQ-LMS-06 | FR | Hệ thống ghi nhận trạng thái hoàn thành của từng Lesson của Learner. | Must |
| REQ-LMS-07 | FR | Learner có thể xem Assignment và Deadline của từng Assignment. | Must |
| REQ-LMS-08 | FR | Learner có thể nộp bài Assignment lên hệ thống. | Must |
| REQ-LMS-09 | FR | Hệ thống ghi nhận thời gian nộp bài và xác định Submission có bị trễ Deadline hay không. | Must |
| REQ-LMS-10 | FR | Learner có thể nộp lại Assignment trước Deadline nếu Assignment cho phép nộp lại. | Must |
| REQ-LMS-11 | FR | Instructor có thể tạo, chỉnh sửa và quản lý Course. | Must |
| REQ-LMS-12 | FR | Instructor có thể tạo, chỉnh sửa và quản lý Lesson thuộc Course. | Must |
| REQ-LMS-13 | FR | Instructor có thể tạo, chỉnh sửa và quản lý Assignment thuộc Course. | Must |
| REQ-LMS-14 | FR | Instructor có thể xem Submission của Learner trong Course mình quản lý. | Must |
| REQ-LMS-15 | FR | Instructor có thể chấm điểm Submission và đưa ra Feedback cho Learner. | Must |
| REQ-LMS-16 | FR | Instructor hoặc Admin có thể phân công Reviewer cho Submission. | Must |
| REQ-LMS-17 | FR | Reviewer có thể xem các Submission được phân công cho mình. | Must |
| REQ-LMS-18 | FR | Reviewer có thể chấm điểm và đưa ra Feedback cho Submission được phân công. | Must |
| REQ-LMS-19 | FR | Learner có thể xem Grade và Feedback của Submission sau khi được đánh giá. | Must |
| REQ-LMS-20 | FR | Learner có thể xem Learning Progress của mình trong từng Course. | Must |
| REQ-LMS-21 | FR | Hệ thống xác định và ghi nhận trạng thái hoàn thành Course của Learner. | Must |
| REQ-LMS-22 | FR | Learner có thể đặt câu hỏi cho AI Tutor trong quá trình học. | Must |
| REQ-LMS-23 | FR | AI Tutor có thể trả lời câu hỏi dựa trên nội dung Course và Lesson được cung cấp. | Must |
| REQ-LMS-24 | FR | AI Tutor có thể giải thích lại nội dung khó bằng cách diễn đạt dễ hiểu hơn hoặc đưa ra ví dụ liên quan. | Must |
| REQ-LMS-25 | FR | AI Tutor phải thông báo khi nội dung Course/Lesson không đủ thông tin để trả lời câu hỏi. | Must |
| REQ-LMS-26 | FR | Admin có thể quản lý User và Role trong hệ thống. | Must |
| REQ-LMS-27 | FR | Admin có thể quản lý Course và các dữ liệu cần thiết cho hoạt động quản trị hệ thống. | Must |

## 2. Non-functional Requirements

| ID | Loại | Yêu cầu | Priority |
|---|---|---|---|
| NFR-LMS-01 | NFR | Hệ thống phải kiểm tra quyền của người dùng trước khi cho phép truy cập các chức năng yêu cầu quyền hạn. | Must |
| NFR-LMS-02 | NFR | Người dùng không được phép truy cập hoặc chỉnh sửa dữ liệu nằm ngoài quyền được cấp. | Must |
| NFR-LMS-03 | NFR | Dữ liệu Course, Lesson, Assignment, Submission, Grade, Feedback và Progress phải được lưu trữ nhất quán. | Must |
| NFR-LMS-04 | NFR | Hệ thống phải bảo vệ thông tin học tập của Learner khỏi truy cập trái phép. | Must |
| NFR-LMS-05 | NFR | AI Tutor không được tự suy đoán hoặc tạo thông tin không có trong context Course/Lesson khi trả lời Learner. | Must |
| NFR-LMS-06 | NFR | Giao diện phải hiển thị rõ trạng thái Lesson, Assignment, Deadline và Learning Progress. | Should |
| NFR-LMS-07 | NFR | Các thao tác quan trọng như chấm điểm, Feedback và thay đổi quyền phải có khả năng truy vết. | Should |