export default function LearnerDashboardPage() {
    return (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>My learning track</h3>
                <ul className="module-list">
                    <li><span>AI Fundamentals</span><span className="badge blue">82%</span></li>
                    <li><span>UX Research Lab</span><span className="badge green">On track</span></li>
                    <li><span>Capstone sprint</span><span className="badge orange">3 tasks left</span></li>
                </ul>

                <div className="progress-box">
                    <div className="progress-row">
                        <span><strong>Course completion</strong><strong>72%</strong></span>
                        <div className="bar"><i style={{ width: '72%' }} /></div>
                    </div>
                    <div className="progress-row">
                        <span><strong>Assignment score</strong><strong>89%</strong></span>
                        <div className="bar"><i style={{ width: '89%' }} /></div>
                    </div>
                </div>
            </div>

            <div className="panel-card">
                <h4>Next actions</h4>
                <ul className="task-list">
                    <li><span>Submit case study</span><span className="badge blue">Today</span></li>
                    <li><span>Join mentor workshop</span><span className="badge green">Tomorrow</span></li>
                    <li><span>Review AI tutor feedback</span><span className="badge purple">Unread</span></li>
                </ul>
            </div>
        </div>
    );
}
