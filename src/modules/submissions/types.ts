export type Submission = {
    id: string;
    assignmentId: string;
    learnerId: string;
    answer: string;
    submittedAt: string;
    status: 'Submitted' | 'Late' | 'Graded';
    grade?: number;
    feedback?: string;
    reviewerId?: string;
};

export type GradeFeedback = {
    submissionId: string;
    grade: number;
    feedback: string;
    reviewerId?: string;
};
