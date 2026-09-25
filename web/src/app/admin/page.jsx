import { useEffect, useState } from 'react';

const ROLE_OPTIONS = ['Learner', 'Instructor', 'Reviewer', 'Admin'];
const COURSE_STATUS_OPTIONS = ['Draft', 'Published', 'Archived'];

export default function AdminConsolePage({
    session,
    roleData = { users: [], courses: [], assignments: [] },
    activeModule = 'overview',
    onUpdateUserRole,
    onUpdateCourse,
}) {
    const users = Array.isArray(roleData.users) ? roleData.users : [];
    const courses = Array.isArray(roleData.courses) ? roleData.courses : [];
    const assignments = Array.isArray(roleData.assignments) ? roleData.assignments : [];
    const [userDrafts, setUserDrafts] = useState({});
    const [courseDrafts, setCourseDrafts] = useState({});

    useEffect(() => {
        const nextDrafts = {};
        users.forEach((user) => {
            nextDrafts[user.id] = user.role || 'Learner';
        });
        setUserDrafts(nextDrafts);
    }, [users]);

    useEffect(() => {
        const nextDrafts = {};
        courses.forEach((course) => {
            nextDrafts[course.id] = {
                title: course.title || '',
                category: course.category || '',
                status: course.status || 'Published',
            };
        });
        setCourseDrafts(nextDrafts);
    }, [courses]);

    const updateUserRole = async (userId) => {
        const nextRole = userDrafts[userId];
        if (!nextRole || !onUpdateUserRole) return;
        await onUpdateUserRole(userId, nextRole);
    };

    const updateCourse = async (courseId) => {
        const nextCourse = courseDrafts[courseId];
        if (!nextCourse || !onUpdateCourse) return;
        await onUpdateCourse(courseId, {
            title: nextCourse.title,
            category: nextCourse.category,
            status: nextCourse.status,
        });
    };

    const renderOverview = () => (
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
                    {users.length > 0 ? users.slice(0, 5).map((user) => (
                        <li key={user.id}><span>{user.name || user.email}</span><span className="badge blue">{user.role}</span></li>
                    )) : <li><span>No user data loaded</span></li>}
                </ul>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>Platform users</h3>
                <div className="module-list interactive-list">
                    {users.length > 0 ? users.map((user) => (
                        <div key={user.id} className="course-detail-panel">
                            <h5>{user.name || user.email}</h5>
                            <p>{user.email}</p>
                            <div className="course-meta">
                                <label>
                                    <span>Role</span>
                                    <select
                                        value={userDrafts[user.id] || user.role}
                                        onChange={(event) => setUserDrafts((current) => ({ ...current, [user.id]: event.target.value }))}
                                    >
                                        {ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </label>
                            </div>
                            <button type="button" className="primary-action" onClick={() => updateUserRole(user.id)}>Save role</button>
                        </div>
                    )) : <p className="muted-text">No user data loaded</p>}
                </div>
            </div>

            <div className="panel-card">
                <h3>Access management</h3>
                <ul className="module-list">
                    <li><span>Admins</span><span className="badge purple">{users.filter((user) => user.role === 'Admin').length}</span></li>
                    <li><span>Instructors</span><span className="badge green">{users.filter((user) => user.role === 'Instructor').length}</span></li>
                    <li><span>Learners</span><span className="badge blue">{users.filter((user) => user.role === 'Learner').length}</span></li>
                </ul>
            </div>
        </div>
    );

    const renderCourses = () => (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>Course management</h3>
                <div className="module-list interactive-list">
                    {courses.length > 0 ? courses.map((course) => (
                        <div key={course.id} className="course-detail-panel">
                            <h5>{course.title}</h5>
                            <label>
                                <span>Title</span>
                                <input
                                    type="text"
                                    value={courseDrafts[course.id]?.title ?? course.title ?? ''}
                                    onChange={(event) => setCourseDrafts((current) => ({
                                        ...current,
                                        [course.id]: {
                                            ...(current[course.id] || { title: course.title || '', category: course.category || '', status: course.status || 'Published' }),
                                            title: event.target.value,
                                        },
                                    }))}
                                />
                            </label>
                            <label>
                                <span>Category</span>
                                <input
                                    type="text"
                                    value={courseDrafts[course.id]?.category ?? course.category ?? ''}
                                    onChange={(event) => setCourseDrafts((current) => ({
                                        ...current,
                                        [course.id]: {
                                            ...(current[course.id] || { title: course.title || '', category: course.category || '', status: course.status || 'Published' }),
                                            category: event.target.value,
                                        },
                                    }))}
                                />
                            </label>
                            <label>
                                <span>Status</span>
                                <select
                                    value={courseDrafts[course.id]?.status ?? course.status ?? 'Published'}
                                    onChange={(event) => setCourseDrafts((current) => ({
                                        ...current,
                                        [course.id]: {
                                            ...(current[course.id] || { title: course.title || '', category: course.category || '', status: course.status || 'Published' }),
                                            status: event.target.value,
                                        },
                                    }))}
                                >
                                    {COURSE_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </label>
                            <button type="button" className="primary-action" onClick={() => updateCourse(course.id)}>Save course</button>
                        </div>
                    )) : <p className="muted-text">No course data loaded</p>}
                </div>
            </div>

            <div className="panel-card">
                <h3>Catalog health</h3>
                <ul className="module-list">
                    <li><span>Published</span><span className="badge green">{courses.filter((course) => course.status === 'Published').length}</span></li>
                    <li><span>Draft</span><span className="badge orange">{courses.filter((course) => course.status !== 'Published').length}</span></li>
                    <li><span>Tags</span><span className="badge blue">{new Set(courses.map((course) => course.category).filter(Boolean)).size}</span></li>
                </ul>
            </div>
        </div>
    );

    const renderReports = () => (
        <div className="dashboard-layout">
            <div className="panel-card">
                <h3>Reports</h3>
                <ul className="module-list">
                    <li><span>Active learners</span><span className="badge blue">{users.filter((user) => user.role === 'Learner').length}</span></li>
                    <li><span>Assignments created</span><span className="badge purple">{assignments.length}</span></li>
                    <li><span>Course completion</span><span className="badge green">74%</span></li>
                </ul>
            </div>

            <div className="panel-card">
                <h3>Operational trends</h3>
                <ul className="module-list">
                    <li><span>Engagement</span><span className="badge green">+12%</span></li>
                    <li><span>Drop-off</span><span className="badge orange">-4%</span></li>
                    <li><span>Avg. score</span><span className="badge blue">88%</span></li>
                </ul>
            </div>
        </div>
    );

    if (activeModule === 'users') return renderUsers();
    if (activeModule === 'courses') return renderCourses();
    if (activeModule === 'reports') return renderReports();
    return renderOverview();
}
