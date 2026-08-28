# 6 – Business Rules, Assumptions và Open Questions

## 1. Business Rules

| ID | Rule |
|---|---|
| BR-LMS-01 | Hệ thống có 4 vai trò người dùng: Learner, Instructor, Reviewer và Admin. |
| BR-LMS-02 | Learner phải đăng ký Course trước khi có thể học các Lesson thuộc Course đó. |
| BR-LMS-03 | Learner chỉ được xem nội dung học tập của các Course mà mình đã đăng ký. |
| BR-LMS-04 | Submission được nộp sau Deadline phải được hệ thống đánh dấu là Late. |
| BR-LMS-05 | Learner được phép Submit lại Assignment trước Deadline nếu Assignment cho phép nộp lại. |
| BR-LMS-06 | Instructor chỉ được quản lý Course, Lesson và Assignment thuộc phạm vi được phân quyền. |
| BR-LMS-07 | Instructor có quyền xem, chấm điểm và Feedback cho Submission của Learner thuộc Course mình quản lý. |
| BR-LMS-08 | Reviewer chỉ được xem và đánh giá các Submission được phân công cho mình. |
| BR-LMS-09 | Instructor hoặc Admin có thể phân công Reviewer cho Submission. |
| BR-LMS-10 | Grade phải được gắn với một Submission cụ thể và người thực hiện đánh giá. |
| BR-LMS-11 | Learner chỉ có thể xem Grade và Feedback của Submission thuộc chính mình. |
| BR-LMS-12 | Course chỉ được ghi nhận Completed khi Learner hoàn thành tất cả Lesson bắt buộc và Assignment bắt buộc của Course. |
| BR-LMS-13 | Learning Progress được xác định dựa trên trạng thái hoàn thành các Lesson và Assignment trong Course. |
| BR-LMS-14 | AI Tutor chỉ được sử dụng nội dung Course/Lesson được cung cấp làm nguồn để trả lời câu hỏi của Learner. |
| BR-LMS-15 | Khi nội dung Course/Lesson không đủ để trả lời, AI Tutor phải thông báo không đủ dữ liệu thay vì tự suy đoán. |
| BR-LMS-16 | AI Tutor ưu tiên giải thích, hướng dẫn và gợi ý cho Assignment thay vì tự động cung cấp đáp án hoàn chỉnh. |
| BR-LMS-17 | Người dùng không được phép truy cập hoặc chỉnh sửa dữ liệu nằm ngoài quyền được cấp. |

## 2. Assumptions

| ID | Assumption |
|---|---|
| ASM-LMS-01 | MVP được triển khai cho nhóm 2 thành viên nên ưu tiên các chức năng Must-have của workflow chính. |
| ASM-LMS-02 | Hệ thống sử dụng dữ liệu Course, Lesson và Assignment do Instructor/Admin cung cấp làm nguồn dữ liệu chính. |
| ASM-LMS-03 | AI Tutor chỉ hỗ trợ việc học và không thay thế vai trò đánh giá chính thức của Instructor hoặc Reviewer. |
| ASM-LMS-04 | Việc chấm điểm trong MVP được thực hiện bởi Instructor hoặc Reviewer, không tự động quyết định Grade bằng AI. |
| ASM-LMS-05 | AI Tutor có thể sử dụng mô hình AI và cơ chế truy xuất nội dung phù hợp để tìm context từ Course/Lesson. |
| ASM-LMS-06 | Learner sử dụng AI Tutor chủ yếu để giải thích nội dung, tìm lại kiến thức và nhận hướng dẫn học tập. |
| ASM-LMS-07 | Các Course trong MVP có thể sử dụng dữ liệu mẫu do nhóm xây dựng để phục vụ demo và kiểm thử. |

## 3. Open Questions

| ID | Open Question | Quyết định cho MVP |
|---|---|---|
| Q-LMS-01 | Learner có được xem toàn bộ Lesson ngay sau khi đăng ký Course hay phải học theo thứ tự? | MVP: Learner được xem các Lesson đã được mở trong Course, chưa bắt buộc học tuần tự. |
| Q-LMS-02 | Assignment có bắt buộc phải hoàn thành mới được tính Course Completed không? | MVP: Chỉ Assignment được đánh dấu là bắt buộc mới ảnh hưởng đến Course Completion. |
| Q-LMS-03 | Learner có được Submit lại Assignment sau Deadline không? | MVP: Có thể nộp sau Deadline nếu Assignment vẫn mở, nhưng Submission được đánh dấu Late. |
| Q-LMS-04 | Khi có nhiều Submission, Submission nào được sử dụng để Grade? | MVP: Submission cuối cùng hợp lệ trước Deadline được sử dụng để Grade mặc định. |
| Q-LMS-05 | Reviewer có thể xem toàn bộ Course của Submission được phân công không? | MVP: Reviewer chỉ xem được thông tin cần thiết để đánh giá Submission được phân công. |
| Q-LMS-06 | AI Tutor có được sử dụng kiến thức bên ngoài Course/Lesson không? | MVP: Không. AI Tutor chỉ trả lời dựa trên context Course/Lesson được cung cấp. |
| Q-LMS-07 | AI Tutor có được đưa đáp án trực tiếp cho Assignment không? | MVP: Không ưu tiên đưa đáp án hoàn chỉnh; AI tập trung giải thích và gợi ý. |
| Q-LMS-08 | Có lưu lịch sử hội thoại giữa Learner và AI Tutor không? | MVP: Có lưu trong phạm vi Course/Session cần thiết; chưa yêu cầu duy trì lịch sử lâu dài. |
| Q-LMS-09 | Course Completion có được tự động cập nhật không? | MVP: Có. Hệ thống tự kiểm tra điều kiện khi Learner hoàn thành Lesson/Assignment. |
| Q-LMS-10 | Có cần thông báo Deadline sắp đến cho Learner không? | MVP: Có thể hiển thị Deadline và trạng thái bài tập; notification tự động là Should nếu còn thời gian triển khai. |