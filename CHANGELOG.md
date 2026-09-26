# Nhật ký thay đổi (Changelog)

> **Mục đích & Chức năng của file này:** File này dùng để ghi lại lịch sử tất cả các thay đổi, tính năng mới được thêm vào, các điểm đã chỉnh sửa, các lỗi (bugs) đã được sửa chữa, vấn đề còn tồn đọng và hướng dẫn nâng cấp qua các phiên bản phát hành của dự án LMS.

---

## [v1.0.0-final] - 2026-09-26

### 🚀 Tính năng đã thêm (Added)
- Luồng đăng nhập và phân quyền truy cập theo vai trò (Learner, Instructor, Reviewer, Admin).
- Chức năng hiển thị danh sách khóa học và theo dõi tiến độ bài học.
- Quản lý đăng ký khóa học (Enrollment) và đánh dấu hoàn thành bài học (Completion).
- Luồng giao bài tập (Assignment) và nộp bài làm (Submission).
- Quy trình chấm điểm và phản hồi của người chấm bài (Reviewer grading & feedback).
- Chức năng quản trị người dùng và giám sát hệ thống dành cho Admin.
- Tích hợp điểm cuối API backend và giao diện trợ lý học tập AI Tutor.
- Tự động tạo bảng (schema) và nạp dữ liệu mẫu (seed data) cho cơ sở dữ liệu khi khởi động.
- Cấu trúc giao diện điều hướng theo vai trò ở phần Frontend.

### 🔄 Các thay đổi & cải tiến (Changed)
- Đồng bộ hóa hành vi của API và Frontend theo đúng tài liệu yêu cầu nghiệp vụ và quy tắc vai trò.
- Thắt chặt kiểm tra dữ liệu đầu vào (Validation): Từ chối các chuỗi rỗng hoặc chỉ chứa khoảng trắng.
- Tăng cường kiểm soát truy cập (RBAC) trên các tuyến đường bảo vệ (protected routes) và các thao tác nhạy cảm.
- Cập nhật tài liệu kiểm thử QA, bảo mật và phát hành phù hợp với hành vi thực tế của sản phẩm.

### 🛠️ Các lỗi đã sửa (Fixed)
- Sửa lỗi xung đột cổng kết nối và tiến trình cũ khi khởi động server local.
- Sửa lỗi thiếu hoặc lỏng lẻo trong việc kiểm tra phân quyền cho các hành động của Instructor, Reviewer, Admin.
- Sửa lỗi chấp nhận dữ liệu không hợp lệ (điểm số vượt khoảng, nhận xét rỗng, tiêu đề rỗng).
- Khắc phục sự bất đồng nhất giữa bằng chứng kiểm thử tự động và tài liệu mô tả.
- Tăng tính ổn định cho quá trình bootstrapping và khởi tạo dữ liệu seed cho môi trường phát triển local.

### ⚠️ Các vấn đề còn tồn đọng (Known issues)
- Môi trường Production yêu cầu cấu hình chính xác các biến trong file `.env`.
- Phản hồi của AI Tutor phụ thuộc vào tính sẵn sàng của dịch vụ Backend và cấu hình runtime (OpenAI API key).
- Sự khác biệt giữa các trình duyệt có thể ảnh hưởng nhỏ đến trải nghiệm giao diện người dùng.

### 📌 Hướng dẫn nâng cấp & Triển khai (Upgrade notes)
- Sử dụng `.env.example` làm căn cứ để tạo cấu hình cho môi trường local.
- Đảm bảo cơ sở dữ liệu có thể kết nối trước khi khởi động API backend.
- Kiểm tra lại các luồng đăng nhập, tuyến đường vai trò và các quy trình chính sau khi triển khai.
- Nếu một migration đã áp dụng vào dữ liệu thực tế, hãy dùng phương pháp sửa tiến (forward fix) thay vì rollback schema một cách thụ động.

---

## 📜 Trạng thái trước đây (Previous state)
- Dự án ban đầu từ một khung sườn (scaffold) cơ bản và đã được phát triển hoàn thiện thành phiên bản phát hành LMS phân quyền đầu tiên.
