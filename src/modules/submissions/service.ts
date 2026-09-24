import type { GradeFeedback, Submission } from './types.ts';
import { isSubmissionGraded, gradeResult } from './domain.ts';

const sampleSubmissions: Submission[] = [
    {
        id: 'submission-1',
        assignmentId: 'assignment-1',
        learnerId: 'learner-1',
        answer: 'The user journey shows friction in the onboarding phase.',
        submittedAt: '2026-09-20T10:15:00.000Z',
        status: 'Graded',
        grade: 88,
        feedback: 'Solid analysis with clear evidence.',
        reviewerId: 'instructor-1',
    },
    {
        id: 'submission-2',
        assignmentId: 'assignment-2',
        learnerId: 'learner-2',
        answer: 'This submission is still waiting for grading.',
        submittedAt: '2026-09-21T09:00:00.000Z',
        status: 'Submitted',
    },
    {
        id: 'submission-3',
        assignmentId: 'assignment-3',
        learnerId: 'learner-3',
        answer: 'Fresh submission reserved for grading validations.',
        submittedAt: '2026-09-22T10:00:00.000Z',
        status: 'Submitted',
    },
];

const instructorManagedCourses: Record<string, string[]> = {
    'instructor-1': ['course-1'],
    'instructor-2': ['course-2'],
};

const validReviewers = new Set(['reviewer-1', 'reviewer-2']);

export type InstructorSubmissionRow = {
    submissionId?: string;
    learnerId: string;
    learnerName: string;
    assignmentId: string;
    assignmentTitle: string;
    submittedAt?: string;
    status: 'Submitted' | 'Not Submitted';
};

export type ReviewerSubmissionRow = {
    submissionId: string;
    learnerId: string;
    learnerName: string;
    assignmentTitle: string;
    submittedAt: string;
    status: 'Submitted' | 'Late' | 'Graded';
};

export async function getSubmissions(): Promise<Submission[]> {
    return sampleSubmissions;
}

