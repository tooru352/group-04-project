import type { TutorAnswer, TutorQuestion } from './types.ts';

export function evaluateTutorContext(question: TutorQuestion, lessonContext: string): TutorAnswer {
    const normalized = `${lessonContext} ${question.question}`.toLowerCase();
    const hasContext =
        normalized.includes('empathy') ||
        normalized.includes('journey mapping') ||
        normalized.includes('prototype') ||
        normalized.includes('user need') ||
        normalized.includes('insight');

    if (!hasContext) {
        return {
            lessonId: question.lessonId,
            answer: 'KHÔNG ĐỦ DỮ LIỆU',
            references: [],
            status: 'insufficient_context',
        };
    }

    const snippet = lessonContext.length > 180 ? lessonContext.slice(0, 180) : lessonContext;

    return {
        lessonId: question.lessonId,
        answer: 'Based on this lesson, prioritize user empathy and insight before proposing a solution or journey map update.',
        references: [{ lessonId: question.lessonId, snippet }],
        status: 'success',
    };
}
