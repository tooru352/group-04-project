import type { ReviewAssignment, ReviewDecision } from './types.ts';
import { canReview } from './domain.ts';

const sampleReviews: ReviewAssignment[] = [
    {
        id: 'review-1',
        submissionId: 'submission-1',
        reviewerId: 'reviewer-1',
        status: 'Assigned',
    },
];

export async function getAssignedReviews(reviewerId: string): Promise<ReviewAssignment[]> {
    return sampleReviews.filter((review) => review.reviewerId === reviewerId);
}

export async function submitReview(reviewId: string, decision: ReviewDecision): Promise<ReviewAssignment> {
    const review = sampleReviews.find((item) => item.id === reviewId);

    if (!review) {
        throw new Error('Review assignment not found.');
    }

    if (!canReview(review)) {
        throw new Error('This review has already been completed.');
    }

    review.status = 'Reviewed';

    return review;
}
