import type { DashboardSummary } from './types.ts';
import { calculateDashboardSummary } from './domain.ts';

export async function getDashboardSummary(learnerId: string): Promise<DashboardSummary> {
    return calculateDashboardSummary({
        learnerId,
        enrolledCourses: 3,
        completedLessons: 4,
        pendingAssignments: 2,
        averageScore: 8.5,
    });
}
