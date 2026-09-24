import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initializeDatabase, query, testDatabase } from './db.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

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

app.post('/api/ai/chat', async (req, res) => {
    try {
        const { question, lessonId, learnerId } = req.body || {};

        if (!question || String(question).trim().length === 0) {
            return res.status(400).json({ ok: false, message: 'Question is required.' });
        }

        const normalizedQuestion = String(question).trim();

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
                            content: 'You are a helpful learning tutor for an LMS. Give clear, actionable guidance for students.'
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
                        context: { lessonId, learnerId },
                    });
                }
            }
        }

        const answer = buildTutorReply(normalizedQuestion, {
            courseTitle: 'LearningHub course',
            lessonId,
            learnerId,
        });

        return res.json({
            ok: true,
            answer,
            source: 'local-tutor',
            context: { lessonId, learnerId },
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
