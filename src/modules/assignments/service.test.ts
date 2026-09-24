import test from 'node:test';
import assert from 'node:assert/strict';

import { createAssignment, getAssignmentById, updateAssignment } from './service.ts';

test('getAssignmentById returns assignment detail for an enrolled learner', async () => {
    const assignment = await getAssignmentById('assignment-1', 'learner-1', {
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
    });

    assert.equal(assignment.id, 'assignment-1');
    assert.equal(assignment.courseId, 'course-1');
    assert.equal(assignment.title, 'Journey map critique');
    assert.equal(assignment.submissionStatus, 'Incomplete');
    assert.ok(assignment.deadline.length > 0);
});

test('getAssignmentById rejects assignment access for non-enrolled learners', async () => {
    await assert.rejects(
        () => getAssignmentById('assignment-1', 'learner-99', {
            userRole: 'Learner',
            enrolledCourseIds: [],
        }),
        /Access denied\. Enroll in the course to view this assignment\./,
    );
});

test('getAssignmentById rejects missing assignment records', async () => {
    await assert.rejects(
        () => getAssignmentById('assignment-404', 'learner-1', {
            userRole: 'Learner',
            enrolledCourseIds: ['course-1'],
        }),
        /Assignment not found\./,
    );
});

test('getAssignmentById denies non-learner roles', async () => {
    await assert.rejects(
        () => getAssignmentById('assignment-1', 'instructor-1', {
            userRole: 'Instructor',
            enrolledCourseIds: ['course-1'],
        }),
        /Only Learners can view assignments\./,
    );
});

test('createAssignment allows an Instructor to create an assignment in a managed course', async () => {
    const assignment = await createAssignment('course-1', {
        title: 'User interview synthesis',
        instructions: 'Summarize stakeholder interviews and identify themes.',
        deadline: '2026-11-01T00:00:00.000Z',
        maxAttempts: 2,
        allowsResubmission: true,
    }, {
        userRole: 'Instructor',
        managedCourseIds: ['course-1'],
    });

    assert.equal(assignment.courseId, 'course-1');
    assert.equal(assignment.title, 'User interview synthesis');
    assert.equal(assignment.status, 'Incomplete');
});

test('createAssignment rejects invalid title or out-of-scope course', async () => {
    await assert.rejects(
        () => createAssignment('course-1', {
            title: '   ',
            instructions: 'Valid instructions.',
            deadline: '2026-11-01T00:00:00.000Z',
            maxAttempts: 2,
            allowsResubmission: true,
        }, {
            userRole: 'Instructor',
            managedCourseIds: ['course-1'],
        }),
        /Title cannot be empty\./,
    );

    await assert.rejects(
        () => createAssignment('course-2', {
            title: 'Out of scope',
            instructions: 'This should fail.',
            deadline: '2026-11-01T00:00:00.000Z',
            maxAttempts: 2,
            allowsResubmission: true,
        }, {
            userRole: 'Instructor',
            managedCourseIds: ['course-1'],
        }),
        /Access denied\. You do not manage this course\./,
    );
});

test('updateAssignment rejects edits outside instructor scope', async () => {
    const created = await createAssignment('course-1', {
        title: 'Research notes',
        instructions: 'Capture notes from research review.',
        deadline: '2026-11-03T00:00:00.000Z',
        maxAttempts: 1,
        allowsResubmission: false,
    }, {
        userRole: 'Instructor',
        managedCourseIds: ['course-1'],
    });

    await assert.rejects(
        () => updateAssignment(created.id, {
            title: 'Editing without permission',
        }, {
            userRole: 'Instructor',
            managedCourseIds: ['course-2'],
        }),
        /Access denied\. You do not manage this course\./,
    );
});
