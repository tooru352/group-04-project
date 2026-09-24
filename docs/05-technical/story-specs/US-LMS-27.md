# Story Spec

Story ID: US-LMS-27
Requirement IDs: REQ-LMS-24
Design link: S12 - AI Tutor (Figma frame `10:17`)

Goal:
When a Learner requests an explanation or example of difficult content, the AI Tutor rephrases or illustrates the concept using Course/Lesson context.

Preconditions:
Learner is logged in and enrolled in the Course.
Learner asks for an explanation or example.
Course/Lesson context contains relevant content.

Happy path:
1. Learner asks "explain this" or "give me an example of X".
2. System identifies intent as EXPLAIN or EXAMPLE.
3. LLM rephrases the relevant content or constructs an example from within the context.
4. Response is displayed on S12 in a clear, simplified format.

Alternate/error paths:
- Context insufficient for explanation → display KHÔNG ĐỦ DỮ LIỆU (US-LMS-28).
- Question is ambiguous → AI may ask a clarifying question.
- LLM produces out-of-context example → application layer rejects; user sees insufficient-context message.

Data read/write:
- Read: Lesson content (context), VoiceTurn
- Write: VoiceTurn (response log)

API contract:
- POST `/api/tutor/ask`
- Request: `{ lessonId, question, sessionId, intent: "explain" | "example" }`
- Response: `{ answer, references, status }`

Authorization:
- Learner must be enrolled in the Course containing the Lesson.

Validation/business rules:
- Explanation/example must be derived from Course/Lesson context only.
- Must not introduce external concepts or invented facts.

Observability/logging:
- Log intent type (EXPLAIN/EXAMPLE), lessonId, latency, status.

Test plan:
- Integration test: explain request with sufficient context → rephrased answer.
- Integration test: explain request with no context → insufficient_context status.
- E2E test: ask for example → verify answer is grounded in lesson content.

Definition of Done:
- AI explains or provides examples based only on available context.
- Out-of-scope requests are clearly flagged.
