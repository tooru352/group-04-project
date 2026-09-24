import type { Assignment } from './types.ts';

export function isLateSubmission(assignment: Assignment, submittedAt: string): boolean {
    if (!assignment.deadline) {
        return false;
    }

    const submittedTime = new Date(submittedAt).getTime();
    const deadlineTime = new Date(assignment.deadline).getTime();

    if (Number.isNaN(submittedTime) || Number.isNaN(deadlineTime)) {
        return false;
    }

    return submittedTime > deadlineTime;
}

export function canSubmitAssignment(assignment: Assignment, answer: string): boolean {
    return assignment.status !== 'Graded' && answer.trim().length > 0;
}
