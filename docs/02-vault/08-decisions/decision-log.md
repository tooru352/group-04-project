# Decision Log

## DEC-001 - Điều kiện hoàn thành Course

- **Date:** 2026-08-28
- **Status:** Accepted
- **Decision:**
  Course được xem là Completed khi Learner hoàn thành
  tất cả Lesson bắt buộc và Assignment bắt buộc.

- **Reason:**
  Đảm bảo Learner hoàn thành đầy đủ nội dung và yêu cầu
  của Course trước khi hệ thống ghi nhận hoàn thành.

- **Impact:**
  Learning Progress cần theo dõi trạng thái hoàn thành
  của Lesson và Assignment để xác định Course Completion.

---

## DEC-002 - Submission sau Deadline

- **Date:** 2026-08-28
- **Status:** Accepted
- **Decision:**
  Learner vẫn được phép Submit Assignment sau Deadline,
  nhưng Submission phải được đánh dấu là Late.

- **Reason:**
  Không ngăn Learner nộp bài nhưng vẫn cần phân biệt
  Submission đúng hạn và quá hạn.

- **Impact:**
  Submission cần lưu thời gian nộp và trạng thái Late.

---

## DEC-003 - AI Tutor khi không đủ dữ liệu

- **Date:** 2026-08-28
- **Status:** Accepted
- **Decision:**
  AI Tutor chỉ trả lời dựa trên nội dung Course/Lesson
  được cung cấp. Nếu context không đủ, AI phải thông báo
  không đủ dữ liệu thay vì tự suy đoán.

- **Reason:**
  Giảm nguy cơ AI cung cấp thông tin không có trong
  nội dung học tập của Course.

- **Impact:**
  AI Tutor cần có cơ chế kiểm tra context trước khi trả lời.