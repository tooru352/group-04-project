# Story Spec

Story ID: US-LMS-25
Requirement IDs: REQ-LMS-25
Design link: S12 - AI Tutor (`10:17`)

Goal:
Learner asks a question to the AI Tutor to get help with course content.

Preconditions:
Learner is logged in and viewing a Course or Lesson.

Happy path:
1. Learner types or speaks a question into the AI Tutor interface.
2. System sends question + current lesson context to LLM service.
3. LLM returns a helpful explanation based on course data.
4. AI Tutor displays the text and source references.

Alternate/error paths:
- Content out of scope -> AI returns "I don't have enough data" (US-LMS-28).
- LLM timeout/failure -> Show friendly error, allow retry.
- Empty question -> Disable send button.

Data read/write:
- Read: Course/Lesson content (for context retrieval).
- Write: VoiceSession, VoiceTurn (logging the chat).

API contract:
- POST `/api/tutor/ask`
- Request: `{ lessonId, question }`
- Response: `{ answer, references, status }`

Authorization:
- Must be a Learner enrolled in the requested `lessonId`'s course.

Validation/business rules:
- Question must not be empty.
- LLM must not make up information (grounded in context).

Observability/logging:
- Log latency, token usage, and session IDs.
- Do not log sensitive PII in raw format.

Test plan:
- Unit test context builder for LLM prompt.
- E2E test with mocked LLM response for success and out-of-scope scenarios.

Definition of Done:
- AI Tutor returns context-aware answers.
- UI displays typing indicator and handles errors gracefully.
