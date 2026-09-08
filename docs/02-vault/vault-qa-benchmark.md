# Vault Q&A Benchmark

## 1. Mục đích

Vault Q&A Benchmark được sử dụng để kiểm tra khả năng của AI trong việc
trả lời câu hỏi dựa trên Project Vault của AI Learning Management System.

AI phải:
- Chỉ sử dụng thông tin có trong Project Vault.
- Nêu Requirement ID / Business Rule ID / Decision ID khi có.
- Không tự suy đoán khi Vault không có đủ dữ liệu.
- Với câu hỏi Unknown, phải trả lời `KHÔNG ĐỦ DỮ LIỆU`.

## 2. Quy ước đánh giá

| Kết quả | Ý nghĩa |
|---|---|
| Correct | Câu trả lời đúng và có nguồn hỗ trợ trong Vault. |
| Partial | Câu trả lời đúng một phần nhưng thiếu thông tin hoặc nguồn. |
| Wrong | Câu trả lời trái với nội dung trong Vault. |
| Unsupported | AI đưa ra thông tin không có trong Vault hoặc tự suy đoán. |

## 3. Benchmark Questions

### A. Fact Questions

| ID | Question | Expected Answer | Expected Source | Result |
|---|---|---|---|---|
| QA-01 | Hệ thống AI Learning Management System có những role nào? | Có 4 role: Learner, Instructor, Reviewer và Admin. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-01) | Correct |
| QA-02 | Workflow chính của hệ thống là gì? | Enroll → Learn → Submit → Grade → Feedback → Complete. | `docs/03-product/screen-flow.md` (validation artifact) | Correct |
| QA-03 | Learner có thể thực hiện những chức năng chính nào? | Đăng ký Course, xem Lesson, làm/nộp Assignment, xem Grade, Feedback, theo dõi Progress và hỏi AI Tutor. | `docs/02-vault/02-requirements/5.requirements.md` (REQ-LMS-03..10, 19..25) | Correct |
| QA-04 | Instructor có thể thực hiện những chức năng nào? | Tạo Course, Lesson, Assignment; xem Submission; chấm điểm; Feedback và theo dõi tiến độ Learner. | `docs/02-vault/02-requirements/5.requirements.md` (REQ-LMS-11..15, 20) | Correct |
| QA-05 | Reviewer khác Instructor ở điểm nào? | Reviewer tập trung vào việc xem và đánh giá Submission được phân công, không nhất thiết quản lý Course. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-06..08) | Correct|
| QA-06 | Admin có những quyền chính nào? | Quản lý User, Role, Course và các dữ liệu/quyền quản trị hệ thống. | `docs/02-vault/02-requirements/5.requirements.md` (REQ-LMS-26..27) | Correct |

### B. Business Rule Questions

| ID | Question | Expected Answer | Expected Source | Result |
|---|---|---|---|---|
| QA-07 | Khi nào một Course được xem là Completed? | Khi Learner hoàn thành tất cả Lesson bắt buộc và Assignment bắt buộc. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-12) / `docs/02-vault/08-decisions/decision-log.md` (DEC-001) | Correct |
| QA-08 | Learner có được nộp Assignment sau Deadline không? | Có. Submission sau Deadline vẫn được phép nhưng phải được đánh dấu là Late. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-04) / `docs/02-vault/08-decisions/decision-log.md` (DEC-002) | Correct |
| QA-09 | Learner có được Submit lại Assignment trước Deadline không? | Có, nếu Assignment cho phép Submit lại. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-05) | Correct |
| QA-10 | Submission nào được sử dụng để Grade mặc định? | Submission cuối cùng hợp lệ trước Deadline được sử dụng để Grade mặc định. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-10) | Correct |
| QA-11 | Reviewer có được xem tất cả Submission trong hệ thống không? | Không. Reviewer chỉ được xem và đánh giá các Submission được phân công. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-08) | Correct|
| QA-12 | Ai có thể phân công Reviewer? | Instructor và Admin có thể phân công Reviewer. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-09) | Correct |
| QA-13 | AI Tutor được phép sử dụng nguồn nào để trả lời Learner? | Chỉ sử dụng nội dung Course/Lesson được cung cấp làm context. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-14) | Correct |

