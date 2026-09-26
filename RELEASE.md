# Ghi chú phát hành (Release Notes)

> **Mục đích & Chức năng của file này:** File này công bố thông tin chính thức về bản phát hành sản phẩm (Release Baseline), bao gồm phạm vi tính năng hoàn thành, các bản sửa lỗi, trạng thái kiểm thử, lưu ý triển khai và các vấn đề cần chú ý khi nghiệm thu phiên bản v1.0.0-final.

---

## 📌 Phiên bản (Version)
`v1.0.0-final`

## 🎯 Phạm vi phát hành (Scope)
Bản phát hành này hoàn thiện nền tảng chức năng đầu tiên của hệ thống LMS, bao gồm xác thực tài khoản, giao diện bảng điều khiển theo vai trò, quản lý khóa học và bài học, quy trình giao và nộp bài tập, quy trình chấm điểm phản hồi của người chấm bài và trợ lý tư vấn học tập AI Tutor.

---

## ✨ Các tính năng chính (Features)
- Phân quyền truy cập dựa trên 4 vai trò: Học viên (Learner), Giảng viên (Instructor), Người chấm (Reviewer), Quản trị viên (Admin).
- Đăng nhập bảo mật với các tài khoản phát hành mẫu có sẵn.
- Khám phá danh mục khóa học và xem chi tiết khóa học.
- Danh sách bài học và theo dõi tiến độ hoàn thành từng bài học.
- Quản lý ghi danh khóa học cho học viên.
- Tạo và quản lý bài tập dành cho giảng viên.
- Nộp bài tập làm và theo dõi trạng thái đánh giá.
- Quy trình chấm điểm dành cho Reviewer với kiểm tra ràng buộc điểm số và nhận xét.
- Quản lý danh sách người dùng và nhật ký hệ thống (Audit log) cho Admin.
- Khởi tạo tự động cấu trúc cơ sở dữ liệu và nạp dữ liệu mẫu ban đầu.
- Tích hợp giao diện và điểm cuối API cho trợ lý thông minh AI Tutor.
- Giao diện người dùng responsive hỗ trợ điều hướng mượt mà theo vai trò.

---

## 🐞 Các bản sửa lỗi chính (Fixes)
- Sửa lỗi tiến trình chạy ngầm cũ và xung đột cổng kết nối khi khởi động local.
- Tăng cường validation: Từ chối các chuỗi nhập rỗng hoặc chỉ chứa khoảng trắng.
- Thêm và thực thi nghiêm ngặt middleware phân quyền `requireRole` trên các API protected.
- Sửa lỗi phân quyền truy cập giữa Giảng viên và Người chấm bài.
- Ngăn chặn các luồng dữ liệu không hợp lệ (như nộp điểm số vượt khung 0-100 hoặc thiếu nhận xét).
- Đảm bảo tính nhất quán cho quá trình khởi tạo dữ liệu seed ban đầu.
- Cập nhật toàn bộ tài liệu kiểm thử QA và bằng chứng nghiệm thu trùng khớp với hành vi thực tế của ứng dụng.

---

## ⚠️ Vấn đề tồn đọng cần lưu ý (Known issues)
- Môi trường phát triển local yêu cầu khai báo chính xác `DATABASE_URL` trong file `.env`.
- Sự khác biệt về trình duyệt có thể ảnh hưởng nhẹ tới hiển thị CSS ở một số màn hình.
- Trợ lý AI Tutor cần kết nối mạng hoặc API key hợp lệ để đưa ra câu trả lời OpenAI (nếu không có sẽ dùng bộ trả lời grounded local).
- Mật khẩu các tài khoản mẫu chỉ dành cho môi trường kiểm thử/thử nghiệm.

---

## 🛠️ Lưu ý khi nâng cấp & Triển khai (Upgrade notes)
- Đổi tên hoặc sao chép `.env.example` thành `.env` và điền thông tin CSDL thực tế trước khi khởi chạy.
- Kiểm tra kết nối CSDL trước khi khởi động API server.
- Khởi chạy API backend một lần để tự động tạo bảng và nạp dữ liệu mẫu.
- Xác minh các luồng người dùng cốt lõi sau khi triển khai: Đăng nhập, truy cập vai trò, tải bài học, nộp bài và chấm điểm.

---

## 📊 Trạng thái phát hành (Release status)
- **Trạng thái:** Bản phát hành chính thức (Final release baseline)
- **Bằng chứng kiểm thử:** 202/202 test cases tự động bằng Python đã **PASSED 100%**.
