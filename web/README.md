# ⚡ Hướng dẫn Ứng dụng Web Frontend (React + Vite)

> **Mục đích & Chức năng của file này:** File này cung cấp tài liệu hướng dẫn và cấu hình cơ bản cho ứng dụng Frontend xây dựng bằng React và Vite. Hướng dẫn bao gồm cách phát triển giao diện, tích hợp công cụ kiểm tra mã nguồn (Oxlint/ESLint) và lưu ý về hiệu năng khi build ứng dụng.

---

## 🚀 Công nghệ sử dụng

Ứng dụng Frontend sử dụng **Vite** kết hợp **React 19** cho tốc độ phản hồi nhanh và phát triển tính năng tức thì (HMR - Hot Module Replacement).

---

## 🛠️ Hướng dẫn phát triển

- **Khởi chạy môi trường Dev:**
  ```bash
  npm --prefix web run dev
  ```

- **Build sản phẩm Production:**
  ```bash
  npm --prefix web run build
  ```

- **Kiểm tra linter mã nguồn:**
  ```bash
  npm --prefix web run lint
  ```

---

## 📌 Lưu ý cấu hình & Hiệu năng

- Ứng dụng đã được tối ưu hóa cấu hình Vite để đảm bảo thời gian đóng gói sản phẩm cực nhanh.
- Các quy tắc kiểm tra linter giúp duy trì chất lượng mã nguồn sạch, phát hiện sớm các lỗi cú pháp và đảm bảo chuẩn React hooks.
