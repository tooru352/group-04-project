// Add test course for enrollment testing
import { query } from './server/db.js';

async function addTestCourse() {
    try {
        // Get instructor ID
        const instructorRow = await query('SELECT id FROM app_users WHERE email = $1', ['bob@lms.test']);
        const instructorId = instructorRow.rows[0]?.id;

        // Add new course
        const result = await query(
            `INSERT INTO courses (id, code, title, description, category, status, instructor_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (id) DO NOTHING
             RETURNING *;`,
            [
                2, // Force ID 2
                'CS-102',
                'Advanced UX Design',
                'Deep dive into advanced user experience design principles, including service design, design systems at scale, and design leadership.',
                'Design',
                'Published',
                instructorId
            ]
        );

        console.log('✅ Added test course:', result.rows[0]);

        // Add lessons for this course
        const courseId = result.rows[0].id;
        
        await query(
            `INSERT INTO lessons (course_id, title, content, duration, is_required, sort_order, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [
                courseId,
                'Service Design',
                'Service design focuses on the entire service ecosystem, including touchpoints, stakeholder journeys, and backend processes. Learn how to design holistic experiences that work across digital and physical channels.',
                45,
                true,
                1,
                'Published'
            ]
        );

        console.log('✅ Added lesson for new course');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addTestCourse();