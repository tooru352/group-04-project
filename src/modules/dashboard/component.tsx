import type { DashboardSummary } from './types';

type DashboardCardProps = {
    summary: DashboardSummary;
};

export default function DashboardCard({ summary }: DashboardCardProps) {
    return (
        <section>
            <h2>Dashboard</h2>
            <ul>
                <li>Enrolled courses: {summary.enrolledCourses}</li>
                <li>Completed lessons: {summary.completedLessons}</li>
                <li>Pending assignments: {summary.pendingAssignments}</li>
                <li>Average score: {summary.averageScore}</li>
            </ul>
        </section>
    );
}
