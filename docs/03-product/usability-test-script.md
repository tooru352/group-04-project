## Usability Test Script

| Task | Success criterion |
|---|---|
| T1: Đăng nhập với vai trò Learner | User chọn role Learner và vào đúng Learner Dashboard |
| T2: Đăng ký khóa học | User mở Browse courses, chọn course chưa enroll và click Enroll thành công |
| T3: Hoàn thành bài học | User mở lesson và click Mark as complete, progress được cập nhật |
| T4: Nộp bài tập | User nhập text vào Your submission và click Submit, thấy trạng thái Submitted |
| T5: Nộp bài muộn | User nhận biết trạng thái Late submission và hiểu đây là bài nộp muộn |
| T6: Chấm điểm bài nộp | User role Instructor mở submission review, nhập Grade và Feedback, save thành công |
| T7: Hỏi AI Tutor | User mở AI Tutor và hỏi câu hỏi liên quan lesson, nhận được answer có source |
| T8: AI Tutor thiếu dữ liệu | User hỏi ngoài context, hệ thống hiển thị đúng `KHÔNG ĐỦ DỮ LIỆU` |

### Notes for moderator
- Chỉ test các task có trong prototype flow đã định nghĩa trong `screen-flow.md` và `prototype-brief.md`.
- Không thêm chức năng mới ngoài scope của prototype.
- Mỗi task phải ghi lại: Pass / Fail, thời gian, lỗi gặp phải và phản hồi của người dùng.