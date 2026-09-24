import test from 'node:test';
import assert from 'node:assert/strict';

import { assertOptimisticLock, runTransactionalWrite } from './transaction.ts';

test('runTransactionalWrite rolls back on simulated write failure', async () => {
    let state = { version: 1, value: 'old' };

    await assert.rejects(
        () => runTransactionalWrite(
            () => {
                state = { ...state, value: 'new' };
                throw new Error('simulated failure');
            },
            {
                rollback: () => {
                    state = { ...state, value: 'old' };
                },
            },
        ),
        /simulated failure/,
    );

    assert.deepEqual(state, { version: 1, value: 'old' });
});

test('assertOptimisticLock rejects a version mismatch with the expected conflict payload', () => {
    assert.throws(
        () => assertOptimisticLock({ version: 2 }, 1),
        (error: any) => {
            assert.equal(error?.error, 'CONFLICT');
            assert.equal(error?.message, 'Resource was updated by another request. Please retry.');
            return true;
        },
    );
});
