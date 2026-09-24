export default function LearnerDashboardPage({ session, roleData = { users: [], courses: [], assignments: [] } }) {
    const courses = Array.isArray(roleData.courses) ? roleData.courses : [];
    const assignments = Array.isArray(roleData.assignments) ? roleData.assignments : [];

    return (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>My learning track</h3>
                <ul className="module-list">
                    {courses.length > 0 ? courses.slice(0, 3).map((course) => (
                        <li key={course.id}>
                            <span>{course.title}</span>
                            <span className="badge blue">{course.status}</span>
                        </li>
                    )) : <li><span>No course data loaded</span></li>}
                </ul>

                <div className="progress-box">
                    <div className="progress-row">
                        <span><strong>Course catalog</strong><strong>{courses.length}</strong></span>
                        <div className="bar"><i style={{ width: `${Math.min((courses.length / 3) * 100, 100)}%` }} /></div>
                    </div>
                    <div className="progress-row">
                        <span><strong>Assignments</strong><strong>{assignments.length}</strong></span>
                        <div className="bar"><i style={{ width: `${Math.min((assignments.length / 3) * 100, 100)}%` }} /></div>
                    </div>
                </div>
            </div>

            <div className="panel-card">
                <h4>Upcoming coursework</h4>
                <ul className="task-list">
                    {assignments.length > 0 ? assignments.slice(0, 3).map((assignment) => (
                        <li key={assignment.id}>
                            <span>{assignment.title}</span>
                            <span className="badge blue">{assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'No deadline'}</span>
                        </li>
                    )) : <li><span>No assignment data loaded</span></li>}
                </ul>
            </div>
        </div>
    )
}
