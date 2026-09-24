import test from 'node:test';
import assert from 'node:assert/strict';

import { getInstructorCourseSubmissions } from './service.ts';

test('getInstructorCourseSubmissions returns managed course rows and marks not-submitted learners', async () => {
    const rows = await getInstructorCourseSubmissions('course-1', 'instructor-1', {
        userRole: 'Instructor',
        managedCourseIds: ['course-1'],
    });

    assert.ok(rows.some((row) => row.learnerId === 'learner-1' && row.assignmentId === 'assignment-1' && row.status === 'Submitted'));
    assert.ok(rows.some((row) => row.learnerId === 'learner-2' && row.assignmentId === 'assignment-1' && row.status === 'Not Submitted'));
});

test('getInstructorCourseSubmissions rejects courses outside instructor scope', async () => {
    await assert.rejects(
        () => getInstructorCourseSubmissions('course-2', 'instructor-1', {
            userRole: 'Instructor',
            managedCourseIds: ['course-1'],
        }),
        /Access denied\.|You do not manage this course\./,
    );
});
