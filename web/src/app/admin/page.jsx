import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:4000'
const ROLE_OPTIONS = ['Learner', 'Instructor', 'Reviewer', 'Admin']
const COURSE_STATUS_OPTIONS = ['Draft', 'Published', 'Archived']

export default function AdminConsolePage({
  session,
  roleData = { users: [], courses: [], assignments: [] },
  activeModule = 'overview',
  onUpdateUserRole,
  onUpdateCourse,
}) {
  const [usersList, setUsersList] = useState(roleData.users || [])
  const [coursesList, setCoursesList] = useState(roleData.courses || [])
  const [auditLogs, setAuditLogs] = useState([])
  const [actionMessage, setActionMessage] = useState('')

  // Search & Filter state
  const [userSearch, setUserSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  // Create User form state
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Learner' })

  // Create Course form state
  const [showCreateCourse, setShowCreateCourse] = useState(false)
  const [newCourse, setNewCourse] = useState({ code: '', title: '', description: '', category: 'General', status: 'Published', instructorId: '' })

  // Drafts for inline editing
  const [userDrafts, setUserDrafts] = useState({})
  const [courseDrafts, setCourseDrafts] = useState({})

  // Sync props to state
  useEffect(() => {
    setUsersList(roleData.users || [])
  }, [roleData.users])

  useEffect(() => {
    setCoursesList(roleData.courses || [])
  }, [roleData.courses])

  useEffect(() => {
    const nextDrafts = {}
    usersList.forEach((u) => {
      nextDrafts[u.id] = u.role || 'Learner'
    })
    setUserDrafts(nextDrafts)
  }, [usersList])

  useEffect(() => {
    const nextDrafts = {}
    coursesList.forEach((c) => {
      nextDrafts[c.id] = {
        title: c.title || '',
        category: c.category || '',
        status: c.status || 'Published',
        instructorId: c.instructorId || '',
      }
    })
    setCourseDrafts(nextDrafts)
  }, [coursesList])

  // Load audit logs when on reports module
  useEffect(() => {
    if (activeModule === 'reports') {
      loadAuditLogs()
    }
  }, [activeModule])

  const loadAuditLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/audit`, {
        headers: { 'x-user-role': session?.role || 'Admin', 'x-user-id': String(session?.userId || '') },
      })
      const data = await res.json()
      if (data.ok) {
        setAuditLogs(data.audit || [])
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err)
    }
  }

  // --- USER HANDLERS ---
  const handleCreateUser = async (e) => {
    e.preventDefault()
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': session?.role || 'Admin',
          'x-user-id': String(session?.userId || ''),
        },
        body: JSON.stringify(newUser),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Tạo người dùng thất bại.')

      setActionMessage('✅ Tạo người dùng mới thành công!')
      setShowCreateUser(false)
      setNewUser({ name: '', email: '', password: '', role: 'Learner' })
      if (data.user) setUsersList((prev) => [...prev, data.user])
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleUpdateRole = async (userId) => {
    const nextRole = userDrafts[userId]
    if (!nextRole) return
    setActionMessage('')
    try {
      if (onUpdateUserRole) {
        await onUpdateUserRole(userId, nextRole)
      } else {
        const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': session?.role || 'Admin',
            'x-user-id': String(session?.userId || ''),
          },
          body: JSON.stringify({ role: nextRole }),
        })
        const data = await res.json()
        if (!res.ok || !data.ok) throw new Error(data.message || 'Cập nhật vai trò thất bại.')
      }

      setActionMessage('✅ Đã cập nhật vai trò người dùng!')
      setUsersList((prev) => prev.map((u) => (String(u.id) === String(userId) ? { ...u, role: nextRole } : u)))
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${userName}" không?`)) return
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': session?.role || 'Admin',
          'x-user-id': String(session?.userId || ''),
        },
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Xóa người dùng thất bại.')

      setActionMessage('🗑️ Đã xóa tài khoản người dùng thành công!')
      setUsersList((prev) => prev.filter((u) => String(u.id) !== String(userId)))
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  // --- COURSE HANDLERS ---
  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/instructor/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCourse, instructorId: newCourse.instructorId || session?.userId }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Tạo khóa học thất bại.')

      setActionMessage('✅ Tạo khóa học mới thành công!')
      setShowCreateCourse(false)
      setNewCourse({ code: '', title: '', description: '', category: 'General', status: 'Published', instructorId: '' })
      if (data.course) setCoursesList((prev) => [...prev, data.course])
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleUpdateCourse = async (courseId) => {
    const patch = courseDrafts[courseId]
    if (!patch) return
    setActionMessage('')
    try {
      if (onUpdateCourse) {
        await onUpdateCourse(courseId, patch)
      } else {
        const res = await fetch(`${API_BASE}/api/admin/courses/${courseId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': session?.role || 'Admin',
            'x-user-id': String(session?.userId || ''),
          },
          body: JSON.stringify(patch),
        })
        const data = await res.json()
        if (!res.ok || !data.ok) throw new Error(data.message || 'Cập nhật khóa học thất bại.')
      }

      setActionMessage('✅ Đã cập nhật thông tin khóa học!')
      setCoursesList((prev) => prev.map((c) => (String(c.id) === String(courseId) ? { ...c, ...patch } : c)))
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseTitle}" không?`)) return
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/instructor/courses/${courseId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Xóa khóa học thất bại.')

      setActionMessage('🗑️ Đã xóa khóa học thành công!')
      setCoursesList((prev) => prev.filter((c) => String(c.id) !== String(courseId)))
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  // Filtered users list
  const filteredUsers = usersList.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    const q = userSearch.toLowerCase()
    const matchesQuery = !userSearch || (u.name && u.name.toLowerCase().includes(q)) || (u.email && u.email.toLowerCase().includes(q))
    return matchesRole && matchesQuery
  })

  // 1. OVERVIEW MODULE
  if (activeModule === 'overview') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card">
          <h3>Admin Overview - Quản trị Hệ thống</h3>
          <ul className="module-list">
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tổng số Người dùng</span>
              <span className="badge blue">{usersList.length} tài khoản</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tổng số Khóa học</span>
              <span className="badge purple">{coursesList.length} khóa học</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tổng số Bài tập</span>
              <span className="badge green">{roleData.assignments?.length || 0} bài tập</span>
            </li>
          </ul>
        </div>

        <div className="panel-card">
          <h3>Phân bổ Tài khoản theo Vai trò</h3>
          <ul className="module-list">
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Quản trị viên (Admin)</span>
              <span className="badge purple">{usersList.filter((u) => u.role === 'Admin').length}</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Giảng viên (Instructor)</span>
              <span className="badge green">{usersList.filter((u) => u.role === 'Instructor').length}</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Người thẩm định (Reviewer)</span>
              <span className="badge orange">{usersList.filter((u) => u.role === 'Reviewer').length}</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Học viên (Learner)</span>
              <span className="badge blue">{usersList.filter((u) => u.role === 'Learner').length}</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  // 2. USERS MANAGEMENT MODULE
  if (activeModule === 'users') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Quản lý Tài khoản & Phân quyền Người dùng</h3>
            <button type="button" className="primary-action" onClick={() => setShowCreateUser(!showCreateUser)}>
              + Tạo tài khoản mới
            </button>
          </div>

          {actionMessage && <p className="sync-status">{actionMessage}</p>}

          {/* Form Tạo Người Dùng */}
          {showCreateUser && (
            <form onSubmit={handleCreateUser} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px' }}>Tạo tài khoản người dùng mới</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <input
                  type="email"
                  placeholder="Địa chỉ Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="submit" className="primary-action">Lưu tài khoản</button>
                <button type="button" className="secondary-button" onClick={() => setShowCreateUser(false)}>Hủy</button>
              </div>
            </form>
          )}

          {/* Thanh Tìm kiếm & Lọc */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              placeholder="🔍 Tìm theo tên hoặc email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
            >
              <option value="ALL">-- Tất cả vai trò --</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Bảng Danh sách Người Dùng */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: 10 }}>#ID</th>
                <th style={{ padding: 10 }}>Họ và tên</th>
                <th style={{ padding: 10 }}>Email</th>
                <th style={{ padding: 10 }}>Vai trò (Role)</th>
                <th style={{ padding: 10, textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: 10 }}>#{user.id}</td>
                  <td style={{ padding: 10 }}><strong>{user.name || 'N/A'}</strong></td>
                  <td style={{ padding: 10 }}>{user.email}</td>
                  <td style={{ padding: 10 }}>
                    <select
                      value={userDrafts[user.id] || user.role}
                      onChange={(e) => setUserDrafts((curr) => ({ ...curr, [user.id]: e.target.value }))}
                      style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1' }}
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: 10, textAlign: 'right' }}>
                    <button
                      type="button"
                      className="primary-action"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', marginRight: 6 }}
                      onClick={() => handleUpdateRole(user.id)}
                    >
                      💾 Lưu
                    </button>
                    <button
                      type="button"
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}
                      onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 16, textAlign: 'center', color: '#64748b' }}>Không tìm thấy người dùng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // 3. COURSES MANAGEMENT MODULE
  if (activeModule === 'courses') {
    const instructors = usersList.filter((u) => u.role === 'Instructor' || u.role === 'Admin')

    return (
      <div className="dashboard-layout">
        <div className="panel-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Quản lý Danh mục & Trạng thái Khóa học toàn hệ thống</h3>
            <button type="button" className="primary-action" onClick={() => setShowCreateCourse(!showCreateCourse)}>
              + Tạo khóa học mới
            </button>
          </div>

          {actionMessage && <p className="sync-status">{actionMessage}</p>}

          {/* Form Tạo Khóa Học */}
          {showCreateCourse && (
            <form onSubmit={handleCreateCourse} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px' }}>Tạo khóa học hệ thống mới</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Mã khóa học (vd: CS-201)"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  placeholder="Tên khóa học"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  placeholder="Danh mục (Design, Data...)"
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <select
                  value={newCourse.instructorId}
                  onChange={(e) => setNewCourse({ ...newCourse, instructorId: e.target.value })}
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Chọn Giảng viên phụ trách --</option>
                  {instructors.map((ins) => (
                    <option key={ins.id} value={ins.id}>{ins.name} ({ins.email})</option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Mô tả ngắn về khóa học..."
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 10 }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="submit" className="primary-action">Lưu khóa học</button>
                <button type="button" className="secondary-button" onClick={() => setShowCreateCourse(false)}>Hủy</button>
              </div>
            </form>
          )}

          {/* Bảng Quản lý Khóa Học */}
          <div style={{ display: 'grid', gap: 12 }}>
            {coursesList.map((course) => {
              const draft = courseDrafts[course.id] || { title: course.title, category: course.category, status: course.status }

              return (
                <div key={course.id} style={{ padding: 14, border: '1px solid #cbd5e1', borderRadius: 10, background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <strong>Mã: {course.code || `#${course.id}`} - {course.title}</strong>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="primary-action"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleUpdateCourse(course.id)}
                      >
                        💾 Lưu thay đổi
                      </button>
                      <button
                        type="button"
                        style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <label style={{ fontSize: '0.85rem' }}>
                      Tiêu đề khóa học:
                      <input
                        type="text"
                        value={draft.title || ''}
                        onChange={(e) => setCourseDrafts((curr) => ({ ...curr, [course.id]: { ...draft, title: e.target.value } }))}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #cbd5e1', marginTop: 4 }}
                      />
                    </label>

                    <label style={{ fontSize: '0.85rem' }}>
                      Danh mục:
                      <input
                        type="text"
                        value={draft.category || ''}
                        onChange={(e) => setCourseDrafts((curr) => ({ ...curr, [course.id]: { ...draft, category: e.target.value } }))}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #cbd5e1', marginTop: 4 }}
                      />
                    </label>

                    <label style={{ fontSize: '0.85rem' }}>
                      Trạng thái phát hành:
                      <select
                        value={draft.status || 'Published'}
                        onChange={(e) => setCourseDrafts((curr) => ({ ...curr, [course.id]: { ...draft, status: e.target.value } }))}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #cbd5e1', marginTop: 4 }}
                      >
                        {COURSE_STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              )
            })}
            {coursesList.length === 0 && <p className="muted-text">Chưa có khóa học nào trên hệ thống.</p>}
          </div>
        </div>
      </div>
    )
  }

  // 4. REPORTS & AUDIT TRAIL MODULE
  if (activeModule === 'reports') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card" style={{ gridColumn: 'span 2' }}>
          <h3>Báo cáo Thống kê & Nhật ký Kiểm duyệt Hệ thống (Audit Trail)</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, margin: '16px 0' }}>
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Learners Active</span>
              <h3 style={{ margin: '4px 0 0', color: '#2563eb' }}>{usersList.filter((u) => u.role === 'Learner').length}</h3>
            </div>
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Instructors</span>
              <h3 style={{ margin: '4px 0 0', color: '#16a34a' }}>{usersList.filter((u) => u.role === 'Instructor').length}</h3>
            </div>
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Courses Live</span>
              <h3 style={{ margin: '4px 0 0', color: '#9333ea' }}>{coursesList.filter((c) => c.status === 'Published').length}</h3>
            </div>
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Assignments</span>
              <h3 style={{ margin: '4px 0 0', color: '#ea580c' }}>{roleData.assignments?.length || 0}</h3>
            </div>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 10, color: '#1e293b' }}>Nhật ký Audit Logs hệ thống</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: 10 }}>#ID</th>
                <th style={{ padding: 10 }}>Actor ID</th>
                <th style={{ padding: 10 }}>Action</th>
                <th style={{ padding: 10 }}>Target Type</th>
                <th style={{ padding: 10 }}>Target ID</th>
                <th style={{ padding: 10 }}>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: 10 }}>#{log.id}</td>
                  <td style={{ padding: 10 }}>User #{log.actorId || 'System'}</td>
                  <td style={{ padding: 10 }}><span className="badge blue">{log.action}</span></td>
                  <td style={{ padding: 10 }}>{log.targetType}</td>
                  <td style={{ padding: 10 }}>#{log.targetId}</td>
                  <td style={{ padding: 10 }}>{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 16, textAlign: 'center', color: '#64748b' }}>Chưa có nhật ký ghi nhận.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return null
}
