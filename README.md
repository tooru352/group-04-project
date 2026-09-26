# Tài liệu dự án LMS (Learning Management System)

> **Mục đích & Chức năng của file này:** Đây là tài liệu chính của dự án, cung cấp cái nhìn tổng quan về hệ thống LMS quản lý học tập theo vai trò. Tệp chứa hướng dẫn chi tiết về cấu trúc thư mục, cài đặt môi trường phát triển, cách chạy ứng dụng (Backend API & React Frontend), dữ liệu mẫu (seed data), lệnh chạy test case, hướng dẫn triển khai (deploy) và các bước xử lý sự cố thường gặp.

---

## 1. Tổng quan hệ thống (Overview)

- **Backend**: Node.js + Express + PostgreSQL (Supabase / Postgres Local)
- **Frontend**: Vite + React
- **Khởi tạo Database**: Tự động khởi tạo schema và nạp dữ liệu mẫu trong `server/db.js`
- **Kiểm thử tự động**: Bộ test case tự động bằng Python nằm trong thư mục `tests/`
- **Các vai trò người dùng (Roles)**: Learner (Học viên), Instructor (Giảng viên), Reviewer (Người chấm bài), Admin (Quản trị viên)

---

## 2. Cấu trúc thư mục (Repository layout)

```text
.
├─ .env.example              # File mẫu cấu hình biến môi trường
├─ .github/
│  └─ workflows/             # Cấu hình GitHub Actions CI/CD (ci.yml, pages.yml)
├─ Dockerfile                # File đóng gói container cho Backend API
├─ docker-compose.yml        # File chạy container Backend + Frontend
├─ docs/                     # Thư mục tài liệu yêu cầu & kỹ thuật
├─ package.json              # Cấu hình scripts và dependencies của dự án Node.js
├─ server/
│  ├─ db.js                  # Khởi tạo DB schema, kết nối và nạp seed data
│  ├─ index.js               # Mã nguồn chính của REST API server
│  └─ test_connection.js     # Script kiểm tra kết nối CSDL
├─ tests/                    # Thư mục chứa 202 test cases tự động (Pytest)
├─ web/                      # Mã nguồn ứng dụng Frontend React (Vite)
│  ├─ Dockerfile
│  ├─ package.json
│  └─ src/
└─ README.md                 # Tài liệu hướng dẫn sử dụng dự án
```

---

## 3. Yêu cầu tiền đề (Prerequisites)

- **Node.js**: Phiên bản 18 trở lên
- **npm**: Trình quản lý gói Node.js
- **Python**: Phiên bản 3.11 trở lên (dùng để chạy pytest)
- **PostgreSQL**: Cơ sở dữ liệu PostgreSQL local hoặc Supabase project
- **DATABASE_URL**: Chuỗi kết nối CSDL PostgreSQL khả dụng

---

## 4. Hướng dẫn cài đặt (Setup)

1. Clone repository về máy local:
2. Tạo file cấu hình môi trường `.env` từ file mẫu:

```bash
copy .env.example .env
```

3. Cập nhật các giá trị thực tế trong file `.env`:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=replace_with_secure_secret
VITE_API_BASE_URL=http://localhost:4000
```

*Ghi chú:*
- `DATABASE_URL` bắt buộc phải có để API kết nối tới PostgreSQL.
- `VITE_API_BASE_URL` được sử dụng bởi Frontend để gọi API Backend.

---

## 5. Cài đặt thư viện phụ thuộc (Dependencies)

Cài đặt cho cả root backend và web frontend:

```bash
npm install
npm --prefix web install
```

---

## 6. Khởi tạo dữ liệu mẫu (Seed Data & Bootstrapping)

Việc khởi tạo cơ sở dữ liệu được tự động xử lý trong `server/db.js`.

Khi khởi động backend, hệ thống sẽ tự động tạo các bảng nếu chưa có và chèn dữ liệu mẫu ban đầu:

- **Học viên (Learner)**: `alice@lms.test` / `learner123`
- **Giảng viên (Instructor)**: `bob@lms.test` / `instructor123`
- **Người chấm bài (Reviewer)**: `carol@lms.test` / `reviewer123`
- **Quản trị viên (Admin)**: `diana@lms.test` / `admin123`

*Tài khoản này chỉ dùng cho mục đích kiểm thử và phát triển ở môi trường Local/Dev.*

---

## 7. Khởi chạy ứng dụng (Run the app)

Chạy **Backend API** (Cổng 4000):

```bash
npm run api
```

Chạy **Frontend React** (mở cửa sổ terminal thứ 2):

```bash
npm --prefix web run dev -- --host 0.0.0.0
```

Hoặc chạy đồng thời cả Backend và Frontend cùng lúc:

```bash
npm run dev
```

### Kiểm tra ứng dụng hoạt động:

- **Kiểm tra sức khỏe Backend (Health Check)**:
  ```bash
  curl http://localhost:4000/api/health
  ```
  *Kết quả kỳ vọng:* `{ "ok": true, "db": "connected", ... }`

- **Truy cập Frontend**: Mở trình duyệt tại địa chỉ Vite hiển thị (thường là `http://localhost:5173`).
- **Đăng nhập thử** bằng tài khoản học viên mẫu: `alice@lms.test` / `learner123`.

---

## 8. Chạy bộ kiểm thử (Test suite)

Chạy các lệnh kiểm tra và xác minh dự án:

```bash
# Kiểm tra lỗi kiểu dữ liệu TypeScript
npm run typecheck

# Chạy toàn bộ 202 test cases tự động bằng Pytest
python -m pytest tests -v
```

### Kiểm thử riêng chức năng AI Tutor:

Sau khi bật Backend server, có thể test riêng tính năng trợ lý AI:

```bash
# Reset lại database để tải dữ liệu nội dung bài học chi tiết
node reset_database.js

# Test AI Tutor ở môi trường local
bash test_ai_tutor_quick.sh
```

---

## 9. Triển khai (Deploy)

1. Chuẩn bị các biến môi trường cho sản phẩm (Production ENV).
2. Đảm bảo Database reachable và schema đã được khởi tạo.
3. Chạy Backend API với biến môi trường Production.
4. Build và serve phần Frontend (`npm --prefix web run build`).

---

## 10. Xử lý sự cố (Troubleshooting)

1. **Backend không khởi động được:**
   - Kiểm tra xem file `.env` đã có và chuỗi `DATABASE_URL` có hợp lệ hay không.
   - Kiểm tra kết nối cơ sở dữ liệu PostgreSQL / Supabase.
   - Kiểm tra cổng `4000` có bị ứng dụng khác chiếm dụng không.

2. **Frontend không gọi được API Backend:**
   - Kiểm tra biến `VITE_API_BASE_URL` trong `.env`.
   - Đảm bảo Backend đang chạy ở `http://localhost:4000`.

3. **Lỗi khi chạy test:**
   - Chạy lệnh test chi tiết: `python -m pytest tests -v` để xem nguyên nhân thất bại cụ thể ở từng testcase.
