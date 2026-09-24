import type { ReviewAssignment } from './types';

type ReviewQueueProps = {
    reviews: ReviewAssignment[];
    onReview?: (reviewId: string) => void;
};

export default function ReviewQueue({ reviews, onReview }: ReviewQueueProps) {
    return (
        <section>
            <h2>Assigned Reviews</h2>
            <ul>
                {reviews.map((review) => (
                    <li key={review.id}>
                        <span>{review.status}</span>
                        <button type="button" onClick={() => onReview?.(review.id)}>
                            Review
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
