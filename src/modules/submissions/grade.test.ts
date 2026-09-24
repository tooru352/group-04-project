import test from 'node:test';
import assert from 'node:assert/strict';

import { assignReviewerToSubmission, gradeSubmission } from './service.ts';

test('gradeSubmission validates grade bounds and feedback content', async () => {
    await assert.rejects(
        () => gradeSubmission('submission-3', {
            submissionId: 'submission-3',
            grade: 101,
            feedback: 'Too high.',
            reviewerId: 'instructor-1',
        }, {
            userRole: 'Instructor',
        }),
        /Grade must be between 0 and 100\./,
    );

    await assert.rejects(
        () => gradeSubmission('submission-3', {
            submissionId: 'submission-3',
            grade: 90,
            feedback: '   ',
            reviewerId: 'instructor-1',
        }, {
            userRole: 'Instructor',
        }),
        /Feedback cannot be empty\./,
    );
});

test('gradeSubmission allows an Instructor to grade a submitted submission', async () => {
    const result = await gradeSubmission('submission-3', {
        submissionId: 'submission-3',
        grade: 88,
        feedback: 'Solid analysis with clear evidence.',
        reviewerId: 'instructor-1',
    }, {
        userRole: 'Instructor',
    });

    assert.equal(result.status, 'Graded');
    assert.equal(result.grade, 88);
    assert.equal(result.feedback, 'Solid analysis with clear evidence.');
});

test('gradeSubmission rejects Learner attempts to grade a submission', async () => {
    await assert.rejects(
        () => gradeSubmission('submission-3', {
            submissionId: 'submission-3',
            grade: 85,
            feedback: 'Not allowed.',
            reviewerId: 'learner-1',
        }, {
            userRole: 'Learner',
        }),
        /Only Instructors or Reviewers can grade this submission\./,
    );
});

test('gradeSubmission allows a Reviewer to grade only their assigned submission', async () => {
    await assignReviewerToSubmission('submission-2', 'reviewer-1', {
        userRole: 'Instructor',
        managedCourseIds: ['course-1'],
    });

    const result = await gradeSubmission('submission-2', {
        submissionId: 'submission-2',
        grade: 92,
        feedback: 'Clear, thoughtful review and strong evidence.',
        reviewerId: 'reviewer-1',
    }, {
        userRole: 'Reviewer',
    });

    assert.equal(result.status, 'Graded');
    assert.equal(result.reviewerId, 'reviewer-1');
    assert.equal(result.grade, 92);
});

test('gradeSubmission rejects reviewer attempts on unassigned submissions', async () => {
    await assert.rejects(
        () => gradeSubmission('submission-1', {
            submissionId: 'submission-1',
            grade: 80,
            feedback: 'This reviewer was not assigned to this work.',
            reviewerId: 'reviewer-2',
        }, {
            userRole: 'Reviewer',
        }),
        /Access denied\. This submission is not assigned to this reviewer\./,
    );
});
