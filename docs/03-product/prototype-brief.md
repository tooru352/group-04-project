# Prompt: Prototype AI LMS

## ASSUMPTIONS

Các assumption dưới đây chỉ phục vụ việc prototype hoạt động, không phải confirmed requirement hoặc business rule:

- PA-001: Prototype dùng sample account cho Learner, Instructor, Reviewer và Admin, không có authentication thật.
- PA-002: Prototype dùng sample data cố định, không kết nối database/API.
- PA-003: Bài nộp được mô phỏng bằng text response; upload file thật chưa được đặc tả.
- PA-004: AI Tutor dùng sample response theo Lesson context, không triển khai AI/LLM thật.
- PA-005: Deadline, thời gian Submit, Grade, Feedback và Progress đều là sample data.
- PA-006: Có thể kích hoạt các state loading, empty, error và permission denied bằng control demo.
- PA-007: Progress percentage được minh họa theo Lesson và Assignment bắt buộc; công thức chi tiết chưa được source-of-truth quy định.
- PA-008: Prototype responsive cho desktop và mobile; breakpoint cụ thể là quyết định UI của prototype.

## Prompt

Tạo prototype web responsive cho **AI Learning Management System (AI LMS)**.

**Nguồn yêu cầu:**
- Requirements: `REQ-LMS-01`, `REQ-LMS-02`, `REQ-LMS-03`, `REQ-LMS-04`, `REQ-LMS-05`, `REQ-LMS-06`, `REQ-LMS-07`, `REQ-LMS-08`, `REQ-LMS-09`, `REQ-LMS-10`, `REQ-LMS-14`, `REQ-LMS-15`, `REQ-LMS-19`, `REQ-LMS-20`, `REQ-LMS-21`, `REQ-LMS-22`, `REQ-LMS-23`, `REQ-LMS-24`, `REQ-LMS-25`, `NFR-LMS-01`, `NFR-LMS-02`, `NFR-LMS-05`, `NFR-LMS-06`.
- Business Rules: `BR-LMS-01`, `BR-LMS-02`, `BR-LMS-03`, `BR-LMS-04`, `BR-LMS-05`, `BR-LMS-06`, `BR-LMS-07`, `BR-LMS-08`, `BR-LMS-09`, `BR-LMS-10`, `BR-LMS-11`, `BR-LMS-12`, `BR-LMS-13`, `BR-LMS-14`, `BR-LMS-15`, `BR-LMS-16`, `BR-LMS-17`.

Không tự tạo, đổi hoặc suy diễn thêm Requirement/Business Rule. Nếu một hành vi chưa được quy định, ghi rõ `ASSUMPTION` riêng, không trộn vào confirmed requirements.

**Persona:**
- Learner: người học có nhiều Course, Lesson và Assignment cần theo dõi, hoàn thành, Submit và xem Grade/Feedback.
- Instructor: giáo viên quản lý Course, Lesson, Assignment, Submission, Grade và Feedback trong phạm vi được phân quyền.
- Reviewer: người được phân công để xem và đánh giá các Submission được giao theo quyền hạn.
- Admin: người quản trị hệ thống, quản lý User, Role, Course và quyền truy cập.

**Mục tiêu:**
- Kiểm chứng flow Learner: Login → Dashboard → Course → Lesson → đánh dấu hoàn thành → cập nhật Learning Progress.
- Kiểm chứng flow Assignment: Course → Assignment → xem yêu cầu/Deadline → thực hiện → Submit → Submission Result; nếu quá Deadline vẫn Submit và hiển thị Late; trước Deadline được Submit lại khi Assignment cho phép.
- Kiểm chứng flow Instructor: Dashboard → Course → Submission list → chọn Submission → xem bài → Grade → nhập Feedback → lưu kết quả; phân biệt Learner đã nộp và chưa nộp.
- Kiểm chứng flow Reviewer: Login → Reviewer Dashboard → Assigned Reviews → mở Submission → xem bài → Grade → Feedback theo Submission được phân công.
- Kiểm chứng flow Admin: Login → Admin Console → User / Role / Course Access management.
- Kiểm chứng flow AI Tutor trong Lesson: mở Tutor → hỏi theo Lesson context → hiển thị câu trả lời và nguồn Lesson; nếu thiếu context phải hiển thị chính xác `KHÔNG ĐỦ DỮ LIỆU`, không suy đoán.
- Prototype chỉ kiểm tra giao diện, navigation và interaction; không cần backend hoặc AI thật.

**Screens bắt buộc:**
`Login`, `Learner Dashboard`, `Course List`, `Course Detail`, `Lesson Detail`, `Assignment Detail`, `Submission / Submit Assignment`, `Submission Result`, `Instructor Dashboard`, `Submission Review / Grading`, `Feedback`, `AI Tutor`, `Reviewer Dashboard`, `Admin Console`.

**States bắt buộc:**
`default`, `loading`, `empty`, `error`, `permission denied`, `incomplete`, `submitted`, `late submission`, `graded`, `feedback available`, `AI Tutor processing`, `AI Tutor answer`, `AI Tutor không đủ dữ liệu`, `confirmation`, `success`.

**Dùng sample data sau:**
- 3 Course: `Human-Centered Product Design`, `Data Literacy for Decisions`, `Systems Thinking 101`.
- Mỗi Course có nhiều Lesson, gồm title, duration, content và completion status.
- Assignment mẫu `Journey map critique`, có instructions, Deadline, required status và khả năng Submit lại theo assumption.
- Submission mẫu của các Learner: đã nộp, chưa nộp và đã Late.
- Grade mẫu `8.5 / 10` cùng Feedback mẫu của Instructor.
- Learning Progress mẫu theo Course, gồm số Lesson hoàn thành, phần trăm và Course completion status.
- Lesson context mẫu về empathy, insight, journey mapping và prototyping để AI Tutor trả lời.

**Yêu cầu giao diện:**
- Responsive desktop/mobile, navigation rõ ràng giữa các màn hình.
- Phân biệt rõ Learner workspace và Instructor workspace.
- Hiển thị rõ Course, Lesson, Assignment, Deadline, Submission status, Grade, Feedback và Learning Progress.
- Hiển thị feedback gần thao tác vừa thực hiện; error phải nêu vấn đề và cách thử lại.
- AI Tutor là thành phần hỗ trợ bên trong Lesson/Course, không phải chatbot độc lập.
- Không dùng màu sắc duy nhất để truyền tải trạng thái.

**Giới hạn:**
- Không kết nối database/API thật.
- Không triển khai AI/LLM thật; AI Tutor dùng sample response.
- Không thêm feature ngoài Requirement/Business Rule đã nêu.
- Không thay đổi source-of-truth.
- Grade, Deadline và Progress chỉ là sample data.
- Prototype có thể triển khai bằng HTML/CSS/JavaScript thuần tại `src/`.
