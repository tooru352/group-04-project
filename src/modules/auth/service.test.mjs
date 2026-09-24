import test from 'node:test';
import assert from 'node:assert/strict';

const { loginUser } = await import('./service.ts');

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
