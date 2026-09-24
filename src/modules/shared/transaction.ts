export type TransactionWriteState<T> = {
    version: number;
    value: T;
};

export function assertOptimisticLock<T extends { version?: number }>(current: T, expectedVersion: number): void {
    const actualVersion = current.version ?? 0;
    if (actualVersion !== expectedVersion) {
        const error = new Error('Resource was updated by another request. Please retry.') as Error & {
            error?: string;
            message: string;
        };
        error.error = 'CONFLICT';
        throw error;
    }
}

export async function runTransactionalWrite<T>(
    write: () => T | Promise<T>,
    options: { rollback?: () => void | Promise<void> } = {},
): Promise<T> {
    try {
        return await write();
    } catch (error) {
        if (options.rollback) {
            await options.rollback();
        }
        throw error;
    }
}
