export { };

declare module '../../server/db.js' {
    export function initializeDatabase(): Promise<void>;
    export function query(
        text: string,
        params?: unknown[],
    ): Promise<{ rows: any[]; rowCount?: number }>;
    export const pool: unknown;
}

declare module '*.json' {
    const value: any;
    export default value;
}
