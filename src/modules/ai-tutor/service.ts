import type { TutorAnswer, TutorQuestion } from './types.ts';
import { evaluateTutorContext } from './domain.ts';

export async function askTutor(
    question: TutorQuestion,
    lessonContext: string,
    context: { userRole?: 'Learner' | 'Instructor' | 'Reviewer' | 'Admin'; enrolledLessonIds?: string[] } = {},
): Promise<TutorAnswer> {
    if (!question.question.trim()) {
        throw new Error('Question is required.');
    }

    const requestedRole = context.userRole ?? 'Learner';
    if (requestedRole !== 'Learner') {
        throw new Error('Only Learners can ask the tutor.');
    }

    const enrolledLessonIds = context.enrolledLessonIds ?? [];
    if (!enrolledLessonIds.includes(question.lessonId)) {
        throw new Error('Access denied. Enroll in the course to ask the tutor.');
    }

    return evaluateTutorContext(question, lessonContext);
}
