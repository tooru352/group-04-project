import type { Assignment, SubmissionDraft } from './types.ts';
import { canSubmitAssignment, isLateSubmission } from './domain.ts';

const sampleAssignments: Assignment[] = [
    {
        id: 'assignment-1',
        courseId: 'course-1',
        title: 'Journey map critique',
        instructions: 'Review the journey map and provide feedback using the lesson context.',
        deadline: '2026-10-01T00:00:00.000Z',
        allowsResubmission: true,
        status: 'Incomplete',
    },
    {
        id: 'assignment-2',
        courseId: 'course-1',
        title: 'Peer review memo',
        instructions: 'Write a short peer-review memo without resubmission.',
        deadline: '2026-10-10T00:00:00.000Z',
        allowsResubmission: false,
        status: 'Incomplete',
    },
    {
        id: 'assignment-3',
        courseId: 'course-1',
        title: 'Deadline expired reflection',
        instructions: 'Submit your final reflection. The deadline has passed.',
        deadline: '2026-09-30T00:00:00.000Z',
        allowsResubmission: true,
        status: 'Incomplete',
    },
];

const submissionAttempts = new Map<string, number>();

export async function getAssignments(courseId: string): Promise<Assignment[]> {
    return sampleAssignments.filter((assignment) => assignment.courseId === courseId);
}

export async function createAssignment(
    courseId: string,
    input: {
        title: string;
        instructions: string;
        deadline: string;
        maxAttempts: number;
        allowsResubmission: boolean;
    },
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        managedCourseIds?: string[];
    } = {},
): Promise<Assignment & { maxAttempts: number; allowsResubmission: boolean }> {
    if (context.userRole !== 'Instructor') {
        throw new Error('Only Instructors can manage assignments.');
    }

    const managedCourseIds = context.managedCourseIds ?? [];
    if (managedCourseIds.length > 0 && !managedCourseIds.includes(courseId)) {
        throw new Error('Access denied. You do not manage this course.');
    }

    const title = input.title?.trim() ?? '';
    if (!title) {
        throw new Error('Title cannot be empty.');
    }

    const instructions = input.instructions?.trim() ?? '';
    if (!instructions) {
        throw new Error('Instructions cannot be empty.');
    }

    const deadline = input.deadline ?? '';
    if (!deadline || Number.isNaN(Date.parse(deadline))) {
        throw new Error('Deadline must be a valid timestamp.');
    }

    if (input.maxAttempts < 1) {
        throw new Error('maxAttempts must be at least 1.');
    }

    const assignment: Assignment & { maxAttempts: number; allowsResubmission: boolean } = {
        id: `assignment-${Date.now()}`,
        courseId,
        title,
        instructions,
        deadline,
        status: 'Incomplete',
        allowsResubmission: input.allowsResubmission,
        maxAttempts: input.maxAttempts,
    };

    sampleAssignments.push(assignment as Assignment);
    return assignment;
}

export async function updateAssignment(
    assignmentId: string,
    input: Partial<{ title: string; instructions: string; deadline: string; maxAttempts: number; allowsResubmission: boolean }>,
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        managedCourseIds?: string[];
    } = {},
): Promise<Assignment & { maxAttempts: number; allowsResubmission: boolean }> {
    const assignment = sampleAssignments.find((item) => item.id === assignmentId);
    if (!assignment) {
        throw new Error('Assignment not found.');
    }

    if (context.userRole !== 'Instructor') {
        throw new Error('Only Instructors can update assignments.');
    }

    const managedCourseIds = context.managedCourseIds ?? [];
    if (managedCourseIds.length > 0 && !managedCourseIds.includes(assignment.courseId)) {
        throw new Error('Access denied. You do not manage this course.');
    }

    const nextTitle = input.title?.trim() ?? assignment.title;
    if (!nextTitle) {
        throw new Error('Title cannot be empty.');
    }

    if (input.maxAttempts !== undefined && input.maxAttempts < 1) {
        throw new Error('maxAttempts must be at least 1.');
    }

    if (input.deadline !== undefined) {
        const parsed = Date.parse(input.deadline);
        if (!input.deadline || Number.isNaN(parsed)) {
            throw new Error('Deadline must be a valid timestamp.');
        }
    }

    const updated = {
        ...assignment,
        title: nextTitle,
        instructions: input.instructions?.trim() ?? assignment.instructions,
        deadline: input.deadline ?? assignment.deadline,
        allowsResubmission: input.allowsResubmission ?? assignment.allowsResubmission,
        maxAttempts: input.maxAttempts ?? (assignment as any).maxAttempts ?? 1,
    };

    const index = sampleAssignments.findIndex((item) => item.id === assignmentId);
    sampleAssignments[index] = updated as Assignment;
    return updated as Assignment & { maxAttempts: number; allowsResubmission: boolean };
}

export async function getAssignmentById(
    assignmentId: string,
    learnerId: string,
    context: {
        userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin';
        enrolledCourseIds?: string[];
    } = {},
): Promise<Assignment & { submissionStatus: 'Incomplete' | 'Submitted' | 'Late' | 'Graded' }> {
    const assignment = sampleAssignments.find((item) => item.id === assignmentId);

    if (!assignment) {
        throw new Error('Assignment not found.');
    }

    if (context.userRole !== 'Learner') {
        throw new Error('Only Learners can view assignments.');
    }

    const enrolledCourseIds = context.enrolledCourseIds ?? [];
    if (!enrolledCourseIds.includes(assignment.courseId)) {
        throw new Error('Access denied. Enroll in the course to view this assignment.');
    }

    return {
        ...assignment,
        submissionStatus: assignment.status,
    };
}

export async function submitAssignment(
    payload: SubmissionDraft & { userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin'; enrolledCourseIds?: string[] },
): Promise<{ id: string; assignmentId: string; status: 'Submitted' | 'Late'; submittedAt: string; isLate: boolean; submitted: boolean; late: boolean; attempt: number }> {
    const assignment = sampleAssignments.find((item) => item.id === payload.assignmentId);

    if (!assignment) {
        throw new Error('Assignment not found.');
    }

    if (payload.userRole !== 'Learner') {
        throw new Error('Only Learners can submit assignments.');
    }

    const enrolledCourseIds = payload.enrolledCourseIds ?? [];
    if (!enrolledCourseIds.includes(assignment.courseId)) {
        throw new Error('Access denied. Enroll in the course to submit this assignment.');
    }

    if (!canSubmitAssignment(assignment, payload.answer)) {
        throw new Error('Assignment answer cannot be empty.');
    }

    const now = new Date();
    const key = `${payload.learnerId}:${assignment.id}`;
    const previousAttemptCount = submissionAttempts.get(key) ?? 0;

    if (previousAttemptCount > 0) {
        if (!assignment.allowsResubmission) {
            throw new Error('RESUBMISSION_NOT_ALLOWED');
        }

        if (assignment.deadline && now.getTime() >= new Date(assignment.deadline).getTime()) {
            throw new Error('PAST_DEADLINE');
        }
    }

    const attempt = previousAttemptCount + 1;
    const submittedAt = now.toISOString();
    const late = isLateSubmission(assignment, submittedAt);
    assignment.status = late ? 'Late' : 'Submitted';
    submissionAttempts.set(key, attempt);

    return {
        id: `submission-${assignment.id}-${payload.learnerId}-${Date.now()}`,
        assignmentId: assignment.id,
        status: assignment.status,
        submittedAt,
        isLate: late,
        submitted: true,
        late,
        attempt,
    };
}
