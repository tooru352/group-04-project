import test from 'node:test';
import assert from 'node:assert/strict';

import { createLesson, getLessonById, updateLesson } from './service.ts';

test('getLessonById returns a published lesson for an enrolled learner', async () => {
    const lesson = await getLessonById('lesson-1', 'learner-1', {
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
    });

    assert.equal(lesson.id, 'lesson-1');
    assert.equal(lesson.courseId, 'course-1');
    assert.equal(lesson.status, 'Published');
    assert.ok(lesson.content.length > 0);
});

test('getLessonById rejects a non-enrolled learner', async () => {
    await assert.rejects(
        () => getLessonById('lesson-2', 'learner-99', {
            userRole: 'Learner',
            enrolledCourseIds: [],
        }),
        /Access denied\. Enroll in the course to view this lesson\./,
    );
});

test('getLessonById rejects a lesson that does not exist', async () => {
    await assert.rejects(
        () => getLessonById('lesson-404', 'learner-1', {
            userRole: 'Learner',
            enrolledCourseIds: ['course-1'],
        }),
        /Lesson not found\./,
    );
});

test('getLessonById denies non-learner roles', async () => {
    await assert.rejects(
        () => getLessonById('lesson-1', 'instructor-1', {
            userRole: 'Instructor',
            enrolledCourseIds: ['course-1'],
        }),
        /Only Learners can view lessons\./,
    );
});

test('createLesson allows an Instructor to add a lesson to a managed course', async () => {
    const lesson = await createLesson('course-1', {
        title: 'Stakeholder Interviews',
        content: 'Interview users to uncover their priorities and pain points.',
        duration: '12 min',
        status: 'Draft',
    }, {
        userRole: 'Instructor',
        managedCourseIds: ['course-1'],
    });

    assert.equal(lesson.courseId, 'course-1');
    assert.equal(lesson.title, 'Stakeholder Interviews');
    assert.equal(lesson.status, 'Draft');
});

test('createLesson rejects invalid title or course scope', async () => {
    await assert.rejects(
        () => createLesson('course-1', {
            title: '   ',
            content: 'Content is here.',
            duration: '10 min',
            status: 'Published',
        }, {
            userRole: 'Instructor',
            managedCourseIds: ['course-1'],
        }),
        /Lesson title and content must not be empty\./,
    );

    await assert.rejects(
        () => createLesson('course-2', {
            title: 'Unauthorised lesson',
            content: 'This course is outside instructor scope.',
            duration: '15 min',
            status: 'Published',
        }, {
            userRole: 'Instructor',
            managedCourseIds: ['course-1'],
        }),
        /Access denied\. You do not manage this course\./,
    );
});

test('updateLesson rejects edits to lessons outside instructor scope', async () => {
    const created = await createLesson('course-1', {
        title: 'Prototype Feedback',
        content: 'Collect early user feedback on prototypes.',
        duration: '20 min',
        status: 'Published',
    }, {
        userRole: 'Instructor',
        managedCourseIds: ['course-1'],
    });

    await assert.rejects(
        () => updateLesson(created.id, {
            title: 'Changed without permission',
        }, {
            userRole: 'Instructor',
            managedCourseIds: ['course-2'],
        }),
        /Access denied\. You do not manage this course\./,
    );
});
