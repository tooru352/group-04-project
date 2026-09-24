export type ReviewAssignment = {
    id: string;
    submissionId: string;
    reviewerId: string;
    status: 'Assigned' | 'InReview' | 'Reviewed';
};

export type ReviewDecision = {
    reviewId: string;
    grade: number;
    feedback: string;
    reviewedAt: string;
};