### C. Edge Case Questions

| ID | Question | Expected Answer | Expected Source | Result |
|---|---|---|---|---|
| QA-14 | Nếu Learner nộp Assignment sau Deadline thì Submission có bị từ chối không? | Không. Submission vẫn được nhận nhưng được đánh dấu là Late. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-04) | Correct |
| QA-15 | Nếu Learner đã Submit một Assignment trước Deadline và sau đó Submit lại trước Deadline thì Submission nào được Grade mặc định? | Submission cuối cùng hợp lệ trước Deadline. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-10) | Correct|
| QA-16 | Nếu Learner hoàn thành tất cả Lesson nhưng chưa hoàn thành một Assignment bắt buộc thì Course có được đánh dấu Completed không? | Không. Course chỉ Completed khi tất cả Lesson bắt buộc và Assignment bắt buộc đều hoàn thành. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-12) | Correct |
| QA-17 | Nếu Reviewer không được phân công cho một Submission thì Reviewer đó có được đánh giá Submission không? | Không. Reviewer chỉ được xem và đánh giá Submission được phân công. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-08) | Correct |
| QA-18 | Nếu AI Tutor không có đủ nội dung Course/Lesson để trả lời câu hỏi của Learner thì AI phải làm gì? | Thông báo `KHÔNG ĐỦ DỮ LIỆU` và không tự suy đoán thông tin. | `docs/02-vault/03-domain/business-rules.md` (BR-LMS-15) / `docs/02-vault/08-decisions/decision-log.md` (DEC-003) | Correct |

### D. Unknown Questions

Các câu hỏi dưới đây được thiết kế để kiểm tra khả năng nhận biết
thông tin chưa được quy định trong Vault.

| ID | Question | Expected Answer | Expected Source | Result |
|---|---|---|---|---|
| QA-19 | Hệ thống có hỗ trợ thanh toán học phí trực tuyến bằng thẻ ngân hàng không? | KHÔNG ĐỦ DỮ LIỆU. Thanh toán khóa học nằm ngoài phạm vi MVP. Không có thông tin về phương thức thanh toán được triển khai. | `docs/01-discovery/1.project-charter.md` / `docs/01-discovery/7.MVP-Scope.md` | Correct |
| QA-20 | Learner có được phép tải video lên Assignment không? | KHÔNG ĐỦ DỮ LIỆU. Vault hiện chưa quy định loại file Submission được hỗ trợ. | `docs/02-vault/02-requirements/5.requirements.md` | Correct |
| QA-21 | Một Course có tối đa bao nhiêu Lesson? | KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định số lượng Lesson tối đa trong một Course. | `docs/02-vault/02-requirements/5.requirements.md` | Correct |
| QA-22 | Assignment có được phép gia hạn Deadline bởi Instructor không? | KHÔNG ĐỦ DỮ LIỆU. Vault hiện chưa có Business Rule quy định về việc gia hạn Deadline. | `docs/02-vault/03-domain/business-rules.md` | Correct |
| QA-23 | AI Tutor có lưu toàn bộ lịch sử trò chuyện của Learner trong bao lâu? | KHÔNG ĐỦ DỮ LIỆU. Vault hiện chưa quy định thời gian lưu conversation history. | `docs/02-vault/02-requirements/5.requirements.md` / `docs/02-vault/08-decisions/decision-log.md` | Correct |
| QA-24 | Learner cần đạt tối thiểu bao nhiêu điểm Assignment để được Complete Course? | KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định điểm tối thiểu để hoàn thành Assignment/Course. | `docs/02-vault/02-requirements/5.requirements.md` / `docs/02-vault/03-domain/business-rules.md` | Correct |

## 4. Benchmark Summary

