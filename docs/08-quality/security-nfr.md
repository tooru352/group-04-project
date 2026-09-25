# Security and NFR Evidence Report

> **Project**: Micro-learning / LMS Course Platform System (Group 04)  
> **Document**: Security + NFR Evidence  
> **Scope**: RBAC enforcement, validation hardening, secret handling, dependency review, basic performance, accessibility, and audit/logging traceability.

---

## 1. Scope

This report verifies that the current release satisfies the basic non-functional and security expectations for the live project state.

Included checks:

- Role-based access control (RBAC)
- Required-field validation and whitespace rejection
- Secret and sensitive-data handling
- Dependency review sanity check
- Basic performance / responsiveness checks
- Accessibility basics
- Logging and investigation traceability

---

## 2. Security Evidence

### 2.1 RBAC enforcement

Evidence from the backend implementation in [server/index.js](../../server/index.js):

- `requireAdmin()` blocks unauthorized admin access
- `requireRole(...allowedRoles)` enforces role gating for protected routes
- Unauthorized access returns HTTP 403 with a controlled message

Validated by tests such as:

- `test_tc_166_sql_injection_in_search_parameters`
- `test_tc_170_direct_url_access_to_protected_admin_route`
- `test_tc_185_non_admin_user_query_append_only_audit_log`
- `test_tc_182_block_self_demotion_of_last_system_admin`

Result:

- RBAC rules are enforced in the server layer
- Protected endpoints reject non-authorized roles

### 2.2 Validation and empty-input handling

Evidence from the same backend implementation:

- `hasMeaningfulText(value)` rejects null/undefined/whitespace-only input
- validation checks reject blank strings before mutation logic proceeds

Validated by tests:

- `test_tc_178_submit_reviewer_grade_without_feedback_text`
- `test_tc_179_blank_lesson_title_is_rejected`
- `test_tc_180_blank_assignment_description_is_rejected`

Result:

- Blank or whitespace-only values are rejected
- Input is not accepted as valid simply because it is non-empty after a type check

### 2.3 Secret handling

Evidence from the repository configuration and runtime behavior:

- secrets are expected to be stored in environment variables, not hardcoded into source files
- runtime starts successfully using `.env` injection
- no API keys or credentials were observed in the codebase in the tested implementation scope

Pass condition:

- No secret value is exposed in source or error output
- No stack trace or credential content is returned to the client

### 2.4 Dependency sanity check

The project relies on standard runtime dependencies for the current implementation and has been verified through successful install/build/runtime checks.

Evidence:

- backend API started successfully with `npm run api`
- frontend build succeeded with `npm --prefix web run build`

Result:

- core dependencies are operational
- no dependency breakage was observed in the current validated scope

---

## 3. NFR Evidence

### 3.1 Basic performance

Evidence from automated test execution:

```bash
python -m pytest tests -q
```

Observed result:

```bash
202 passed in 9.39s
```

This indicates the current test suite completes quickly enough for the validated project scope and does not show obvious performance regressions in the automated checks.

### 3.2 Accessibility basics

The frontend code and test plan include checks for:

- keyboard navigation / tab focus support
- ARIA live-region expectations
- accessibility-related UI states and label coverage

Related tests include:

- `test_tc_162_keyboard_tab_stop_focus_outline_indicator`
- `test_tc_163_screen_reader_aria_live_region_announcements`

Result:

- baseline accessibility checks are in place
- no critical blocker was observed in the current scope

### 3.3 Logging and investigation traceability

The system is designed to support investigation through:

- server-side request validation and denial responses
- consistent structured errors for protected-route denials
- test outputs and runtime logs for verification

Pass condition:

- logs and responses are informative enough for troubleshooting
- no secret values are exposed in logs or error payloads
- stack traces are not leaked to normal client output

---

## 4. Pass Criteria

The release passes the Security + NFR review if all of the following are true:

- RBAC enforcement is active and rejects unauthorized roles
- Required fields reject blank/whitespace-only values
- No secrets or credentials are exposed in the source, logs, or error outputs
- Dependency/runtime checks succeed for the current scope
- Basic performance and accessibility checks remain green
- Logging supports investigation without leaking sensitive data

---

## 5. Final Assessment

### Result: PASS

Evidence summary:

- 202/202 automated tests passed
- backend runtime started successfully
- frontend production build succeeded
- no release blockers found
- no secret leakage or stack trace exposure observed in the validated scope

### Release blocker status

- **Release blockers**: 0
- **Open critical issues**: 0

### Sign-off

The project is acceptable for the current release scope under the validated security and NFR baseline.
