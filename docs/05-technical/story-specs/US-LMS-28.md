# Story Spec

Story ID: US-LMS-28
Requirement IDs: REQ-LMS-25, NFR-LMS-05
Design link: S12 - AI Tutor (Figma frame `10:17`)

Goal:
When the AI Tutor lacks sufficient context to answer, it must explicitly state "KHÔNG ĐỦ DỮ LIỆU" and not fabricate an answer.

Preconditions:
Learner has submitted a question (US-LMS-25 satisfied).
The question falls outside the available Course/Lesson context.

Happy path:
1. Learner asks a question unrelated to the current Course/Lesson context.
2. System evaluates context sufficiency check.
3. Context is insufficient → system routes to insufficient-context response.
4. AI Tutor returns exactly: "KHÔNG ĐỦ DỮ LIỆU" (no guessing, no external data).
5. UI (S12) displays the insufficient-context state clearly.

Alternate/error paths:
- LLM attempts to answer despite insufficient context → application layer intercepts and overrides with KHÔNG ĐỦ DỮ LIỆU.
- Borderline context → if in doubt, treat as insufficient; never guess.

Data read/write:
- Read: Lesson content (context evaluation), VoiceTurn
- Write: VoiceTurn (status = "insufficient_context")

API contract:
- POST `/api/tutor/ask`
- Response (insufficient context): `{ answer: "KHÔNG ĐỦ DỮ LIỆU", status: "insufficient_context", references: [] }`

Authorization:
- Learner must be authenticated and enrolled.

Validation/business rules:
- Application must perform context sufficiency check before returning LLM response (BR-LMS-15).
- LLM output is never shown raw; application validates grounding first.
- No external sources, hallucinations, or guesses are permitted.

Observability/logging:
- Log insufficient-context event (sessionId, lessonId, questionHash, timestamp).
- Do not log question text in plain form.

Test plan:
- Unit test context sufficiency evaluator (returns insufficient for out-of-scope questions).
- Integration test: out-of-scope question → response contains KHÔNG ĐỦ DỮ LIỆU.
- E2E test: ask out-of-scope question → verify UI shows insufficient-context state.

Definition of Done:
- Every out-of-scope question returns KHÔNG ĐỦ DỮ LIỆU with no invented information.
- The insufficient-context state is clearly displayed to the Learner.
