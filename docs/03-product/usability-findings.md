## Usability Findings

| Finding | Evidence | Decision |
|---|---|---|
| Trạng thái mic/AI Tutor chưa rõ ràng | 2/3 người dùng không biết hệ thống đang nghe hay đang chờ lệnh; họ thường dừng lại sau 1–2 giây vì không chắc AI đã bắt đầu xử lý | Thêm trạng thái rõ ràng như `Listening...`, `Processing...` và nút `Stop` / `Retry` để người dùng biết hệ thống đang hoạt động |
| Nút đăng ký khóa học chưa đủ nổi bật | 1/3 người dùng không biết phải click vào đâu để enroll khóa học; nhiều người nhầm lẫn giữa course detail và dashboard | Tăng độ nổi bật của nút `Enroll` và hiển thị rõ trạng thái `Enrolled` sau khi đăng ký thành công |
| Progress của bài học chưa được thể hiện rõ | 2/3 người dùng không chắc lesson đã hoàn thành hay chưa sau khi click `Mark as complete` | Hiển thị trạng thái `Completed`, cập nhật progress bar ngay lập tức và thêm success feedback rõ ràng |
| Quy trình nộp bài tập thiếu xác nhận và phản hồi | 3/3 người dùng không chắc bài của mình đã được gửi thành công; có người click submit nhưng không nhận được feedback rõ ràng | Thêm confirm trước khi submit và hiển thị popup/message: `Submitted successfully` kèm timestamp và trạng thái bài nộp |
| AI Tutor cần hỏi lại rõ hơn khi câu hỏi mơ hồ hoặc thiếu dữ liệu | 3/3 người dùng hỏi mơ hồ và không biết AI Tutor sẽ trả lời như thế nào; có người cho rằng hệ thống lỗi khi không có câu trả lời phù hợp | Thêm flow clarification ngắn gọn, ví dụ gợi ý lựa chọn hoặc hỏi lại: “Bạn muốn tìm khóa học theo loại nào?”; khi thiếu context thì hiển thị chính xác `KHÔNG ĐỦ DỮ LIỆU` |