export async function getReviewerSubmissions(
    reviewerId: string,
    context: { userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin' } = {},
): Promise<ReviewerSubmissionRow[]> {
    if (context.userRole !== 'Reviewer') {
        throw new Error('Only Reviewers can view their assigned submissions.');
    }

    const assigned = sampleSubmissions.filter((submission) => submission.reviewerId === reviewerId);

    const learnerMap = new Map([
        ['learner-1', 'Alice Learner'],
        ['learner-2', 'Bob Learner'],
        ['learner-3', 'Cara Learner'],
    ]);

    const titleMap = new Map([
        ['assignment-1', 'Journey map critique'],
        ['assignment-2', 'Prototype usability test'],
        ['assignment-3', 'Capstone reflection'],
    ]);

    return assigned.map((submission) => ({
        submissionId: submission.id,
        learnerId: submission.learnerId,
        learnerName: learnerMap.get(submission.learnerId) ?? submission.learnerId,
        assignmentTitle: titleMap.get(submission.assignmentId) ?? submission.assignmentId,
        submittedAt: submission.submittedAt,
        status: submission.status,
    }));
}

export async function getSubmissionFeedback(
    submissionId: string,
    learnerId: string,
    context: { userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin' } = {},
): Promise<{
    submissionId: string;
    grade: number | null;
    feedback: string | null;
    reviewerId?: string | null;
    gradedAt?: string | null;
    status: 'Graded' | 'Awaiting Grading';
}> {
    const submission = sampleSubmissions.find((item) => item.id === submissionId);

    if (!submission) {
        throw new Error('Submission not found.');
    }

    if (context.userRole !== 'Learner') {
        throw new Error('Only Learners can view feedback.');
    }

    if (submission.learnerId !== learnerId) {
        throw new Error('Access denied. You can only view your own feedback.');
    }

    if (submission.status !== 'Graded' || submission.grade == null || submission.feedback == null) {
        return {
            submissionId: submission.id,
            grade: null,
            feedback: null,
            reviewerId: null,
            gradedAt: null,
            status: 'Awaiting Grading',
        };
    }

    return {
        submissionId: submission.id,
        grade: submission.grade,
        feedback: submission.feedback,
        reviewerId: submission.reviewerId ?? null,
        gradedAt: submission.submittedAt,
        status: 'Graded',
    };
}

export async function assignReviewerToSubmission(
    submissionId: string,
    reviewerId: string,
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        managedCourseIds?: string[];
    } = {},
): Promise<{ submissionId: string; reviewerId: string; status: 'Assigned' }> {
    const submission = sampleSubmissions.find((item) => item.id === submissionId);

    if (!submission) {
        throw new Error('Submission not found.');
    }

    if (context.userRole !== 'Instructor' && context.userRole !== 'Admin') {
        throw new Error('Only Instructors or Admins can assign reviewers.');
    }

    if (!validReviewers.has(reviewerId)) {
        throw new Error('reviewerId must reference a valid Reviewer user.');
    }

    const managedCourseIds = context.managedCourseIds ?? [];
    const assignmentCourseId = 'course-1';
    if (managedCourseIds.length > 0 && !managedCourseIds.includes(assignmentCourseId)) {
        throw new Error('Access denied. You do not manage this course.');
    }

    submission.reviewerId = reviewerId;
    submission.status = 'Submitted';

    return {
        submissionId: submission.id,
        reviewerId,
        status: 'Assigned',
    };
}

export async function getInstructorCourseSubmissions(
    courseId: string,
    instructorId: string,
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        managedCourseIds?: string[];
    } = {},
): Promise<InstructorSubmissionRow[]> {
    if (context.userRole !== 'Instructor') {
        throw new Error('Only Instructors can view submissions.');
    }

    const managedCourseIds = context.managedCourseIds ?? instructorManagedCourses[instructorId] ?? [];
    if (!managedCourseIds.includes(courseId)) {
        throw new Error('Access denied. You do not manage this course.');
    }

    const learners = [
        { id: 'learner-1', name: 'Alice Learner' },
        { id: 'learner-2', name: 'Bob Learner' },
        { id: 'learner-3', name: 'Cara Learner' },
    ];

    return learners.map((learner) => {
        const submission = sampleSubmissions.find(
            (item) => item.assignmentId === 'assignment-1' && item.learnerId === learner.id,
        );

        return {
            submissionId: submission?.id,
            learnerId: learner.id,
            learnerName: learner.name,
            assignmentId: 'assignment-1',
            assignmentTitle: 'Journey map critique',
            submittedAt: submission?.submittedAt,
            status: submission ? 'Submitted' : 'Not Submitted',
        };
    });
}

export async function gradeSubmission(
    submissionId: string,
    payload: GradeFeedback,
    context: { userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin'; reviewerId?: string } = {},
): Promise<Submission & { grade: number; feedback: string; reviewerId: string }> {
    const submission = sampleSubmissions.find((item) => item.id === submissionId);

    if (!submission) {
        throw new Error('Submission not found.');
    }

    if (context.userRole !== 'Instructor' && context.userRole !== 'Reviewer') {
        throw new Error('Only Instructors or Reviewers can grade this submission.');
    }

    if (context.userRole === 'Reviewer') {
        const reviewerId = payload.reviewerId ?? context.reviewerId ?? null;
        if (!reviewerId || submission.reviewerId !== reviewerId) {
            throw new Error('Access denied. This submission is not assigned to this reviewer.');
        }
    }

    if (submission.status === 'Graded') {
        throw new Error('This submission is already graded.');
    }

    if (!payload.feedback || payload.feedback.trim().length === 0) {
        throw new Error('Feedback cannot be empty.');
    }

    const grade = gradeResult(submission, payload.grade);

    if (grade < 0 || grade > 100) {
        throw new Error('Grade must be between 0 and 100.');
    }

    submission.grade = grade;
    submission.feedback = payload.feedback.trim();
    submission.reviewerId = payload.reviewerId ?? submission.reviewerId ?? 'instructor-1';
    submission.status = 'Graded';

    return {
        ...submission,
        grade,
        feedback: payload.feedback.trim(),
        reviewerId: submission.reviewerId,
    };
}
