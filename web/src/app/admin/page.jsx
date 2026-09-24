export default function AdminConsolePage({ session, roleData = { users: [], courses: [], assignments: [] } }) {
    const users = Array.isArray(roleData.users) ? roleData.users : [];
    const courses = Array.isArray(roleData.courses) ? roleData.courses : [];
    const assignments = Array.isArray(roleData.assignments) ? roleData.assignments : [];

    return (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>Admin overview</h3>
                <ul className="module-list">
                    <li><span>User access</span><span className="badge blue">{users.length} active</span></li>
                    <li><span>Course catalog</span><span className="badge purple">{courses.length} courses</span></li>
                    <li><span>Assignments</span><span className="badge green">{assignments.length} total</span></li>
                </ul>
            </div>

            <div className="panel-card">
                <h4>Platform users</h4>
                <ul className="task-list">
                    {users.length > 0 ? users.slice(0, 4).map((user) => (
                        <li key={user.id}>
                            <span>{user.name || user.email}</span>
                            <span className="badge blue">{user.role}</span>
                        </li>
                    )) : <li><span>No user data loaded</span></li>}
                </ul>
            </div>
        </div>
    )
}
