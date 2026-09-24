import type { ReviewAssignment } from './types.ts';

export function canReview(review: ReviewAssignment): boolean {
    return review.status !== 'Reviewed';
}
