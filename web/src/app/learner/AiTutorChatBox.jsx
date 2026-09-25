import { useState } from 'react'

const API_BASE = 'http://localhost:4000'

export default function AiTutorChatBox({
  userId,
  contextTitle = '',
  lessonId = 'lesson-1',
  placeholder = 'Đặt câu hỏi cho AI Tutor về bài học này...',
  quickPrompts = [],
  embedded = true,
}) {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [minimized, setMinimized] = useState(false)

  const defaultQuickPrompts = quickPrompts.length > 0
    ? quickPrompts
    : [
        '💡 Giải thích khái niệm bài học này',
        '🔍 Cho tôi ví dụ thực tế minh họa',
        '📝 Hướng dẫn cách ứng dụng vào bài tập',
      ]

  const handleAsk = async (customPrompt) => {
    const questionText = (customPrompt || prompt).trim()
    if (!questionText) return

    setLoading(true)
    setError('')
    setAnswer(null)

    try {
      const res = await fetch(`${API_BASE}/api/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          lessonId,
          learnerId: userId || 1,
          sessionId: userId || 1,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'AI Tutor failed')
      }

      setAnswer(data)
      if (!customPrompt) setPrompt('')
    } catch (err) {
      setError(err.message || 'Không thể lấy phản hồi từ AI Tutor.')
    } finally {
      setLoading(false)
    }
  }

  if (minimized && !embedded) {
    return (
      <button
        type="button"
        className="primary-action"
        onClick={() => setMinimized(false)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          borderRadius: 30,
          padding: '12px 20px',
          boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        🤖 Trợ lý AI Tutor
      </button>
    )
  }

  return (
    <div
      className="ai-tutor-box"
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
        border: '1px solid #bfdbfe',
        boxShadow: embedded ? 'none' : '0 12px 36px rgba(15,23,42,0.15)',
        position: embedded ? 'relative' : 'fixed',
        bottom: embedded ? 'auto' : 24,
        right: embedded ? 'auto' : 24,
        width: embedded ? '100%' : 380,
        maxWidth: '100%',
        zIndex: embedded ? 1 : 1000,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>🤖</span>
          <div>
            <strong style={{ color: '#1e40af', fontSize: '0.95rem' }}>AI Tutor - Trợ lý Bài học</strong>
            {contextTitle && (
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Bối cảnh: <em>{contextTitle}</em>
              </div>
            )}
          </div>
        </div>
        {!embedded && (
          <button
            type="button"
            onClick={() => setMinimized(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.1rem' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {defaultQuickPrompts.map((qp) => (
          <button
            key={qp}
            type="button"
            style={{
              fontSize: '0.78rem',
              padding: '4px 10px',
              borderRadius: 14,
              border: '1px solid #93c5fd',
              background: '#fff',
              color: '#1d4ed8',
              cursor: 'pointer',
              fontWeight: 500,
            }}
            onClick={() => {
              const text = qp.replace(/^[\p{Emoji}\s]+/u, '')
              setPrompt(text)
              handleAsk(text)
            }}
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Question Form */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAsk()
            }
          }}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
            background: '#fff',
          }}
        />
        <button
          type="button"
          className="primary-action"
          onClick={() => handleAsk()}
          disabled={loading || !prompt.trim()}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          {loading ? '...' : 'Hỏi AI'}
        </button>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: 8 }}>{error}</p>}

      {/* AI Answer Display */}
      {loading && (
        <div style={{ marginTop: 10, fontSize: '0.85rem', color: '#2563eb' }}>
          🤖 AI đang tra cứu bài học và trả lời...
        </div>
      )}

      {!loading && answer && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 8,
            background: '#fff',
            border: '1px solid #dbeafe',
            fontSize: '0.9rem',
            lineHeight: 1.5,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 'bold', color: '#1e40af', fontSize: '0.82rem' }}>Câu trả lời từ AI Tutor:</span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 10,
                background: answer.status === 'success' ? '#dcfce7' : '#fef3c7',
                color: answer.status === 'success' ? '#15803d' : '#b45309',
                fontWeight: 600,
              }}
            >
              {answer.status === 'success' ? 'Grounded in Lesson' : 'Cần thêm context'}
            </span>
          </div>

          <p style={{ margin: 0, color: '#1e293b', whiteSpace: 'pre-wrap' }}>{answer.answer}</p>

          {answer.references && answer.references.length > 0 && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #cbd5e1', fontSize: '0.78rem', color: '#64748b' }}>
              📌 <em>Trích dẫn nội dung bài học:</em> "{answer.references[0]?.snippet}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
