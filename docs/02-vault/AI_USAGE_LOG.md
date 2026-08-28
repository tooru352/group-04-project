# AI Usage Log v1

## 1. Mục đích

AI được sử dụng để hỗ trợ nhóm trong các hoạt động phân tích, tổng hợp
research, xây dựng requirement, review và kiểm tra tính nhất quán của
Project Vault.

AI không được sử dụng để tự quyết định Business Rule, Scope hoặc quyền
truy cập của hệ thống. Các đề xuất của AI đều được thành viên kiểm tra
lại với evidence, requirement và decision đã được nhóm xác nhận.

## 2. AI Usage Log

| ID | Thành viên | Task | Prompt / Skill | Input Context | AI Output | Verification | Correction / Decision |
|---|---|---|---|---|---|---|---|
| AI-001 | Đoàn Xuân Toàn | Xây dựng Project Charter | Đề xuất Problem, Objective, MVP và Users dựa trên đề tài AI LMS | Problem và yêu cầu đề tài | AI đề xuất các thành phần của Project Charter | Đối chiếu với yêu cầu bài tập và thống nhất nhóm | Giữ các nội dung phù hợp với scope |
| AI-002 | Đoàn Xuân Toàn | Tổng hợp Learner Research | Phân tích pain points và themes từ 3 Learner interviews | Research evidence của P1-P3 | AI xác định các pain point chính | Đối chiếu từng insight với evidence | Loại bỏ insight không có evidence |
| AI-003 | Đoàn Xuân Toàn | Business Rule - Submission | Đề xuất cách xử lý Submission sau Deadline | Workflow và requirement của hệ thống | AI đề xuất từ chối Submission sau Deadline | Đối chiếu với decision của nhóm | AI sai. Nhóm quyết định vẫn cho phép Submit và đánh dấu Late |
| AI-004 | Đỗ Thị Kim Yến | Instructor Research Synthesis | Tổng hợp pain points từ interview giáo viên | Interview của 2 Instructor | AI xác định khó khăn trong quản lý tiến độ và bài tập | Đối chiếu với evidence | Chỉ giữ pain points có evidence |
| AI-005 | Đỗ Thị Kim Yến | Persona/JTBD | Tạo Persona/JTBD từ research synthesis | Pain points và insights | AI đề xuất Learner và Instructor persona | Đối chiếu với research evidence | Loại bỏ đặc điểm không có nguồn |

## 3. AI Errors / Corrections

### AI-003 - Submission after Deadline

- **AI đề xuất:** Từ chối Submission sau Deadline.
- **Verification:** Đối chiếu với quyết định của nhóm.
- **Kết quả:** AI không phù hợp với Business Rule đã thống nhất.
- **Correction:** Submission sau Deadline vẫn được phép và được đánh dấu `Late`.
- **Decision source:** Project Charter / Business Rules.

### AI-006 - Unknown Question

- **AI đề xuất:** Hệ thống cấp Certificate sau khi hoàn thành Course.
- **Verification:** Kiểm tra Project Vault.
- **Kết quả:** Vault không có Requirement hoặc Business Rule về Certificate.
- **Correction:** AI phải trả lời `KHÔNG ĐỦ DỮ LIỆU` thay vì tự suy đoán.