import type { Submission } from './types.ts';

export function isSubmissionGraded(submission: Submission): boolean {
    return submission.status === 'Graded';
}

export function gradeResult(submission: Submission, grade: number): number {
    if (grade < 0 || grade > 100) {
        throw new Error('Grade must be between 0 and 100.');
    }

    return grade;
}
