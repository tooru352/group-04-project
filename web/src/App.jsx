import { useEffect, useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:4000'

const roleConfig = [
  {
    id: 'admin',
    name: 'Admin',
    summary: 'People, policies, platform health',
    accent: 'purple',
  },
  {
    id: 'learner',
    name: 'Learner',
    summary: 'Courses, lessons, assignments',
    accent: 'blue',
  },
  {
    id: 'instructor',
    name: 'Instructor',
    summary: 'Teaching flow and grading',
    accent: 'green',
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    summary: 'Quality review and feedback',
    accent: 'orange',
  },
]

const roleModules = {
  admin: [
    { id: 'overview', label: 'Overview', summary: 'Platform health' },
    { id: 'users', label: 'Users', summary: 'People and access' },
    { id: 'courses', label: 'Courses', summary: 'Catalog and quality' },
    { id: 'reports', label: 'Reports', summary: 'Analytics and usage' },
  ],
  learner: [
    { id: 'overview', label: 'Overview', summary: 'My learning track' },
    { id: 'courses', label: 'Courses', summary: 'My enrolled courses' },
    { id: 'assignments', label: 'Assignments', summary: 'Task and deadlines' },
    { id: 'grades', label: 'Grades', summary: 'Progress and performance' },
    { id: 'ai-tutor', label: 'AI Tutor', summary: 'Ask an AI learning coach' },
  ],
  instructor: [
    { id: 'overview', label: 'Overview', summary: 'Teaching dashboard' },
    { id: 'courses', label: 'Courses', summary: 'Class management' },
    { id: 'assignments', label: 'Assignments', summary: 'Set and grade work' },
    { id: 'submissions', label: 'Submissions', summary: 'Review learner work' },
  ],
  reviewer: [
    { id: 'overview', label: 'Overview', summary: 'Review queue' },
    { id: 'reviews', label: 'Reviews', summary: 'Pending quality checks' },
    { id: 'feedback', label: 'Feedback', summary: 'Comments and outcomes' },
    { id: 'history', label: 'History', summary: 'Previous evaluations' },
  ],
}

function RoleModuleScreen({ role, session, roleData, activeModule }) {
  const courses = Array.isArray(roleData.courses) ? roleData.courses : []
  const users = Array.isArray(roleData.users) ? roleData.users : []
  const assignments = Array.isArray(roleData.assignments) ? roleData.assignments : []

  const card = (title, body, accent = 'blue') => (
    <div className="panel-card" key={title}>
      <h3>{title}</h3>
      <ul className="module-list">
        {body.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <span className={`badge ${accent}`}>{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  if (role === 'learner') {
    if (activeModule === 'ai-tutor') {
      return (
        <div className="ai-tutor-shell">
          <div className="panel-card ai-tutor-panel">
            <h3>AI Tutor</h3>
            <p className="ai-tutor-subtitle">Ask for course guidance, assignments help, or revision suggestions.</p>
            <div className="ai-tutor-form">
              <textarea
                value={session?.aiPrompt || ''}
                onChange={(event) => session?.setAiPrompt?.(event.target.value)}
                placeholder="Example: How should I structure my assignment response?"
              />
              <button type="button" className="primary-action" onClick={session?.handleAiAsk} disabled={session?.aiLoading || false}>
                {session?.aiLoading ? 'Thinking...' : 'Ask AI Tutor'}
              </button>
            </div>
            <div className="ai-tutor-response">
              {session?.aiLoading ? <p>Generating guidance...</p> : null}
              {!session?.aiLoading && session?.aiAnswer ? <p>{session.aiAnswer}</p> : null}
              {!session?.aiLoading && !session?.aiAnswer ? <p className="muted-text">Ask a question to get learning guidance and assignment support.</p> : null}
            </div>
          </div>
        </div>
      )
    }

    if (activeModule === 'courses') {
      return (
        <div className="dashboard-layout">
          {card('My courses', courses.slice(0, 4).map((course) => ({ label: course.title, value: course.status || 'Published' })), 'blue')}
          {card('Recent activity', [
            { label: 'Completed lessons', value: '12' },
            { label: 'Current streak', value: '5 days' },
            { label: 'Next due', value: 'Today' },
          ], 'green')}
        </div>
      )
    }

    if (activeModule === 'assignments') {
      return (
        <div className="dashboard-layout">
          {card('Assignment queue', assignments.slice(0, 4).map((assignment) => ({ label: assignment.title, value: assignment.status || 'Open' })), 'orange')}
          {card('Deadlines', [
            { label: 'Submission due this week', value: '3' },
            { label: 'Pending review', value: '1' },
            { label: 'Improvement goals', value: '2' },
          ], 'blue')}
        </div>
      )
    }

    if (activeModule === 'grades') {
      return (
        <div className="dashboard-layout">
          {card('Performance', [
            { label: 'Current average', value: '92%' },
            { label: 'Assignments passed', value: '8/10' },
            { label: 'Course completion', value: '74%' },
          ], 'green')}
          {card('Progress checklist', [
            { label: 'Reading modules', value: 'Done' },
            { label: 'Practice tasks', value: 'In progress' },
            { label: 'Final project', value: 'Planned' },
          ], 'purple')}
        </div>
      )
    }

    return (
      <div className="dashboard-layout">
        {card('Learning overview', [
          { label: 'Enrolled courses', value: String(courses.length) },
          { label: 'Open assignments', value: String(assignments.length) },
          { label: 'Learning streak', value: '5 days' },
        ], 'blue')}
        {card('Upcoming work', assignments.slice(0, 3).map((item) => ({ label: item.title, value: item.status || 'Published' })), 'orange')}
      </div>
    )
  }

  if (role === 'instructor') {
    if (activeModule === 'courses') {
      return (
        <div className="dashboard-layout">
          {card('Managed courses', courses.slice(0, 4).map((course) => ({ label: course.title, value: course.category || 'Course' })), 'green')}
          {card('Course health', [
            { label: 'Published courses', value: String(courses.filter((course) => course.status === 'Published').length) },
            { label: 'Draft courses', value: String(courses.filter((course) => course.status !== 'Published').length) },
            { label: 'Students active', value: '84' },
          ], 'blue')}
        </div>
      )
    }

    if (activeModule === 'assignments') {
      return (
        <div className="dashboard-layout">
          {card('Assignments', assignments.slice(0, 4).map((assignment) => ({ label: assignment.title, value: assignment.status || 'Open' })), 'purple')}
          {card('Grading flow', [
            { label: 'Needs grading', value: '3' },
            { label: 'Awaiting review', value: '2' },
            { label: 'Average score', value: '88%' },
          ], 'orange')}
        </div>
      )
    }

    if (activeModule === 'submissions') {
      return (
        <div className="dashboard-layout">
          {card('Submission queue', [
            { label: 'Alice Learner', value: 'Draft' },
            { label: 'Bob Team', value: 'Submitted' },
            { label: 'Review ready', value: '2' },
          ], 'orange')}
          {card('Feedback backlog', [
            { label: 'Late submissions', value: '1' },
            { label: 'Needs comment', value: '4' },
            { label: 'Rubric updates', value: '2' },
          ], 'green')}
        </div>
      )
    }

    return (
      <div className="dashboard-layout">
        {card('Teaching overview', [
          { label: 'Managed courses', value: String(courses.length) },
          { label: 'Assignments', value: String(assignments.length) },
          { label: 'Instructor', value: session?.name || 'Instructor' },
        ], 'green')}
        {card('Teaching priorities', [
          { label: 'Class review', value: 'This week' },
          { label: 'Feedback queue', value: '5' },
          { label: 'Mentoring', value: '2 sessions' },
        ], 'blue')}
      </div>
    )
  }

  if (role === 'reviewer') {
    if (activeModule === 'reviews') {
      return (
        <div className="dashboard-layout">
          {card('Review queue', assignments.slice(0, 4).map((assignment) => ({ label: assignment.title, value: assignment.status || 'Pending' })), 'orange')}
          {card('Quality checks', [
            { label: 'High priority', value: '4' },
            { label: 'In progress', value: '2' },
            { label: 'Completed', value: '9' },
          ], 'purple')}
        </div>
      )
    }

    if (activeModule === 'feedback') {
      return (
        <div className="dashboard-layout">
          {card('Feedback cases', [
            { label: 'Content issues', value: '3' },
            { label: 'Policy alerts', value: '1' },
            { label: 'Resolved this week', value: '7' },
          ], 'blue')}
          {card('Reviewer notes', [
            { label: 'Template library', value: 'Ready' },
            { label: 'Escalations', value: '2' },
            { label: 'Audit trail', value: 'Updated' },
          ], 'green')}
        </div>
      )
    }

    if (activeModule === 'history') {
      return (
        <div className="dashboard-layout">
          {card('Review history', [
            { label: 'This month', value: '18' },
            { label: 'Average turnaround', value: '2.4d' },
            { label: 'Follow-ups', value: '6' },
          ], 'green')}
          {card('Previous actions', [
            { label: 'Approved bundles', value: '12' },
            { label: 'Flagged items', value: '3' },
            { label: 'Escalated', value: '2' },
          ], 'orange')}
        </div>
      )
    }

    return (
      <div className="dashboard-layout">
        {card('Review overview', [
          { label: 'Open reviews', value: String(assignments.length) },
          { label: 'Team members', value: String(users.filter((user) => user.role === 'Reviewer').length) },
          { label: 'Reviewer', value: session?.name || 'Reviewer' },
        ], 'orange')}
        {card('Priority queue', [
          { label: 'Needs action', value: '4' },
          { label: 'Awaiting response', value: '2' },
          { label: 'Escalations', value: '1' },
        ], 'blue')}
      </div>
    )
  }

  if (activeModule === 'users') {
    return (
      <div className="dashboard-layout">
        {card('Platform users', users.slice(0, 5).map((user) => ({ label: user.name || user.email, value: user.role })), 'purple')}
        {card('Access management', [
          { label: 'Admins', value: String(users.filter((user) => user.role === 'Admin').length) },
          { label: 'Instructors', value: String(users.filter((user) => user.role === 'Instructor').length) },
          { label: 'Learners', value: String(users.filter((user) => user.role === 'Learner').length) },
        ], 'blue')}
      </div>
    )
  }

  if (activeModule === 'courses') {
    return (
      <div className="dashboard-layout">
        {card('Course catalog', courses.slice(0, 4).map((course) => ({ label: course.title, value: course.status || 'Published' })), 'blue')}
        {card('Catalog health', [
          { label: 'Published', value: String(courses.filter((course) => course.status === 'Published').length) },
          { label: 'Draft', value: String(courses.filter((course) => course.status !== 'Published').length) },
          { label: 'Tags', value: String(new Set(courses.map((course) => course.category).filter(Boolean)).size) },
        ], 'green')}
      </div>
    )
  }

  if (activeModule === 'reports') {
    return (
      <div className="dashboard-layout">
        {card('Reports', [
          { label: 'Active learners', value: String(users.filter((user) => user.role === 'Learner').length) },
          { label: 'Assignments created', value: String(assignments.length) },
          { label: 'Course completion', value: '74%' },
        ], 'purple')}
        {card('Operational trends', [
          { label: 'Engagement', value: '+12%' },
          { label: 'Drop-off', value: '-4%' },
          { label: 'Avg. score', value: '88%' },
        ], 'orange')}
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      {card('Overview', [
        { label: 'System users', value: String(users.length) },
        { label: 'Courses', value: String(courses.length) },
        { label: 'Assignments', value: String(assignments.length) },
      ], 'purple')}
      {card('Platform status', [
        { label: 'Admin', value: session?.name || 'Admin' },
        { label: 'Sync status', value: 'Live' },
        { label: 'Maintenance', value: 'None' },
      ], 'green')}
    </div>
  )
}

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed for ${url}`)
  }

  return response.json()
}

function App() {
  const [activeRole, setActiveRole] = useState('admin')
  const [activeModule, setActiveModule] = useState('overview')
  const [session, setSession] = useState(null)
  const [form, setForm] = useState({ email: 'alice@lms.test', password: 'learner123' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [roleData, setRoleData] = useState({ users: [], courses: [], assignments: [] })
  const [dataLoading, setDataLoading] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (!session) {
      setRoleData({ users: [], courses: [], assignments: [] })
      return
    }

    let isCancelled = false

    async function loadDashboardData() {
      setDataLoading(true)

      try {
        const [usersResponse, coursesResponse, assignmentsResponse] = await Promise.all([
          fetchJson(`${API_BASE}/api/users`),
          fetchJson(`${API_BASE}/api/courses`),
          fetchJson(`${API_BASE}/api/assignments`),
        ])

        if (!isCancelled) {
          setRoleData({
            users: usersResponse.users || [],
            courses: coursesResponse.courses || [],
            assignments: assignmentsResponse.assignments || [],
          })
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message || 'Không thể tải dữ liệu dashboard.')
        }
      } finally {
        if (!isCancelled) {
          setDataLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      isCancelled = true
    }
  }, [session])

  const stats = [
    { label: 'Active learners', value: String(roleData.users.filter((user) => user.role === 'Learner').length || 0), trend: 'live' },
    { label: 'Courses live', value: String(roleData.courses.filter((course) => course.status === 'Published').length || 0), trend: 'live' },
    { label: 'Assignments', value: String(roleData.assignments.length || 0), trend: 'live' },
    { label: 'Users', value: String(roleData.users.length || 0), trend: 'live' },
  ]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Invalid credentials.')
      }

      const userRole = String(result.session.role).toLowerCase()
      setSession({
        name: result.session.name,
        role: userRole,
        email: result.session.email,
      })
      setActiveRole(userRole)
      setActiveModule('overview')
    } catch (loginError) {
      setError(loginError.message || 'Không thể đăng nhập.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setSession(null)
    setActiveRole('admin')
    setActiveModule('overview')
    setAiPrompt('')
    setAiAnswer('')
    setAiLoading(false)
    setError('')
  }

  const handleAiAsk = async () => {
    const prompt = aiPrompt.trim()
    if (!prompt) {
      setError('Please enter a question for the AI tutor.')
      return
    }

    setAiLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prompt,
          lessonId: 'lesson-1',
          learnerId: session?.email || 'learner',
        }),
      })

      const result = await response.json()
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'AI tutor failed to answer.')
      }

      setAiAnswer(result.answer || 'No answer returned.')
      setAiPrompt('')
    } catch (aiError) {
      setError(aiError.message || 'Unable to get AI response.')
    } finally {
      setAiLoading(false)
    }
  }

  const currentModuleItems = roleModules[activeRole] || roleModules.admin
  const dashboardContent = (
    <RoleModuleScreen
      role={activeRole}
      session={{ ...session, aiPrompt, aiAnswer, aiLoading, handleAiAsk, setAiPrompt }}
      roleData={roleData}
      activeModule={activeModule}
    />
  )

  if (!session) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <p className="eyebrow">LMS authentication</p>
          <h1>Đăng nhập hệ thống</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="alice@lms.test"
              />
            </label>

            <label>
              Mật khẩu
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="learner123"
              />
            </label>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="primary-action full-width" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="seed-account-box">
            <p>Seed accounts để test luồng:</p>
            <ul>
              <li><strong>Learner:</strong> alice@lms.test / learner123</li>
              <li><strong>Instructor:</strong> bob@lms.test / instructor123</li>
              <li><strong>Reviewer:</strong> carol@lms.test / reviewer123</li>
              <li><strong>Admin:</strong> diana@lms.test / admin123</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">L</div>
          <div>
            <p className="eyebrow">Learning OS</p>
            <h1>LearningHub</h1>
          </div>
        </div>

        <div className="user-panel">
          <span className="user-label">Signed in</span>
          <strong>{session.name}</strong>
          <small>{session.role}</small>
        </div>

        <nav className="role-nav" aria-label="Role navigation">
          {currentModuleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-button ${activeModule === item.id ? 'active' : ''}`}
              onClick={() => setActiveModule(item.id)}
            >
              <span className={`dot ${roleConfig.find((role) => role.id === activeRole)?.accent || 'blue'}`} />
              <span>
                <strong>{item.label}</strong>
                <small>{item.summary}</small>
              </span>
            </button>
          ))}
        </nav>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Role module</p>
            <h2>{currentModuleItems.find((item) => item.id === activeModule)?.label || 'Overview'} · {roleConfig.find((role) => role.id === activeRole)?.name}</h2>
          </div>
          <button type="button" className="primary-action">
            Sync live data
          </button>
        </header>

        <section className="stats-grid" aria-label="Platform metrics">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <em>{stat.trend}</em>
            </article>
          ))}
        </section>

        <section className="content-panel">
          {dataLoading ? <p>Đang tải dữ liệu từ API...</p> : dashboardContent}
          {error && <p className="login-error">{error}</p>}
        </section>
      </main>
    </div>
  )
}

export default App
