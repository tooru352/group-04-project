import test from 'node:test';
import assert from 'node:assert/strict';

import { completeLesson } from './service.ts';

test('completeLesson records completion for an enrolled learner once', async () => {
    const result = await completeLesson('lesson-2', 'learner-1', {
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
    });

    assert.equal(result.lessonId, 'lesson-2');
    assert.equal(result.userId, 'learner-1');
    assert.equal(result.status, 'completed');
    assert.ok(result.completedAt && result.completedAt.length > 0);
});

test('completeLesson ignores duplicate completion attempts', async () => {
    await assert.rejects(
        () => completeLesson('lesson-2', 'learner-1', {
            userRole: 'Learner',
            enrolledCourseIds: ['course-1'],
        }),
        /Already completed\./,
    );
});

test('completeLesson denies access to non-enrolled learners', async () => {
    await assert.rejects(
        () => completeLesson('lesson-2', 'learner-99', {
            userRole: 'Learner',
            enrolledCourseIds: [],
        }),
        /Access denied\. Enroll in the course to complete this lesson\./,
    );
});

test('completeLesson denies non-learner roles', async () => {
    await assert.rejects(
        () => completeLesson('lesson-2', 'instructor-1', {
            userRole: 'Instructor',
            enrolledCourseIds: ['course-1'],
        }),
        /Only Learners can complete lessons\./,
    );
});
