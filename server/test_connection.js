import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

console.log('Testing DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'NOT SET');

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('<PROJECT_REF>')) {
  console.log('⚠️ Vui lòng thay thế <PROJECT_REF> trong tệp .env bằng Supabase Reference ID hoặc Host của bạn.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  const res = await pool.query('SELECT NOW() AS now, current_database() AS db;');
  console.log('✅ Kết nối Supabase thành công!');
  console.log('Thời gian máy chủ DB:', res.rows[0].now);
  console.log('Tên Database:', res.rows[0].db);
  await pool.end();
} catch (err) {
  console.error('❌ Lỗi kết nối Supabase:', err.message);
  await pool.end();
  process.exit(1);
}