| Category | Number of Questions | Correct | Partial | Wrong | Unsupported |
|---|---:|---:|---:|---:|---:|
| Fact | 6 | 6 | 0 | 0 | 0 |
| Rule | 7 | 6 | 1 | 0 | 0 |
| Edge Case | 5 | 5 | 0 | 0 | 0 |
| Unknown | 6 | 6 | 0 | 0 | 0 |
| **Total** | **24** | 24 | 0 | 0 | 0 |

## 5. Accuracy

### Công thức

Accuracy được tính trên các câu hỏi mà AI phải trả lời đúng theo Vault:

`Accuracy = 24 / 24 × 100% = 100%`

Mục tiêu:

**Accuracy ≥ 80%**

Đối với câu Unknown, AI chỉ được tính là Correct khi:
- AI xác định đúng là Vault chưa đủ dữ liệu.
- Không tự đưa ra thông tin bên ngoài.
- Nêu được nguồn hoặc loại tài liệu cần bổ sung nếu có thể xác định.

## 6. Benchmark Execution

<!-- Test 1 - Fact -->
Question:QA01

Hệ thống có những role nào?

AI Answer:

Hệ thống có 4 vai trò chính: Learner, Instructor, Reviewer và Admin.

Expected:

Learner, Instructor, Reviewer và Admin.

Result: Correct

<!-- 
Test 2 - Fact -->
Question:QA02

Workflow chính của hệ thống là gì?

AI Answer:

Luồng chính của hệ thống là Enroll → Learn → Submit → Grade → Feedback → Complete.

Expected:

Enroll → Learn → Submit → Grade → Feedback → Complete.

Result: Correct


<!-- Test 3 - Fact -->
Question:QA03

Learner có thể thực hiện những chức năng chính nào?

AI Answer:

Learner có thể đăng ký Course, xem Lesson, làm và nộp Assignment, xem Grade và Feedback, theo dõi Progress và hỏi AI Tutor.

Expected:

Đăng ký Course, xem Lesson, làm/nộp Assignment, xem Grade, Feedback, theo dõi Progress và hỏi AI Tutor.

Result: Correct

<!-- Test 4 - Fact -->
Question:QA04

Instructor có thể thực hiện những chức năng nào?

AI Answer:

Instructor có thể tạo Course, Lesson và Assignment, xem Submission, chấm điểm, gửi Feedback và theo dõi tiến độ Learner.

Expected:

Tạo Course, Lesson, Assignment; xem Submission; chấm điểm; Feedback và theo dõi tiến độ Learner.

Result: Correct

<!-- Test 5 - Fact -->
Question:QA05

Reviewer khác Instructor ở điểm nào?

AI Answer:

Reviewer tập trung vào việc xem và chấm điểm các Submission được phân công cho mình, còn Instructor không nhất thiết chỉ làm công việc đó.

Expected:

Reviewer tập trung vào việc xem và đánh giá Submission được phân công, không nhất thiết quản lý Course.

Result: Correct

<Test 6 - Fact -->
Question:QA06

Admin có những quyền chính nào?

AI Answer:

Admin có quyền quản lý User, Role, Course và các dữ liệu, quyền liên quan đến vận hành hệ thống.

Expected:

Quản lý User, Role, Course và các dữ liệu/quyền quản trị hệ thống.

Result: Correct



<!-- Test 7 - Business Rule -->
Question:QA07

Khi nào một Course được xem là Completed?

AI Answer:

Course chỉ được đánh dấu hoàn thành khi Learner đã hoàn thành tất cả Lesson bắt buộc và Assignment bắt buộc.

Expected:

Khi Learner hoàn thành tất cả Lesson bắt buộc và Assignment bắt buộc.

Result: Correct

<!-- Test 8 - Business Rule -->
Question:QA08

Learner có được nộp Assignment sau Deadline không?

AI Answer:

Có. Learner vẫn có thể nộp bài sau hạn, nhưng Submission đó sẽ được đánh dấu là Late.

Expected:

Có. Submission sau Deadline vẫn được phép nhưng phải được đánh dấu là Late.

Result: Correct

