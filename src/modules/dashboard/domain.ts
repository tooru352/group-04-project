import type { DashboardSummary } from './types.ts';

export function calculateDashboardSummary(data: DashboardSummary): DashboardSummary {
    return {
        ...data,
        averageScore: Number(Math.min(Math.max(data.averageScore, 0), 10).toFixed(1)),
    };
}
