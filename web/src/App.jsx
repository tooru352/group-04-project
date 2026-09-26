import { useEffect, useState } from 'react'
import './App.css'
import AdminConsolePage from './app/admin/page.jsx'
import LearnerModuleView from './app/learner/LearnerModuleView.jsx'
import InstructorModuleView from './app/instructor/InstructorModuleView.jsx'
import ReviewerModuleView from './app/reviewer/ReviewerModuleView.jsx'

// FIX BUG-03: Replaced window.location.reload() with persistent localStorage session & smooth React State updates (Do Thi Kim Yen)
const API_BASE = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:4000'
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000')

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
    { id: 'courses', label: 'Courses', summary: 'Courses & AI Lessons' },
    { id: 'assignments', label: 'Assignments', summary: 'Tasks & AI Support' },
    { id: 'grades', label: 'Grades', summary: 'Progress and performance' },
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

function RoleModuleScreen({
  role,
  session,
  roleData,
  activeModule,
  selectedCourseId,
  onSelectCourse,
  selectedAssignmentId,
  onSelectAssignment,
  assignmentDraft,
  setAssignmentDraft,
  submitAssignment,
  assignmentSubmitState,
  onUpdateUserRole,
  onUpdateCourse,
  onRefreshData,
}) {
  const courses = Array.isArray(roleData.courses) ? roleData.courses : []
  const users = Array.isArray(roleData.users) ? roleData.users : []
  const assignments = Array.isArray(roleData.assignments) ? roleData.assignments : []
  const selectedCourse = courses.find((course) => course.id === selectedCourseId) || null
  const selectedAssignment = assignments.find((assignment) => assignment.id === selectedAssignmentId) || null

  const courseAction = (course) => (
    <button
      type="button"
      key={course.id || course.title}
      className={`course-row ${selectedCourseId === course.id ? 'active' : ''}`}
      onClick={() => onSelectCourse?.(course)}
    >
      <span>{course.title}</span>
      <span className="badge blue">{course.status || 'Published'}</span>
    </button>
  )

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
    return (
      <LearnerModuleView
        session={session}
        activeModule={activeModule}
        courses={courses}
        assignments={assignments}
        selectedCourseId={selectedCourseId}
        onSelectCourse={onSelectCourse}
        selectedAssignmentId={selectedAssignmentId}
        onSelectAssignment={onSelectAssignment}
        assignmentDraft={assignmentDraft}
        setAssignmentDraft={setAssignmentDraft}
        submitAssignment={submitAssignment}
        assignmentSubmitState={assignmentSubmitState}
      />
    )
  }

  if (role === 'instructor') {
    return (
      <InstructorModuleView
        session={session}
        activeModule={activeModule}
        courses={courses}
        assignments={assignments}
        users={users}
        onRefreshData={onRefreshData}
      />
    )
  }

  if (role === 'reviewer') {
    return (
      <ReviewerModuleView
        session={session}
        activeModule={activeModule}
        roleData={roleData}
      />
    )
  }

  if (role === 'admin') {
    return <AdminConsolePage session={session} roleData={roleData} activeModule={activeModule} onUpdateUserRole={onUpdateUserRole} onUpdateCourse={onUpdateCourse} />
  }

  return <AdminConsolePage session={session} roleData={roleData} activeModule={activeModule} onUpdateUserRole={onUpdateUserRole} onUpdateCourse={onUpdateCourse} />
}

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed for ${url}`)
  }

  return response.json()
}

function App() {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('lms_session')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [activeRole, setActiveRole] = useState(() => session?.role || 'admin')
  const [activeModule, setActiveModule] = useState('overview')
  const [form, setForm] = useState({ email: 'alice@lms.test', password: 'learner123' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [roleData, setRoleData] = useState({ users: [], courses: [], assignments: [] })
  const [dataLoading, setDataLoading] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [assignmentDraft, setAssignmentDraft] = useState('')
  const [assignmentSubmitState, setAssignmentSubmitState] = useState(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState('')

  const demoAccounts = {
    learner: { email: 'alice@lms.test', password: 'learner123' },
    instructor: { email: 'bob@lms.test', password: 'instructor123' },
    reviewer: { email: 'carol@lms.test', password: 'reviewer123' },
    admin: { email: 'diana@lms.test', password: 'admin123' },
  }

  const updateSession = (newSession) => {
    setSession(newSession)
    if (newSession) {
      localStorage.setItem('lms_session', JSON.stringify(newSession))
    } else {
      localStorage.removeItem('lms_session')
    }
  }

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
      const userSession = {
        userId: result.session.userId,
        name: result.session.name,
        role: userRole,
        email: result.session.email,
      }
      updateSession(userSession)
      setActiveRole(userRole)
      setActiveModule('overview')
      setSelectedCourseId(null)
    } catch (loginError) {
      setError(loginError.message || 'Không thể đăng nhập.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    updateSession(null)
    setActiveRole('admin')
    setActiveModule('overview')
    setAiPrompt('')
    setAiAnswer('')
    setAiLoading(false)
    setError('')
    setSyncStatus('')
    setSelectedCourseId(null)
    setSelectedAssignmentId(null)
    setAssignmentDraft('')
    setAssignmentSubmitState(null)
  }

  const handleRolePreset = (roleId) => {
    const preset = demoAccounts[roleId]
    if (!preset) return

    setForm({ email: preset.email, password: preset.password })
    setError('')
    setActiveRole(roleId)
    setSelectedCourseId(null)
    setSelectedAssignmentId(null)
    setAssignmentDraft('')
    setAssignmentSubmitState(null)
  }

  const refreshDashboardData = async () => {
    setDataLoading(true)
    setError('')
    setSyncStatus('Đang đồng bộ dữ liệu...')

    try {
      const [usersResponse, coursesResponse, assignmentsResponse] = await Promise.all([
        fetchJson(`${API_BASE}/api/users`),
        fetchJson(`${API_BASE}/api/courses`),
        fetchJson(`${API_BASE}/api/assignments`),
      ])

      setRoleData({
        users: usersResponse.users || [],
        courses: coursesResponse.courses || [],
        assignments: assignmentsResponse.assignments || [],
      })
      setSyncStatus('Dữ liệu đã được đồng bộ thành công.')
    } catch (refreshError) {
      setError(refreshError.message || 'Không thể đồng bộ dữ liệu.')
      setSyncStatus('')
    } finally {
      setDataLoading(false)
    }
  }

  const handleAssignmentSubmit = async (assignmentId) => {
    const answer = assignmentDraft.trim()
    if (!assignmentId || !answer) {
      setAssignmentSubmitState({ ok: false, message: 'Please enter an answer before submitting.' })
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          learnerId: session?.userId || session?.email || 'learner',
          answer,
        }),
      })

      const result = await response.json()
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Unable to submit assignment.')
      }

      setAssignmentSubmitState({ ok: true, message: 'Assignment submitted successfully.' })
      setAssignmentDraft('')
    } catch (submitError) {
      setAssignmentSubmitState({ ok: false, message: submitError.message || 'Could not submit assignment.' })
    }
  }

  const handleUpdateUserRole = async (userId, nextRole) => {
    if (!session || !session.userId) {
      setError('Admin session is required.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': session.role || 'Admin',
          'x-user-id': String(session.userId),
        },
        body: JSON.stringify({ role: nextRole }),
      })

      const result = await response.json()
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Unable to update role.')
      }

      setRoleData((current) => ({
        ...current,
        users: (current.users || []).map((user) => (user.id === userId ? { ...user, role: result.user.role } : user)),
      }))
      setSyncStatus('User role updated successfully.')
      setError('')
    } catch (roleError) {
      setError(roleError.message || 'Could not update user role.')
    }
  }

  const handleUpdateCourse = async (courseId, patch) => {
    if (!session || !session.userId) {
      setError('Admin session is required.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': session.role || 'Admin',
          'x-user-id': String(session.userId),
        },
        body: JSON.stringify(patch),
      })

      const result = await response.json()
      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Unable to update course.')
      }

      setRoleData((current) => ({
        ...current,
        courses: (current.courses || []).map((course) => (course.id === courseId ? { ...course, ...result.course } : course)),
      }))
      setSyncStatus('Course updated successfully.')
      setError('')
    } catch (courseError) {
      setError(courseError.message || 'Could not update course.')
    }
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
      const msg = prompt.toLowerCase()
      const intent = msg.includes('example') || msg.includes('illustrate') ? 'example' : 'explain'

      const response = await fetch(`${API_BASE}/api/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prompt,
          lessonId: 'lesson-1',
          learnerId: session?.userId || session?.email || 'learner',
          sessionId: session?.userId || session?.email || 'learner',
          intent,
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
      selectedCourseId={selectedCourseId}
      onSelectCourse={(course) => setSelectedCourseId(course?.id || null)}
      selectedAssignmentId={selectedAssignmentId}
      onSelectAssignment={(assignment) => {
        setSelectedAssignmentId(assignment?.id || null)
        setAssignmentSubmitState(null)
        setAssignmentDraft('')
      }}
      assignmentDraft={assignmentDraft}
      setAssignmentDraft={setAssignmentDraft}
      submitAssignment={handleAssignmentSubmit}
      assignmentSubmitState={assignmentSubmitState}
      onUpdateUserRole={handleUpdateUserRole}
      onUpdateCourse={handleUpdateCourse}
    />
  )

  if (!session) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <p className="eyebrow">LMS authentication</p>
          <h1>Đăng nhập hệ thống</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="role-picker" aria-label="Quick login roles">
              {roleConfig.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`role-card ${activeRole === role.id ? 'active' : ''}`}
                  onClick={() => handleRolePreset(role.id)}
                >
                  <span className={`dot ${role.accent}`} />
                  <span>{role.name}</span>
                </button>
              ))}
            </div>

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
              onClick={() => {
                setActiveModule(item.id)
                if (item.id !== 'courses') {
                  setSelectedCourseId(null)
                }
                if (item.id !== 'assignments') {
                  setSelectedAssignmentId(null)
                }
                if (item.id !== 'assignments') {
                  setAssignmentDraft('')
                  setAssignmentSubmitState(null)
                }
              }}
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
          <button type="button" className="primary-action" onClick={refreshDashboardData} disabled={dataLoading}>
            {dataLoading ? 'Đang đồng bộ...' : 'Sync live data'}
          </button>
        </header>

        {syncStatus && <p className="sync-status" aria-live="polite">{syncStatus}</p>}

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
