# Project Vault Index

## Purpose

Đây là điểm vào của Project Vault. Khi trả lời câu hỏi về AI LMS, hãy bắt đầu từ index này, đi theo source priority và trích dẫn đúng file cùng ID.

## Source-of-truth map

| Area | Primary source | Backup/context source |
|---|---|---|
| Requirements | [5.requirements.md](02-requirements/5.requirements.md) | [Discovery requirements](../01-discovery/5.requirements.md) |
| Business Rules | [business-rules.md](03-domain/business-rules.md) | [Discovery rules](../01-discovery/6.business-rules.md) |
| Decisions | [decision-log.md](08-decisions/decision-log.md) | Project Charter |
| Problem, users, MVP, success | [project-charter.md](../01-discovery/1.project-charter.md) | User Research / Persona |
| Domain terms | [glossary.md](03-domain/glossary.md) | Discovery Glossary |
| Research evidence | [user-research.md](01-sources/user-research.md) | [Discovery research](../01-discovery/2.user-research.md) |
| Product interpretation | [PRD.md](../03-product/PRD.md) | Prototype Brief / Screen Flow |
| QA benchmark | [vault-qa-benchmark.md](vault-qa-benchmark.md) | Source-of-truth files above |

## Artifact directory

- Requirements: `02-requirements/`
- Domain rules and glossary: `03-domain/`
- Research sources: `01-sources/`
- Decisions: `08-decisions/`
- QA and governance: `source-priority.md`, `vault-qa-benchmark.md`, `AI_USAGE_LOG.md`

## Retrieval rules

1. Requirement và Business Rule đã xác nhận có priority cao nhất.
2. Decision đã xác nhận giải thích các điểm đã được nhóm chốt.
3. Project Charter cung cấp context về Problem, Users, MVP và Success Metrics.
4. Prototype/Product docs chỉ minh họa hoặc diễn giải, không tạo Requirement/Business Rule mới.
5. Chat/AI output không phải source-of-truth nếu chưa được nhóm xác nhận.
6. Khi không đủ thông tin, trả lời chính xác `KHÔNG ĐỦ DỮ LIỆU` và nêu nguồn cần bổ sung nếu xác định được.
7. Khi nguồn mâu thuẫn, nêu rõ các nguồn mâu thuẫn và không tự quyết định.

## Citation format

- Requirement: `REQ-LMS-xx` + `02-requirements/5.requirements.md`
- Business Rule: `BR-LMS-xx` + `03-domain/business-rules.md`
- Decision: `DEC-xxx` + `08-decisions/decision-log.md`
- Unknown: `KHÔNG ĐỦ DỮ LIỆU` + file/section đã kiểm tra

## QA benchmark

Benchmark chính nằm tại [vault-qa-benchmark.md](vault-qa-benchmark.md). Khi benchmark có kết quả Partial/Wrong/Unsupported, sửa prompt hoặc citation trước, không sửa confirmed Requirement/Business Rule để làm cho câu trả lời khớp.
