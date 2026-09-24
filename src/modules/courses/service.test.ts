import test from 'node:test';
import assert from 'node:assert/strict';

import { enrollCourse, evaluateCourseCompletion, getCourseProgress, getCourses } from './service.ts';

test('getCourses returns only published courses and filters by category and search', async () => {
    const courses = await getCourses({ category: 'Design', q: 'design' });

    assert.deepEqual(
        courses.map((course) => course.id),
        ['course-1'],
    );
    assert.ok(courses.every((course) => course.status === 'Published'));
});

test('getCourses returns empty result when no active course matches filters', async () => {
    const courses = await getCourses({ category: 'Unknown', q: 'not-found' });

    assert.deepEqual(courses, []);
});

test('enrollCourse allows a learner to enroll in an available course', async () => {
    const enrollment = await enrollCourse('course-2', 'learner-99', { userRole: 'Learner' });

    assert.equal(enrollment.courseId, 'course-2');
    assert.equal(enrollment.userId, 'learner-99');
    assert.equal(enrollment.status, 'Active');
    assert.ok(enrollment.id.length > 0);
});

test('enrollCourse rejects duplicate enrollment for the same learner and course', async () => {
    await assert.rejects(
        () => enrollCourse('course-1', 'learner-1', { userRole: 'Learner' }),
        /Already enrolled\./,
    );
});

test('enrollCourse denies non-learner roles', async () => {
    await assert.rejects(
        () => enrollCourse('course-3', 'instructor-1', { userRole: 'Instructor' }),
        /Only learners can enroll\./,
    );
});

test('getCourseProgress returns 50% for one completed lesson out of two required items', async () => {
    const progress = await getCourseProgress('course-1', 'learner-1', {
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
        completedLessonIds: ['lesson-1'],
    });

    assert.equal(progress.courseId, 'course-1');
    assert.equal(progress.totalItems, 2);
    assert.equal(progress.completedItems, 1);
    assert.equal(progress.percentage, 50);
    assert.equal(progress.lessonStatuses.length, 2);
});

test('getCourseProgress returns 0% when no required lessons are complete', async () => {
    const progress = await getCourseProgress('course-2', 'learner-99', {
        userRole: 'Learner',
        enrolledCourseIds: ['course-2'],
        completedLessonIds: [],
    });

    assert.equal(progress.percentage, 0);
    assert.equal(progress.completedItems, 0);
});

test('getCourseProgress denies access for non-enrolled learner', async () => {
    await assert.rejects(
        () => getCourseProgress('course-1', 'learner-99', {
            userRole: 'Learner',
            enrolledCourseIds: [],
            completedLessonIds: ['lesson-1'],
        }),
        /Access denied\. Enroll in the course to view progress\./,
    );
});

test('evaluateCourseCompletion marks a course complete when all required lessons and assignments are done', async () => {
    const result = await evaluateCourseCompletion('course-1', 'learner-1', {
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
        completedLessonIds: ['lesson-1', 'lesson-2'],
        submittedAssignmentIds: ['assignment-1'],
    });

    assert.equal(result.courseId, 'course-1');
    assert.equal(result.isCompleted, true);
    assert.equal(result.completedItems, 3);
    assert.equal(result.totalItems, 3);
});

test('evaluateCourseCompletion keeps course in progress when a required item is still missing', async () => {
    const result = await evaluateCourseCompletion('course-1', 'learner-1', {
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
        completedLessonIds: ['lesson-1'],
        submittedAssignmentIds: ['assignment-1'],
    });

    assert.equal(result.isCompleted, false);
    assert.equal(result.completedItems, 2);
    assert.equal(result.totalItems, 3);
});

test('evaluateCourseCompletion denies access to non-enrolled learners', async () => {
    await assert.rejects(
        () => evaluateCourseCompletion('course-1', 'learner-99', {
            userRole: 'Learner',
            enrolledCourseIds: [],
            completedLessonIds: ['lesson-1', 'lesson-2'],
            submittedAssignmentIds: ['assignment-1'],
        }),
        /Access denied\. Enroll in the course to evaluate completion\./,
    );
});
