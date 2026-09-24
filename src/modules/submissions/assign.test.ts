import test from 'node:test';
import assert from 'node:assert/strict';

import { assignReviewerToSubmission } from './service.ts';

test('assignReviewerToSubmission allows an Instructor to assign a valid Reviewer', async () => {
    const result = await assignReviewerToSubmission('submission-3', 'reviewer-1', {
        userRole: 'Instructor',
        managedCourseIds: ['course-1'],
    });

    assert.equal(result.submissionId, 'submission-3');
    assert.equal(result.reviewerId, 'reviewer-1');
    assert.equal(result.status, 'Assigned');
});

test('assignReviewerToSubmission rejects non-Reviewer assignment targets', async () => {
    await assert.rejects(
        () => assignReviewerToSubmission('submission-3', 'learner-1', {
            userRole: 'Instructor',
            managedCourseIds: ['course-1'],
        }),
        /reviewerId must reference a valid Reviewer user\./,
    );
});

test('assignReviewerToSubmission rejects non-Instructor/Admin actors', async () => {
    await assert.rejects(
        () => assignReviewerToSubmission('submission-3', 'reviewer-1', {
            userRole: 'Learner',
            managedCourseIds: ['course-1'],
        }),
        /Only Instructors or Admins can assign reviewers\./,
    );
});
