# Story Spec

Story ID: US-LMS-26
Requirement IDs: REQ-LMS-23, NFR-LMS-05
Design link: S12 - AI Tutor (Figma frame `10:17`)

Goal:
The AI Tutor answers the Learner's question based on the current Course/Lesson context only, without making up information.

Preconditions:
Learner is logged in and enrolled in the Course.
Learner has asked a question (US-LMS-25 satisfied).
Course/Lesson context is available to the AI Tutor service.

Happy path:
1. System sends the question + Course/Lesson context to the LLM service.
2. LLM generates an answer grounded in the provided context.
3. Answer is returned to the API.
4. API returns the answer with source references (Course/Lesson).
5. AI Tutor screen (S12) displays the answer and references.

Alternate/error paths:
- Context not sufficient for the question → system must not guess; triggers US-LMS-28 flow.
- LLM service timeout/error → show friendly error; allow retry.
- Answer produced without context grounding → rejected by application layer; not shown to user.

Data read/write:
- Read: Lesson content (for context), VoiceTurn (session context)
- Write: VoiceTurn (response record, log)

API contract:
- POST `/api/tutor/ask`
- Request: `{ lessonId, question, sessionId }`
- Response: `{ answer, references: [{ lessonId, snippet }], status: "success" | "insufficient_context" }`

Authorization:
- Learner must be enrolled in the Course containing the Lesson.
- LLM must not access DB directly; application provides context.

Validation/business rules:
- Answer must be grounded in provided context (BR-LMS-14, BR-LMS-15).
- Application must validate context sufficiency before returning answer.
- LLM output must not include external sources or invented facts.

Observability/logging:
- Log session ID, lessonId, latency, status, and token usage.
- Do not log raw question/answer in production without privacy review.

Test plan:
- Unit test context-grounding check (sufficient vs. insufficient context).
- Integration test: question with valid context → grounded answer returned.
- E2E test: ask question from Lesson context → verify answer references correct lesson.

Definition of Done:
- AI Tutor only answers using Course/Lesson context.
- Source references are displayed alongside the answer.
- Out-of-context questions trigger the KHÔNG ĐỦ DỮ LIỆU message (US-LMS-28).
