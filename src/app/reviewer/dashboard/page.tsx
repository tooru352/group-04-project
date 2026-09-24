export default function ReviewerDashboardPage() {
    return (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>Review queue</h3>
                <ul className="module-list">
                    <li><span>Peer review cases</span><span className="badge orange">18 open</span></li>
                    <li><span>Quality scoring</span><span className="badge blue">94 avg</span></li>
                    <li><span>Escalations</span><span className="badge purple">3 urgent</span></li>
                </ul>
            </div>

            <div className="panel-card">
                <h4>Standards</h4>
                <ul className="task-list">
                    <li><span>Rubric calibration</span><span className="badge green">Updated</span></li>
                    <li><span>Feedback turnaround</span><span className="badge blue">1.8 days</span></li>
                    <li><span>Exceptions</span><span className="badge orange">2 flags</span></li>
                </ul>
            </div>
        </div>
    );
}
