export type Assignment = {
    id: string;
    courseId: string;
    title: string;
    instructions: string;
    deadline: string;
    allowsResubmission: boolean;
    status: 'Incomplete' | 'Submitted' | 'Late' | 'Graded';
};

export type SubmissionDraft = {
    assignmentId: string;
    learnerId: string;
    answer: string;
    submittedAt?: string;
};

export type SubmissionResult = {
    id: string;
    assignmentId: string;
    status: 'Submitted' | 'Late';
    submittedAt: string;
    isLate: boolean;
    submitted: boolean;
    late: boolean;
    attempt: number;
};
