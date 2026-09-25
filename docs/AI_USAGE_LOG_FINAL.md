# 18.32. Output #32 - AI Usage Log

| ID | Task | Context | AI output | Human verification/decision | Value |
| --- | --- | --- | --- | --- | --- |
| A-01 | Review requirement | Ghi chú phỏng vấn + brief | Phát hiện thiếu quy tắc xác nhận về late submission và role gating | Thêm quy tắc kiểm tra dựa trên source priority và requirement đã xác nhận; từ chối các giả định không có căn cứ | Ngăn sai lệch quy tắc nghiệp vụ |
| A-02 | Prototype | REQ-LMS-01..REQ-LMS-05 và luồng role | Sinh luồng role nhưng thiếu kiểm soát quyền truy cập rõ ràng | Từ chối luồng tự duyệt; chỉnh prototype theo RBAC và kiểm tra quyền | Prototype phù hợp với quy tắc |
| A-03 | Chia story | PRD + scope MVP | Đề xuất một story lớn cho course + assignment + grading | Chia thành các story nhỏ hơn, dễ review và có ràng buộc scope rõ ràng | Story <= 3 pts |
| A-04 | Mã nguồn | Spec US-LMS-05..US-LMS-12 | Gợi ý triển khai nhưng bỏ qua bảo vệ duplicate submission và transaction safeguards | Review của người dùng phát hiện race condition và write path sai; chuyển validation sang kiểm soát ở server-side transaction | Di chuyển validation vào transaction |
| A-05 | Testing | Tập AC cho RBAC, grading và workflow submission | Tạo 14 case nhưng thiếu negative case quyền/validation | Review của người dùng phát hiện thiếu negative case cho role access, input rỗng và duplicate submissions | Phát hiện BUG-01, BUG-02, RBAC issue |
| A-06 | Tài liệu | Repo + trạng thái release | Draft runbook/release notes theo template chung không phù hợp repo | Kiểm tra lại lệnh và evidence dựa trên repo thực tế; cập nhật theo cấu hình LMS hiện có | Hướng dẫn onboarding dễ tái lặp |

## Ghi chú

- AI được dùng như công cụ hỗ trợ soạn thảo, không phải là nguồn chân lý của dự án.
- Quyết định cuối cùng đều được kiểm tra lại dựa trên requirement đã xác nhận, code đang chạy và test tự động.
- Dự án tuân theo quy tắc ưu tiên trong [docs/02-vault/source-priority.md](../docs/02-vault/source-priority.md): requirement/business rule > decision log > charter > research > prototype > AI output.
- Evidence được dùng trong quá trình review bao gồm:
  - [docs/01-discovery/5.requirements.md](../docs/01-discovery/5.requirements.md)
  - [docs/03-product/taiga-backlog.md](../docs/03-product/taiga-backlog.md)
  - [docs/08-quality/bug-log.md](../docs/08-quality/bug-log.md)
  - [server/index.js](../server/index.js)
  - [server/db.js](../server/db.js)
  - [tests](../tests)
