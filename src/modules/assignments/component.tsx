import type { Assignment } from './types';

type AssignmentCardProps = {
    assignment: Assignment;
    onSubmit?: () => void;
};

export default function AssignmentCard({ assignment, onSubmit }: AssignmentCardProps) {
    return (
        <article>
            <h2>{assignment.title}</h2>
            <p>{assignment.instructions}</p>
            <p>Deadline: {assignment.deadline}</p>
            <p>Status: {assignment.status}</p>
            <button type="button" onClick={() => onSubmit?.()}>
                Submit assignment
            </button>
        </article>
    );
}
