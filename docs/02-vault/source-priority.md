# Source Priority

## 1. Mục đích

File này quy định thứ tự ưu tiên của các nguồn thông tin trong Project Vault
khi có sự khác biệt hoặc mâu thuẫn giữa các tài liệu.

AI và thành viên nhóm không được tự ý chọn thông tin từ nguồn có độ ưu tiên
thấp hơn khi nguồn có độ ưu tiên cao hơn đã tồn tại.

## 2. Thứ tự ưu tiên nguồn

| Priority | Source | Quy tắc |
|---|---|---|
| 1 | Requirement / Business Rule đã được nhóm xác nhận | Source of truth cho yêu cầu và quy tắc nghiệp vụ |
| 2 | Decision Log / Decision đã được nhóm xác nhận | Source of truth cho các quyết định đã được thống nhất |
| 3 | Project Charter phiên bản hiện tại | Source of truth cho Problem, Objective, Scope, Users và Success Metrics |
| 4 | User Research + Research Synthesis | Source cho evidence về nhu cầu, pain points và insight của người dùng |
| 5 | Persona / JTBD | Đại diện cho nhu cầu và mục tiêu người dùng đã được tổng hợp từ research |
| 6 | Prototype / Design | Minh họa giao diện và hành vi dự kiến; không tự tạo Business Rule |
| 7 | Meeting Notes / Working Notes | Ghi nhận trao đổi, nhưng chỉ trở thành source of truth khi được xác nhận |
| 8 | Chat / AI Output | Chỉ là đề xuất hoặc working note nếu chưa được nhóm xác nhận và tích hợp vào tài liệu chính thức |

## 3. Quy tắc khi có xung đột

Khi hai nguồn có nội dung khác nhau:

1. Ưu tiên nguồn có Priority cao hơn.
2. Không tự ý thay đổi Requirement hoặc Business Rule dựa trên đề xuất của AI.
3. Nếu hai nguồn cùng có mức độ quan trọng hoặc chưa xác định nguồn nào đúng,
   tạo một Open Question hoặc Decision để nhóm xác nhận.
4. Sau khi quyết định được xác nhận, cập nhật Source of Truth và Decision Log.
5. Các tài liệu cũ không còn hiệu lực phải được đánh dấu là Superseded trong
   Project Vault.

## 4. Quy tắc đối với AI

AI chỉ được trả lời dựa trên các nguồn có trong Project Vault.

Nếu thông tin trong Vault không đủ để đưa ra kết luận, AI phải trả lời:

> KHÔNG ĐỦ DỮ LIỆU

AI không được tự sử dụng kiến thức bên ngoài để bổ sung hoặc suy đoán
Business Rule, Requirement, Scope hoặc quyền truy cập.

Nếu phát hiện xung đột giữa các nguồn, AI phải chỉ ra các nguồn đang xung đột
và không tự quyết định nguồn nào đúng nếu chưa có Decision được xác nhận.

## 5. Ví dụ

### Ví dụ 1 - Business Rule và AI Output

Business Rule đã xác nhận:

> Submission sau Deadline vẫn được phép nhưng được đánh dấu Late.

Nếu AI đề xuất:

> Submission sau Deadline phải bị từ chối.

→ Không sử dụng đề xuất của AI vì Business Rule đã được xác nhận có Priority cao hơn.

### Ví dụ 2 - Prototype và Requirement

Prototype không hiển thị chức năng AI Tutor nhưng Requirement đã xác nhận
AI Tutor là một phần của MVP.

→ Requirement được ưu tiên. Prototype cần được cập nhật.

### Ví dụ 3 - Thông tin chưa được xác định

Nếu được hỏi:

> Course có cấp chứng chỉ sau khi hoàn thành không?

và Project Vault không có Requirement, Business Rule hoặc Decision nào về
chứng chỉ:

→ Trả lời:

> KHÔNG ĐỦ DỮ LIỆU

Không được tự suy đoán rằng hệ thống có hoặc không có chứng chỉ.