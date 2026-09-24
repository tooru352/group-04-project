# Bảng UX copy

Các nhãn tiếng Anh trong cột CTA và trạng thái được giữ nguyên khi chúng là nhãn đã dùng trong prototype. Phần giải thích và hướng dẫn sử dụng dùng tiếng Việt.

| Vị trí            | Trạng thái                     | Nội dung                                                        | Thao tác / khôi phục        | Ghi chú                                 |
| ----------------- | ------------------------------ | --------------------------------------------------------------- | --------------------------- | --------------------------------------- |
| Login             | Lỗi (Error)                    | `Thông tin đăng nhập chưa đúng.`                                | `Kiểm tra lại và thử lại`   | Không xóa dữ liệu đã nhập               |
| Course Detail     | Not enrolled                   | `Đăng ký để mở Lesson và Assignment của Course này.`            | `Enroll in course`          | Nêu rõ hệ quả trước thao tác            |
| Course Detail     | Thành công (Success)           | `Đã đăng ký Course.`                                            | `Mở Course`                 | Toast đặt gần thao tác                  |
| Lesson Detail     | Incomplete                     | `Đọc Lesson rồi đánh dấu hoàn thành để cập nhật tiến độ.`       | `Mark as complete`          | Nêu rõ tác động đến tiến độ             |
| Lesson Detail     | Thành công (Success)           | `Đã hoàn thành Lesson. Tiến độ đã được cập nhật.`               | `Back to course`            | Hiển thị phần trăm mới                  |
| Assignment        | Phản hồi rỗng (Empty response) | `Thêm nội dung bài làm trước khi Submit.`                       | `Quay lại bài làm`          | Giữ nội dung đã nhập                    |
| Submit modal      | Xác nhận (Confirmation)        | `Submit bài làm này? Bạn sẽ ghi nhận một Submission mới.`       | `Cancel` / `Confirm Submit` | Dùng trước thao tác quan trọng          |
| Submission Result | Success                        | `Đã nộp bài thành công.`                                        | `Back to course`            | Có timestamp và trạng thái chờ chấm     |
| Submission Result | Late                           | `Bài đã được nộp sau Deadline và được đánh dấu Late.`           | `Xem kết quả`               | Không ngụ ý có thể xóa trạng thái Late  |
| Submission Result | Resubmit                       | `Bạn có thể Submit lại trước Deadline khi Assignment cho phép.` | `Submit again`              | Hide action when policy disallows       |
| Grading           | Missing grade                  | `Nhập Grade trước khi lưu kết quả.`                             | `Quay lại Grade`            | Inline field error                      |
| Grading           | Missing feedback               | `Thêm Feedback để Learner biết cách cải thiện.`                 | `Quay lại Feedback`         | Inline field error                      |
| Grading           | Success                        | `Grade và Feedback đã được lưu.`                                | `Xem Submission`            | Attach to selected Submission           |
| Course List       | Empty                          | `Chưa có Course phù hợp.`                                       | `Xem tất cả Course`         | Cung cấp bước tiếp theo hữu ích         |
| Data load         | Error                          | `Không thể tải dữ liệu. Hãy thử lại.`                           | `Retry`                     | Giữ ngữ cảnh và thử lại tại chỗ         |
| Access            | Permission denied              | `Bạn chưa có quyền truy cập nội dung này.`                      | `Quay lại Course`           | Không tiết lộ nội dung được bảo vệ      |
| AI Tutor          | Idle                           | `Ready to listen`                                               | `Start listening`           | Ghép icon với chữ                       |
| AI Tutor          | Listening                      | `Listening...`                                                  | `Stop`                      | Người dùng phải biết hệ thống đang nghe |
| AI Tutor          | Processing                     | `Processing...`                                                 | `Stop`                      | Prevent duplicate submit                |
| AI Tutor          | Answer                         | `Đây là cách Lesson giải thích vấn đề này.`                     | `Ask follow-up`             | Hiển thị `Source · Lesson ...`          |
| AI Tutor          | Insufficient context           | `KHÔNG ĐỦ DỮ LIỆU`                                              | `Hỏi về Lesson hiện tại`    | Không đoán hoặc bịa nội dung            |
| Toast             | Error                          | `Có lỗi khi lưu. Hãy thử lại.`                                  | `Retry`                     | Actionable recovery                     |
| State Lab         | Confirmation                   | `Bạn có chắc muốn Submit Assignment không?`                     | `Cancel` / `Confirm`        | QA-only state                           |

## Quy tắc viết nội dung

- Dùng một động từ cho mỗi CTA: `Enroll`, `Open course`, `Submit assignment`, `Save grade & feedback`, `Retry`.
- Ưu tiên nhãn trạng thái cụ thể: `Submitted`, `Late submission`, `Graded`, `Not submitted`.
- Nêu vấn đề trước, sau đó đưa ra thao tác khôi phục.
- Giữ các nhãn tiếng Anh đã có trong prototype khi chúng là một phần của UI đã kiểm thử; phần giải thích xung quanh phải dùng tiếng Việt nhất quán.
- Không dùng câu đổ lỗi, thông báo lỗi mơ hồ hoặc thay đổi trạng thái mà không báo cho người dùng.
