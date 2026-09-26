import { useState } from 'react'

const API_BASE = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:4000'
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000')

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
        { text: '💡 Giải thích khái niệm bài học này', intent: 'explain' },
        { text: '🔍 Cho tôi ví dụ thực tế minh họa', intent: 'example' },
        { text: '📝 Tóm tắt ý chính của bài học', intent: 'explain' },
      ]

  // Strategy 1: Try Puter.js (free AI, no API key required - User-Pays model)
  const askViaPuter = async (questionText, lessonContext) => {
    const puter = window.puter
    if (!puter?.ai?.chat) throw new Error('Puter not available')

    const systemPrompt = `Bạn là AI Tutor thân thiện cho khóa học "Human-Centered Product Design".
Trả lời bằng tiếng Việt, rõ ràng và chi tiết.
Nội dung bài học: ${lessonContext || 'Human-Centered Product Design - Design thinking, empathy, user research, prototyping, design systems.'}
Luôn trả lời các câu hỏi về học tập và thiết kế. Chỉ từ chối câu hỏi hoàn toàn không liên quan giáo dục.`

    const response = await puter.ai.chat(
      `${systemPrompt}\n\nCâu hỏi: ${questionText}`,
      { model: 'gpt-4o-mini' }
    )

    const text = response?.message?.content?.[0]?.text
      || response?.message?.content
      || response?.text
      || (typeof response === 'string' ? response : null)

    if (!text) throw new Error('Empty response from Puter')
    return text
  }

  const handleAsk = async (customPrompt, customIntent) => {
    const questionText = (customPrompt || prompt).trim()
    if (!questionText) return

    setLoading(true)
    setError('')
    setAnswer(null)

    try {
      // Auto-detect intent from question if not provided
      let detectedIntent = customIntent
      if (!detectedIntent) {
        const lowerQ = questionText.toLowerCase()
        if (lowerQ.includes('ví dụ') || lowerQ.includes('example') || lowerQ.includes('minh họa') || lowerQ.includes('illustrate') || lowerQ.includes('cụ thể')) {
          detectedIntent = 'example'
        } else if (lowerQ.includes('tóm tắt') || lowerQ.includes('tóm lại') || lowerQ.includes('summary')) {
          detectedIntent = 'summarize'
        } else {
          detectedIntent = 'explain'
        }
      }

      // === Strategy 1: Puter.js (free AI, no API key) ===
      try {
        const puterAnswer = await askViaPuter(questionText, contextTitle)
        setAnswer({ ok: true, answer: puterAnswer, source: 'puter', status: 'success', references: [], intent: detectedIntent })
        if (!customPrompt) setPrompt('')
        return
      } catch (puterErr) {
        // Puter unavailable or user not signed into Puter → fallback
        console.info('Puter AI unavailable, using backend:', puterErr.message)
      }

      // === Strategy 2: Backend API (local tutor / OpenAI) ===
      const res = await fetch(`${API_BASE}/api/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          lessonId,
          learnerId: userId || 1,
          sessionId: userId || 1,
          intent: detectedIntent,
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
        {defaultQuickPrompts.map((qp) => {
          const promptText = typeof qp === 'string' ? qp : qp.text
          const promptIntent = typeof qp === 'string' ? 'explain' : qp.intent
          
          return (
            <button
              key={promptText}
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
                const text = promptText.replace(/^[\p{Emoji}\s]+/u, '')
                setPrompt(text)
                handleAsk(text, promptIntent)
              }}
            >
              {promptText}
            </button>
          )
        })}
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
