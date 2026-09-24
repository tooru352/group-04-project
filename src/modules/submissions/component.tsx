import type { Submission } from './types';

type SubmissionListProps = {
    submissions: Submission[];
    onGrade?: (submissionId: string) => void;
};

export default function SubmissionList({ submissions, onGrade }: SubmissionListProps) {
    return (
        <section>
            <h2>Submission Review</h2>
            <ul>
                {submissions.map((submission) => (
                    <li key={submission.id}>
                        <p>{submission.answer}</p>
                        <small>{submission.status}</small>
                        <button type="button" onClick={() => onGrade?.(submission.id)}>
                            Review
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
