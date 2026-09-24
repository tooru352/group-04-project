export default function InstructorDashboardPage() {
    return (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>Teaching dashboard</h3>
                <ul className="module-list">
                    <li><span>Course delivery</span><span className="badge green">Healthy</span></li>
                    <li><span>Student engagement</span><span className="badge blue">89%</span></li>
                    <li><span>Grading backlog</span><span className="badge orange">14 items</span></li>
                </ul>
            </div>

            <div className="panel-card">
                <h4>Instructor actions</h4>
                <ul className="task-list">
                    <li><span>Review submissions</span><span className="badge purple">8</span></li>
                    <li><span>Plan cohort session</span><span className="badge green">Ready</span></li>
                    <li><span>Release lesson notes</span><span className="badge blue">Draft</span></li>
                </ul>
            </div>
        </div>
    );
}
