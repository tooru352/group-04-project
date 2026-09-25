# 18.35. Output #35 - Retrospective / AI Metrics

| Metric | Kết quả mẫu | Ý nghĩa |
| --- | --- | --- |
| Requirement-to-story traceability | 30/30 stories mapped to requirement and implementation evidence | Khớng còn scope mơ hồ; mọi story đều có nguồn chứng minh |
| Automated critical E2E / regression | 202/202 tests passed via `python -m pytest tests -q` | Hệ thống đạt mức regression kiểm soát và có evidence thực tế |
| Command benchmark / prompt safety | 0 unsupported business rule accepted after review | AI output phải được kiểm tra lại trước khi dùng làm source-of-truth |
| AI-generated defects caught before merge | 4 major issues caught and corrected before finalization | Team đã duy trì quality gate bằng review và verification |
| AI-assisted implementation time | Không có timer chính thức, nhưng workflow rút ngắn đáng kể trong docs và traceability | AI giúp tăng tốc nhưng không thay thế human review |

Trung 40

---

| Metric | Kết quả mẫu | Ý nghĩa |
| --- | --- | --- |
| AI-generated defects caught before merge | 4 findings | Review/test đã bắt được sai sót trước khi merge |
| Reusable artifacts | 6 prompt/template/doc artifacts reused | Có thể tái sử dụng cho các dự án tiếp theo |

## 1. What AI did well

- AI hỗ trợ nhanh trong việc tổng hợp requirement, task catalog và traceability draft.
- AI rút ngắn thời gian viết tài liệu và chuẩn hóa format báo cáo.
- AI giúp tạo nhanh các template như README, RUNBOOK, RELEASE, CHANGELOG, TRACEABILITY, AI_USAGE_LOG.

## 2. AI mistakes identified with evidence

| STT | Sai xót của AI | Evidence cụ thể | Cách kiểm chứng / sửa |
| --- | --- | --- | --- |
| 1 | AI đề xuất “Submission sau deadline phải bị từ chối” | [docs/02-vault/source-priority.md](docs/02-vault/source-priority.md), [docs/08-quality/bug-log.md](docs/08-quality/bug-log.md), [docs/01-discovery/5.requirements.md](docs/01-discovery/5.requirements.md) | Đối chiếu với source-of-truth; nhóm xác nhận rằng late submission được chấp nhận và đánh dấu Late, không bị chặn. |
| 2 | AI thêm scope mới không có evidence trong requirement | [docs/01-discovery/5.requirements.md](docs/01-discovery/5.requirements.md), [docs/03-product/taiga-backlog.md](docs/03-product/taiga-backlog.md) | Theo source priority, mọi scope mới phải có requirement/decision xác nhận; nếu không, loại bỏ hoặc ghi là assumption. |
| 3 | AI tạo traceability không khớp implementation thực tế | [server/index.js](server/index.js), [server/db.js](server/db.js), [docs/05-technical/API.md](docs/05-technical/API.md) | Kiểm tra API thật và schema thực tế, sau đó sửa matrix để khớp với code và test. |
| 4 | AI viết docs theo template chung, không phù hợp với dự án LMS thật | [README.md](README.md), [RELEASE.md](RELEASE.md), [CHANGELOG.md](CHANGELOG.md), [docs/RUNBOOK.md](docs/RUNBOOK.md) | Team sửa lại doc để phản ánh đúng chức năng LMS: role-based auth, course, lesson, assignment, reviewer, AI Tutor. |
| 5 | AI bỏ qua edge case validation như input rỗng / khoảng trắng | [server/index.js](server/index.js) | Dùng logic kiểm tra có giá trị ngữ nghĩa; fix bằng validation nghiêm ngặt trước khi xử lý dữ liệu. |
| 6 | AI có thể bỏ qua RBAC / security checks nếu không kiểm tra kỹ | [server/index.js](server/index.js), [docs/08-quality/bug-log.md](docs/08-quality/bug-log.md) | Dùng middleware `requireRole` / `requireAdmin` và xác minh bằng test quyền, không tin vào output AI. |

## 3. Lessons learned

- Keep: Story Spec + tool schema + structured prompt + human review.
- Improve: QA benchmark cần thêm conflict case và factual case rõ ràng hơn.
- Stop: Không để AI tự suy đoán thêm scope hoặc business rule mới.
- Next experiment: đánh giá 30 utterances với test structured command tự động trong CI.

## 4. Evidence and repository references

- Requirement + business rule baseline: [docs/01-discovery/5.requirements.md](docs/01-discovery/5.requirements.md)
- Source-of-truth priority: [docs/02-vault/source-priority.md](docs/02-vault/source-priority.md)
- Story backlog: [docs/03-product/taiga-backlog.md](docs/03-product/taiga-backlog.md)
- Traceability: [docs/05-technical/TRACEABILITY.md](docs/05-technical/TRACEABILITY.md)
- Backend and validation logic: [server/index.js](server/index.js)
- Database bootstrap: [server/db.js](server/db.js)
- Test verification: [tests](tests)
- AI log and retrospective: [docs/AI_USAGE_LOG.md](docs/AI_USAGE_LOG.md), [retrospective.md](retrospective.md)

## 5. Final takeaway

AI là công cụ hỗ trợ tăng tốc, nhưng không được dùng làm source-of-truth. Trong dự án này, các sai sót của AI đã được phát hiện và sửa bằng cách đối chiếu với requirement, code và test thực tế. Điều này giúp hệ thống duy trì được tính đúng đắn về nghiệp vụ, bảo mật và chất lượng sản phẩm.
