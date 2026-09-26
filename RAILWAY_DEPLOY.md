# 🚂 Deploy Backend lên Railway

## Bước 1: Tạo tài khoản
1. Vào https://railway.app
2. Click **Login with GitHub**
3. Authorize Railway

## Bước 2: Tạo project mới
1. Click **New Project**
2. Chọn **Deploy from GitHub repo**
3. Chọn repository `group-04-project`
4. Railway sẽ tự động detect `Dockerfile` và build

## Bước 3: Thêm Environment Variables
Vào tab **Variables**, thêm các biến sau:

```env
DATABASE_URL=postgresql://postgres.fnxluoduirrkgulmiixs:Xuantoan%40352@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
PORT=4000
NODE_ENV=production
JWT_SECRET=replace_with_secure_secret
```

## Bước 4: Lấy URL backend
1. Vào tab **Settings**
2. Scroll xuống **Networking** → **Public Networking**
3. Click **Generate Domain**
4. Copy URL (dạng: `https://your-app.up.railway.app`)

## Bước 5: Cập nhật frontend
Mở file `web/.env.production` và thay:

```env
VITE_API_BASE_URL=https://your-app.up.railway.app
```

## Bước 6: Deploy frontend lên Vercel
1. Commit và push code:
```bash
git add .
git commit -m "Update production API URL"
git push
```

2. Vào Vercel Dashboard → **Environment Variables**
3. Thêm:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-app.up.railway.app`
   - Environment: **Production**

4. Redeploy trên Vercel

## ✅ Kiểm tra
- Backend: Mở `https://your-app.up.railway.app/api/health`
- Frontend: Mở Vercel URL và thử login

## 💰 Chi phí
- Railway: $5 credit miễn phí/tháng (đủ dùng)
- Vercel: Miễn phí
- Supabase: Miễn phí (database hiện tại)

## 🔧 Troubleshooting

### Backend không start
- Check Logs trong Railway dashboard
- Verify `DATABASE_URL` đúng format

### Frontend không kết nối được backend
- Check CORS trong `server/index.js`
- Verify `VITE_API_BASE_URL` trên Vercel

### Database connection error
- Kiểm tra Supabase database có đang chạy không
- Test connection: `node server/test_connection.js`
