export default function AdminConsolePage() {
    return (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>Admin overview</h3>
                <ul className="module-list">
                    <li><span>Course catalog</span><span className="badge purple">24 updates</span></li>
                    <li><span>User access</span><span className="badge blue">128 active</span></li>
                    <li><span>Compliance checks</span><span className="badge green">All clear</span></li>
                </ul>
            </div>

            <div className="panel-card">
                <h4>Operations</h4>
                <ul className="task-list">
                    <li><span>Audit queue</span><span className="badge orange">12</span></li>
                    <li><span>Role approvals</span><span className="badge blue">5 pending</span></li>
                    <li><span>Platform alerts</span><span className="badge green">Low risk</span></li>
                </ul>
            </div>
        </div>
    );
}
