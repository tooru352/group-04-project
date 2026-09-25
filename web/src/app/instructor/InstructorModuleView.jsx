import { useEffect, useState } from 'react'

// FIX BUG-04: Implemented sort_order = COALESCE(MAX(sort_order), 0) + 1 for incremental lesson order (Do Thi Kim Yen)
const API_BASE = 'http://localhost:4000'

export default function InstructorModuleView({
  session,
  activeModule,
  courses = [],
  assignments = [],
  users = [],
  onRefreshData,
}) {
  const instructorId = session?.userId

  // Local state copies to allow instant reactivity without page reloads
  const [coursesList, setCoursesList] = useState(courses)
  const [assignmentsList, setAssignmentsList] = useState(assignments)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  // Sync props to local state
  useEffect(() => {
    setCoursesList(courses)
  }, [courses])

  useEffect(() => {
    setAssignmentsList(assignments)
  }, [assignments])

  // Selected course & state
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [lessons, setLessons] = useState([])
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null)

  // Create form states
  const [showCreateCourse, setShowCreateCourse] = useState(false)
  const [newCourse, setNewCourse] = useState({ code: '', title: '', description: '', category: 'Design' })

  const [showCreateLesson, setShowCreateLesson] = useState(false)
  const [newLesson, setNewLesson] = useState({ title: '', content: '', duration: 25, isRequired: true })

  const [showCreateAssignment, setShowCreateAssignment] = useState(false)
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', deadline: '', maxAttempts: 1 })

  // Edit states
  const [editingCourse, setEditingCourse] = useState(null)
  const [editingLesson, setEditingLesson] = useState(null)
  const [editingAssignment, setEditingAssignment] = useState(null)

  // Grading form state
  const [gradingState, setGradingState] = useState({ grade: 85, feedback: '', status: 'Passed', reviewerId: '' })

  // Load submissions on mount
  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/instructor/submissions`)
      const data = await res.json()
      if (data.ok) {
        setSubmissions(data.submissions || [])
      }
    } catch (err) {
      console.error('Failed to load instructor submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load lessons for selected course
  useEffect(() => {
    if (!selectedCourseId) {
      setLessons([])
      return
    }
    loadLessons(selectedCourseId)
  }, [selectedCourseId])

  const loadLessons = async (courseId) => {
    try {
      const res = await fetch(`${API_BASE}/api/courses/${courseId}/lessons`)
      const data = await res.json()
      if (data.ok) setLessons(data.lessons || [])
    } catch (err) {
      console.error('Failed to load lessons:', err)
    }
  }

  // Whenever showCreateLesson or lessons change, update default lesson title (Bài [đã tạo + 1])
  const openCreateLessonForm = () => {
    const nextLessonNumber = lessons.length + 1
    setNewLesson({
      title: `Bài ${nextLessonNumber}: `,
      content: '',
      duration: 25,
      isRequired: true,
    })
    setShowCreateLesson(!showCreateLesson)
    setEditingLesson(null)
  }

  // --- COURSE HANDLERS (NO PAGE RELOAD) ---
  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/instructor/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCourse, instructorId }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Tạo khóa học thất bại.')

      setActionMessage('✅ Tạo khóa học mới thành công!')
      setShowCreateCourse(false)
      setNewCourse({ code: '', title: '', description: '', category: 'Design' })
      if (data.course) {
        setCoursesList((prev) => [...prev, data.course])
      }
      onRefreshData?.()
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    if (!editingCourse) return
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/instructor/courses/${editingCourse.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCourse),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Cập nhật khóa học thất bại.')

      setActionMessage('✅ Cập nhật khóa học thành công!')
      const updated = data.course || editingCourse
      setCoursesList((prev) => prev.map((c) => (String(c.id) === String(updated.id) ? { ...c, ...updated } : c)))
      setEditingCourse(null)
      onRefreshData?.()
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
      if (String(selectedCourseId) === String(courseId)) setSelectedCourseId(null)
      onRefreshData?.()
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  // --- LESSON HANDLERS ---
  const handleCreateLesson = async (e) => {
    e.preventDefault()
    if (!selectedCourseId) return
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/instructor/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newLesson, courseId: Number(selectedCourseId) }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Tạo bài học thất bại.')

      setActionMessage('✅ Thêm bài học mới thành công!')
      setShowCreateLesson(false)
      setNewLesson({ title: '', content: '', duration: 25, isRequired: true })
      // Reload lessons to fetch in correct sort_order (places new lesson at end: bài đã tạo + 1)
      await loadLessons(selectedCourseId)
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleUpdateLesson = async (e) => {
    e.preventDefault()
    if (!editingLesson) return
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/instructor/lessons/${editingLesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLesson),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Cập nhật bài học thất bại.')

      setActionMessage('✅ Cập nhật bài học thành công!')
      setEditingLesson(null)
      await loadLessons(selectedCourseId)
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài học "${lessonTitle}" không?`)) return
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/instructor/lessons/${lessonId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Xóa bài học thất bại.')

      setActionMessage('🗑️ Đã xóa bài học thành công!')
      await loadLessons(selectedCourseId)
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  // --- ASSIGNMENT HANDLERS (NO PAGE RELOAD) ---
  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    const targetCourseId = newAssignment.courseId || selectedCourseId
    if (!targetCourseId) {
      setActionMessage('⚠️ Vui lòng chọn một khóa học trước khi tạo bài tập.')
      return
    }
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/instructor/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAssignment, courseId: targetCourseId }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Tạo bài tập thất bại.')

      setActionMessage('✅ Tạo bài tập mới thành công!')
      setShowCreateAssignment(false)
      setNewAssignment({ courseId: '', title: '', description: '', deadline: '', maxAttempts: 1 })
      if (data.assignment) {
        setAssignmentsList((prev) => [...prev, data.assignment])
      }
      onRefreshData?.()
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleUpdateAssignment = async (e) => {
    e.preventDefault()
    if (!editingAssignment) return
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/instructor/assignments/${editingAssignment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAssignment),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Cập nhật bài tập thất bại.')

      setActionMessage('✅ Cập nhật bài tập thành công!')
      const updated = data.assignment || editingAssignment
      setAssignmentsList((prev) => prev.map((a) => (String(a.id) === String(updated.id) ? { ...a, ...updated } : a)))
      setEditingAssignment(null)
      onRefreshData?.()
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleDeleteAssignment = async (assignmentId, assignmentTitle) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài tập "${assignmentTitle}" không?`)) return
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/instructor/assignments/${assignmentId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Xóa bài tập thất bại.')

      setActionMessage('🗑️ Đã xóa bài tập thành công!')
      setAssignmentsList((prev) => prev.filter((a) => String(a.id) !== String(assignmentId)))
      onRefreshData?.()
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  // --- SUBMISSION HANDLERS ---
  const handleGradeSubmission = async (submissionId) => {
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/submissions/${submissionId}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: Number(gradingState.grade),
          feedback: gradingState.feedback,
          status: gradingState.status,
          reviewerId: gradingState.reviewerId ? Number(gradingState.reviewerId) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Chấm điểm thất bại.')

      setActionMessage('🎉 Đã chấm điểm và gửi nhận xét thành công!')
      loadSubmissions()
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleAssignReviewer = async (submissionId, reviewerId) => {
    if (!reviewerId) return
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/submissions/${submissionId}/assign-reviewer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId: Number(reviewerId) }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Phân công reviewer thất bại.')

      setActionMessage('✅ Phân công Reviewer thành công!')
      loadSubmissions()
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const selectedCourse = coursesList.find((c) => String(c.id) === String(selectedCourseId)) || null
  const selectedSubmission = submissions.find((s) => String(s.id) === String(selectedSubmissionId)) || null
  const reviewerUsers = users.filter((u) => u.role === 'Reviewer')

  // 1. OVERVIEW MODULE
  if (activeModule === 'overview') {
    const pendingCount = submissions.filter((s) => s.grade === null || s.grade === undefined).length

    return (
      <div className="dashboard-layout">
        <div className="panel-card">
          <h3>Tổng quan Giảng dạy</h3>
          <ul className="module-list">
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Khóa học đang quản lý</span>
              <span className="badge green">{coursesList.length}</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tổng số bài tập</span>
              <span className="badge blue">{assignmentsList.length}</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Bài nộp chờ chấm</span>
              <span className="badge orange">{pendingCount}</span>
            </li>
          </ul>
        </div>

        <div className="panel-card">
          <h3>Bài nộp sinh viên mới nhất</h3>
          <ul className="task-list">
            {submissions.slice(0, 5).map((sub) => (
              <li key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <strong>{sub.learner_name}</strong> - <em>{sub.assignment_title}</em>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Nộp: {new Date(sub.submitted_at).toLocaleString('vi-VN')} {sub.is_late && <span style={{ color: '#dc2626' }}>(Trễ hạn)</span>}
                  </div>
                </div>
                {sub.grade !== null && sub.grade !== undefined ? (
                  <span className="badge green">Điểm: {sub.grade}</span>
                ) : (
                  <span className="badge orange">Chưa chấm</span>
                )}
              </li>
            ))}
            {submissions.length === 0 && <li className="muted-text">Chưa có bài nộp nào.</li>}
          </ul>
        </div>
      </div>
    )
  }

  // 2. COURSES & LESSONS MODULE
  if (activeModule === 'courses') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3>Khóa học do bạn quản lý</h3>
            <button type="button" className="primary-action" onClick={() => { setShowCreateCourse(!showCreateCourse); setEditingCourse(null); }}>
              + Tạo khóa học
            </button>
          </div>

          {actionMessage && <p className="sync-status">{actionMessage}</p>}

          {/* Form Tạo Khóa Học */}
          {showCreateCourse && (
            <form onSubmit={handleCreateCourse} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px' }}>Tạo khóa học mới</h4>
              <div style={{ display: 'grid', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Mã môn học (vd: CS-102)"
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
                  placeholder="Danh mục (Design, Data, Systems...)"
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <textarea
                  placeholder="Mô tả khóa học..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="primary-action">Lưu khóa học</button>
                  <button type="button" className="secondary-button" onClick={() => setShowCreateCourse(false)}>Hủy</button>
                </div>
              </div>
            </form>
          )}

          {/* Form Sửa Khóa Học */}
          {editingCourse && (
            <form onSubmit={handleUpdateCourse} style={{ padding: 16, background: '#eff6ff', borderRadius: 12, marginBottom: 16, border: '1px solid #93c5fd' }}>
              <h4 style={{ margin: '0 0 12px', color: '#1e40af' }}>✏️ Chỉnh sửa khóa học #{editingCourse.id}</h4>
              <div style={{ display: 'grid', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Mã môn học"
                  value={editingCourse.code || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  placeholder="Tên khóa học"
                  value={editingCourse.title || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  placeholder="Danh mục"
                  value={editingCourse.category || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <textarea
                  placeholder="Mô tả..."
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="primary-action">💾 Lưu thay đổi</button>
                  <button type="button" className="secondary-button" onClick={() => setEditingCourse(null)}>Hủy</button>
                </div>
              </div>
            </form>
          )}

          <div className="module-list interactive-list">
            {coursesList.map((course) => (
              <div
                key={course.id}
                className={`course-row ${String(selectedCourseId) === String(course.id) ? 'active' : ''}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 6, background: String(selectedCourseId) === String(course.id) ? '#e0f2fe' : '#fff', cursor: 'pointer' }}
                onClick={() => setSelectedCourseId(course.id)}
              >
                <div>
                  <strong>{course.title}</strong>
                  <span className="badge green" style={{ marginLeft: 8 }}>{course.category || 'General'}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}
                    onClick={() => { setEditingCourse(course); setShowCreateCourse(false); }}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    type="button"
                    style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}
                    onClick={() => handleDeleteCourse(course.id, course.title)}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))}
            {coursesList.length === 0 && <p className="muted-text">Chưa có khóa học nào.</p>}
          </div>
        </div>

        {/* CỘT QUẢN LÝ BÀI HỌC (LESSONS) */}
        <div className="panel-card">
          <h3>Quản lý Bài học (Lessons)</h3>
          {selectedCourse ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4>{selectedCourse.title}</h4>
                <button type="button" className="secondary-button" onClick={openCreateLessonForm}>
                  + Thêm bài học mới (Bài {lessons.length + 1})
                </button>
              </div>

              {/* Form Thêm Bài Học */}
              {showCreateLesson && (
                <form onSubmit={handleCreateLesson} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px' }}>Thêm bài học mới (vị trí: Bài {lessons.length + 1})</h4>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <input
                      type="text"
                      placeholder={`Tiêu đề bài học (vd: Bài ${lessons.length + 1}: Tìm hiểu UX)`}
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      required
                      style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                    <textarea
                      placeholder="Nội dung bài học..."
                      rows={4}
                      value={newLesson.content}
                      onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                      required
                      style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                    <input
                      type="number"
                      placeholder="Thời lượng (phút)"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                      style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="submit" className="primary-action">Lưu bài học</button>
                      <button type="button" className="secondary-button" onClick={() => setShowCreateLesson(false)}>Hủy</button>
                    </div>
                  </div>
                </form>
              )}

              {/* Form Sửa Bài Học */}
              {editingLesson && (
                <form onSubmit={handleUpdateLesson} style={{ padding: 16, background: '#eff6ff', borderRadius: 12, marginBottom: 16, border: '1px solid #93c5fd' }}>
                  <h4 style={{ margin: '0 0 12px', color: '#1e40af' }}>✏️ Sửa bài học #{editingLesson.id}</h4>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <input
                      type="text"
                      placeholder="Tiêu đề bài học"
                      value={editingLesson.title || ''}
                      onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                      required
                      style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                    <textarea
                      placeholder="Nội dung bài học..."
                      rows={4}
                      value={editingLesson.content || ''}
                      onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                      required
                      style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                    <input
                      type="number"
                      placeholder="Thời lượng (phút)"
                      value={editingLesson.duration || 20}
                      onChange={(e) => setEditingLesson({ ...editingLesson, duration: Number(e.target.value) })}
                      style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="submit" className="primary-action">💾 Lưu thay đổi</button>
                      <button type="button" className="secondary-button" onClick={() => setEditingLesson(null)}>Hủy</button>
                    </div>
                  </div>
                </form>
              )}

              {/* Danh sách bài học (Được sắp xếp đúng thứ tự nằm sau bài đã tạo) */}
              <div className="lessons-list" style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                {lessons.map((lesson, idx) => (
                  <div key={lesson.id} style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Vị trí {idx + 1}: {lesson.title}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="badge gray">{lesson.duration} phút</span>
                        <button
                          type="button"
                          style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', fontSize: '0.75rem' }}
                          onClick={() => setEditingLesson(lesson)}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          type="button"
                          style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', fontSize: '0.75rem' }}
                          onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '6px 0 0' }}>{lesson.content}</p>
                  </div>
                ))}
                {lessons.length === 0 && <p className="muted-text">Chưa có bài học nào trong khóa học này.</p>}
              </div>
            </div>
          ) : (
            <p className="muted-text">Chọn một khóa học ở danh sách bên trái để quản lý bài học.</p>
          )}
        </div>
      </div>
    )
  }

  // 3. ASSIGNMENTS MODULE
  if (activeModule === 'assignments') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3>Danh sách bài tập (Assignments)</h3>
            <button type="button" className="primary-action" onClick={() => { setShowCreateAssignment(!showCreateAssignment); setEditingAssignment(null); }}>
              + Tạo bài tập mới
            </button>
          </div>

          {actionMessage && <p className="sync-status">{actionMessage}</p>}

          {/* Form Tạo Bài Tập */}
          {showCreateAssignment && (
            <form onSubmit={handleCreateAssignment} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16, border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px' }}>Tạo bài tập mới</h4>
              <div style={{ display: 'grid', gap: 10 }}>
                <select
                  value={newAssignment.courseId || selectedCourseId || ''}
                  onChange={(e) => {
                    setNewAssignment({ ...newAssignment, courseId: e.target.value })
                    setSelectedCourseId(e.target.value)
                  }}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                >
                  <option value="">-- Chọn khóa học áp dụng --</option>
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Tiêu đề bài tập"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />

                <textarea
                  placeholder="Mô tả / Đề bài tập..."
                  rows={3}
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />

                <label style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Hạn nộp (Deadline):
                  <input
                    type="datetime-local"
                    value={newAssignment.deadline}
                    onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                    style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: '100%', marginTop: 4 }}
                  />
                </label>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="primary-action">Tạo bài tập</button>
                  <button type="button" className="secondary-button" onClick={() => setShowCreateAssignment(false)}>Hủy</button>
                </div>
              </div>
            </form>
          )}

          {/* Form Sửa Bài Tập */}
          {editingAssignment && (
            <form onSubmit={handleUpdateAssignment} style={{ padding: 16, background: '#eff6ff', borderRadius: 12, marginBottom: 16, border: '1px solid #93c5fd' }}>
              <h4 style={{ margin: '0 0 12px', color: '#1e40af' }}>✏️ Chỉnh sửa bài tập #{editingAssignment.id}</h4>
              <div style={{ display: 'grid', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Tiêu đề bài tập"
                  value={editingAssignment.title || ''}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />

                <textarea
                  placeholder="Mô tả / Đề bài tập..."
                  rows={3}
                  value={editingAssignment.description || ''}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                  required
                  style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
                />

                <label style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Hạn nộp (Deadline):
                  <input
                    type="datetime-local"
                    value={editingAssignment.deadline ? new Date(editingAssignment.deadline).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingAssignment({ ...editingAssignment, deadline: e.target.value })}
                    style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: '100%', marginTop: 4 }}
                  />
                </label>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="primary-action">💾 Lưu thay đổi</button>
                  <button type="button" className="secondary-button" onClick={() => setEditingAssignment(null)}>Hủy</button>
                </div>
              </div>
            </form>
          )}

          {/* Danh sách bài tập */}
          <div className="module-list interactive-list">
            {assignmentsList.map((asg) => (
              <div key={asg.id} style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 10, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <strong style={{ fontSize: '1.05rem' }}>{asg.title}</strong>
                    <span className="badge purple" style={{ marginLeft: 8 }}>{asg.course_title || 'General'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}
                      onClick={() => setEditingAssignment(asg)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      type="button"
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}
                      onClick={() => handleDeleteAssignment(asg.id, asg.title)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>

                <p style={{ margin: '4px 0 8px', fontSize: '0.9rem', color: '#475569' }}>{asg.description}</p>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  ⏰ Hạn nộp: {asg.deadline ? new Date(asg.deadline).toLocaleString('vi-VN') : 'Không giới hạn'}
                </div>
              </div>
            ))}
            {assignmentsList.length === 0 && <p className="muted-text">Chưa có bài tập nào.</p>}
          </div>
        </div>
      </div>
    )
  }

  // 4. SUBMISSIONS & GRADING MODULE
  if (activeModule === 'submissions') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card">
          <h3>Danh sách bài nộp của sinh viên</h3>
          {actionMessage && <p className="sync-status">{actionMessage}</p>}

          {loading ? (
            <p>Đang tải danh sách bài nộp...</p>
          ) : (
            <div className="module-list interactive-list">
              {submissions.map((sub) => (
                <button
                  type="button"
                  key={sub.id}
                  className={`course-row ${String(selectedSubmissionId) === String(sub.id) ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSubmissionId(sub.id)
                    setGradingState({
                      grade: sub.grade !== null && sub.grade !== undefined ? sub.grade : 85,
                      feedback: sub.feedback || '',
                      status: sub.status || 'Passed',
                      reviewerId: sub.reviewer_id || '',
                    })
                  }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <strong>{sub.learner_name}</strong> - {sub.assignment_title}
                    {sub.is_late && <span style={{ color: '#dc2626', marginLeft: 6, fontSize: '0.78rem' }}>(Trễ hạn)</span>}
                  </div>
                  <span className={`badge ${sub.grade !== null && sub.grade !== undefined ? 'green' : 'orange'}`}>
                    {sub.grade !== null && sub.grade !== undefined ? `${sub.grade} đ` : 'Chưa chấm'}
                  </span>
                </button>
              ))}
              {submissions.length === 0 && <p className="muted-text">Chưa có bài nộp nào từ sinh viên.</p>}
            </div>
          )}
        </div>

        <div className="panel-card">
          <h3>Chấm điểm & Nhận xét bài làm</h3>
          {selectedSubmission ? (
            <div className="course-detail-panel">
              <h4>{selectedSubmission.assignment_title}</h4>
              <p className="muted-text">Sinh viên: <strong>{selectedSubmission.learner_name}</strong> ({selectedSubmission.learner_email})</p>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 12 }}>
                Ngày nộp: {new Date(selectedSubmission.submitted_at).toLocaleString('vi-VN')} {selectedSubmission.is_late && <span style={{ color: '#dc2626', fontWeight: 'bold' }}>- Trễ hạn</span>}
              </div>

              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #cbd5e1', marginBottom: 16 }}>
                <strong style={{ color: '#1e293b', display: 'block', marginBottom: 6 }}>Nội dung bài làm của sinh viên:</strong>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#334155' }}>{selectedSubmission.answer}</p>
              </div>

              {/* Form Chấm điểm */}
              <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #93c5fd' }}>
                <h4 style={{ margin: '0 0 12px', color: '#1e40af' }}>Đánh giá & Chấm điểm</h4>

                <div style={{ display: 'grid', gap: 12 }}>
                  <label style={{ fontWeight: 'bold' }}>
                    Điểm số (0 - 100):
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={gradingState.grade}
                      onChange={(e) => setGradingState({ ...gradingState, grade: e.target.value })}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                    />
                  </label>

                  <label style={{ fontWeight: 'bold' }}>
                    Kết quả đánh giá:
                    <select
                      value={gradingState.status}
                      onChange={(e) => setGradingState({ ...gradingState, status: e.target.value })}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                    >
                      <option value="Passed">Passed (Đạt)</option>
                      <option value="Needs Revision">Needs Revision (Cần sửa lại)</option>
                      <option value="Rejected">Rejected (Không đạt)</option>
                    </select>
                  </label>

                  <label style={{ fontWeight: 'bold' }}>
                    Nhận xét / Feedback cho sinh viên:
                    <textarea
                      rows={4}
                      value={gradingState.feedback}
                      onChange={(e) => setGradingState({ ...gradingState, feedback: e.target.value })}
                      placeholder="Viết nhận xét chi tiết về bài làm..."
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                    />
                  </label>

                  <label style={{ fontWeight: 'bold' }}>
                    Phân công Reviewer đánh giá cùng (tùy chọn):
                    <select
                      value={gradingState.reviewerId}
                      onChange={(e) => {
                        setGradingState({ ...gradingState, reviewerId: e.target.value })
                        handleAssignReviewer(selectedSubmission.id, e.target.value)
                      }}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                    >
                      <option value="">-- Chọn Reviewer --</option>
                      {reviewerUsers.map((r) => (
                        <option key={r.id} value={r.id}>{r.name} ({r.email})</option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    className="primary-action"
                    onClick={() => handleGradeSubmission(selectedSubmission.id)}
                    style={{ marginTop: 8 }}
                  >
                    💾 Lưu kết quả chấm điểm & Nhận xét
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="muted-text">Chọn một bài nộp ở danh sách bên trái để kiểm tra và chấm điểm.</p>
          )}
        </div>
      </div>
    )
  }

  return null
}