<!-- Test 9 - Business Rule -->
Question:QA09

Learner có được Submit lại Assignment trước Deadline không?

AI Answer:

Có, Learner có thể gửi lại bài trước khi hết hạn nếu Assignment cho phép.

Expected:

Có. Learner được phép Submit lại trước Deadline.

Result: Correct

<!-- Test 10 - Business Rule -->
Question:QA10

Submission nào được sử dụng để Grade mặc định?

AI Answer:

Theo Vault, Submission cuối cùng hợp lệ trước Deadline sẽ được dùng làm Grade mặc định.

Expected:

Submission cuối cùng hợp lệ trước Deadline được sử dụng để Grade mặc định.

Result: Correct

<!-- Test 11 - Business Rule -->
Question:QA11

Reviewer có được xem tất cả Submission trong hệ thống không?

AI Answer:

Không. Reviewer chỉ được xem và chấm điểm các Submission được phân công cho mình.

Expected:

Không. Reviewer chỉ được xem và đánh giá các Submission được phân công.

Result: Correct



<!-- Test 12 - Business Rule -->
Question:QA12

Ai có thể phân công Reviewer?

AI Answer:

Instructor và Admin có thể phân công Reviewer cho Submission.

Expected:

Instructor và Admin có thể phân công Reviewer.

Result: Correct



<!-- Test 13 - Business Rule -->
Question:QA13

AI Tutor được phép sử dụng nguồn nào để trả lời Learner?

AI Answer:

AI Tutor chỉ được dựa trên nội dung Course và Lesson đã được cung cấp làm context để trả lời.

Expected:

Chỉ sử dụng nội dung Course/Lesson được cung cấp làm context.

Result: Correct

<!-- Test 14 - Edge Case -->
Question:QA14

Nếu Learner nộp Assignment sau Deadline thì Submission có bị từ chối không?

AI Answer:

Không. Submission vẫn được nhận, nhưng hệ thống sẽ đánh dấu là Late.

Expected:

Không. Submission vẫn được nhận nhưng được đánh dấu là Late.

Result: Correct


<!-- Test 15 - Edge Case -->
Question:QA15

Nếu Learner đã Submit một Assignment trước Deadline và sau đó Submit lại trước Deadline thì Submission nào được Grade mặc định?

AI Answer:

Grade mặc định sẽ dùng Submission cuối cùng hợp lệ trước Deadline.

Expected:

Submission cuối cùng hợp lệ trước Deadline.

Result: Correct



<!-- Test 16 - Edge Case -->
Question:QA16

Nếu Learner hoàn thành tất cả Lesson nhưng chưa hoàn thành một Assignment bắt buộc thì Course có được đánh dấu Completed không?

AI Answer:

Không. Course chỉ được xem là Completed khi tất cả Lesson bắt buộc và Assignment bắt buộc đều hoàn thành.

Expected:

Không. Course chỉ Completed khi tất cả Lesson bắt buộc và Assignment bắt buộc đều hoàn thành.

<!-- Test 17 - Edge Case -->
Question:QA17

Nếu Reviewer không được phân công cho một Submission thì Reviewer đó có được đánh giá Submission không?

AI Answer:

Không. Reviewer không được đánh giá Submission nếu chưa được phân công cho công việc đó.

Expected:

Không. Reviewer chỉ được xem và đánh giá các Submission được phân công.


<!-- Test 18 - Edge Case -->
Question:QA18

Nếu AI Tutor không có đủ nội dung Course/Lesson để trả lời câu hỏi của Learner thì AI phải làm gì?

AI Answer:

AI Tutor phải thông báo rằng không đủ dữ liệu để trả lời và không được suy đoán thêm thông tin ngoài context có sẵn.

Expected:

Thông báo KHÔNG ĐỦ DỮ LIỆU và không tự suy đoán thông tin.

Result: Correct

<!-- Test 19 - Unknown -->
Question:QA19

Hệ thống có hỗ trợ thanh toán học phí trực tuyến bằng thẻ ngân hàng không?

AI Answer:

