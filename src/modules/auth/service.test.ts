import test from 'node:test';
import assert from 'node:assert/strict';

import { loginUser } from './service.ts';
import {
    authorizeRequestAccess,
    authorizeRouteAccess,
    resolveRoleFromSession,
} from './domain.ts';

test('valid credentials succeed', async () => {
    const result = await loginUser({ email: 'alice@lms.test', password: 'learner123' });
    assert.equal(result.role, 'Learner');
    assert.equal(result.userId, 'learner-1');
    assert.ok(result.token.length > 0);
});

test('invalid credentials fail generically', async () => {
    await assert.rejects(
        () => loginUser({ email: 'alice@lms.test', password: 'wrong' }),
        /Invalid credentials\./,
    );
});

test('empty input fails', async () => {
    await assert.rejects(
        () => loginUser({ email: '', password: 'x' }),
        /Email and password are required\./,
    );
});

test('resolveRoleFromSession accepts valid role values', () => {
    assert.equal(resolveRoleFromSession('Learner'), 'Learner');
    assert.equal(resolveRoleFromSession('Instructor'), 'Instructor');
    assert.equal(resolveRoleFromSession('Admin'), 'Admin');
});

test('resolveRoleFromSession rejects invalid or missing role', () => {
    assert.equal(resolveRoleFromSession(undefined), null);
    assert.equal(resolveRoleFromSession('Unknown'), null);
    assert.equal(resolveRoleFromSession(''), null);
});

test('authorizeRouteAccess enforces server-side role checks', () => {
    assert.equal(authorizeRouteAccess('Learner', 'Learner'), true);
    assert.equal(authorizeRouteAccess('Learner', 'Instructor'), false);
    assert.equal(authorizeRouteAccess('Instructor', 'Learner'), true);
    assert.equal(authorizeRouteAccess('Reviewer', 'Admin'), false);
    assert.equal(authorizeRouteAccess('Admin', 'Reviewer'), true);
    assert.equal(authorizeRouteAccess('Unknown', 'Learner'), false);
});

test('authorizeRequestAccess rejects missing bearer token with 401', () => {
    const result = authorizeRequestAccess({
        authHeader: undefined,
        userRole: 'Learner',
        currentUserId: 'learner-1',
        resourceOwnerId: 'learner-1',
        requiredRole: 'Learner',
    });

    assert.deepEqual(result, {
        allowed: false,
        status: 401,
        error: 'UNAUTHORIZED',
        message: 'Authentication required',
    });
});

test('authorizeRequestAccess rejects insufficient role or ownership with 403', () => {
    const wrongRole = authorizeRequestAccess({
        authHeader: 'Bearer token-abc',
        userRole: 'Learner',
        currentUserId: 'learner-1',
        resourceOwnerId: 'learner-2',
        requiredRole: 'Instructor',
    });

    const wrongOwner = authorizeRequestAccess({
        authHeader: 'Bearer token-abc',
        userRole: 'Learner',
        currentUserId: 'learner-1',
        resourceOwnerId: 'learner-2',
        requiredRole: 'Learner',
    });

    assert.deepEqual(wrongRole, {
        allowed: false,
        status: 403,
        error: 'FORBIDDEN',
        message: 'Access denied',
    });

    assert.deepEqual(wrongOwner, {
        allowed: false,
        status: 403,
        error: 'FORBIDDEN',
        message: 'Access denied',
    });
});

test('authorizeRequestAccess allows matching owner or higher role', () => {
    const allowedAsOwner = authorizeRequestAccess({
        authHeader: 'Bearer token-abc',
        userRole: 'Learner',
        currentUserId: 'learner-1',
        resourceOwnerId: 'learner-1',
        requiredRole: 'Learner',
    });

    const allowedAsInstructor = authorizeRequestAccess({
        authHeader: 'Bearer token-abc',
        userRole: 'Instructor',
        currentUserId: 'instructor-1',
        resourceOwnerId: 'learner-2',
        requiredRole: 'Learner',
    });

    assert.deepEqual(allowedAsOwner, {
        allowed: true,
        status: 200,
        error: null,
        message: 'Authorized',
    });

    assert.deepEqual(allowedAsInstructor, {
        allowed: true,
        status: 200,
        error: null,
        message: 'Authorized',
    });
});
