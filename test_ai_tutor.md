# AI Tutor Test Cases

## Test với nội dung bài học chi tiết

Sau khi thêm nội dung chi tiết vào lessons, test các câu hỏi sau:

### Test Case 1: Giải thích khái niệm
**Câu hỏi:** "Giải thích cho tôi về user research methods"

**Kết quả mong đợi:** 
AI Tutor nên trả lời dựa trên nội dung bài học "Research":
- Qualitative research methods
- Interviews, observations, contextual inquiry
- Empathy mapping, journey mapping
- Grounded in real user data

---

### Test Case 2: Yêu cầu ví dụ
**Câu hỏi:** "Cho tôi ví dụ về prototyping"

**Kết quả mong đợi:**
AI Tutor nên đưa ví dụ dựa trên bài học "Prototyping":
- Low-fidelity sketching
- Wireframing
- High-fidelity interactive prototypes
- Paper prototypes, Figma, HTML mockups

---

### Test Case 3: Hỏi về assignment
**Câu hỏi:** "Bài tập Design Reflection yêu cầu gì?"

**Kết quả mong đợi:**
AI Tutor nên trả lời dựa trên assignment description:
- 500-word reflection
- Research methods used
- User needs identified
- Design decisions based on feedback
- Prototype iterations and learning

---

### Test Case 4: Câu hỏi ngoài scope
**Câu hỏi:** "Thời tiết hôm nay thế nào?"

**Kết quả mong đợi:**
```
KHÔNG ĐỦ DỮ LIỆU: Câu hỏi không nằm trong phạm vi bài học hoặc môn học hiện tại.
```

---

### Test Case 5: Câu hỏi trong scope nhưng không đủ context
**Câu hỏi:** "Làm thế nào để học lập trình Python?"

**Kết quả mong đợi:**
```
KHÔNG ĐỦ DỮ LIỆU: Câu hỏi không nằm trong phạm vi bài học hoặc môn học hiện tại.
```

---

## Cách test

### 1. Test qua API:
```bash
curl -X POST http://localhost:4000/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Giải thích cho tôi về user research methods",
    "lessonId": "2",
    "learnerId": "1",
    "sessionId": "session-1"
  }'
```

### 2. Test qua frontend:
1. Login với `alice@lms.test` / `learner123`
2. Vào Courses → Chọn "Human-Centered Product Design"
3. Vào Lessons → Chọn bài "Research"
4. Sử dụng AI Tutor chatbox
5. Hỏi các câu hỏi test ở trên

---

## Lesson IDs để test:
- Lesson 1 (Intro): General design thinking
- Lesson 2 (Research): User research methods
- Lesson 3 (Prototyping): Prototype types and testing
- Lesson 4 (Design Systems): Component libraries and patterns

---

## Expected AI Tutor Behavior:

✅ **Should:**
- Base answers on lesson content
- Provide relevant examples from lesson
- Reference specific concepts taught
- Reject off-topic questions

❌ **Should NOT:**
- Make up information not in lessons
- Answer questions outside course scope
- Provide generic answers without context
- Accept any question regardless of relevance
