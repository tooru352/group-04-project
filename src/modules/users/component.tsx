import type { UserProfile } from './types';

type UserListProps = {
    users: UserProfile[];
};

export default function UserList({ users }: UserListProps) {
    return (
        <section>
            <h2>User Directory</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <p>{user.name}</p>
                        <small>{user.role}</small>
                    </li>
                ))}
            </ul>
        </section>
    );
}
