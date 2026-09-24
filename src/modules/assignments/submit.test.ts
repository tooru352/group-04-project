import test from 'node:test';
import assert from 'node:assert/strict';

import { submitAssignment } from './service.ts';

test('submitAssignment accepts a non-empty answer for an enrolled learner', async () => {
    const submission = await submitAssignment({
        assignmentId: 'assignment-1',
        learnerId: 'learner-1',
        answer: 'I would review the journey and make suggestions based on user pain points.',
        submittedAt: '2026-09-15T10:00:00.000Z',
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
    });

    assert.equal(submission.submitted, true);
    assert.equal(submission.status, 'Submitted');
    assert.equal(submission.late, false);
});

test('submitAssignment rejects empty answer text', async () => {
    await assert.rejects(
        () => submitAssignment({
            assignmentId: 'assignment-1',
            learnerId: 'learner-1',
            answer: '   ',
            submittedAt: '2026-09-15T10:00:00.000Z',
            userRole: 'Learner',
            enrolledCourseIds: ['course-1'],
        }),
        /Assignment answer cannot be empty\./,
    );
});

test('submitAssignment marks late answer when submission passes deadline', async () => {
    const RealDate = globalThis.Date;
    class MockDate extends RealDate {
        constructor(...args: any[]) {
            if (args.length === 0) {
                super('2026-10-02T10:00:00.000Z');
                return;
            }
            super(...(args as [any]));
        }

        static now() {
            return new RealDate('2026-10-02T10:00:00.000Z').getTime();
        }
    }

    Object.defineProperty(globalThis, 'Date', {
        value: MockDate,
        configurable: true,
        writable: true,
    });

    try {
        const submission = await submitAssignment({
            assignmentId: 'assignment-1',
            learnerId: 'learner-late-1',
            answer: 'Late but valid response.',
            submittedAt: '2026-09-15T10:00:00.000Z',
            userRole: 'Learner',
            enrolledCourseIds: ['course-1'],
        });

        assert.equal(submission.late, true);
        assert.equal(submission.status, 'Late');
    } finally {
        Object.defineProperty(globalThis, 'Date', {
            value: RealDate,
            configurable: true,
            writable: true,
        });
    }
});

test('submitAssignment requires learner enrollment before submission', async () => {
    await assert.rejects(
        () => submitAssignment({
            assignmentId: 'assignment-1',
            learnerId: 'learner-99',
            answer: 'This should be denied.',
            submittedAt: '2026-09-15T10:00:00.000Z',
            userRole: 'Learner',
            enrolledCourseIds: [],
        }),
        /Access denied\. Enroll in the course to submit this assignment\./,
    );
});

test('submitAssignment ignores client-supplied submittedAt and uses server time', async () => {
    const submission = await submitAssignment({
        assignmentId: 'assignment-1',
        learnerId: 'learner-1',
        answer: 'Server-generated timestamp should win.',
        submittedAt: '2099-12-31T23:59:59.000Z',
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
    });

    assert.notEqual(submission.submittedAt, '2099-12-31T23:59:59.000Z');
    assert.equal(submission.isLate, false);
    assert.equal(submission.status, 'Submitted');
});

test('submitAssignment allows resubmission before deadline when policy permits', async () => {
    const firstSubmission = await submitAssignment({
        assignmentId: 'assignment-1',
        learnerId: 'learner-2',
        answer: 'First answer for resubmission.',
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
    });

    const secondSubmission = await submitAssignment({
        assignmentId: 'assignment-1',
        learnerId: 'learner-2',
        answer: 'Second answer before deadline.',
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
    });

    assert.equal(firstSubmission.attempt, 1);
    assert.equal(secondSubmission.attempt, 2);
    assert.equal(secondSubmission.status, 'Submitted');
});

test('submitAssignment rejects resubmission when the assignment disallows it', async () => {
    await submitAssignment({
        assignmentId: 'assignment-2',
        learnerId: 'learner-3',
        answer: 'Initial answer for a no-resubmission assignment.',
        userRole: 'Learner',
        enrolledCourseIds: ['course-1'],
    });

    await assert.rejects(
        () => submitAssignment({
            assignmentId: 'assignment-2',
            learnerId: 'learner-3',
            answer: 'Second answer should be blocked.',
            userRole: 'Learner',
            enrolledCourseIds: ['course-1'],
        }),
        /RESUBMISSION_NOT_ALLOWED|Resubmission not allowed\./,
    );
});

test('submitAssignment rejects resubmission after the deadline', async () => {
    const RealDate = globalThis.Date;
    class MockDate extends RealDate {
        constructor(...args: any[]) {
            if (args.length === 0) {
                super('2026-10-02T10:00:00.000Z');
                return;
            }
            super(...(args as [any]));
        }

        static now() {
            return new RealDate('2026-10-02T10:00:00.000Z').getTime();
        }
    }

    Object.defineProperty(globalThis, 'Date', {
        value: MockDate,
        configurable: true,
        writable: true,
    });

    try {
        await submitAssignment({
            assignmentId: 'assignment-3',
            learnerId: 'learner-4',
            answer: 'Initial attempt for expired assignment.',
            userRole: 'Learner',
            enrolledCourseIds: ['course-1'],
        });

        await assert.rejects(
            () => submitAssignment({
                assignmentId: 'assignment-3',
                learnerId: 'learner-4',
                answer: 'This should fail because the deadline has passed.',
                userRole: 'Learner',
                enrolledCourseIds: ['course-1'],
            }),
            /PAST_DEADLINE|Past deadline\./,
        );
    } finally {
        Object.defineProperty(globalThis, 'Date', {
            value: RealDate,
            configurable: true,
            writable: true,
        });
    }
});
