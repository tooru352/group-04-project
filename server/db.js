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

    const canonicalUsers = [
        { email: 'alice@lms.test', password: 'learner123', role: 'Learner', name: 'Alice Learner' },
        { email: 'bob@lms.test', password: 'instructor123', role: 'Instructor', name: 'Bob Instructor' },
        { email: 'carol@lms.test', password: 'reviewer123', role: 'Reviewer', name: 'Carol Reviewer' },
        { email: 'diana@lms.test', password: 'admin123', role: 'Admin', name: 'Diana Admin' },
    ];

    for (const user of canonicalUsers) {
        await query(
            `INSERT INTO app_users (email, password, role, name)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (email) DO UPDATE SET
               password = EXCLUDED.password,
               role = EXCLUDED.role,
               name = EXCLUDED.name;`,
            [user.email, user.password, user.role, user.name],
        );
    }

    const instructorRow = await query('SELECT id FROM app_users WHERE email = $1', ['bob@lms.test']);
    const instructorId = instructorRow.rows[0]?.id;

    const courseByCode = await query('SELECT id FROM courses WHERE code = $1 LIMIT 1;', ['CS-101']);
    if (courseByCode.rowCount === 0) {
        await query(
            `INSERT INTO courses (id, code, title, description, category, status, instructor_id)
             VALUES (1, 'CS-101', 'Human-Centered Product Design', 'Design thinking, empathy, user research and prototyping.', 'Design', 'Published', $1)
             ON CONFLICT (id) DO NOTHING;`,
            [instructorId || null],
        );
    }

    const courseIds = await query('SELECT id FROM courses ORDER BY id LIMIT 1;');
    if (courseIds.rowCount === 0) {
        await query(
            `INSERT INTO courses (code, title, description, category, status, instructor_id)
             VALUES ('CS-101', 'Human-Centered Product Design', 'Design thinking, empathy, user research and prototyping.', 'Design', 'Published', $1);`,
            [instructorId || null],
        );
    }

    const courseOne = await query('SELECT id FROM courses WHERE id = 1 LIMIT 1;');
    if (courseOne.rowCount === 0) {
        const firstCourse = await query('SELECT id FROM courses ORDER BY id LIMIT 1;');
        const fallbackCourseId = firstCourse.rows[0]?.id;
        if (fallbackCourseId) {
            await query(
                `UPDATE courses
                 SET code = 'LEGACY-' || code,
                     title = 'Legacy Course',
                     description = 'Migrated legacy course for compatibility.',
                     category = 'General',
                     updated_at = NOW()
                 WHERE id = $1;`,
                [fallbackCourseId],
            );
        }
        await query(
            `INSERT INTO courses (id, code, title, description, category, status, instructor_id)
             VALUES (1, 'CS-101', 'Human-Centered Product Design', 'Design thinking, empathy, user research and prototyping.', 'Design', 'Published', $1);`,
            [instructorId || null],
        );
    }

    const course1Id = await query('SELECT id FROM courses WHERE id = 1 LIMIT 1;');
    const courseOneId = course1Id.rows[0]?.id;
    if (courseOneId) {
        await query(
            `INSERT INTO lessons (course_id, title, content, duration, is_required, sort_order, status)
             SELECT $1, 'Intro', 'Welcome to Human-Centered Product Design! This course introduces design thinking principles and user-centered design methodology. You will learn how to identify user needs, conduct effective research, synthesize insights, and prototype solutions that solve real problems. Throughout this course, we focus on empathy, iteration, and evidence-based decision making.', 25, TRUE, 1, 'Published'
             WHERE NOT EXISTS (
                 SELECT 1 FROM lessons WHERE course_id = $1 AND title = 'Intro' LIMIT 1
             );`,
            [courseOneId],
        );

        await query(
            `INSERT INTO lessons (course_id, title, content, duration, is_required, sort_order, status)
             SELECT $1, 'Research', 'User research is the foundation of human-centered design. In this lesson, you will learn qualitative research methods including interviews, observations, and contextual inquiry. We cover how to design research questions, recruit participants, conduct ethical research, and synthesize findings into actionable insights. Key concepts include empathy mapping, journey mapping, and identifying pain points. Research must be grounded in real user data, not assumptions. Always validate your hypotheses with evidence from actual users.', 30, TRUE, 2, 'Published'
             WHERE NOT EXISTS (
                 SELECT 1 FROM lessons WHERE course_id = $1 AND title = 'Research' LIMIT 1
             );`,
            [courseOneId],
        );

        await query(
            `INSERT INTO lessons (course_id, title, content, duration, is_required, sort_order, status)
             SELECT $1, 'Prototyping', 'Prototyping transforms ideas into tangible artifacts for testing. This lesson covers low-fidelity sketching, wireframing, and high-fidelity interactive prototypes. Learn when to use each prototype type, how to test with users, and iterate based on feedback. Prototypes should focus on testing specific hypotheses about user behavior and product assumptions. Remember: fail fast, learn quickly, and iterate based on evidence. Use tools like Figma, paper prototypes, or simple HTML mockups depending on your testing goals.', 35, TRUE, 3, 'Published'
             WHERE NOT EXISTS (
                 SELECT 1 FROM lessons WHERE course_id = $1 AND title = 'Prototyping' LIMIT 1
             );`,
            [courseOneId],
        );

        await query(
            `INSERT INTO lessons (course_id, title, content, duration, is_required, sort_order, status)
             SELECT $1, 'Design Systems', 'A design system is a collection of reusable components, patterns, and guidelines that ensure consistency across products. This lesson introduces core principles: component libraries, design tokens, accessibility standards, and documentation. Learn how to build scalable design systems that support multiple teams and products. Key topics include atomic design methodology, design-development handoff, and version control for design assets. A good design system reduces decision fatigue and improves team velocity.', 40, TRUE, 4, 'Published'
             WHERE NOT EXISTS (
                 SELECT 1 FROM lessons WHERE course_id = $1 AND title = 'Design Systems' LIMIT 1
             );`,
            [courseOneId],
        );

        await query(
            `INSERT INTO assignments (course_id, title, description, deadline, max_attempts, status)
             SELECT $1, 'Design Reflection', 'Submit a 500-word reflection on user research and design choices. Address the following: (1) What research methods did you use and why? (2) What user needs did you identify? (3) How did user feedback influence your design decisions? (4) What prototype iterations did you create and what did you learn from testing? Support your answers with specific examples from your research data. Focus on evidence-based reasoning rather than personal opinions.', NOW() + INTERVAL '7 days', 2, 'Published'
             WHERE NOT EXISTS (
                 SELECT 1 FROM assignments WHERE course_id = $1 AND title = 'Design Reflection' LIMIT 1
             );`,
            [courseOneId],
        );

        const learnerId = await query('SELECT id FROM app_users WHERE email = $1', ['alice@lms.test']);
        if (learnerId.rows[0]) {
            await query(
                `INSERT INTO enrollments (user_id, course_id, status)
                 VALUES ($1, $2, 'Active')
                 ON CONFLICT (user_id, course_id) DO UPDATE SET status = EXCLUDED.status;`,
                [learnerId.rows[0].id, courseOneId],
            );
        }
    }
}

export async function testDatabase() {
    const result = await query('SELECT NOW() AS now;');
    return result.rows[0];
}

export { pool };
