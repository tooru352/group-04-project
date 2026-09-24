import test from 'node:test';
import assert from 'node:assert/strict';

import { getSubmissionFeedback } from './service.ts';

test('getSubmissionFeedback returns grade and feedback for the learner owner', async () => {
    const result = await getSubmissionFeedback('submission-1', 'learner-1', {
        userRole: 'Learner',
    });

    assert.equal(result.submissionId, 'submission-1');
    assert.equal(result.grade, 88);
    assert.equal(result.feedback, 'Solid analysis with clear evidence.');
    assert.equal(result.reviewerId, 'instructor-1');
});

test('getSubmissionFeedback shows Awaiting Grading for an ungraded submission', async () => {
    const result = await getSubmissionFeedback('submission-2', 'learner-2', {
        userRole: 'Learner',
    });

    assert.equal(result.status, 'Awaiting Grading');
    assert.equal(result.grade, null);
    assert.equal(result.feedback, null);
});

test('getSubmissionFeedback rejects other learners from viewing the feedback', async () => {
    await assert.rejects(
        () => getSubmissionFeedback('submission-1', 'learner-2', {
            userRole: 'Learner',
        }),
        /Access denied\. You can only view your own feedback\./,
    );
});
