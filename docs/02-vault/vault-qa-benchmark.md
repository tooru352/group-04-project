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
| QA-01 | Hệ thống AI Learning Management System có những role nào? | Có 4 role: Learner, Instructor, Reviewer và Admin. | `docs/01-discovery/1.project-charter.md` / `vault/02-requirements/requirements.md` | Pending |
| QA-02 | Workflow chính của hệ thống là gì? | Enroll → Learn → Submit → Grade → Feedback → Complete. | `docs/01-discovery/1.project-charter.md` / `vault/03-domain/workflows.md` | Pending |
| QA-03 | Learner có thể thực hiện những chức năng chính nào? | Đăng ký Course, xem Lesson, làm/nộp Assignment, xem Grade, Feedback, theo dõi Progress và hỏi AI Tutor. | `docs/01-discovery/1.project-charter.md` | Pending |
| QA-04 | Instructor có thể thực hiện những chức năng nào? | Tạo Course, Lesson, Assignment; xem Submission; chấm điểm; Feedback và theo dõi tiến độ Learner. | `docs/01-discovery/1.project-charter.md` | Pending |
| QA-05 | Reviewer khác Instructor ở điểm nào? | Reviewer tập trung vào việc xem và đánh giá Submission được phân công, không nhất thiết quản lý Course. | `docs/01-discovery/1.project-charter.md` / `vault/02-requirements/requirements.md` | Pending |
| QA-06 | Admin có những quyền chính nào? | Quản lý User, Role, Course và các dữ liệu/quyền quản trị hệ thống. | `docs/01-discovery/1.project-charter.md` | Pending |

### B. Business Rule Questions

| ID | Question | Expected Answer | Expected Source | Result |
|---|---|---|---|---|
| QA-07 | Khi nào một Course được xem là Completed? | Khi Learner hoàn thành tất cả Lesson bắt buộc và Assignment bắt buộc. | `vault/03-domain/business-rules.md` / `vault/08-decisions/decision-log.md` | Pending |
| QA-08 | Learner có được nộp Assignment sau Deadline không? | Có. Submission sau Deadline vẫn được phép nhưng phải được đánh dấu là Late. | `vault/03-domain/business-rules.md` / `vault/08-decisions/decision-log.md` | Pending |
| QA-09 | Learner có được Submit lại Assignment trước Deadline không? | Có. Learner được phép Submit lại trước Deadline. | `vault/03-domain/business-rules.md` | Pending |
| QA-10 | Submission nào được sử dụng để Grade mặc định? | Submission cuối cùng hợp lệ trước Deadline được sử dụng để Grade mặc định. | `vault/03-domain/business-rules.md` | Pending |
| QA-11 | Reviewer có được xem tất cả Submission trong hệ thống không? | Không. Reviewer chỉ được xem và đánh giá các Submission được phân công. | `vault/03-domain/business-rules.md` | Pending |
| QA-12 | Ai có thể phân công Reviewer? | Instructor và Admin có thể phân công Reviewer. | `vault/03-domain/business-rules.md` / `vault/08-decisions/decision-log.md` | Pending |
| QA-13 | AI Tutor được phép sử dụng nguồn nào để trả lời Learner? | Chỉ sử dụng nội dung Course/Lesson được cung cấp làm context. | `vault/03-domain/business-rules.md` / `vault/08-decisions/decision-log.md` | Pending |

### C. Edge Case Questions

| ID | Question | Expected Answer | Expected Source | Result |
|---|---|---|---|---|
| QA-14 | Nếu Learner nộp Assignment sau Deadline thì Submission có bị từ chối không? | Không. Submission vẫn được nhận nhưng được đánh dấu là Late. | `vault/03-domain/business-rules.md` | Pending |
| QA-15 | Nếu Learner đã Submit một Assignment trước Deadline và sau đó Submit lại trước Deadline thì Submission nào được Grade mặc định? | Submission cuối cùng hợp lệ trước Deadline. | `vault/03-domain/business-rules.md` | Pending |
| QA-16 | Nếu Learner hoàn thành tất cả Lesson nhưng chưa hoàn thành một Assignment bắt buộc thì Course có được đánh dấu Completed không? | Không. Course chỉ Completed khi tất cả Lesson bắt buộc và Assignment bắt buộc đều hoàn thành. | `vault/03-domain/business-rules.md` | Pending |
| QA-17 | Nếu Reviewer không được phân công cho một Submission thì Reviewer đó có được đánh giá Submission không? | Không. Reviewer chỉ được xem và đánh giá Submission được phân công. | `vault/03-domain/business-rules.md` | Pending |
| QA-18 | Nếu AI Tutor không có đủ nội dung Course/Lesson để trả lời câu hỏi của Learner thì AI phải làm gì? | Thông báo `KHÔNG ĐỦ DỮ LIỆU` và không tự suy đoán thông tin. | `vault/03-domain/business-rules.md` / `vault/08-decisions/decision-log.md` | Pending |

