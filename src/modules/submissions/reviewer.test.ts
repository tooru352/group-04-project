import test from 'node:test';
import assert from 'node:assert/strict';

import { assignReviewerToSubmission, getReviewerSubmissions } from './service.ts';

test('getReviewerSubmissions returns only assigned submissions for the matching reviewer', async () => {
    await assignReviewerToSubmission('submission-3', 'reviewer-1', {
        userRole: 'Instructor',
        managedCourseIds: ['course-1'],
    });

    const rows = await getReviewerSubmissions('reviewer-1', { userRole: 'Reviewer' });

    assert.ok(rows.some((row) => row.submissionId === 'submission-3' && row.assignmentTitle === 'Capstone reflection'));
    assert.ok(rows.every((row) => row.learnerId !== 'learner-2'));
});

test('getReviewerSubmissions rejects non-reviewer actors and excludes unassigned work', async () => {
    await assert.rejects(
        () => getReviewerSubmissions('reviewer-1', { userRole: 'Learner' }),
        /Only Reviewers can view their assigned submissions\./,
    );

    const rows = await getReviewerSubmissions('reviewer-2', { userRole: 'Reviewer' });
    assert.deepEqual(rows, []);
});