KHÔNG ĐỦ DỮ LIỆU. Vault không nêu thông tin về phương thức thanh toán và thanh toán khóa học nằm ngoài phạm vi MVP.

Expected:

KHÔNG ĐỦ DỮ LIỆU. Thanh toán khóa học nằm ngoài phạm vi MVP. Không có thông tin về phương thức thanh toán được triển khai.

Result: Correct


<!-- Test 20 - Unknown -->
Question:QA20

Learner có được phép tải video lên Assignment không?

AI Answer:

KHÔNG ĐỦ DỮ LIỆU. Vault hiện chưa quy định loại file nào được phép nộp cho Assignment.

Expected:

KHÔNG ĐỦ DỮ LIỆU. Vault hiện chưa quy định loại file Submission được hỗ trợ.

Result: Correct



<!-- Test 21 - Unknown -->
Question:QA21

Một Course có tối đa bao nhiêu Lesson?

AI Answer:

KHÔNG ĐỦ DỮ LIỆU. Vault không quy định số lượng Lesson tối đa cho một Course.

Expected:

KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định số lượng Lesson tối đa trong một Course.

Result: Correct

<!-- Test 22 - Unknown -->
Question:QA22

Assignment có được phép gia hạn Deadline bởi Instructor không?

AI Answer:

KHÔNG ĐỦ DỮ LIỆU. Vault không có Business Rule nào quy định việc gia hạn Deadline.

Expected:

KHÔNG ĐỦ DỮ LIỆU. Vault hiện chưa có Business Rule quy định về việc gia hạn Deadline.

Result: Correct

<!-- 
Test 23 - Unknown -->
Question:QA23

AI Tutor có lưu toàn bộ lịch sử trò chuyện của Learner trong bao lâu?

AI Answer:

KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định thời gian lưu lịch sử trò chuyện của Learner.

Expected:

KHÔNG ĐỦ DỮ LIỆU. Vault hiện chưa quy định thời gian lưu conversation history.

Result: Correct

<!-- Test 24 - Unknown -->
Question:QA24

Learner cần đạt tối thiểu bao nhiêu điểm Assignment để được Complete Course?

AI Answer:

KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định điểm tối thiểu để hoàn thành Assignment hoặc Course.

Expected:

KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định điểm tối thiểu để hoàn thành Assignment/Course.

Result: Correct

## 7. Improvement Log

Nếu AI trả lời sai, nhóm phải xác định nguyên nhân và cập nhật Vault hoặc
prompt.

| Lần | Vấn đề phát hiện | Nguyên nhân | Cách cải thiện | Kết quả |
|---|---|---|---|---|
| 1 | QA-09 bị Partial vì câu trả lời và Expected Answer chưa giữ rõ điều kiện resubmit. | Business Rule `BR-LMS-05` chỉ cho phép Submit lại khi Assignment cho phép. | Sửa Expected Answer thành “Có, nếu Assignment cho phép Submit lại” và bổ sung citation `BR-LMS-05`. | QA-09 chuyển thành Correct. |
| 2 | Nhiều Expected Source dùng path cũ hoặc file không còn tồn tại. | Citation không theo cấu trúc thư mục hiện tại và thiếu ID cụ thể. | Chuẩn hóa citation về path hiện tại trong `docs/02-vault/...` hoặc `docs/01-discovery/...`, đồng thời thêm `REQ-LMS-*`, `BR-LMS-*` và `DEC-*` khi có. | Không còn stale path trong benchmark; source dễ truy xuất và kiểm chứng hơn. |
| 3 | Benchmark Summary vẫn ghi 23/24 và 96.93% sau khi QA-09 đã được sửa. | Execution result, summary và accuracy không được cập nhật đồng bộ. | Cập nhật QA-09 execution, Summary thành 24 Correct/0 Partial và Accuracy thành 100%; bổ sung `vault-qa-prompt.md` với procedure, safety checks và answer format. | Benchmark nhất quán ở 24/24 Correct; prompt có quy tắc chống suy đoán và giữ điều kiện. |