# ADR Index - Architecture Decision Records

Thư mục này chứa các quyết định kiến trúc quan trọng của dự án **Orbit LMS** (AI Learning Management System).  
Mỗi ADR ghi lại: bối cảnh, quyết định, hậu quả, và các phương án bị từ chối.

## Danh sách ADR

| ID | Tiêu đề | Status | Stories liên quan |
|---|---|---|---|
| [ADR-001](ADR-001.md) | AI Tutor chỉ trả lời từ Course/Lesson context, không suy đoán | Accepted | US-LMS-25, US-LMS-26, US-LMS-27, US-LMS-28 |
| [ADR-002](ADR-002.md) | Course Completion chỉ ghi nhận khi đủ Lesson bắt buộc VÀ Assignment bắt buộc | Accepted | US-LMS-09, US-LMS-07, US-LMS-08 |
| [ADR-003](ADR-003.md) | Append-only Audit Log cho thao tác Grade, Feedback và thay đổi quyền | Accepted | US-LMS-30, US-LMS-03, US-LMS-23 |
| [ADR-004](ADR-004.md) | Server-authoritative timestamp cho Late Submission detection | Accepted | US-LMS-12, US-LMS-11 |
| [ADR-005](ADR-005.md) | AI Tutor không cung cấp đáp án hoàn chỉnh cho Assignment | Accepted | US-LMS-25, US-LMS-26, US-LMS-27 |
| [ADR-006](ADR-006.md) | RBAC thực hiện ở server middleware, không tin client tự khai role | Accepted | US-LMS-03, US-LMS-02, US-LMS-14, US-LMS-17 |

## Template ADR

```markdown
# ADR-XXX - [Tiêu đề ngắn gọn]

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-YYY  
**Date:** YYYY-MM-DD  
**Deciders:** [Team/Person]  
**Stories:** [Story IDs liên quan]

---

## Context
[Mô tả vấn đề, tại sao cần ra quyết định này]

## Decision
[Quyết định được đưa ra là gì]

## Consequences
**Tích cực:**
- ...

**Tiêu cực / đánh đổi:**
- ...

## Rejected Alternatives
| Phương án | Lý do từ chối |
|---|---|
| ... | ... |
```
