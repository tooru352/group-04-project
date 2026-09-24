export default function InstructorDashboardPage({ session, roleData = { users: [], courses: [], assignments: [] } }) {
    const courses = Array.isArray(roleData.courses) ? roleData.courses : [];
    const assignments = Array.isArray(roleData.assignments) ? roleData.assignments : [];

    return (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>Teaching dashboard</h3>
                <ul className="module-list">
                    <li><span>Managed courses</span><span className="badge green">{courses.length}</span></li>
                    <li><span>Assignments</span><span className="badge blue">{assignments.length}</span></li>
                    <li><span>Instructor</span><span className="badge orange">{session?.name || 'Instructor'}</span></li>
                </ul>
            </div>

            <div className="panel-card">
                <h4>Course coverage</h4>
                <ul className="task-list">
                    {courses.length > 0 ? courses.slice(0, 3).map((course) => (
                        <li key={course.id}>
                            <span>{course.title}</span>
                            <span className="badge purple">{course.category}</span>
                        </li>
                    )) : <li><span>No course data loaded</span></li>}
                </ul>
            </div>
        </div>
    )
}
