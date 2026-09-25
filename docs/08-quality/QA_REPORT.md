# QA Report

> **Project**: Micro-learning / LMS Course Platform System (Group 04)  
> **Report Date**: 2026-09-25  
> **Scope**: End-to-end validation of backend APIs, database initialization, role-based access control, UI role shells, and AI Tutor behavior.

---

## 1. Scope

This QA review covered the following workstreams:

- Backend API and database initialization
- Authentication and authorization checks
- Learner, Instructor, Reviewer, and Admin flows
- Course, lesson, assignment, and submission logic
- AI Tutor grounded-answer validation
- Validation and business-rule enforcement
- Frontend build stability and runtime startup check

The validated scope matches the repository implementation in the current codebase and aligns with the requirement-driven test suite.

---

## 2. Environment

- Operating System: Windows
- Workspace: D:\MIS3032\group-04-project
- Backend runtime: Node.js Express server
- API endpoint: http://localhost:4000
- Frontend runtime: Vite React app
- Database: Supabase / PostgreSQL-backed schema initialized through the app
- Test runner: Python pytest

---

## 3. Evidence and Verification Results

### Automated test evidence

Command executed:

```bash
python -m pytest tests -q
```

Observed output:

```bash
........................................................................ [ 35%]
........................................................................ [ 71%]
..........................................................               [100%]
202 passed in 9.39s
```

### Runtime evidence

Command executed:

```bash
npm run api
```

Observed output:

```bash
> group-04-project@1.0.0 api
> node server/index.js

◇ injected env (3) from .env
◇ injected env (0) from .env
API server running on http://localhost:4000
```

### Frontend build evidence

Command executed:

```bash
npm --prefix web run build
```

Observed output:

```bash
vite v8.3.0 building client environment for production...
✓ 22 modules transformed.
✓ built in 1.00s
```

---

## 4. Result Summary

| Area | Result | Evidence |
| --- | --- | --- |
| Automated tests | PASS | 202/202 passed |
| API runtime | PASS | Server started successfully on localhost:4000 |
| Frontend build | PASS | Vite production build completed successfully |
| Security / validation checks | PASS | Required permission, rule, and validation tests are included and passing |
| Release blockers | 0 | No open blocker found during verification |

### Release Blockers

- **Release blockers found**: 0
- **Open critical defects**: 0

---

## 5. Known Issues / Remaining Risks

At the time of this report, there are no open release-blocking defects.

Minor risks / follow-up items:

- Continue monitoring runtime behavior under heavier real-user load beyond the current automated suite.
- Keep validation and RBAC checks aligned with future feature additions.
- Maintain the current test discipline to ensure new rules remain enforced by automation.

---

## 6. Risk Assessment

### Overall Risk

- **Business risk**: Low
- **Technical risk**: Low
- **Security risk**: Low, based on passing permission and validation coverage
- **Operational risk**: Low for the current feature set and verified workflow

---

## 7. Sign-off

QA review is complete for the current release scope.

- **Status**: PASS
- **Release blockers**: 0
- **Evidence-based result**: 202/202 automated tests passed, API runtime verified, frontend build verified
- **Final sign-off**: Approved for release within the validated scope
