import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export async function query(text, params = []) {
    return pool.query(text, params);
}

export async function initializeDatabase() {
    await query(`
        CREATE TABLE IF NOT EXISTS app_users (
            id SERIAL PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('Learner', 'Instructor', 'Reviewer', 'Admin')),
            name TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    await query(`
        ALTER TABLE app_users
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS courses (
            id SERIAL PRIMARY KEY,
            code TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Archived')),
            instructor_id INT REFERENCES app_users(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS enrollments (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
            course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
            status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Archived')),
            enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE(user_id, course_id)
        );
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS lessons (
            id SERIAL PRIMARY KEY,
            course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            duration INT NOT NULL DEFAULT 0,
            is_required BOOLEAN NOT NULL DEFAULT TRUE,
            sort_order INT NOT NULL DEFAULT 1,
            status TEXT NOT NULL DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Archived')),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS assignments (
            id SERIAL PRIMARY KEY,
            course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            deadline TIMESTAMPTZ,
            max_attempts INT NOT NULL DEFAULT 1,
            status TEXT NOT NULL DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Archived')),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS submissions (
            id SERIAL PRIMARY KEY,
            assignment_id INT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
            learner_id INT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
            answer TEXT,
            status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Rejected', 'Passed', 'Needs Revision')),
            submitted_at TIMESTAMPTZ,
            is_late BOOLEAN NOT NULL DEFAULT FALSE,
            reviewer_id INT REFERENCES app_users(id) ON DELETE SET NULL,
            grade NUMERIC(5,2),
            feedback TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            id SERIAL PRIMARY KEY,
            actor_id INT REFERENCES app_users(id) ON DELETE SET NULL,
            action TEXT NOT NULL,
            target_type TEXT,
            target_id TEXT,
            metadata JSONB NOT NULL DEFAULT '{}',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS lesson_completions (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
            lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
            completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE(user_id, lesson_id)
        );
    `);

    const userCount = await query('SELECT COUNT(*)::int AS total FROM app_users;');
    if (userCount.rows[0].total === 0) {
        await query(
            `INSERT INTO app_users (email, password, role, name)
             VALUES
               ('alice@lms.test', 'learner123', 'Learner', 'Alice Learner'),
               ('bob@lms.test', 'instructor123', 'Instructor', 'Bob Instructor'),
               ('carol@lms.test', 'reviewer123', 'Reviewer', 'Carol Reviewer'),
               ('diana@lms.test', 'admin123', 'Admin', 'Diana Admin');`
        );
    }

    const courseCount = await query('SELECT COUNT(*)::int AS total FROM courses;');
    if (courseCount.rows[0].total === 0) {
        const instructorId = await query('SELECT id FROM app_users WHERE email = $1', ['bob@lms.test']);
        const instructor = instructorId.rows[0]?.id;

        await query(
            `INSERT INTO courses (code, title, description, category, status, instructor_id)
             VALUES
               ('CS-101', 'Human-Centered Product Design', 'Design thinking, empathy, user research and prototyping.', 'Design', 'Published', $1),
               ('DS-201', 'Data Literacy for Decisions', 'Interpret charts, metrics, analysis and evidence-based decisions.', 'Data', 'Published', $1),
               ('SYS-301', 'Systems Thinking 101', 'Model complex systems and understand root causes.', 'Systems', 'Published', $1);`,
            [instructor],
        );

        await query(
            `INSERT INTO lessons (course_id, title, content, duration, is_required, sort_order, status)
             SELECT c.id, 'Intro', 'Course introduction and outcomes.', 25, TRUE, 1, 'Published'
             FROM courses c WHERE c.code = 'CS-101'
             UNION ALL
             SELECT c.id, 'Research', 'User research methods and synthesis.', 30, TRUE, 2, 'Published'
             FROM courses c WHERE c.code = 'CS-101'
             UNION ALL
             SELECT c.id, 'Analytics Basics', 'Core metrics and data literacy.', 35, TRUE, 1, 'Published'
             FROM courses c WHERE c.code = 'DS-201'
             UNION ALL
             SELECT c.id, 'Decision Frames', 'Decision quality and trade-offs.', 40, TRUE, 2, 'Published'
             FROM courses c WHERE c.code = 'DS-201'
             UNION ALL
             SELECT c.id, 'Systems Map', 'Map feedback loops and causal structure.', 20, TRUE, 1, 'Published'
             FROM courses c WHERE c.code = 'SYS-301'
             UNION ALL
             SELECT c.id, 'Intervention', 'Design intervention strategies.', 25, TRUE, 2, 'Published'
             FROM courses c WHERE c.code = 'SYS-301';`
        );

        await query(
            `INSERT INTO assignments (course_id, title, description, deadline, max_attempts, status)
             SELECT c.id, 'Design Reflection', 'Submit a short reflection on user research and design choices.', NOW() + INTERVAL '7 days', 2, 'Published'
             FROM courses c WHERE c.code = 'CS-101'
             UNION ALL
             SELECT c.id, 'Data Memo', 'Write a short data memo with evidence and interpretation.', NOW() + INTERVAL '10 days', 2, 'Published'
             FROM courses c WHERE c.code = 'DS-201'
             UNION ALL
             SELECT c.id, 'Systems Case', 'Apply systems thinking to a real-world problem.', NOW() + INTERVAL '12 days', 2, 'Published'
             FROM courses c WHERE c.code = 'SYS-301';`
        );

        const learnerId = await query('SELECT id FROM app_users WHERE email = $1', ['alice@lms.test']);
        if (learnerId.rows[0]) {
            await query(
                `INSERT INTO enrollments (user_id, course_id, status)
                 SELECT u.id, c.id, 'Active'
                 FROM app_users u
                 JOIN courses c ON c.code = 'CS-101'
                 WHERE u.email = 'alice@lms.test'
                 ON CONFLICT (user_id, course_id) DO NOTHING;`,
            );
        }
    }
}

export async function testDatabase() {
    const result = await query('SELECT NOW() AS now;');
    return result.rows[0];
}

export { pool };
