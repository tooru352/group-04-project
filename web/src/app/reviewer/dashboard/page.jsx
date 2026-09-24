export default function ReviewerDashboardPage({ session, roleData = { users: [], courses: [], assignments: [] } }) {
    const assignments = Array.isArray(roleData.assignments) ? roleData.assignments : [];
    const users = Array.isArray(roleData.users) ? roleData.users : [];

    return (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>Review queue</h3>
                <ul className="module-list">
                    <li><span>Open assignments</span><span className="badge orange">{assignments.length}</span></li>
                    <li><span>Review team</span><span className="badge blue">{users.filter((user) => user.role === 'Reviewer').length}</span></li>
                    <li><span>Reviewer</span><span className="badge purple">{session?.name || 'Reviewer'}</span></li>
                </ul>
            </div>

            <div className="panel-card">
                <h4>Pending review items</h4>
                <ul className="task-list">
                    {assignments.length > 0 ? assignments.slice(0, 3).map((assignment) => (
                        <li key={assignment.id}>
                            <span>{assignment.title}</span>
                            <span className="badge blue">{assignment.status || 'Published'}</span>
                        </li>
                    )) : <li><span>No review data loaded</span></li>}
                </ul>
            </div>
        </div>
    )
}
