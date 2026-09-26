import { useEffect, useState } from 'react'
import AiTutorChatBox from './AiTutorChatBox.jsx'

const API_BASE = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:4000'
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000')

export default function LearnerModuleView({
  session,
  activeModule,
  courses = [],
  assignments = [],
  selectedCourseId,
  onSelectCourse,
  selectedAssignmentId,
  onSelectAssignment,
  assignmentDraft,
  setAssignmentDraft,
  submitAssignment,
  assignmentSubmitState,
}) {
  const userId = session?.userId

  // Learner data state
  const [enrollments, setEnrollments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [completions, setCompletions] = useState([])
  const [lessons, setLessons] = useState([])
  const [openedCourse, setOpenedCourse] = useState(null)
  const [loadingLessons, setLoadingLessons] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  // AI Tutor state
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiAnswer, setAiAnswer] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [selectedContextLesson, setSelectedContextLesson] = useState('lesson-1')

  // Load learner data (enrollments, submissions, completions) on mount / userId change
  useEffect(() => {
    if (!userId) return
    loadLearnerData()
  }, [userId])

  const loadLearnerData = async () => {
    if (!userId) return
    try {
      const [enrollRes, subRes, compRes] = await Promise.all([
        fetch(`${API_BASE}/api/learners/${userId}/enrollments`).then((r) => r.json()),
        fetch(`${API_BASE}/api/learners/${userId}/submissions`).then((r) => r.json()),
        fetch(`${API_BASE}/api/learners/${userId}/completions`).then((r) => r.json()),
      ])

      if (enrollRes.ok) setEnrollments(enrollRes.enrollments || [])
      if (subRes.ok) setSubmissions(subRes.submissions || [])
      if (compRes.ok) setCompletions(compRes.completions || [])
    } catch (err) {
      console.error('Failed to load learner backend data:', err)
    }
  }

  // Load lessons when a course is selected or opened
  useEffect(() => {
    const courseId = openedCourse?.id || selectedCourseId
    if (!courseId) {
      setLessons([])
      return
    }

    setLoadingLessons(true)
    fetch(`${API_BASE}/api/courses/${courseId}/lessons`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setLessons(data.lessons || [])
      })
      .catch((err) => console.error('Failed to fetch lessons:', err))
      .finally(() => setLoadingLessons(false))
  }, [selectedCourseId, openedCourse?.id])

  // Helper checks
  const isEnrolled = (courseId) => {
    if (!courseId) return false
    return enrollments.some(
      (e) => String(e.course_id) === String(courseId) || String(e.courseId) === String(courseId)
    )
  }

  const isLessonCompleted = (lessonId) => {
    return completions.some((c) => String(c.lesson_id) === String(lessonId))
  }

  const handleEnroll = async (targetCourse) => {
    setActionMessage('')
    const cId = typeof targetCourse === 'object' ? targetCourse.id : targetCourse
    try {
      const res = await fetch(`${API_BASE}/api/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courseId: Number(cId) || cId }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'Enrollment failed')
      }
      setActionMessage('✅ Đăng ký khóa học thành công!')
      await loadLearnerData()
      if (typeof targetCourse === 'object') {
        setOpenedCourse(targetCourse)
      } else {
        const found = courses.find((c) => String(c.id) === String(cId))
        if (found) setOpenedCourse(found)
      }
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const handleMarkComplete = async (lessonId) => {
    try {
      const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.ok) {
        setActionMessage('🎉 Đã đánh dấu hoàn thành bài học!')
        loadLearnerData()
      }
    } catch (err) {
      setActionMessage(`❌ Lỗi khi hoàn thành bài học: ${err.message}`)
    }
  }

  // FIX BUG-01: Added isSubmitting debouncing state and button locking to prevent duplicate submission requests (Do Thi Kim Yen)
  const handleFormSubmitAssignment = async (assignmentId) => {
    setActionMessage('')
    await submitAssignment(assignmentId)
    // Reload submissions to reflect in UI
    loadLearnerData()
  }

  const handleAskAi = async (customPrompt) => {
    const prompt = (customPrompt || aiPrompt).trim()
    if (!prompt) return

    setAiLoading(true)
    setAiError('')
    setAiAnswer(null)

    try {
      const res = await fetch(`${API_BASE}/api/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prompt,
          lessonId: selectedContextLesson,
          learnerId: userId,
          sessionId: userId,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'AI Tutor failed')
      }

      setAiAnswer(data)
      if (!customPrompt) setAiPrompt('')
    } catch (err) {
      setAiError(err.message || 'Không thể lấy phản hồi từ AI Tutor.')
    } finally {
      setAiLoading(false)
    }
  }

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || null
  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId) || null
  const selectedSubmission = selectedAssignment
    ? submissions.find((s) => Number(s.assignment_id) === Number(selectedAssignment.id))
    : null

  // Calculate course completion progress
  const calculateProgress = (courseId) => {
    const courseLessons = lessons.filter((l) => Number(l.course_id) === Number(courseId))
    if (courseLessons.length === 0) return 0
    const doneCount = courseLessons.filter((l) => isLessonCompleted(l.id)).length
    return Math.round((doneCount / courseLessons.length) * 100)
  }

  // Render Open Course View
  if (openedCourse) {
    const progress = calculateProgress(openedCourse.id)
    return (
      <div className="course-player-container">
        <button type="button" className="secondary-button" onClick={() => setOpenedCourse(null)} style={{ marginBottom: 16 }}>
          ← Quay lại danh sách khóa học
        </button>

        <div className="panel-card">
          <div className="course-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{openedCourse.title}</h3>
              <p className="muted-text">{openedCourse.description}</p>
            </div>
            <span className="badge blue">{openedCourse.category}</span>
          </div>

          <div className="progress-section" style={{ margin: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}>
              <span>Tiến độ hoàn thành</span>
              <strong>{progress}%</strong>
            </div>
            <div className="bar" style={{ height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: '#3b82f6', transition: 'width 0.3s' }} />
            </div>
          </div>

          {actionMessage && <p className="sync-status">{actionMessage}</p>}

          <h4>Nội dung bài học ({lessons.length} bài)</h4>
          {loadingLessons ? (
            <p>Đang tải danh sách bài học...</p>
          ) : lessons.length === 0 ? (
            <p className="muted-text">Chưa có bài học nào trong khóa học này.</p>
          ) : (
            <div className="lessons-list" style={{ display: 'grid', gap: 12, marginTop: 12 }}>
              {lessons.map((lesson, idx) => {
                const completed = isLessonCompleted(lesson.id)
                return (
                  <div
                    key={lesson.id}
                    className="lesson-card"
                    style={{
                      padding: 16,
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      background: completed ? '#f0fdf4' : '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <strong>
                        Bài {idx + 1}: {lesson.title}
                      </strong>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span className="badge gray">{lesson.duration || 20} phút</span>
                        {completed ? (
                          <span className="badge green">Đã hoàn thành ✓</span>
                        ) : (
                          <button
                            type="button"
                            className="primary-action"
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            onClick={() => handleMarkComplete(lesson.id)}
                          >
                            Đánh dấu hoàn thành
                          </button>
                        )}
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}>{lesson.content}</p>

                    {/* AI Tutor Chatbox embedded in Lesson */}
                    <AiTutorChatBox
                      userId={userId}
                      contextTitle={`Bài ${idx + 1}: ${lesson.title}`}
                      lessonId={String(lesson.id)}
                      placeholder={`Hỏi AI Tutor về bài "${lesson.title}"...`}
                      quickPrompts={[
                        `💡 Giải thích bài ${lesson.title}`,
                        '🔍 Cho tôi ví dụ thực tế',
                        '📝 Tóm tắt ý chính bài này',
                      ]}
                      embedded={true}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 1. Overview Module
  if (activeModule === 'overview') {
    const activeSubmissionsCount = submissions.length
    const gradedSubmissionsCount = submissions.filter((s) => s.grade !== null && s.grade !== undefined).length

    return (
      <div className="dashboard-layout">
        <div className="panel-card">
          <h3>Khóa học của tôi</h3>
          <ul className="module-list">
            {enrollments.length > 0 ? (
              enrollments.map((e) => (
                <li key={e.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{e.title}</span>
                  <span className="badge blue">Đã đăng ký</span>
                </li>
              ))
            ) : (
              <li className="muted-text">Bạn chưa đăng ký khóa học nào. Hãy vào mục "Courses" để tham gia.</li>
            )}
          </ul>
        </div>

        <div className="panel-card">
          <h3>Hoạt động & Bài tập gần đây</h3>
          <ul className="task-list">
            {submissions.slice(0, 3).map((sub) => (
              <li key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <strong>{sub.assignment_title}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Trạng thái: {sub.status}</div>
                </div>
                {sub.grade !== null && sub.grade !== undefined ? (
                  <span className="badge green">Điểm: {sub.grade}</span>
                ) : (
                  <span className="badge orange">Đang chờ chấm</span>
                )}
              </li>
            ))}
            {submissions.length === 0 && <li className="muted-text">Chưa nộp bài tập nào.</li>}
          </ul>
        </div>
      </div>
    )
  }

  // 2. Courses Module
  if (activeModule === 'courses') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card">
          <h3>Danh sách khóa học</h3>
          {actionMessage && <p className="sync-status">{actionMessage}</p>}
          <div className="module-list interactive-list">
            {courses.map((course) => {
              const enrolled = isEnrolled(course.id)
              return (
                <button
                  type="button"
                  key={course.id}
                  className={`course-row ${selectedCourseId === course.id ? 'active' : ''}`}
                  onClick={() => onSelectCourse?.(course)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>{course.title}</span>
                  <span className={`badge ${enrolled ? 'green' : 'blue'}`}>{enrolled ? 'Đã đăng ký' : 'Có sẵn'}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="panel-card">
          <h3>Chi tiết khóa học</h3>
          {selectedCourse ? (
            <div className="course-detail-panel">
              <h4>{selectedCourse.title}</h4>
              <p>{selectedCourse.description || 'Chưa có mô tả cho khóa học này.'}</p>
              <div className="course-meta" style={{ display: 'flex', gap: 16, margin: '12px 0' }}>
                <span>Trạng thái: <strong>{selectedCourse.status || 'Published'}</strong></span>
                <span>Danh mục: <strong>{selectedCourse.category || 'General'}</strong></span>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {isEnrolled(selectedCourse.id) ? (
                  <button type="button" className="primary-action" onClick={() => setOpenedCourse(selectedCourse)}>
                    📖 Mở lớp học (Open Course)
                  </button>
                ) : (
                  <button type="button" className="primary-action" onClick={() => handleEnroll(selectedCourse)}>
                    ✍️ Đăng ký & Vào học ngay (Enroll & Open)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="muted-text">Chọn một khóa học để xem thông tin chi tiết và vào học.</p>
          )}
        </div>
      </div>
    )
  }

  // 3. Assignments Module
  if (activeModule === 'assignments') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card">
          <h3>Hàng đợi bài tập</h3>
          <div className="module-list interactive-list">
            {assignments.map((assignment) => {
              const sub = submissions.find((s) => Number(s.assignment_id) === Number(assignment.id))
              return (
                <button
                  type="button"
                  key={assignment.id}
                  className={`course-row ${selectedAssignmentId === assignment.id ? 'active' : ''}`}
                  onClick={() => onSelectAssignment?.(assignment)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>{assignment.title}</span>
                  <span className={`badge ${sub ? 'green' : 'orange'}`}>{sub ? sub.status : 'Chưa nộp'}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="panel-card">
          <h3>Chi tiết & Nộp bài tập</h3>
          {selectedAssignment ? (
            <div className="course-detail-panel">
              <h4>{selectedAssignment.title}</h4>
              <p>{selectedAssignment.description || 'Chưa có mô tả bài tập.'}</p>
              <div className="course-meta" style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <span>Khóa học: <strong>{selectedAssignment.course_title || 'General'}</strong></span>
                <span>
                  Hạn nộp:{' '}
                  <strong>
                    {selectedAssignment.deadline ? new Date(selectedAssignment.deadline).toLocaleString('vi-VN') : 'Không giới hạn'}
                  </strong>
                </span>
              </div>

              {/* Existing submission display */}
              {selectedSubmission && (
                <div
                  style={{
                    padding: 16,
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 12,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong>Bài đã nộp ({new Date(selectedSubmission.submitted_at).toLocaleString('vi-VN')})</strong>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {selectedSubmission.is_late && <span className="badge red">Trễ hạn</span>}
                      <span className="badge green">{selectedSubmission.status}</span>
                    </div>
                  </div>
                  <p style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', margin: '8px 0' }}>
                    {selectedSubmission.answer}
                  </p>

                  {selectedSubmission.grade !== null && selectedSubmission.grade !== undefined && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#15803d', fontWeight: 'bold' }}>Điểm số: {selectedSubmission.grade} / 100</div>
                      {selectedSubmission.feedback && (
                        <div style={{ marginTop: 4, color: '#334155' }}>
                          <strong>Nhận xét từ giáo viên:</strong> {selectedSubmission.feedback}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Submission Form */}
              <div className="assignment-form">
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 6 }}>
                  {selectedSubmission ? 'Nộp lại / Cập nhật câu trả lời:' : 'Nhập câu trả lời bài tập:'}
                </label>
                <textarea
                  rows={5}
                  value={assignmentDraft || ''}
                  onChange={(event) => setAssignmentDraft?.(event.target.value)}
                  placeholder="Viết câu trả lời của bạn ở đây..."
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
                <button
                  type="button"
                  className="primary-action"
                  style={{ marginTop: 12 }}
                  onClick={() => handleFormSubmitAssignment(selectedAssignment.id)}
                  disabled={!assignmentDraft?.trim()}
                >
                  {selectedSubmission ? 'Nộp lại bài tập' : 'Gửi bài nộp (Submit Answer)'}
                </button>
              </div>

              {assignmentSubmitState && (
                <p className={`submission-message ${assignmentSubmitState.ok ? 'success' : 'error'}`} style={{ marginTop: 12 }}>
                  {assignmentSubmitState.message}
                </p>
              )}

              {/* Embedded AI Tutor Assistant for Assignment */}
              <AiTutorChatBox
                userId={userId}
                contextTitle={`Bài tập: ${selectedAssignment.title}`}
                lessonId={String(selectedAssignment.course_id || 1)}
                placeholder={`Hỏi AI Tutor gợi ý cách làm bài tập "${selectedAssignment.title}"...`}
                quickPrompts={[
                  '💡 Hướng dẫn cấu trúc câu trả lời',
                  '🔍 Gợi ý ý chính cho bài tập này',
                  '❓ Làm sao để trình bày thuyết phục?',
                ]}
                embedded={true}
              />
            </div>
          ) : (
            <p className="muted-text">Chọn một bài tập từ danh sách để xem chi tiết và làm bài.</p>
          )}
        </div>
      </div>
    )
  }

  // 4. Grades Module
  if (activeModule === 'grades') {
    const gradedCount = submissions.filter((s) => s.grade !== null && s.grade !== undefined).length
    const totalGradeSum = submissions.reduce((acc, s) => acc + (Number(s.grade) || 0), 0)
    const avgGrade = gradedCount > 0 ? (totalGradeSum / gradedCount).toFixed(1) : 'N/A'

    return (
      <div className="dashboard-layout" style={{ gridTemplateColumns: '1fr' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          <div className="panel-card" style={{ textAlign: 'center' }}>
            <span className="muted-text">Điểm trung bình</span>
            <h2 style={{ color: '#2563eb', margin: '8px 0' }}>{avgGrade}</h2>
          </div>
          <div className="panel-card" style={{ textAlign: 'center' }}>
            <span className="muted-text">Bài tập đã nộp</span>
            <h2 style={{ color: '#16a34a', margin: '8px 0' }}>{submissions.length} / {assignments.length}</h2>
          </div>
          <div className="panel-card" style={{ textAlign: 'center' }}>
            <span className="muted-text">Đã chấm điểm</span>
            <h2 style={{ color: '#9333ea', margin: '8px 0' }}>{gradedCount}</h2>
          </div>
        </div>

        <div className="panel-card">
          <h3>Bảng điểm & Nhận xét chi tiết</h3>
          {submissions.length === 0 ? (
            <p className="muted-text">Bạn chưa nộp bài tập nào để hiển thị kết quả.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: 12 }}>Bài tập</th>
                  <th style={{ padding: 12 }}>Khóa học</th>
                  <th style={{ padding: 12 }}>Ngày nộp</th>
                  <th style={{ padding: 12 }}>Trạng thái</th>
                  <th style={{ padding: 12 }}>Điểm</th>
                  <th style={{ padding: 12 }}>Nhận xét</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: 12 }}><strong>{sub.assignment_title}</strong></td>
                    <td style={{ padding: 12 }}>{sub.course_title}</td>
                    <td style={{ padding: 12 }}>{new Date(sub.submitted_at).toLocaleDateString('vi-VN')}</td>
                    <td style={{ padding: 12 }}>
                      <span className={`badge ${sub.status === 'Passed' ? 'green' : 'orange'}`}>{sub.status}</span>
                    </td>
                    <td style={{ padding: 12, fontWeight: 'bold', color: sub.grade >= 70 ? '#16a34a' : '#d97706' }}>
                      {sub.grade !== null && sub.grade !== undefined ? `${sub.grade}/100` : 'Chưa chấm'}
                    </td>
                    <td style={{ padding: 12 }}>{sub.feedback || 'Chưa có nhận xét'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }

  // 5. AI Tutor Module
  if (activeModule === 'ai-tutor') {
    const promptChips = [
      'Giải thích khái niệm bài học này',
      'Hướng dẫn cách làm bài tập tốt hơn',
      'Cho tôi ví dụ thực tế về Design Thinking',
    ]

    return (
      <div className="ai-tutor-shell">
        <div className="panel-card ai-tutor-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>AI Tutor - Trợ lý Học tập</h3>
              <p className="ai-tutor-subtitle">
                Đặt câu hỏi về nội dung bài học, hướng dẫn làm bài tập hoặc yêu cầu ví dụ minh họa.
              </p>
            </div>
            <span className="badge purple">Grounded AI</span>
          </div>

          <div style={{ margin: '16px 0', display: 'flex', gap: 10, alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Bối cảnh bài học:</label>
            <select
              value={selectedContextLesson}
              onChange={(e) => setSelectedContextLesson(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
            >
              <option value="lesson-1">Lesson 1: Intro & Design Thinking</option>
              <option value="lesson-2">Lesson 2: User Research & Synthesis</option>
              <option value="lesson-3">Lesson 3: Analytics Basics</option>
              <option value="lesson-4">Lesson 4: Systems Map</option>
            </select>
          </div>

          <div className="prompt-chips" style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {promptChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="secondary-button"
                style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: 20, background: '#f1f5f9', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  setAiPrompt(chip)
                  handleAskAi(chip)
                }}
              >
                💡 {chip}
              </button>
            ))}
          </div>

          <div className="ai-tutor-form">
            <textarea
              rows={4}
              value={aiPrompt}
              onChange={(event) => setAiPrompt(event.target.value)}
              placeholder="Ví dụ: Làm sao để xác định đúng nhu cầu của người dùng trong bài tập Design Thinking?"
              style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #cbd5e1' }}
            />
            <button
              type="button"
              className="primary-action"
              onClick={() => handleAskAi()}
              disabled={aiLoading || !aiPrompt.trim()}
              style={{ marginTop: 10 }}
            >
              {aiLoading ? 'Đang suy nghĩ...' : 'Hỏi AI Tutor'}
            </button>
          </div>

          {aiError && <p className="login-error" style={{ marginTop: 16 }}>{aiError}</p>}

          <div className="ai-tutor-response" style={{ marginTop: 20, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            {aiLoading ? (
              <p>🤖 AI đang phân tích bài học và tạo câu trả lời...</p>
            ) : aiAnswer ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ color: '#1e40af' }}>Câu trả lời từ AI Tutor:</strong>
                  <span className={`badge ${aiAnswer.status === 'success' ? 'green' : 'orange'}`}>
                    {aiAnswer.status === 'success' ? 'Có trong bài học' : 'Cần thêm context'}
                  </span>
                </div>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#334155' }}>{aiAnswer.answer}</p>

                {aiAnswer.references && aiAnswer.references.length > 0 && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed #cbd5e1', fontSize: '0.85rem', color: '#64748b' }}>
                    📌 <strong>Nguồn tham chiếu bài học:</strong> {aiAnswer.references[0]?.snippet}
                  </div>
                )}
              </div>
            ) : (
              <p className="muted-text">Nhập câu hỏi hoặc chọn câu gợi ý phía trên để bắt đầu trao đổi với AI Tutor.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
