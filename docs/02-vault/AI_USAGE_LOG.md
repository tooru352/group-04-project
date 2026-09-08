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
| AI-006 | Đoàn Xuân Toàn | Requirement Inventory Review | Kiểm tra và tổng hợp các Functional Requirement trong vault | Requirement inventory, business rules và workflow | AI xác định các requirement chính và mức ưu tiên | Đối chiếu với source-of-truth trong vault | Giữ requirement phù hợp với MVP và không bịa thêm scope |
| AI-007 | Đỗ Thị Kim Yến | Business Rule Consistency Check | Đối chiếu các quy tắc nghiệp vụ với requirement và workflow chính | Business rules, open questions và decision log | AI xác định các quy tắc cần nhất quán như resubmission, late submission, completion | Đối chiếu với evidence của vault | Duy trì các quy tắc đã được nhóm phê duyệt và không sửa theo cảm tính |
| AI-008 | Đoàn Xuân Toàn | Vault QA Prompt & Safety Rules | Xây dựng checklist chống suy đoán và định dạng trả lời benchmark | Prompt, benchmark và quy tắc chất lượng vault | AI đề xuất quy tắc: chỉ trả lời từ vault, cite source, trả lời KHÔNG ĐỦ DỮ LIỆU khi thiếu thông tin | Đối chiếu với benchmark và source files | Giữ format trả lời theo chuẩn evidence-based và không bịa thông tin |
| AI-009 | Đỗ Thị Kim Yến | Vault QA Benchmark Validation | Kiểm tra câu hỏi benchmark, expected answer và citation | Vault QA benchmark, source-priority và source files | AI đề xuất chuẩn hóa expected answer, source path và điều kiện đánh giá | Đối chiếu với file thực tế của vault | Chỉnh sửa citation và cập nhật trạng thái Correct/Partial cho benchmark |
| AI-010 | Đoàn Xuân Toàn | Vault Q&A Answer Generation | Trả lời câu hỏi benchmark dựa trên Project Vault | Các file requirement, business rules, decision log và prompt | AI trả lời ngắn gọn, có ID nguồn và file nguồn | Đối chiếu với vault hiện có | Giữ câu trả lời trong phạm vi evidence, không tự bổ sung kiến thức ngoài vault |

## 3. AI Errors / Corrections

### AI-003 - Submission after Deadline

- **AI đề xuất:** Từ chối Submission sau Deadline.
- **Verification:** Đối chiếu với quyết định của nhóm.
- **Kết quả:** AI không phù hợp với Business Rule đã thống nhất.
- **Correction:** Submission sau Deadline vẫn được phép và được đánh dấu `Late`.
- **Decision source:** Project Charter / Business Rules.

### AI-011 - Unknown Question

- **AI đề xuất:** Hệ thống cấp Certificate sau khi hoàn thành Course.
- **Verification:** Kiểm tra Project Vault.
- **Kết quả:** Vault không có Requirement hoặc Business Rule về Certificate.
- **Correction:** AI phải trả lời `KHÔNG ĐỦ DỮ LIỆU` thay vì tự suy đoán.

### AI-012 - Vault QA Safety / Benchmark Quality

- **AI đề xuất:** Chỉnh sửa prompt và benchmark để tránh câu trả lời suy đoán.
- **Verification:** Đối chiếu với source-priority, benchmark và quy định trong vault.
- **Kết quả:** Nhiều câu hỏi cần có citation rõ ràng và không được giả định thông tin chưa có trong vault.
- **Correction:** Tăng cường quy tắc: chỉ dùng requirement/business rule/decision đã xác nhận, cite đúng file và trả lời `KHÔNG ĐỦ DỮ LIỆU` khi thiếu evidence.
- **Decision source:** Vault QA prompt, benchmark và source-priority.