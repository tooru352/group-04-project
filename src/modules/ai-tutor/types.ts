export type TutorQuestion = {
    lessonId: string;
    learnerId: string;
    question: string;
    intent?: 'explain' | 'example';
};

export type TutorReference = {
    lessonId: string;
    snippet: string;
};

export type TutorAnswer = {
    lessonId: string;
    answer: string;
    references: TutorReference[];
    status: 'success' | 'insufficient_context';
};
