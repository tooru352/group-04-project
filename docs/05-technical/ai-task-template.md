# AI Task Template - LMS

Dùng để copy/paste cho từng task khi triển khai với AI agent. Định dạng task phải đồng bộ với TRACEABILITY của repo: TASK-01..TASK-30, tương ứng 1-1 với US-LMS-01..US-LMS-30.

---

## Template

# AI Implementation Prompt

TASK: TASK-XX - [Tên task]
STORY: US-LMS-XX
CONTEXT:
Story Spec + REQ-LMS-XX + Business Rules + API contract + current module.

## Rules
- Chỉ sửa các module cần thiết.
- Không refactor ngoài module liên quan nếu không cần.
- Chỉ Learner/Instructor/Reviewer/Admin theo role hợp lệ mới được thao tác.
- Phải tuân theo business rules của story.
- Không nhận dữ liệu không đáng tin cậy từ client nếu domain yêu cầu server-side.
- Trả về lỗi theo contract rõ ràng.

## Before coding
Trước khi code:
1. Nêu implementation plan 3-7 bước.
2. Liệt kê các file dự kiến thay đổi và lý do.
3. Liệt kê test cases cần thêm/chạy.
4. Nêu các rủi ro regression/security/assumption.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.

---

## Ví dụ thực tế

# AI Implementation Prompt

TASK: TASK-11 - Implement POST /api/submissions
STORY: US-LMS-11
CONTEXT:
Story Spec + REQ-LMS-08 + NFR-LMS-06 + API contract + current Assignment/Submission module.

## Rules
- Chỉ Learner đã đăng nhập mới được Submit.
- Learner chỉ được Submit Assignment thuộc Course mà mình đã Enroll.
- answerContent không được rỗng.
- Submission sau Deadline vẫn được phép nhưng phải được đánh dấu Late.
- Không được tự thay đổi Grade khi Submit.
- Không refactor module ngoài Assignment/Submission nếu không cần.

## Before coding
Trước khi code:
1. Nêu implementation plan.
2. Liệt kê các file dự kiến thay đổi.
3. Liệt kê test cases.
4. Nêu các rủi ro hoặc assumption.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.

---

## Checklist cho AI khi implement

- Đọc đúng Story Spec liên quan.
- Chỉ sửa file/module phù hợp.
- Không tạo abstraction hoặc dependency dư thừa.
- Nếu cần validate, ưu tiên validate real logic, không mock behavior.
- Đảm bảo error handling, authz, và state consistency đúng.
- Test đi cùng task; không để test sau.
- Không nói “done” nếu chưa có output thật từ lint/typecheck/test/build.
