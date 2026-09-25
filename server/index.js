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

    if (!email || !password) {
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
        'insight',
        'research',
        'design thinking',
        'systems',
        'feedback loop',
        'decision',
        'data',
        'metrics',
    ];

    const hasRelevantContext = relevantKeywords.some((keyword) => normalizedContext.includes(keyword) || normalizedPrompt.includes(keyword));

    if (!normalizedQuestion) {
        return { answer: 'Please enter a question so I can help you.', status: 'invalid_input', references: [] };
    }

    if (!hasRelevantContext) {
        return { answer: 'KHÔNG ĐỦ DỮ LIỆU', status: 'insufficient_context', references: [] };
    }

    const intention = getTutorIntention(normalizedQuestion);
    const snippet = lessonContext.length > 200 ? lessonContext.slice(0, 200) : lessonContext;

    const answerMap = {
        explain: 'Based on the lesson, the key idea is to connect the user need with the observed insight, then turn that into a clear action or design decision.',
        example: 'Example: if a learner identifies a user pain point, the design response is to map that pain point to a specific need, then test a prototype to confirm the solution.',
    };

    return {
        answer: answerMap[intention] || answerMap.explain,
        status: 'success',
        references: [{ lessonId: 'lesson-1', snippet }],
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

app.listen(port, async () => {
    try {
        await initializeDatabase();
        console.log(`API server running on http://localhost:${port}`);
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
    }
});
