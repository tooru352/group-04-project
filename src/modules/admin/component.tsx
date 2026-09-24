import type { UserRole } from './types';

type AccessTableProps = {
    role: UserRole;
    onRoleChange?: (role: UserRole) => void;
};

export default function AccessTable({ role, onRoleChange }: AccessTableProps) {
    return (
        <section>
            <h2>Admin Console</h2>
            <select value={role} onChange={(event) => onRoleChange?.(event.target.value as UserRole)}>
                <option value="Learner">Learner</option>
                <option value="Instructor">Instructor</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Admin">Admin</option>
            </select>
            <p>Current role: {role}</p>
        </section>
    );
}
