import test from 'node:test';
import assert from 'node:assert/strict';

// @ts-ignore -- runtime JS module without generated typings; behavior is validated in this test.
import { initializeDatabase, query } from '../../server/db.js';

test('initializeDatabase creates the LMS schema and seed data', async () => {
    await initializeDatabase();

    const requiredTables = [
        'app_users',
        'courses',
        'enrollments',
        'lessons',
        'assignments',
        'submissions',
        'audit_logs',
    ];

    const result = await query(
        `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name = ANY($1)`,
        [requiredTables],
    );

    const tables = result.rows.map((row: { table_name: string }) => row.table_name);
    assert.deepEqual(new Set(tables), new Set(requiredTables));

    const appUsers = await query('SELECT COUNT(*)::int AS total FROM app_users;');
    assert.ok(appUsers.rows[0].total >= 4);

    const courses = await query('SELECT COUNT(*)::int AS total FROM courses;');
    assert.ok(courses.rows[0].total >= 3);
});