### D. Unknown Questions

Các câu hỏi dưới đây được thiết kế để kiểm tra khả năng nhận biết
thông tin chưa được quy định trong Vault.

| ID | Question | Expected Answer | Expected Source | Result |
|---|---|---|---|---|
| QA-19 | Hệ thống có hỗ trợ thanh toán học phí trực tuyến bằng thẻ ngân hàng không? | KHÔNG ĐỦ DỮ LIỆU. Thanh toán khóa học nằm ngoài phạm vi MVP. Không có thông tin về phương thức thanh toán được triển khai. | `docs/01-discovery/1.project-charter.md` / `docs/01-discovery/7.MVP-Scope.md` | Pending |
| QA-20 | Learner có được phép tải video lên Assignment không? | KHÔNG ĐỦ DỮ LIỆU. Vault hiện chưa quy định loại file Submission được hỗ trợ. | `vault/02-requirements/requirements.md` | Pending |
| QA-21 | Một Course có tối đa bao nhiêu Lesson? | KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định số lượng Lesson tối đa trong một Course. | `vault/02-requirements/requirements.md` | Pending |
| QA-22 | Assignment có được phép gia hạn Deadline bởi Instructor không? | KHÔNG ĐỦ DỮ LIỆU. Vault hiện chưa có Business Rule quy định về việc gia hạn Deadline. | `vault/03-domain/business-rules.md` | Pending |
| QA-23 | AI Tutor có lưu toàn bộ lịch sử trò chuyện của Learner trong bao lâu? | KHÔNG ĐỦ DỮ LIỆU. Vault hiện chưa quy định thời gian lưu conversation history. | `vault/02-requirements/requirements.md` / `vault/08-decisions/decision-log.md` | Pending |
| QA-24 | Learner cần đạt tối thiểu bao nhiêu điểm Assignment để được Complete Course? | KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định điểm tối thiểu để hoàn thành Assignment/Course. | `vault/02-requirements/requirements.md` / `vault/03-domain/business-rules.md` | Pending |

## 4. Benchmark Summary

| Category | Number of Questions | Correct | Partial | Wrong | Unsupported |
|---|---:|---:|---:|---:|---:|
| Fact | 6 | - | - | - | - |
| Rule | 7 | - | - | - | - |
| Edge Case | 5 | - | - | - | - |
| Unknown | 6 | - | - | - | - |
| **Total** | **24** | - | - | - | - |

## 5. Accuracy

### Công thức

Accuracy được tính trên các câu hỏi mà AI phải trả lời đúng theo Vault:

`Accuracy = Correct / Total Questions × 100%`

Mục tiêu:

**Accuracy ≥ 80%**

Đối với câu Unknown, AI chỉ được tính là Correct khi:
- AI xác định đúng là Vault chưa đủ dữ liệu.
- Không tự đưa ra thông tin bên ngoài.
- Nêu được nguồn hoặc loại tài liệu cần bổ sung nếu có thể xác định.

## 6. Benchmark Execution

Sau khi hoàn thành Vault, nhóm sẽ chạy thử tối thiểu 2-3 câu đại diện cho
các loại câu hỏi khác nhau.

### Test 1 - Fact

**Question:**

> Hệ thống có những role nào?

**AI Answer:**

> [Ghi câu trả lời thực tế của AI]

**Expected:**

> Learner, Instructor, Reviewer và Admin.

**Result:** Correct / Partial / Wrong / Unsupported

---

### Test 2 - Business Rule

**Question:**

> Learner có được nộp Assignment sau Deadline không?

**AI Answer:**

> [Ghi câu trả lời thực tế của AI]

**Expected:**

> Có. Submission sau Deadline vẫn được phép nhưng phải được đánh dấu là Late.

**Result:** Correct / Partial / Wrong / Unsupported

---

### Test 3 - Unknown

**Question:**

> Learner có được phép tải video lên Assignment không?

**AI Answer:**

> [Ghi câu trả lời thực tế của AI]

**Expected:**

> KHÔNG ĐỦ DỮ LIỆU. Vault chưa quy định loại file Submission được hỗ trợ.

**Result:** Correct / Partial / Wrong / Unsupported

## 7. Improvement Log

Nếu AI trả lời sai, nhóm phải xác định nguyên nhân và cập nhật Vault hoặc
prompt.

| Lần | Vấn đề phát hiện | Nguyên nhân | Cách cải thiện | Kết quả |
|---|---|---|---|---|
| 1 | [Ghi lỗi] | [Thiếu context / tài liệu chưa rõ / prompt] | [Cập nhật Vault hoặc prompt] | [Kết quả] |
| 2 | [Ghi lỗi] | [Thiếu context / tài liệu chưa rõ / prompt] | [Cập nhật Vault hoặc prompt] | [Kết quả] |
| 3 | [Ghi lỗi] | [Thiếu context / tài liệu chưa rõ / prompt] | [Cập nhật Vault hoặc prompt] | [Kết quả] |