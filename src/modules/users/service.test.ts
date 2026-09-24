import test from 'node:test';
import assert from 'node:assert/strict';

import { getAuditEvents, getUsers, updateUserRole } from './service.ts';

test('getUsers returns the seeded user roster', async () => {
    const users = await getUsers();

    assert.deepEqual(
        users.map((user) => user.id),
        ['learner-1', 'instructor-1', 'reviewer-1', 'admin-1'],
    );
});

test('updateUserRole allows an Admin to promote a Learner', async () => {
    const updated = await updateUserRole('learner-1', 'INSTRUCTOR', {
        actorId: 'admin-1',
        actorRole: 'Admin',
    });

    assert.equal(updated.id, 'learner-1');
    assert.equal(updated.role, 'Instructor');
    assert.equal(updated.email, 'alice@lms.test');
});

test('updateUserRole rejects non-admin access', async () => {
    await assert.rejects(
        () => updateUserRole('instructor-1', 'REVIEWER', {
            actorId: 'learner-1',
            actorRole: 'Learner',
        }),
        /Only Admin users can update roles\./,
    );
});

test('updateUserRole rejects invalid role values', async () => {
    await assert.rejects(
        () => updateUserRole('reviewer-1', 'BANNED', {
            actorId: 'admin-1',
            actorRole: 'Admin',
        }),
        /Invalid role value\./,
    );
});

test('updateUserRole writes an audit event after a successful role change', async () => {
    await updateUserRole('reviewer-1', 'INSTRUCTOR', {
        actorId: 'admin-1',
        actorRole: 'Admin',
    });

    const events = getAuditEvents();
    const lastEvent = events.at(-1);

    assert.ok(lastEvent);
    assert.equal(lastEvent?.adminId, 'admin-1');
    assert.equal(lastEvent?.targetUserId, 'reviewer-1');
    assert.equal(lastEvent?.oldRole, 'Reviewer');
    assert.equal(lastEvent?.newRole, 'Instructor');
    assert.ok(lastEvent?.timestamp.length > 0);
});

test('updateUserRole blocks self-demotion of the last admin', async () => {
    await assert.rejects(
        () => updateUserRole('admin-1', 'LEARNER', {
            actorId: 'admin-1',
            actorRole: 'Admin',
        }),
        /Cannot remove the last admin\./,
    );
});
