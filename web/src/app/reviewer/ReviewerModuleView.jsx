import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:4000'

export default function ReviewerModuleView({ session, activeModule }) {
  const reviewerId = session?.userId

  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null)
  const [reviewForm, setReviewForm] = useState({ grade: 85, feedback: '', status: 'Passed' })

  // Load submissions assigned to reviewer or unassigned
  useEffect(() => {
    loadSubmissions()
  }, [reviewerId])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const url = reviewerId
        ? `${API_BASE}/api/reviewer/submissions?reviewerId=${reviewerId}`
        : `${API_BASE}/api/reviewer/submissions`
      const res = await fetch(url)
      const data = await res.json()
      if (data.ok) {
        setSubmissions(data.submissions || [])
      }
    } catch (err) {
      console.error('Failed to load reviewer submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle saving review & feedback
  const handleSaveReview = async (submissionId) => {
    if (!submissionId) return
    setActionMessage('')
    try {
      const res = await fetch(`${API_BASE}/api/submissions/${submissionId}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: Number(reviewForm.grade),
          feedback: reviewForm.feedback,
          status: reviewForm.status,
          reviewerId: reviewerId ? Number(reviewerId) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Lưu đánh giá thất bại.')

      setActionMessage('🎉 Đã thẩm định và cập nhật nhận xét thành công!')
      await loadSubmissions()
    } catch (err) {
      setActionMessage(`❌ ${err.message}`)
    }
  }

  const selectedSubmission = submissions.find((s) => String(s.id) === String(selectedSubmissionId)) || null
  const pendingSubmissions = submissions.filter((s) => s.grade === null || s.grade === undefined)
  const evaluatedSubmissions = submissions.filter((s) => s.grade !== null && s.grade !== undefined)

  // Calculate stats
  const totalEvaluated = evaluatedSubmissions.length
  const avgGrade = totalEvaluated > 0
    ? (evaluatedSubmissions.reduce((sum, s) => sum + Number(s.grade || 0), 0) / totalEvaluated).toFixed(1)
    : 'N/A'

  // 1. OVERVIEW MODULE
  if (activeModule === 'overview') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card">
          <h3>Tổng quan Hàng chờ Thẩm định</h3>
          <ul className="module-list">
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tổng số bài tập chờ thẩm định</span>
              <span className="badge orange">{pendingSubmissions.length}</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Đã hoàn thành đánh giá</span>
              <span className="badge green">{evaluatedSubmissions.length}</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Điểm trung bình đã cho</span>
              <span className="badge blue">{avgGrade}</span>
            </li>
          </ul>
        </div>

        <div className="panel-card">
          <h3>Bài làm cần kiểm duyệt gần đây</h3>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <ul className="task-list">
              {pendingSubmissions.slice(0, 5).map((sub) => (
                <li key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <strong>{sub.learner_name}</strong> - <em>{sub.assignment_title}</em>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Nộp: {new Date(sub.submitted_at).toLocaleString('vi-VN')} {sub.is_late && <span style={{ color: '#dc2626' }}>(Trễ hạn)</span>}
                    </div>
                  </div>
                  <span className="badge orange">Chờ duyệt</span>
                </li>
              ))}
              {pendingSubmissions.length === 0 && <li className="muted-text">Không có bài làm nào chờ duyệt.</li>}
            </ul>
          )}
        </div>
      </div>
    )
  }

  // 2. REVIEWS MODULE (CHẤM & THẨM ĐỊNH CHẤT LƯỢNG)
  if (activeModule === 'reviews') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card">
          <h3>Hàng chờ Thẩm định bài làm</h3>
          {actionMessage && <p className="sync-status">{actionMessage}</p>}

          {loading ? (
            <p>Đang tải danh sách bài làm...</p>
          ) : (
            <div className="module-list interactive-list">
              {submissions.map((sub) => (
                <button
                  type="button"
                  key={sub.id}
                  className={`course-row ${String(selectedSubmissionId) === String(sub.id) ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSubmissionId(sub.id)
                    setReviewForm({
                      grade: sub.grade !== null && sub.grade !== undefined ? sub.grade : 85,
                      feedback: sub.feedback || '',
                      status: sub.status || 'Passed',
                    })
                  }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <strong>{sub.learner_name}</strong> - {sub.assignment_title}
                    {sub.is_late && <span style={{ color: '#dc2626', marginLeft: 6, fontSize: '0.78rem' }}>(Trễ hạn)</span>}
                  </div>
                  <span className={`badge ${sub.grade !== null && sub.grade !== undefined ? 'green' : 'orange'}`}>
                    {sub.grade !== null && sub.grade !== undefined ? `${sub.grade} đ` : 'Chờ duyệt'}
                  </span>
                </button>
              ))}
              {submissions.length === 0 && <p className="muted-text">Chưa có bài nộp nào cần thẩm định.</p>}
            </div>
          )}
        </div>

        <div className="panel-card">
          <h3>Chi tiết & Phiếu Thẩm định</h3>
          {selectedSubmission ? (
            <div className="course-detail-panel">
              <h4>{selectedSubmission.assignment_title}</h4>
              <p className="muted-text">Môn học: <strong>{selectedSubmission.course_title}</strong> | Sinh viên: <strong>{selectedSubmission.learner_name}</strong> ({selectedSubmission.learner_email})</p>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 12 }}>
                Ngày nộp: {new Date(selectedSubmission.submitted_at).toLocaleString('vi-VN')} {selectedSubmission.is_late && <span style={{ color: '#dc2626', fontWeight: 'bold' }}>- Trễ hạn</span>}
              </div>

              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #cbd5e1', marginBottom: 16 }}>
                <strong style={{ color: '#1e293b', display: 'block', marginBottom: 6 }}>Bài làm của sinh viên:</strong>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#334155' }}>{selectedSubmission.answer}</p>
              </div>

              {/* Form Thẩm định */}
              <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #c084fc' }}>
                <h4 style={{ margin: '0 0 12px', color: '#6b21a8' }}>📝 Kết quả Đánh giá của Reviewer</h4>

                <div style={{ display: 'grid', gap: 12 }}>
                  <label style={{ fontWeight: 'bold' }}>
                    Điểm đánh giá (0 - 100):
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={reviewForm.grade}
                      onChange={(e) => setReviewForm({ ...reviewForm, grade: e.target.value })}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                    />
                  </label>

                  <label style={{ fontWeight: 'bold' }}>
                    Trạng thái kết quả:
                    <select
                      value={reviewForm.status}
                      onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                    >
                      <option value="Passed">Passed (Đạt chuẩn)</option>
                      <option value="Needs Revision">Needs Revision (Cần chỉnh sửa lại)</option>
                      <option value="Rejected">Rejected (Không đạt yêu cầu)</option>
                    </select>
                  </label>

                  <label style={{ fontWeight: 'bold' }}>
                    Nhận xét / Feedback chuyên môn từ Reviewer:
                    <textarea
                      rows={5}
                      value={reviewForm.feedback}
                      onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                      placeholder="Ghi nhận xét chi tiết, góp ý chuyên môn cho sinh viên..."
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 4 }}
                    />
                  </label>

                  <button
                    type="button"
                    className="primary-action"
                    onClick={() => handleSaveReview(selectedSubmission.id)}
                    style={{ marginTop: 8 }}
                  >
                    💾 Lưu kết quả thẩm định & Nhận xét
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="muted-text">Chọn một bài làm ở danh sách bên trái để tiến hành kiểm duyệt và nhận xét.</p>
          )}
        </div>
      </div>
    )
  }

  // 3. FEEDBACK MODULE (QUẢN LÝ NHẬN XÉT)
  if (activeModule === 'feedback') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card" style={{ gridColumn: 'span 2' }}>
          <h3>Danh sách Nhận xét & Đánh giá đã gửi</h3>
          {actionMessage && <p className="sync-status">{actionMessage}</p>}

          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {evaluatedSubmissions.map((sub) => (
              <div key={sub.id} style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <strong style={{ fontSize: '1.05rem' }}>{sub.learner_name}</strong> - <em>{sub.assignment_title}</em>
                    <span className="badge purple" style={{ marginLeft: 8 }}>Môn: {sub.course_title}</span>
                  </div>
                  <div>
                    <span className="badge green" style={{ marginRight: 6 }}>Điểm: {sub.grade}</span>
                    <span className={`badge ${sub.status === 'Passed' ? 'green' : 'orange'}`}>{sub.status}</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, margin: '8px 0', fontSize: '0.9rem', color: '#334155' }}>
                  <strong>Nhận xét:</strong> {sub.feedback || 'Chưa có ghi chú chi tiết.'}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Ngày đánh giá: {new Date(sub.submitted_at).toLocaleString('vi-VN')}
                </div>
              </div>
            ))}

            {evaluatedSubmissions.length === 0 && <p className="muted-text">Chưa có bài làm nào được thẩm định.</p>}
          </div>
        </div>
      </div>
    )
  }

  // 4. HISTORY MODULE (LỊCH SỬ THẨM ĐỊNH)
  if (activeModule === 'history') {
    return (
      <div className="dashboard-layout">
        <div className="panel-card" style={{ gridColumn: 'span 2' }}>
          <h3>Nhật ký Lịch sử Thẩm định & Kiểm duyệt</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: 10 }}>#ID</th>
                <th style={{ padding: 10 }}>Sinh viên</th>
                <th style={{ padding: 10 }}>Bài tập</th>
                <th style={{ padding: 10 }}>Môn học</th>
                <th style={{ padding: 10 }}>Điểm số</th>
                <th style={{ padding: 10 }}>Trạng thái</th>
                <th style={{ padding: 10 }}>Ngày thẩm định</th>
              </tr>
            </thead>
            <tbody>
              {evaluatedSubmissions.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: 10 }}>#{sub.id}</td>
                  <td style={{ padding: 10 }}><strong>{sub.learner_name}</strong><br /><small style={{ color: '#64748b' }}>{sub.learner_email}</small></td>
                  <td style={{ padding: 10 }}>{sub.assignment_title}</td>
                  <td style={{ padding: 10 }}>{sub.course_title}</td>
                  <td style={{ padding: 10 }}><strong style={{ color: '#16a34a' }}>{sub.grade} đ</strong></td>
                  <td style={{ padding: 10 }}><span className={`badge ${sub.status === 'Passed' ? 'green' : 'orange'}`}>{sub.status}</span></td>
                  <td style={{ padding: 10 }}>{new Date(sub.submitted_at).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
              {evaluatedSubmissions.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 16, textAlign: 'center', color: '#64748b' }}>Chưa có nhật ký thẩm định nào.</td>
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
