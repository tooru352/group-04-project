import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initializeDatabase, query, testDatabase } from './db.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

const ADMIN_ROLE_VALUES = new Set(['learner', 'instructor', 'reviewer', 'admin']);

const normalizeRoleInput = (value) => {
    const text = String(value ?? '').trim();
    if (!text) return null;

    const map = {
        learner: 'Learner',
        instructor: 'Instructor',
        reviewer: 'Reviewer',
        admin: 'Admin',
    };

    return map[String(text).trim().toLowerCase()] || null;
};

const hasMeaningfulText = (value) => {
    if (value === undefined || value === null) return false;
    return String(value).trim().length > 0;
};

function requireAdmin(req, res, next) {
    const headerRole = String(req.headers['x-user-role'] || '').trim();
    const bodyRole = String(req.body?.role || req.body?.actorRole || '').trim();
    const queryRole = String(req.query?.role || '').trim();
    const role = normalizeRoleInput(headerRole || bodyRole || queryRole);

    if (!role || role !== 'Admin') {
        return res.status(403).json({ ok: false, message: 'Admin access required.' });
    }

    return next();
}

// FIX BUG-02: Enforced requireRole('Instructor', 'Admin') middleware on all instructor REST endpoints (Do Thi Kim Yen)
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        const headerRole = String(req.headers['x-user-role'] || '').trim();
        const bodyRole = String(req.body?.role || req.body?.actorRole || '').trim();
        const queryRole = String(req.query?.role || '').trim();
        const role = normalizeRoleInput(headerRole || bodyRole || queryRole);

        if (!role || !allowedRoles.includes(role)) {
            return res.status(403).json({
                ok: false,
                message: `Access denied. Protected endpoint requires role: ${allowedRoles.join(' or ')}.`,
            });
        }

        req.userRole = role;
        return next();
    };
}

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
    try {
        const now = await testDatabase();
        res.json({ ok: true, db: 'connected', time: now.now });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body || {};

    if (!hasMeaningfulText(email) || !hasMeaningfulText(password)) {
        return res.status(400).json({ ok: false, message: 'Email and password are required.' });
    }

    try {
        const result = await query(
            'SELECT id, email, role, name FROM app_users WHERE email = $1 AND password = $2 LIMIT 1;',
            [String(email).trim().toLowerCase(), String(password)],
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ ok: false, message: 'Invalid credentials.' });
        }

        const user = result.rows[0];
        const session = {
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        return res.json({ ok: true, session });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/users', async (_req, res) => {
    try {
        const result = await query('SELECT id, email, role, name, created_at FROM app_users ORDER BY id;');
        res.json({ ok: true, users: result.rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/courses', async (_req, res) => {
    try {
        const result = await query(`
            SELECT c.id, c.code, c.title, c.description, c.category, c.status, u.name AS instructor_name
            FROM courses c
            LEFT JOIN app_users u ON u.id = c.instructor_id
            ORDER BY c.id;
        `);

        res.json({ ok: true, courses: result.rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/courses/:courseId/lessons', async (req, res) => {
    try {
        const { courseId } = req.params;
        const result = await query(
            `SELECT id, course_id, title, content, duration, is_required, sort_order, status
             FROM lessons
             WHERE course_id = $1
             ORDER BY sort_order, id;`,
            [courseId],
        );
        res.json({ ok: true, lessons: result.rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.post('/api/lessons/:lessonId/complete', async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { userId } = req.body || {};
        if (!userId) {
            return res.status(400).json({ ok: false, message: 'userId is required.' });
        }
        await query(
            `INSERT INTO lesson_completions (user_id, lesson_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, lesson_id) DO NOTHING;`,
            [userId, lessonId],
        );
        res.json({ ok: true, message: 'Lesson marked as completed.' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/learners/:learnerId/completions', async (req, res) => {
    try {
        const { learnerId } = req.params;
        const result = await query(
            `SELECT lesson_id, completed_at FROM lesson_completions WHERE user_id = $1;`,
            [learnerId],
        );
        res.json({ ok: true, completions: result.rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/learners/:learnerId/enrollments', async (req, res) => {
    try {
        const { learnerId } = req.params;
        const result = await query(
            `SELECT e.id, e.course_id, c.code, c.title, c.description, c.category, e.status, e.enrolled_at
             FROM enrollments e
             JOIN courses c ON c.id = e.course_id
             WHERE e.user_id = $1;`,
            [learnerId],
        );
        res.json({ ok: true, enrollments: result.rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/learners/:learnerId/submissions', async (req, res) => {
    try {
        const { learnerId } = req.params;
        const result = await query(
            `SELECT s.id, s.assignment_id, a.title AS assignment_title, a.course_id, c.title AS course_title,
                    s.learner_id, s.answer, s.status, s.submitted_at, s.is_late, s.grade, s.feedback,
                    u.name AS reviewer_name
             FROM submissions s
             JOIN assignments a ON a.id = s.assignment_id
             JOIN courses c ON c.id = a.course_id
             LEFT JOIN app_users u ON u.id = s.reviewer_id
             WHERE s.learner_id = $1
             ORDER BY s.submitted_at DESC, s.id DESC;`,
            [learnerId],
        );
        res.json({ ok: true, submissions: result.rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/courses/:courseId/enrollments', async (req, res) => {
    try {
        const { courseId } = req.params;
        const result = await query(
            `SELECT e.id, e.user_id, u.name, u.email, e.status, e.enrolled_at
             FROM enrollments e
             JOIN app_users u ON u.id = e.user_id
             WHERE e.course_id = $1
             ORDER BY e.enrolled_at DESC;`,
            [courseId],
        );

        res.json({ ok: true, enrollments: result.rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.post('/api/enrollments', async (req, res) => {
    const { userId, courseId } = req.body || {};

    if (!userId || !courseId) {
        return res.status(400).json({ ok: false, message: 'userId and courseId are required.' });
    }

    try {
        const existing = await query(
            'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2 LIMIT 1;',
            [userId, courseId],
        );

        if (existing.rowCount > 0) {
            return res.status(409).json({ ok: false, message: 'User is already enrolled in this course.' });
        }

        const inserted = await query(
            'INSERT INTO enrollments (user_id, course_id, status) VALUES ($1, $2, $3) RETURNING *;',
            [userId, courseId, 'Active'],
        );

        return res.status(201).json({ ok: true, enrollment: inserted.rows[0] });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/assignments', async (_req, res) => {
    try {
        const result = await query(`
            SELECT a.id, a.course_id, c.title AS course_title, a.title, a.description, a.deadline, a.max_attempts, a.status
            FROM assignments a
            JOIN courses c ON c.id = a.course_id
            ORDER BY a.deadline ASC;
        `);

        res.json({ ok: true, assignments: result.rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/admin/users', requireAdmin, async (_req, res) => {
    try {
        const result = await query('SELECT id, email, role, name, created_at FROM app_users ORDER BY id;');
        res.json({
            ok: true,
            users: result.rows.map((user) => ({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                createdAt: user.created_at,
            })),
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.patch('/api/admin/users/:id/role', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body || {};
        const nextRole = normalizeRoleInput(role);
        const actorId = String(req.headers['x-user-id'] || req.body?.actorId || '');

        if (!nextRole) {
            return res.status(422).json({ ok: false, message: 'Invalid role value.' });
        }

        const current = await query('SELECT id, email, role, name FROM app_users WHERE id = $1 LIMIT 1;', [id]);
        if (current.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'User not found.' });
        }

        const target = current.rows[0];
        const adminCount = await query("SELECT COUNT(*)::int AS total FROM app_users WHERE role = 'Admin';");
        const isSelfDemotion = actorId && Number(actorId) === Number(id) && target.role === 'Admin' && nextRole !== 'Admin';

        if (isSelfDemotion && adminCount.rows[0].total <= 1) {
            return res.status(422).json({ ok: false, message: 'Cannot remove the last admin.' });
        }

        const updated = await query(
            'UPDATE app_users SET role = $1 WHERE id = $2 RETURNING id, email, role, name, created_at;',
            [nextRole, id],
        );

        const record = updated.rows[0];

        await query(
            `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata)
             VALUES ($1, $2, $3, $4, $5);`,
            [actorId || null, 'role_update', 'user', String(id), JSON.stringify({ oldRole: target.role, newRole: nextRole, updatedAt: new Date().toISOString() })],
        );

        return res.json({
            ok: true,
            user: {
                id: record.id,
                email: record.email,
                role: record.role,
                name: record.name,
                createdAt: record.created_at,
            },
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});

app.post('/api/admin/users', requireAdmin, async (req, res) => {
    try {
        const { email, password, name, role } = req.body || {};
        if (!hasMeaningfulText(email) || !hasMeaningfulText(password) || !hasMeaningfulText(name)) {
            return res.status(400).json({ ok: false, message: 'Email, password, and name are required.' });
        }

        const validRole = normalizeRoleInput(role) || 'Learner';
        const actorId = String(req.headers['x-user-id'] || req.body?.actorId || '');

        const existing = await query('SELECT id FROM app_users WHERE email = $1 LIMIT 1;', [String(email).trim().toLowerCase()]);
        if (existing.rowCount > 0) {
            return res.status(409).json({ ok: false, message: 'User with this email already exists.' });
        }

        const result = await query(
            `INSERT INTO app_users (email, password, name, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, email, role, name, created_at;`,
            [String(email).trim().toLowerCase(), String(password), String(name).trim(), validRole]
        );

        const newUser = result.rows[0];

        await query(
            `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata)
             VALUES ($1, $2, $3, $4, $5);`,
            [actorId || null, 'create_user', 'user', String(newUser.id), JSON.stringify({ email: newUser.email, role: newUser.role })]
        );

        res.status(201).json({ ok: true, user: newUser });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.delete('/api/admin/users/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const actorId = String(req.headers['x-user-id'] || req.body?.actorId || '');

        const targetRes = await query('SELECT id, email, role FROM app_users WHERE id = $1 LIMIT 1;', [id]);
        if (targetRes.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'User not found.' });
        }

        const target = targetRes.rows[0];
        if (target.role === 'Admin') {
            const adminCount = await query("SELECT COUNT(*)::int AS total FROM app_users WHERE role = 'Admin';");
            if (adminCount.rows[0].total <= 1) {
                return res.status(422).json({ ok: false, message: 'Cannot delete the last admin.' });
            }
        }

        await query('DELETE FROM app_users WHERE id = $1;', [id]);

        await query(
            `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata)
             VALUES ($1, $2, $3, $4, $5);`,
            [actorId || null, 'delete_user', 'user', String(id), JSON.stringify({ email: target.email, role: target.role })]
        );

        res.json({ ok: true, message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/admin/courses', requireAdmin, async (_req, res) => {
    try {
        const result = await query(`
            SELECT c.id, c.code, c.title, c.description, c.category, c.status, c.instructor_id, u.name AS instructor_name
            FROM courses c
            LEFT JOIN app_users u ON u.id = c.instructor_id
            ORDER BY c.id;
        `);

        res.json({
            ok: true,
            courses: result.rows.map((course) => ({
                id: course.id,
                code: course.code,
                title: course.title,
                description: course.description,
                category: course.category,
                status: course.status,
                instructorId: course.instructor_id,
                instructorName: course.instructor_name,
            })),
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.patch('/api/admin/courses/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, status } = req.body || {};
        const actorId = String(req.headers['x-user-id'] || req.body?.actorId || '');

        const currentCourse = await query('SELECT id, title, category, status FROM courses WHERE id = $1 LIMIT 1;', [id]);
        if (currentCourse.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'Course not found.' });
        }

        const nextTitle = typeof title === 'string' ? title.trim() : undefined;
        const nextCategory = typeof category === 'string' ? category.trim() : undefined;
        const nextStatus = typeof status === 'string' ? status.trim() : undefined;

        if (nextTitle !== undefined && nextTitle.length === 0) {
            return res.status(422).json({ ok: false, message: 'Course title cannot be empty.' });
        }

        if (nextCategory !== undefined && nextCategory.length === 0) {
            return res.status(422).json({ ok: false, message: 'Course category cannot be empty.' });
        }

        if (nextStatus && !['Draft', 'Published', 'Archived'].includes(nextStatus)) {
            return res.status(422).json({ ok: false, message: 'Invalid course status.' });
        }

        if (nextStatus === 'Archived') {
            const activeEnrollment = await query(
                "SELECT COUNT(*)::int AS total FROM enrollments WHERE course_id = $1 AND status = 'Active';",
                [id],
            );

            if (activeEnrollment.rows[0].total > 0) {
                return res.status(409).json({ ok: false, message: 'Cannot archive a course with active enrollments.' });
            }
        }

        const updated = await query(
            `UPDATE courses
             SET title = COALESCE($1, title), category = COALESCE($2, category), status = COALESCE($3, status), updated_at = NOW()
             WHERE id = $4
             RETURNING id, code, title, description, category, status, instructor_id, created_at, updated_at;`,
            [nextTitle ?? null, nextCategory ?? null, nextStatus ?? null, id],
        );

        const record = updated.rows[0];

        await query(
            `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata)
             VALUES ($1, $2, $3, $4, $5);`,
            [actorId || null, 'course_update', 'course', String(id), JSON.stringify({
                oldStatus: currentCourse.rows[0].status,
                newStatus: record.status,
                updatedAt: new Date().toISOString(),
            })],
        );

        return res.json({
            ok: true,
            course: {
                id: record.id,
                code: record.code,
                title: record.title,
                description: record.description,
                category: record.category,
                status: record.status,
                instructorId: record.instructor_id,
                createdAt: record.created_at,
                updatedAt: record.updated_at,
            },
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/admin/audit', requireAdmin, async (_req, res) => {
    try {
        const result = await query(
            `SELECT id, actor_id, action, target_type, target_id, metadata, created_at
             FROM audit_logs
             ORDER BY created_at DESC
             LIMIT 50;`,
        );

        res.json({
            ok: true,
            audit: result.rows.map((item) => ({
                id: item.id,
                actorId: item.actor_id,
                action: item.action,
                targetType: item.target_type,
                targetId: item.target_id,
                metadata: item.metadata,
                createdAt: item.created_at,
            })),
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

function buildTutorReply(question, context = {}) {
    const text = String(question || '').trim();
    const lower = text.toLowerCase();

    const courseText = context.courseTitle ? ` for ${context.courseTitle}` : '';

    if (!text) {
        return 'Please enter a question so I can help you.';
    }

    if (lower.includes('assignment') || lower.includes('submit') || lower.includes('deadline')) {
        return `For this assignment${courseText}, focus on the brief first, then break the task into 3 parts: understanding the requirement, drafting your answer, and checking the deadline and submission format before sending it. If you are unsure, I can help you outline the response step by step.`;
    }

    if (lower.includes('course') || lower.includes('lesson') || lower.includes('module')) {
        return `The best approach${courseText} is to review the key concept, identify the learning objective, and summarize it in your own words. Try to explain the concept in 3 bullet points: what it is, why it matters, and how it applies to the activity.`;
    }

    if (lower.includes('grade') || lower.includes('score') || lower.includes('progress')) {
        return `To improve your grade, prioritize the rubric criteria, check the parts with the lowest score, and revise the strongest examples. Keep the answer specific, evidence-based, and tied back to the assignment requirements.`;
    }

    return `Here is a practical answer for your question: start by identifying the main objective, then use the course concepts to support your explanation with examples. I can also help you turn this into a short answer, a study note, or a step-by-step plan if you want.`;
}

function getTutorIntention(question = '') {
    const value = String(question).toLowerCase();

    if (value.includes('example') || value.includes('for example') || value.includes('illustrate')) {
        return 'example';
    }

    if (value.includes('explain') || value.includes('why') || value.includes('what is') || value.includes('how does')) {
        return 'explain';
    }

    return 'explain';
}

function getGroundedTutorAnswer(question, lessonContext = '') {
    const normalizedQuestion = String(question || '').trim();
    const normalizedContext = String(lessonContext || '').toLowerCase();
    const normalizedPrompt = normalizedQuestion.toLowerCase();

    const relevantKeywords = [
        'empathy',
        'user need',
        'journey mapping',
        'prototype',
        'prototyping',
        'insight',
        'research',
        'design thinking',
        'design system',
        'component',
        'wireframe',
        'sketch',
        'figma',
        'atomic design',
        'systems',
        'feedback loop',
        'decision',
        'data',
        'metrics',
        'lesson',
        'course',
        'assignment',
        'interview',
        'observation',
        'user',
        'accessibility',
    ];

    if (!normalizedQuestion) {
        return { answer: 'Please enter a question so I can help you.', status: 'invalid_input', references: [] };
    }

    if (!normalizedQuestion) {
        return { answer: 'Please enter a question so I can help you.', status: 'invalid_input', references: [] };
    }

    // If lesson has meaningful content, accept the question
    // Only reject if lesson content is too short (likely fallback/empty)
    if (lessonContext.length < 50) {
        return { 
            answer: 'KHÔNG ĐỦ DỮ LIỆU: Bài học chưa có nội dung đầy đủ.', 
            status: 'insufficient_context', 
            references: [] 
        };
    }

    // Check for completely off-topic questions (e.g., weather, sports, politics)
    const offTopicKeywords = ['weather', 'thời tiết', 'football', 'bóng đá', 'politics', 'chính trị', 'stock', 'cổ phiếu'];
    const isOffTopic = offTopicKeywords.some((keyword) => normalizedPrompt.includes(keyword));
    
    if (isOffTopic) {
        return { 
            answer: 'KHÔNG ĐỦ DỮ LIỆU: Câu hỏi không nằm trong phạm vi bài học hoặc môn học hiện tại.', 
            status: 'insufficient_context', 
            references: [] 
        };
    }

    const intention = getTutorIntention(normalizedQuestion);
    
    // Get more context from lesson
    const fullSnippet = lessonContext.length > 500 ? lessonContext.slice(0, 500) : lessonContext;
    const shortSnippet = lessonContext.length > 150 ? lessonContext.slice(0, 150) : lessonContext;

    let answer = '';
    
    if (intention === 'example') {
        // Generate concrete examples based on lesson content
        if (normalizedContext.includes('prototype') || normalizedContext.includes('prototyping')) {
            answer = `Ví dụ cụ thể về prototyping từ bài học:\n\n• Paper prototypes (vẽ tay trên giấy): Test ý tưởng nhanh trong 5-10 phút, phù hợp cho brainstorming ban đầu\n• Wireframes trong Figma: Prototype trung bình để thể hiện layout và structure, giúp team align về UI\n• Interactive HTML mockups: High-fidelity prototype để test với người dùng thật, đo lường behavior thực tế\n\nMỗi loại prototype phục vụ mục đích khác nhau và được dùng ở các giai đoạn khác nhau của design process.`;
        } else if (normalizedContext.includes('research') || normalizedContext.includes('interview')) {
            answer = `Ví dụ cụ thể về user research methods:\n\n1. Interviews: Hỏi "Kể về lần gần nhất bạn gặp vấn đề với [sản phẩm]?" thay vì "Bạn có thích sản phẩm không?" (open-ended question)\n\n2. Empathy Map: Tổng hợp dữ liệu theo 4 quadrants\n   • Says: "Tôi muốn tìm nhanh"\n   • Thinks: "App này chậm quá"\n   • Does: Scroll liên tục, click nhiều nút\n   • Feels: Frustrated, mất kiên nhẫn\n\n3. Journey Map: Map từng bước user thực hiện, identify pain points (e.g., "Bước 3: Login - User phải nhập quá nhiều thông tin → Frustration level cao")`;
        } else if (normalizedContext.includes('design system') || normalizedContext.includes('component')) {
            answer = `Ví dụ về design system:\n\n• Component: Button với variants\n  - Primary: bg-blue, text-white (CTA chính)\n  - Secondary: border-blue, text-blue (action phụ)\n  - Disabled: bg-gray, không clickable\n\n• Design Tokens:\n  - color-primary: #2563eb\n  - spacing-base: 8px (4, 8, 16, 24, 32...)\n  - font-size-body: 16px\n\n• Guidelines: "Dùng Primary button cho 1 CTA chính mỗi screen, Secondary cho các actions khác"\n\nVí dụ thực tế: Material Design (Google), Human Interface Guidelines (Apple)`;
        } else {
            answer = `Ví dụ áp dụng từ bài học:\n\n${fullSnippet}\n\n➡️ Cách áp dụng vào thực tế:\n1. Bắt đầu với user research để identify real needs\n2. Synthesize insights thành pain points cụ thể\n3. Tạo prototype để test giả thuyết\n4. Iterate dựa trên feedback từ user testing\n\nKey principle: Base decisions on evidence, not assumptions.`;
        }
    } else {
        // Explain mode - extract key concepts and explain them
        answer = `${fullSnippet}\n\n`;
        
        if (normalizedContext.includes('research') && normalizedContext.includes('interview')) {
            answer += `\n📌 Trọng tâm: Phương pháp nghiên cứu người dùng\n• Qualitative methods: Interviews, observations, contextual inquiry\n• Tools: Empathy mapping, journey mapping\n• Principle: Grounded in real user data, không dựa vào assumptions\n• Goal: Identify pain points và user needs thực tế`;
        } else if (normalizedContext.includes('prototype') && (normalizedContext.includes('low-fidelity') || normalizedContext.includes('high-fidelity'))) {
            answer += `\n📌 Trọng tâm: Prototyping strategies\n• Low-fidelity: Sketching, paper prototypes → Nhanh, phù hợp early stage\n• High-fidelity: Figma, interactive prototypes → Chi tiết, phù hợp user testing\n• Testing approach: Test specific hypotheses, fail fast, iterate\n• Tools mentioned: Figma, paper, HTML mockups`;
        } else if (normalizedContext.includes('design system') || normalizedContext.includes('atomic')) {
            answer += `\n📌 Trọng tâm: Design system principles\n• Component libraries: Reusable UI elements\n• Design tokens: Variables cho colors, spacing, typography\n• Atomic design: Methodology để build scalable systems\n• Benefits: Consistency, reduced decision fatigue, improved team velocity`;
        } else {
            answer += `\n📌 Trọng tâm:\n• Design thinking và user-centered approach\n• Evidence-based decision making\n• Iteration và continuous improvement\n• Empathy với người dùng`;
        }
    }

    return {
        answer,
        status: 'success',
        references: [{ lessonId: 'lesson-1', snippet: shortSnippet }],
    };
}

app.post('/api/tutor/ask', async (req, res) => {
    try {
        const { question, lessonId, learnerId, sessionId, intent } = req.body || {};

        if (!question || String(question).trim().length === 0) {
            return res.status(400).json({ ok: false, message: 'Question is required.', status: 'invalid_input' });
        }

        const normalizedQuestion = String(question).trim();
        const normalizedLessonInput = String(lessonId || 'lesson-1').trim();
        const numericLessonId = Number.parseInt(
            normalizedLessonInput.startsWith('lesson-') ? normalizedLessonInput.replace(/^lesson-/, '') : normalizedLessonInput,
            10,
        );
        const requestedLessonId = Number.isFinite(numericLessonId) ? numericLessonId : 1;
        const requestedLearnerId = learnerId || sessionId || 'learner-1';

        if (!requestedLearnerId) {
            return res.status(401).json({ ok: false, message: 'Unauthorized', status: 'unauthorized' });
        }

        const lessonResult = await query(
            'SELECT id, title, content, course_id FROM lessons WHERE id = $1 LIMIT 1;',
            [requestedLessonId],
        );

        const lesson = lessonResult.rows[0] || (await query('SELECT id, title, content, course_id FROM lessons ORDER BY id LIMIT 1;')).rows[0];
        const contextText = lesson?.content || 'Empathy and user needs are central to design decisions. Journey mapping connects user pain points to actions and prototypes.';
        
        // Try OpenAI first if API key exists - OpenAI will handle all questions
        if (process.env.OPENAI_API_KEY) {
            try {
                const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: `You are an AI tutor for a Human-Centered Design course. Answer based ONLY on this lesson content:\n\n${contextText}\n\nProvide detailed, helpful answers in Vietnamese. If the question is completely unrelated to design, learning, or education, respond with: "KHÔNG ĐỦ DỮ LIỆU: Câu hỏi không nằm trong phạm vi bài học."`
                            },
                            { 
                                role: 'user', 
                                content: intent === 'example' ? `${normalizedQuestion}. Hãy cho ví dụ cụ thể và chi tiết.` : normalizedQuestion 
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 600,
                    }),
                });

                if (aiResponse.ok) {
                    const data = await aiResponse.json();
                    const answer = data.choices?.[0]?.message?.content?.trim();

                    if (answer) {
                        return res.json({
                            ok: true,
                            answer,
                            source: 'openai',
                            status: 'success',
                            references: [{ lessonId: requestedLessonId, snippet: contextText.slice(0, 200) }],
                            lessonId: requestedLessonId,
                            intent: intent || getTutorIntention(normalizedQuestion),
                            sessionId: sessionId || requestedLearnerId,
                        });
                    }
                } else {
                    const errorData = await aiResponse.json();
                    console.error('OpenAI API error:', errorData);
                }
            } catch (openaiError) {
                console.error('OpenAI error, falling back to local:', openaiError.message);
                // Fall through to local tutor
            }
        }
        
        // Fallback to local grounded tutor if OpenAI not available
        const groundedResult = getGroundedTutorAnswer(normalizedQuestion, contextText);

        if (groundedResult.status !== 'success') {
            return res.json({
                ok: true,
                answer: groundedResult.answer,
                references: groundedResult.references,
                status: groundedResult.status,
                lessonId: requestedLessonId,
                intent: intent || getTutorIntention(normalizedQuestion),
            });
        }

        return res.json({
            ok: true,
            answer: groundedResult.answer,
            references: groundedResult.references,
            status: 'success',
            lessonId: requestedLessonId,
            intent: intent || getTutorIntention(normalizedQuestion),
            sessionId: sessionId || requestedLearnerId,
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message || 'AI tutor failed.', status: 'internal_error' });
    }
});

app.post('/api/ai/chat', async (req, res) => {
    try {
        const { question, lessonId, learnerId, sessionId, intent } = req.body || {};

        const normalizedQuestion = String(question || '').trim();
        if (!normalizedQuestion) {
            return res.status(400).json({ ok: false, message: 'Question is required.' });
        }

        if (process.env.OPENAI_API_KEY) {
            const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful learning tutor for an LMS. Give clear, actionable guidance for students grounded in the available lesson content only.'
                        },
                        { role: 'user', content: normalizedQuestion }
                    ],
                    temperature: 0.6,
                }),
            });

            if (aiResponse.ok) {
                const data = await aiResponse.json();
                const answer = data.choices?.[0]?.message?.content?.trim();

                if (answer) {
                    return res.json({
                        ok: true,
                        answer,
                        source: 'openai',
                        status: 'success',
                        references: [],
                        context: { lessonId, learnerId, sessionId, intent },
                    });
                }
            }
        }

        const result = await app._router?._stack ? null : null;
        const fallback = getGroundedTutorAnswer(normalizedQuestion, 'Empathy and user needs are central to design decisions. Journey mapping connects user pain points to actions and prototypes.');

        return res.json({
            ok: true,
            answer: fallback.answer,
            status: fallback.status,
            references: fallback.references,
            source: 'local-tutor',
            context: { lessonId, learnerId, sessionId, intent },
        });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message || 'AI tutor failed.' });
    }
});

app.post('/api/submissions', async (req, res) => {
    const { assignmentId, learnerId, answer } = req.body || {};

    if (!assignmentId || !learnerId || !answer || String(answer).trim().length === 0) {
        return res.status(400).json({ ok: false, message: 'assignmentId, learnerId, and answer are required.' });
    }

    try {
        const assignment = await query('SELECT id, deadline FROM assignments WHERE id = $1', [assignmentId]);
        if (assignment.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'Assignment not found.' });
        }

        const deadline = assignment.rows[0].deadline;
        const isLate = deadline && new Date() > new Date(deadline);

        const result = await query(
            `INSERT INTO submissions (assignment_id, learner_id, answer, status, submitted_at, is_late)
             VALUES ($1, $2, $3, 'Submitted', NOW(), $4)
             RETURNING *;`,
            [assignmentId, learnerId, answer, isLate],
        );

        res.status(201).json({ ok: true, submission: result.rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/instructor/submissions', requireRole('Instructor', 'Admin'), async (_req, res) => {
    try {
        const result = await query(`
            SELECT s.id, s.assignment_id, a.title AS assignment_title, a.course_id, c.title AS course_title,
                   s.learner_id, u.name AS learner_name, u.email AS learner_email,
                   s.answer, s.status, s.submitted_at, s.is_late, s.grade, s.feedback,
                   s.reviewer_id, r.name AS reviewer_name
            FROM submissions s
            JOIN assignments a ON a.id = s.assignment_id
            JOIN courses c ON c.id = a.course_id
            JOIN app_users u ON u.id = s.learner_id
            LEFT JOIN app_users r ON r.id = s.reviewer_id
            ORDER BY s.submitted_at DESC, s.id DESC;
        `);

        res.json({ ok: true, submissions: result.rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/reviewer/submissions', requireRole('Reviewer', 'Instructor', 'Admin'), async (req, res) => {
    try {
        const reviewerId = req.query.reviewerId ? Number(req.query.reviewerId) : null;
        let queryStr = `
            SELECT s.id, s.assignment_id, a.title AS assignment_title, a.course_id, c.title AS course_title,
                   s.learner_id, u.name AS learner_name, u.email AS learner_email,
                   s.answer, s.status, s.submitted_at, s.is_late, s.grade, s.feedback,
                   s.reviewer_id, r.name AS reviewer_name
            FROM submissions s
            JOIN assignments a ON a.id = s.assignment_id
            JOIN courses c ON c.id = a.course_id
            JOIN app_users u ON u.id = s.learner_id
            LEFT JOIN app_users r ON r.id = s.reviewer_id
        `;
        const params = [];
        if (reviewerId) {
            queryStr += ` WHERE s.reviewer_id = $1 OR s.reviewer_id IS NULL`;
            params.push(reviewerId);
        }
        queryStr += ` ORDER BY s.submitted_at DESC, s.id DESC;`;

        const result = await query(queryStr, params);
        res.json({ ok: true, submissions: result.rows });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.patch('/api/submissions/:id/grade', requireRole('Reviewer', 'Instructor', 'Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { grade, feedback, status, reviewerId } = req.body || {};

        if (grade === undefined || grade === null) {
            return res.status(400).json({ ok: false, message: 'Grade score is required.' });
        }

        const numGrade = Number(grade);
        if (Number.isNaN(numGrade) || numGrade < 0 || numGrade > 100) {
            return res.status(422).json({ ok: false, message: 'Grade must be between 0 and 100.' });
        }

        const trimmedFeedback = typeof feedback === 'string' ? feedback.trim() : '';
        if (!hasMeaningfulText(trimmedFeedback)) {
            return res.status(400).json({ ok: false, message: 'Feedback is required.' });
        }

        const nextStatus = status && ['Passed', 'Needs Revision', 'Rejected'].includes(status) ? status : (numGrade >= 70 ? 'Passed' : 'Needs Revision');

        const updated = await query(
            `UPDATE submissions
             SET grade = $1, feedback = $2, status = $3, reviewer_id = COALESCE($4, reviewer_id), updated_at = NOW()
             WHERE id = $5
             RETURNING *;`,
            [numGrade, trimmedFeedback, nextStatus, reviewerId || null, id]
        );

        if (updated.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'Submission not found.' });
        }

        await query(
            `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata)
             VALUES ($1, $2, $3, $4, $5);`,
            [reviewerId || null, 'grade_submission', 'submission', String(id), JSON.stringify({ grade: numGrade, status: nextStatus })]
        );

        res.json({ ok: true, submission: updated.rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.post('/api/submissions/:id/assign-reviewer', requireRole('Instructor', 'Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewerId } = req.body || {};

        if (!reviewerId) {
            return res.status(400).json({ ok: false, message: 'reviewerId is required.' });
        }

        const updated = await query(
            `UPDATE submissions SET reviewer_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *;`,
            [reviewerId, id]
        );

        if (updated.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'Submission not found.' });
        }

        res.json({ ok: true, submission: updated.rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.post('/api/instructor/courses', requireRole('Instructor', 'Admin'), async (req, res) => {
    try {
        const { code, title, description, category, instructorId } = req.body || {};
        if (!code || !title) {
            return res.status(400).json({ ok: false, message: 'Code and title are required.' });
        }

        const validInstructorId = Number.parseInt(String(instructorId || '2').replace(/\D/g, ''), 10) || 2;

        const result = await query(
            `INSERT INTO courses (code, title, description, category, status, instructor_id)
             VALUES ($1, $2, $3, $4, 'Published', $5)
             RETURNING *;`,
            [String(code).trim().toUpperCase(), String(title).trim(), String(description || '').trim(), String(category || 'General').trim(), validInstructorId]
        );

        res.status(201).json({ ok: true, course: result.rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.patch('/api/instructor/courses/:id', requireRole('Instructor', 'Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { code, title, description, category } = req.body || {};

        const updated = await query(
            `UPDATE courses
             SET code = COALESCE($1, code),
                 title = COALESCE($2, title),
                 description = COALESCE($3, description),
                 category = COALESCE($4, category),
                 updated_at = NOW()
             WHERE id = $5
             RETURNING *;`,
            [
                code !== undefined ? String(code).trim().toUpperCase() : null,
                title !== undefined ? String(title).trim() : null,
                description !== undefined ? String(description).trim() : null,
                category !== undefined ? String(category).trim() : null,
                id,
            ]
        );

        if (updated.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'Course not found.' });
        }

        res.json({ ok: true, course: updated.rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.post('/api/instructor/lessons', requireRole('Instructor', 'Admin'), async (req, res) => {
    try {
        const { courseId, title, content, duration, isRequired } = req.body || {};
        const validTitle = typeof title === 'string' ? title.trim() : '';
        const validContent = typeof content === 'string' ? content.trim() : '';

        if (!courseId || !hasMeaningfulText(validTitle) || !hasMeaningfulText(validContent)) {
            return res.status(400).json({ ok: false, message: 'courseId, title, and content are required.' });
        }

        const validCourseId = Number.parseInt(String(courseId).replace(/\D/g, ''), 10) || Number(courseId) || 1;

        const orderRes = await query(
            'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM lessons WHERE course_id = $1;',
            [validCourseId]
        );
        const nextOrder = Number(orderRes.rows[0]?.next_order || 1);

        const result = await query(
            `INSERT INTO lessons (course_id, title, content, duration, is_required, sort_order, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'Published')
             RETURNING *;`,
            [validCourseId, validTitle, validContent, Number(duration || 20), isRequired !== false, nextOrder]
        );

        res.status(201).json({ ok: true, lesson: result.rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.post('/api/instructor/assignments', requireRole('Instructor', 'Admin'), async (req, res) => {
    try {
        const { courseId, title, description, deadline, maxAttempts } = req.body || {};
        const validTitle = typeof title === 'string' ? title.trim() : '';
        const validDescription = typeof description === 'string' ? description.trim() : '';

        if (!courseId || !hasMeaningfulText(validTitle) || !hasMeaningfulText(validDescription)) {
            return res.status(400).json({ ok: false, message: 'courseId, title, and description are required.' });
        }

        const validCourseId = Number.parseInt(String(courseId).replace(/\D/g, ''), 10) || Number(courseId) || 1;

        const result = await query(
            `INSERT INTO assignments (course_id, title, description, deadline, max_attempts, status)
             VALUES ($1, $2, $3, $4, $5, 'Published')
             RETURNING *;`,
            [validCourseId, validTitle, validDescription, deadline ? new Date(deadline) : null, Number(maxAttempts || 1)]
        );

        res.status(201).json({ ok: true, assignment: result.rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.patch('/api/instructor/lessons/:id', requireRole('Instructor', 'Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, duration, isRequired } = req.body || {};

        const updated = await query(
            `UPDATE lessons
             SET title = COALESCE($1, title),
                 content = COALESCE($2, content),
                 duration = COALESCE($3, duration),
                 is_required = COALESCE($4, is_required)
             WHERE id = $5
             RETURNING *;`,
            [
                title !== undefined ? String(title).trim() : null,
                content !== undefined ? String(content).trim() : null,
                duration !== undefined ? Number(duration) : null,
                isRequired !== undefined ? Boolean(isRequired) : null,
                id,
            ]
        );

        if (updated.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'Lesson not found.' });
        }

        res.json({ ok: true, lesson: updated.rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.delete('/api/instructor/lessons/:id', requireRole('Instructor', 'Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM lessons WHERE id = $1 RETURNING *;', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'Lesson not found.' });
        }
        res.json({ ok: true, message: 'Lesson deleted successfully.' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.patch('/api/instructor/assignments/:id', requireRole('Instructor', 'Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, deadline, maxAttempts } = req.body || {};

        const updated = await query(
            `UPDATE assignments
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 deadline = COALESCE($3, deadline),
                 max_attempts = COALESCE($4, max_attempts)
             WHERE id = $5
             RETURNING *;`,
            [
                title !== undefined ? String(title).trim() : null,
                description !== undefined ? String(description).trim() : null,
                deadline ? new Date(deadline) : null,
                maxAttempts !== undefined ? Number(maxAttempts) : null,
                id,
            ]
        );

        if (updated.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'Assignment not found.' });
        }

        res.json({ ok: true, assignment: updated.rows[0] });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.delete('/api/instructor/assignments/:id', requireRole('Instructor', 'Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM assignments WHERE id = $1 RETURNING *;', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'Assignment not found.' });
        }
        res.json({ ok: true, message: 'Assignment deleted successfully.' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.delete('/api/instructor/courses/:id', requireRole('Instructor', 'Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM courses WHERE id = $1 RETURNING *;', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ ok: false, message: 'Course not found.' });
        }
        res.json({ ok: true, message: 'Course deleted successfully.' });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.listen(port, async () => {
    try {
        await initializeDatabase();
        console.log(`API server running on http://localhost:${port}`);
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
    }
});
