import test from 'node:test';
import assert from 'node:assert/strict';

import { getAdminCourses, getAuditEvents, getAuditTrail, updateCourse } from './service.ts';

test('getAdminCourses returns the full course list, including non-published entries', async () => {
    const courses = await getAdminCourses();

    assert.ok(courses.some((course) => course.id === 'course-1'));
    assert.ok(courses.some((course) => course.id === 'course-4' && course.status === 'Draft'));
});

test('updateCourse allows an Admin to change course metadata system-wide', async () => {
    const updated = await updateCourse('course-2', {
        title: 'Advanced Data Storytelling',
        category: 'Analytics',
        status: 'Draft',
    }, {
        actorId: 'admin-1',
        actorRole: 'Admin',
    });

    assert.equal(updated.id, 'course-2');
    assert.equal(updated.title, 'Advanced Data Storytelling');
    assert.equal(updated.category, 'Analytics');
    assert.equal(updated.status, 'Draft');
});

test('updateCourse rejects non-admin access', async () => {
    await assert.rejects(
        () => updateCourse('course-1', { status: 'Draft' }, {
            actorId: 'learner-1',
            actorRole: 'Learner',
        }),
        /Only Admin users can manage courses\./,
    );
});

test('updateCourse rejects invalid status transitions', async () => {
    await assert.rejects(
        () => updateCourse('course-1', { status: 'Unknown' as any }, {
            actorId: 'admin-1',
            actorRole: 'Admin',
        }),
        /Invalid course status\./,
    );
});

test('updateCourse blocks archival when the course has active enrollments', async () => {
    await assert.rejects(
        () => updateCourse('course-1', { status: 'Archived' }, {
            actorId: 'admin-1',
            actorRole: 'Admin',
        }),
        /Cannot archive a course with active enrollments\./,
    );
});

test('updateCourse writes a course audit event after a successful change', async () => {
    await updateCourse('course-3', { title: 'Systems Thinking for Leaders' }, {
        actorId: 'admin-1',
        actorRole: 'Admin',
    });

    const events = getAuditEvents();
    const lastEvent = events.at(-1);

    assert.ok(lastEvent);
    assert.equal(lastEvent?.adminId, 'admin-1');
    assert.equal(lastEvent?.courseId, 'course-3');
    assert.equal(lastEvent?.action, 'update');
    assert.ok(lastEvent?.timestamp.length > 0);
});

test('getAuditTrail returns the append-only filtered audit log for Admin access', async () => {
    await updateCourse('course-2', { title: 'Audit Trail Validation' }, {
        actorId: 'admin-1',
        actorRole: 'Admin',
    });

    const trail = getAuditTrail({
        actorId: 'admin-1',
        action: 'update',
        from: '2020-01-01T00:00:00.000Z',
        to: '2099-12-31T00:00:00.000Z',
    }, { actorRole: 'Admin' });

    assert.ok(trail.length > 0);
    assert.ok(trail.every((event) => event.actorId === 'admin-1'));
    assert.ok(trail.every((event) => event.action === 'update'));
    assert.ok(trail.every((event) => !!event.id && !!event.target && !!event.createdAt));
});

test('getAuditTrail rejects non-admin access', () => {
    assert.throws(
        () => getAuditTrail({}, { actorRole: 'Learner' }),
        /Only Admin users can query the audit trail\./,
    );
});
