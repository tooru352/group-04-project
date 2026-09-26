# Cấu trúc mã nguồn Backend & Domain (Source Structure)

> **Mục đích & Chức năng của file này:** File này mô tả sơ đồ tổ chức thư mục mã nguồn phía Backend/Core của dự án (`src/`), quy định nguyên tắc phân chia tầng kiến trúc (App, Modules, Shared, Core, Tests) và các quy tắc thiết kế mã nguồn cần tuân thủ.

---

## 📁 Cấu trúc thư mục `src/`

```text
src/
├─ app/                       # Chứa vỏ giao diện tuyến đường/trang (Route/Page shells)
│  ├─ auth/login/             # Trang đăng nhập
│  ├─ learner/                # Bảng điều khiển và các trang cho Học viên
│  ├─ instructor/             # Trang cho Giảng viên
│  ├─ reviewer/               # Trang cho Người chấm bài
│  ├─ admin/                  # Trang cho Quản trị viên
│  └─ state-lab/
├─ modules/                   # Các mô-đun nghiệp vụ chính (Business Domain Modules)
│  ├─ auth/                   # Mô-đun xác thực
│  ├─ users/                  # Mô-đun quản lý người dùng
│  ├─ courses/                # Mô-đun quản lý khóa học
│  ├─ lessons/                # Mô-đun quản lý bài học
│  ├─ assignments/            # Mô-đun bài tập
│  ├─ submissions/            # Mô-đun bài nộp
│  ├─ reviews/                # Mô-đun chấm điểm
│  ├─ ai-tutor/               # Mô-đun trợ lý AI Tutor
│  ├─ admin/                  # Mô-đun quản trị
│  └─ dashboard/              # Mô-đun bảng điều khiển
├─ shared/                    # Các thành phần dùng chung (UI components, validation, utils)
├─ core/                      # Các dịch vụ cốt lõi (kết nối DB, Auth token, Logging, AI client)
└─ tests/                     # Bộ test tích hợp và E2E
```

---

## 📜 Các quy tắc thiết kế (Rules)

1. **Thư mục `app/`**: Chỉ chứa các trang và tuyến đường giao diện người dùng (Route/Page shells).
2. **Thư mục `modules/`**: Cung cấp giao diện lập trình công khai (Public API) thông qua file `index.ts`.
3. **Thành phần UI (Component UI)**: Chỉ đóng vai trò hiển thị (presentational) và không trực tiếp thực hiện fetch dữ liệu rải rác.
4. **Quy tắc nghiệp vụ (Business Rules)**: Nằm hoàn toàn ở tầng domain/service logic, không viết trực tiếp trong giao diện UI.
