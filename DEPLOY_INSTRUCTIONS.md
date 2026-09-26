# Hướng dẫn Deploy Frontend lên Vercel

## ✅ Đã sửa các lỗi sau:

1. **Hardcoded API URL** trong `web/src/App.jsx` - giờ dùng biến môi trường
2. **Base path sai** trong `web/vite.config.js` - đổi từ `/group-04-project/` thành `/`
3. **Thêm file `.env`** cho local và production

## 📝 Các bước deploy:

### Bước 1: Cập nhật URL backend Supabase

Mở file `web/.env.production` và thay thế URL backend thật của bạn:

```env
VITE_API_BASE_URL=https://your-actual-backend-url.com
```

**Lưu ý:** Bạn cần biết URL của backend đã deploy trên Supabase. Có thể là:
- Supabase Edge Function URL: `https://fnxluoduirrkgulmiixs.supabase.co/functions/v1`
- Hoặc URL khác tùy cách bạn deploy backend

### Bước 2: Cấu hình Vercel Environment Variables

Vào **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

Thêm biến:
- **Key:** `VITE_API_BASE_URL`
- **Value:** `https://your-actual-backend-url.com` (URL backend thật)
- **Environment:** Production (và Preview nếu cần)

### Bước 3: Deploy lên Vercel

#### Cách 1: Deploy qua Vercel CLI
```bash
cd web
npm install -g vercel
vercel --prod
```

#### Cách 2: Deploy qua Vercel Dashboard
1. Vào https://vercel.com/new
2. Import repository GitHub của bạn
3. Vercel sẽ tự động phát hiện cấu hình từ `vercel.json`
4. Click **Deploy**

### Bước 4: Kiểm tra

Sau khi deploy thành công:
1. Mở URL Vercel app của bạn
2. Thử login với account: `alice@lms.test` / `learner123`
3. Kiểm tra Network tab trong DevTools - API calls phải gọi tới backend Supabase, không phải localhost

## 🔍 Troubleshooting

### Lỗi: "Cannot read API"
- Kiểm tra biến `VITE_API_BASE_URL` đã set đúng trên Vercel chưa
- Kiểm tra backend Supabase có đang chạy không

### Lỗi: CORS
- Backend cần bật CORS cho domain Vercel của bạn
- Kiểm tra file `server/index.js` có `cors()` middleware

### Lỗi: 404 Not Found khi refresh page
- Vercel cần file `vercel.json` có rewrites cho SPA
- Đã được fix trong config mới

## 🚀 Các file đã thay đổi:

- ✅ `web/src/App.jsx` - dùng environment variable
- ✅ `web/vite.config.js` - sửa base path
- ✅ `web/.env` - config local
- ✅ `web/.env.production` - config production (CẦN CẬP NHẬT URL)
- ✅ `vercel.json` - cấu hình Vercel mới
