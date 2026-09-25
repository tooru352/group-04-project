# Traceability Final

## Phạm vi
- Dự án: Hệ thống LMS theo vai trò người dùng
- Nguồn dữ liệu chính: danh mục yêu cầu, backlog story, màn hình thiết kế, hợp đồng API, mã nguồn, và bài kiểm thử tự động
- Phạm vi kiểm soát: 30/30 story đã được ánh xạ tới yêu cầu, công việc, thiết kế/API, bằng chứng triển khai, bài kiểm thử và trạng thái cuối cùng
- Trạng thái: Hoàn thành 100% phạm vi

## Ma trận truy vết

| Mã yêu cầu | Câu chuyện | Công việc | Thiết kế/API | Bằng chứng trong repo | Kiểm thử | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-LMS-01 | US-LMS-01 | T-01 / TASK-01 | S01 Đăng nhập; `POST /api/auth/login` | Triển khai trong [server/index.js](../server/index.js); ghi chú xác thực và auth trong [docs/08-quality/code-review.md](08-quality/code-review.md) | TC-002, TC-003, TC-004 | Hoàn thành |
| REQ-LMS-02 | US-LMS-02 | T-01 / TASK-02 | Shell theo vai trò; middleware bảo vệ route | Xử lý phân quyền trong [server/index.js](../server/index.js) | TC-005, TC-006, TC-007 | Hoàn thành |
| NFR-LMS-01, NFR-LMS-02, NFR-LMS-04 | US-LMS-03 | T-01 / TASK-03 | Tất cả màn hình và API được bảo vệ; kiểm tra 401/403 | Bằng chứng tăng cường RBAC và sửa lỗi trong [docs/08-quality/bug-log.md](docs/08-quality/bug-log.md) và [server/index.js](../server/index.js) | TC-166..TC-200 | Hoàn thành |
| REQ-LMS-03 | US-LMS-04 | T-01 / TASK-04 | S03 Danh sách khóa học; `GET /api/courses` | Danh sách khóa học trong [server/index.js](../server/index.js); dữ liệu mẫu trong [server/db.js](../server/db.js) | TC-016, TC-017, TC-018 | Hoàn thành |
| REQ-LMS-04 | US-LMS-05 | T-01 / TASK-05 | S04 Chi tiết khóa học; `POST /api/enrollments` | Logic ghi danh trong [server/index.js](../server/index.js) | TC-019, TC-020, TC-021 | Hoàn thành |
| REQ-LMS-05 | US-LMS-06 | T-01 / TASK-06 | S05 Chi tiết bài học; `GET /api/courses/:courseId/lessons` | Danh sách bài học và kiểm soát ghi danh trong [server/index.js](../server/index.js) | TC-022, TC-023, TC-024 | Hoàn thành |
| REQ-LMS-06 | US-LMS-07 | T-01 / TASK-07 | Route hoàn thành bài học; `POST /api/lessons/:lessonId/complete` | Logic hoàn thành bài học trong [server/index.js](../server/index.js) | TC-025, TC-026, TC-097, TC-098 | Hoàn thành |
| REQ-LMS-20, NFR-LMS-06 | US-LMS-08 | T-01 / TASK-08 | Xem tiến độ; API hoàn thành của người học | Logic tiến độ và hoàn thành trong [server/index.js](../server/index.js) | TC-027, TC-028, TC-029 | Hoàn thành |
| REQ-LMS-21 | US-LMS-09 | T-01 / TASK-09 | Logic hoàn thành khóa học và dashboard người học | Logic trạng thái hoàn thành trong [server/index.js](../server/index.js) | TC-030, TC-031, TC-032 | Hoàn thành |
| REQ-LMS-07, NFR-LMS-06 | US-LMS-10 | T-01 / TASK-10 | Màn hình chi tiết bài tập; endpoint bài tập | Logic bài tập trong [server/index.js](../server/index.js) | TC-033, TC-034, TC-035 | Hoàn thành |
| REQ-LMS-08 | US-LMS-11 | T-01 / TASK-11 | Nộp bài tập; `POST /api/submissions` | Logic lưu bài nộp trong [server/index.js](../server/index.js) | TC-036, TC-037, TC-038 | Hoàn thành |
| REQ-LMS-09 | US-LMS-12 | T-01 / TASK-12 | Cờ trễ và timestamp nộp bài | `submitted_at` và `is_late` trong [server/db.js](../server/db.js) và [server/index.js](../server/index.js) | TC-039, TC-040, TC-041 | Hoàn thành |
| REQ-LMS-10 | US-LMS-13 | T-01 / TASK-13 | Quy tắc nộp lại và kiểm tra dữ liệu | Logic xác thực trong [server/index.js](../server/index.js) | TC-042, TC-043, TC-044 | Hoàn thành |
| REQ-LMS-14 | US-LMS-14 | T-01 / TASK-14 | Xem bài nộp của giảng viên | Flow giảng viên trong [server/index.js](../server/index.js) | TC-045, TC-046, TC-047 | Hoàn thành |
| REQ-LMS-15 | US-LMS-15 | T-01 / TASK-15 | Lưu điểm và phản hồi | Logic chấm điểm trong [server/index.js](../server/index.js) | TC-048, TC-049, TC-050 | Hoàn thành |
| REQ-LMS-19 | US-LMS-16 | T-01 / TASK-16 | Xem phản hồi của người học | Endpoint đọc bài nộp và phản hồi trong [server/index.js](../server/index.js) | TC-051, TC-052, TC-053 | Hoàn thành |
| REQ-LMS-16 | US-LMS-17 | T-01 / TASK-17 | Luồng giao việc cho reviewer | Giao reviewer trong [server/index.js](../server/index.js) | TC-054, TC-055, TC-056 | Hoàn thành |
| REQ-LMS-17 | US-LMS-18 | T-01 / TASK-18 | Dashboard reviewer và bài nộp được giao | Query reviewer trong [server/index.js](../server/index.js) | TC-057, TC-058, TC-059 | Hoàn thành |
| REQ-LMS-18 | US-LMS-19 | T-01 / TASK-19 | Chấm điểm và phản hồi của reviewer | Logic chấm điểm review trong [server/index.js](../server/index.js) | TC-060, TC-061, TC-062 | Hoàn thành |
| REQ-LMS-11 | US-LMS-20 | T-01 / TASK-20 | Quản lý khóa học của giảng viên; flow CRUD khóa học | Quản lý khóa học trong [server/index.js](../server/index.js) | TC-063, TC-064, TC-065 | Hoàn thành |
| REQ-LMS-12 | US-LMS-21 | T-01 / TASK-21 | Quản lý bài học; API `GET/POST/PATCH` | API bài học trong [server/index.js](../server/index.js) | TC-066, TC-067, TC-068 | Hoàn thành |
| REQ-LMS-13 | US-LMS-22 | T-01 / TASK-22 | Quản lý bài tập | API bài tập trong [server/index.js](../server/index.js) | TC-069, TC-070, TC-071 | Hoàn thành |
| REQ-LMS-26 | US-LMS-23 | T-01 / TASK-23 | Quản lý người dùng và vai trò của admin | Logic admin trong [server/index.js](../server/index.js) | TC-011, TC-012, TC-013, TC-015 | Hoàn thành |
| REQ-LMS-27 | US-LMS-24 | T-01 / TASK-24 | Dữ liệu vận hành và xem audit của admin | Bằng chứng admin trong [server/index.js](../server/index.js) và [docs/08-quality/QA_REPORT.md](08-quality/QA_REPORT.md) | TC-014, TC-030, TC-166..TC-200 | Hoàn thành |
| REQ-LMS-22 | US-LMS-25 | T-01 / TASK-25 | Luồng AI Tutor và injection ngữ cảnh | Logic AI Tutor trong [server/index.js](../server/index.js); giao diện người học trong [web/src/app/learner](../web/src/app/learner) | TC-072, TC-073, TC-074 | Hoàn thành |
| REQ-LMS-23 | US-LMS-26 | T-01 / TASK-26 | Phản hồi AI dựa trên ngữ cảnh | AI Tutor trả lời theo ngữ cảnh trong [server/index.js](../server/index.js) | TC-075, TC-076, TC-077 | Hoàn thành |
| REQ-LMS-24 | US-LMS-27 | T-01 / TASK-27 | Giải thích và ví dụ dựa trên nội dung bài học | Luồng giải thích ví dụ trong [server/index.js](../server/index.js) | TC-078, TC-079, TC-080 | Hoàn thành |
| REQ-LMS-25, NFR-LMS-05 | US-LMS-28 | T-01 / TASK-28 | Chuyển sang fallback khi thiếu ngữ cảnh / từ chối câu hỏi | Xác thực ngữ cảnh AI Tutor trong [server/index.js](../server/index.js) | TC-081, TC-082, TC-083 | Hoàn thành |
| NFR-LMS-01, NFR-LMS-03 | US-LMS-29 | T-01 / TASK-29 | Luồng cập nhật dữ liệu an toàn và nhất quán | Khởi tạo DB + xác thực trong [server/db.js](../server/db.js) và [server/index.js](../server/index.js) | TC-084, TC-166..TC-200 | Hoàn thành |
| NFR-LMS-07, NFR-LMS-04 | US-LMS-30 | T-01 / TASK-30 | Ghi và đọc audit log; giám sát của admin | Bằng chứng audit trong [docs/08-quality/QA_REPORT.md](08-quality/QA_REPORT.md) và [server/index.js](../server/index.js) | TC-014, TC-166..TC-200 | Hoàn thành |

## Nguồn bằng chứng sử dụng

- Yêu cầu: [docs/01-discovery/5.requirements.md](01-discovery/5.requirements.md)
- Backlog story: [docs/03-product/taiga-backlog.md](03-product/taiga-backlog.md)
- Định nghĩa user story: [docs/03-product/user-stories.md](03-product/user-stories.md)
- Màn hình thiết kế: [docs/04-design/screen-inventory.md](04-design/screen-inventory.md)
- Hợp đồng API: [docs/05-technical/API.md](05-technical/API.md)
- Bằng chứng artifact và bug: [docs/08-quality/bug-log.md](08-quality/bug-log.md), [docs/08-quality/QA_REPORT.md](08-quality/QA_REPORT.md), [docs/08-quality/code-review.md](08-quality/code-review.md)
- Triển khai: [server/index.js](../server/index.js), [server/db.js](../server/db.js)
- Bài kiểm thử tự động: [tests](../tests)

## Trạng thái cuối cùng

- Độ phủ từ yêu cầu sang story: 100%
- Độ phủ từ story sang công việc: 100%
- Độ phủ từ story sang kiểm thử: 100% với bằng chứng hồi quy tự động
- Trạng thái tổng kết cuối cùng: Hoàn thành
