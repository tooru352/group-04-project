# Reset Database trên Railway Production

Sau khi thêm nội dung chi tiết cho lessons, cần reset database production để load data mới.

## Cách 1: Chạy script qua Railway CLI (Nhanh nhất)

### Bước 1: Cài Railway CLI
```bash
npm install -g @railway/cli
```

### Bước 2: Login
```bash
railway login
```

### Bước 3: Link project
```bash
railway link
```
Chọn project `group-04-project`

### Bước 4: Chạy reset script
```bash
railway run node reset_database.js
```

---

## Cách 2: Manual qua Railway Dashboard

### Bước 1: Vào Railway Dashboard
https://railway.app → Chọn project `group-04-project`

### Bước 2: Restart service
- Click vào service
- Click **Settings** tab
- Scroll xuống **Danger Zone**
- Click **Restart**

Backend sẽ tự động chạy `initializeDatabase()` khi restart, nhưng **không xóa data cũ**.

---

## Cách 3: Reset database từ Supabase Dashboard (Khuyến nghị nếu muốn xóa toàn bộ)

### Bước 1: Vào Supabase Dashboard
https://supabase.com/dashboard

### Bước 2: Chọn project của bạn

### Bước 3: Vào **SQL Editor**

### Bước 4: Chạy script sau:
```sql
-- Drop all tables
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS lesson_completions CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS app_users CASCADE;
```

### Bước 5: Restart Railway service
Backend sẽ tự động tạo lại tables với nội dung mới.

---

## Kiểm tra kết quả

### 1. Check lessons qua API:
```bash
curl https://group-04-project-production.up.railway.app/api/courses/1/lessons | jq '.lessons[] | {id, title, content: .content[0:100]}'
```

### 2. Test AI Tutor:
```bash
bash test_ai_production.sh
```

Kết quả mong đợi: AI Tutor trả lời chi tiết dựa trên nội dung bài học mới.

---

## Lưu ý

- ⚠️ Reset database sẽ **XÓA TẤT CẢ DỮ LIỆU**
- ✅ Seed data (users, courses, lessons, assignments) sẽ được tạo lại tự động
- ✅ Login vẫn hoạt động với accounts: alice@lms.test, bob@lms.test, etc.
