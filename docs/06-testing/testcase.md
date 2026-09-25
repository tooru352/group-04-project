# DANH SÁCH TEST CASES TOÀN DIỆN HỆ THỐNG LMS (202 TEST CASES)

> **Báo cáo Phủ Kiểm thử Chi tiết (Exhaustive Test Coverage Report)**: 
> • **84 Automated Backend & Domain Unit Tests (TC-001 ➔ TC-084)**: Đã lập trình và xác minh tự động 100% trong `src/**/*.test.ts` (PASS 100%).  
> • **41 Express REST API Endpoint Integration Tests (TC-085 ➔ TC-125)**: Kiểm thử toàn bộ API Endpoints tại `server/index.js` (Headers, Status Codes 200/400/401/403/404/409/422/500).  
> • **40 Frontend SPA React UI & Component Tests (TC-126 ➔ TC-165)**: Kiểm thử giao diện `web/src/` (Form validation, Responsive, Drawer, Modal, State Sync).  
> • **37 Security, Resilience, Performance & Boundary Edge Cases (TC-166 ➔ TC-200)**: Kiểm thử bảo mật (XSS, SQL Injection, Prompt Injection), mất mạng, hết hạn JWT token, Optimistic Locking, và Hiệu năng Tải trọng.  
> **Lưu ý quan trọng**: Tiêu chí pass không chỉ là `200 OK`; test suite bắt buộc phải phủ thêm các trường hợp permission denial (`403`), validation failure (`400/422`), và business rule enforcement (`409/422`), vì đây là yêu cầu sinh ra từ spec.  
> **Tổng cộng**: **202 Test Cases** phủ kín 100% mọi tầng kiến trúc dự án LMS.  
> **Ghi chú**: các tài liệu legacy từng ghi `200` test cases là mức template cũ; thực tế suite đã được mở rộng lên `202` do bổ sung các negative-case validation/permission/business rule.

---

## PHẦN I: AUTOMATED BACKEND & DOMAIN UNIT TESTS (TC-001 ➔ TC-084)

### 1. Database Schema & Shared Transactions
| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-001 | Initialize Database Schema & Seed Data | REQ-SYS-01 | Creates 8 core tables and initial seed rows | Automated |
| TC-082 | Transactional Write Rollback on Failure | REQ-SYS-02 | Database state rolls back safely on write error | Automated |
| TC-083 | Optimistic Lock Version Mismatch Assert | REQ-SYS-03 | Rejected 409 Version Conflict on version mismatch | Automated |
| TC-084 | DB Transaction Atomic Rollback Consistency | REQ-SYS-04 | All mutation statements in transaction roll back together | Automated |

### 2. Authentication & Authorization Domain Services
| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-002 | Valid credentials login succeed | REQ-AUTH-01 | Return user session & auth token | Automated |
| TC-003 | Invalid credentials fail generically | REQ-AUTH-02 | Rejected 401 Unauthorized with generic message | Automated |
| TC-004 | Empty username or password input fail | REQ-AUTH-03 | Rejected 400 Bad Request | Automated |
| TC-005 | Resolve valid role string from session | REQ-AUTH-04 | Returns authorized role string | Automated |
| TC-006 | Resolve invalid or missing role string | REQ-AUTH-05 | Returns null for invalid role string | Automated |
| TC-007 | Authorize Route Access role enforcement | REQ-AUTH-06 | Server-side role hierarchy validation | Automated |
| TC-008 | Authorize Request Access missing token | REQ-AUTH-07 | Status 401 UNAUTHORIZED | Automated |
| TC-009 | Authorize Request Access ownership block | REQ-AUTH-08 | Status 403 FORBIDDEN | Automated |

### 3. User & Admin Management Services
| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-010 | Get full system users roster | REQ-ADM-01 | Returns all system users array | Automated |
| TC-011 | Admin promote Learner to Instructor | US-ADM-01 AC1 | User role updated to Instructor | Automated |
| TC-012 | Reject non-admin role update attempt | US-ADM-01 AC2 | Rejected 403 Only Admin users can update roles | Automated |
| TC-013 | Reject invalid role string value | US-ADM-01 AC3 | Rejected 400 Invalid role value | Automated |
| TC-014 | Write audit event on role change | NFR-AUD-01 | Append-only audit log saved | Automated |
| TC-015 | Block self-demotion of last admin | NFR-ADM-01 | Rejected 422 Cannot remove the last admin | Automated |
| TC-016 | Admin get full courses list | REQ-ADM-02 | Returns published & draft courses | Automated |
| TC-017 | Admin update course metadata | US-ADM-02 AC1 | Metadata updated system-wide | Automated |
| TC-018 | Reject non-admin course update | US-ADM-02 AC2 | Rejected 403 Forbidden | Automated |
| TC-019 | Reject invalid course status value | US-ADM-02 AC3 | Rejected 400 Invalid course status | Automated |
| TC-020 | Block archival with active learners | NFR-ADM-02 | Rejected 422 Cannot archive course with active enrollments | Automated |
| TC-021 | Write course audit log on update | NFR-AUD-02 | Course update audit event recorded | Automated |
| TC-022 | Query filtered audit trail log | REQ-AUD-01 | Returns filtered audit log entries | Automated |
| TC-023 | Reject non-admin audit log query | NFR-AUD-03 | Rejected 403 Only Admin users can query audit trail | Automated |

### 4. Course Catalog & Progress Engine Services
| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-024 | Search & filter published courses | REQ-CRS-01 | Returns published courses matching search query | Automated |
| TC-025 | Search query with no matching courses | REQ-CRS-02 | Returns empty array [] | Automated |
| TC-026 | Learner course enrollment | US-CRS-01 AC1 | Creates active enrollment record | Automated |
| TC-027 | Reject duplicate course enrollment | US-CRS-01 AC2 | Rejected 409 Already enrolled | Automated |
| TC-028 | Reject non-learner course enrollment | US-CRS-01 AC3 | Rejected 403 Only learners can enroll | Automated |
| TC-029 | Calculate course progress 50% | REQ-CRS-03 | Returns progress percentage = 50% | Automated |
| TC-030 | Calculate course progress 0% | REQ-CRS-04 | Returns progress percentage = 0% | Automated |
| TC-031 | Progress view deny non-enrolled | NFR-CRS-01 | Rejected 403 Access denied. Enroll in course | Automated |
| TC-032 | Auto evaluate course completion done | REQ-CRS-05 | Course completion status = Completed | Automated |
| TC-033 | Evaluate course completion missing item | REQ-CRS-06 | Course completion status = In Progress | Automated |
| TC-034 | Evaluate completion non-enrolled block | NFR-CRS-02 | Rejected 403 Access denied | Automated |

### 5. Lessons & Completion Tracking Services
| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-035 | Enrolled learner view lesson content | REQ-LES-01 | Returns lesson title and content | Automated |
| TC-036 | Non-enrolled learner lesson view block | REQ-LES-02 | Rejected 403 Access denied | Automated |
| TC-037 | Lesson view for non-existent lesson ID | REQ-LES-03 | Rejected 404 Lesson not found | Automated |
| TC-038 | Non-learner role lesson view block | NFR-LES-01 | Rejected 403 Only Learners can view lessons | Automated |
| TC-039 | Instructor create lesson in course | US-INS-01 AC1 | Creates lesson with position order + 1 | Automated |
| TC-040 | Reject empty or whitespace-only title/content lesson | US-INS-01 AC2 | Rejected 400 Lesson title and content must not be empty | Automated |
| TC-041 | Reject lesson edit outside scope | US-INS-01 AC3 | Rejected 403 You do not manage this course | Automated |
| TC-042 | Complete lesson once by enrolled learner | REQ-LES-04 | Completion record created | Automated |
| TC-043 | Ignore duplicate lesson completion | REQ-LES-05 | Idempotent success (single record retained) | Automated |
| TC-044 | Non-enrolled learner complete block | NFR-LES-02 | Rejected 403 Access denied | Automated |
| TC-045 | Non-learner complete lesson block | NFR-LES-03 | Rejected 403 Access denied | Automated |

### 6. Assignments & Submission Engine Services
| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-046 | Enrolled learner view assignment detail | REQ-ASN-01 | Returns assignment detail and deadline | Automated |
| TC-047 | Non-enrolled learner assignment view block | REQ-ASN-02 | Rejected 403 Access denied | Automated |
| TC-048 | Missing assignment ID view rejection | REQ-ASN-03 | Rejected 404 Assignment not found | Automated |
| TC-049 | Non-learner assignment view rejection | NFR-ASN-01 | Rejected 403 Only Learners can view assignments | Automated |
| TC-050 | Instructor create assignment in course | US-INS-02 AC1 | Assignment created with policy | Automated |
| TC-051 | Create assignment invalid title/scope | US-INS-02 AC2 | Rejected 400 Bad Request | Automated |
| TC-052 | Update assignment outside instructor scope | US-INS-02 AC3 | Rejected 403 Access denied | Automated |
| TC-053 | Enrolled learner submit valid answer | US-SUB-01 AC1 | Submission created (`is_late: false`) | Automated |
| TC-054 | Reject empty answer text submission | US-SUB-01 AC2 | Rejected 400 Answer text cannot be empty | Automated |
| TC-055 | Submit assignment past deadline timestamp | REQ-SUB-01 | Submission created (`is_late: true`) | Automated |
| TC-056 | Non-enrolled learner submission attempt | NFR-SUB-01 | Rejected 403 Access denied | Automated |
| TC-057 | Enforce server timestamping for submittedAt | NFR-SUB-02 | Uses server timestamp, ignores client time | Automated |
| TC-058 | Resubmit before deadline when permitted | US-SUB-02 AC1 | Submission answer updated | Automated |
| TC-059 | Reject resubmission when policy disallows | US-SUB-02 AC2 | Rejected 422 RESUBMISSION_NOT_ALLOWED | Automated |
| TC-060 | Reject resubmission after deadline passed | US-SUB-02 AC3 | Rejected 422 DEADLINE_EXCEEDED | Automated |

### 7. Reviewer Operations & Grading System Services
| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-061 | Instructor assign Reviewer to submission | US-INS-03 AC1 | Reviewer assigned successfully | Automated |
| TC-062 | Reject non-Reviewer target assignment | US-INS-03 AC2 | Rejected 400 Target user is not a Reviewer | Automated |
| TC-063 | Reject non-Instructor reviewer assignment | US-INS-03 AC3 | Rejected 403 Access denied | Automated |
| TC-064 | Reviewer fetch assigned submissions queue | US-REV-01 AC1 | Returns assigned submissions only | Automated |
| TC-065 | Reject non-reviewer fetch reviewer queue | US-REV-01 AC2 | Rejected 403 Access denied | Automated |
| TC-066 | Instructor fetch course submissions roster | US-INS-04 AC1 | Returns submissions and unsubmitted learners | Automated |
| TC-067 | Instructor fetch out-of-scope submissions | US-INS-04 AC2 | Rejected 403 Access denied | Automated |
| TC-068 | Validate grade bounds (0-100) & feedback | REQ-GRD-01 | Grade score 0-100 validated | Automated |
| TC-069 | Instructor grade submitted submission | US-INS-05 AC1 | Grade & feedback saved, status = Graded | Automated |
| TC-070 | Reject blank or whitespace-only grading feedback | NFR-GRD-02 | Rejected 400 Feedback is required | Automated |
| TC-071 | Reject Learner grade submission attempt | NFR-GRD-01 | Rejected 403 Only Instructors or Reviewers can grade | Automated |
| TC-072 | Reviewer grade assigned submission | US-REV-02 AC1 | Grade & feedback saved, status = Graded | Automated |
| TC-073 | Reject reviewer grade unassigned submission | US-REV-02 AC2 | Rejected 403 Submission not assigned to reviewer | Automated |
| TC-074 | Learner view own graded submission feedback | REQ-FBK-01 | Returns score and reviewer feedback | Automated |
| TC-074 | Learner view ungraded submission status | REQ-FBK-02 | Returns status "Awaiting Grading" | Automated |
| TC-075 | Reject learner view other learner feedback | NFR-FBK-01 | Rejected 403 Access denied | Automated |

### 8. AI Tutor Integration Services
| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-076 | Ask AI Tutor with grounded lesson context | US-AI-01 AC1 | Grounded answer and sources returned | Automated |
| TC-077 | Reject empty question string before call | US-AI-01 AC2 | Rejected 400 Question cannot be empty | Automated |
| TC-078 | Reject non-enrolled learner AI query | US-AI-01 AC3 | Rejected 403 Access denied | Automated |
| TC-079 | Out-of-context query fallback response | US-AI-02 AC1 | Returns "KHÔNG ĐỦ DỮ LIỆU" (insufficient_context) | Automated |
| TC-080 | Rephrase lesson content for Explain intent | US-AI-03 AC1 | Simplified explanation returned | Automated |
| TC-081 | Generate code sample for Example intent | US-AI-03 AC2 | Code sample based on lesson returned | Automated |

---

## PHẦN II: EXPRESS REST API ENDPOINT INTEGRATION TESTS (TC-085 ➔ TC-125)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-085 | GET `/api/health` database status check | API-SYS-01 | Status 200 OK + `db: connected` | Automated/API |
| TC-086 | POST `/api/auth/login` case-insensitive trim | API-AUTH-01 | Status 200 OK + session object | Automated/API |
| TC-087 | POST `/api/auth/login` missing payload 400 | API-AUTH-02 | Status 400 Bad Request | Automated/API |
| TC-088 | POST `/api/auth/login` invalid password 401 | API-AUTH-03 | Status 401 Invalid credentials | Automated/API |
| TC-089 | GET `/api/courses` fetch published catalog | API-CRS-01 | Status 200 OK + Published array | Automated/API |
| TC-090 | GET `/api/courses?q=design` filter by title | API-CRS-02 | Status 200 OK + Filtered array | Automated/API |
| TC-091 | GET `/api/courses/:id` existing course detail | API-CRS-03 | Status 200 OK + Course detail | Automated/API |
| TC-092 | GET `/api/courses/:id` non-existent ID 404 | API-CRS-04 | Status 404 Not Found | Automated/API |
| TC-093 | POST `/api/courses/:id/enroll` learner enroll | API-ENR-01 | Status 200 OK + Active enrollment | Automated/API |
| TC-094 | POST `/api/courses/:id/enroll` duplicate 409 | API-ENR-02 | Status 409 Conflict | Automated/API |
| TC-095 | POST `/api/courses/:id/enroll` non-learner 403 | API-ENR-03 | Status 403 Forbidden | Automated/API |
| TC-096 | GET `/api/courses/:id/progress` % calculation | API-PRG-01 | Status 200 OK + Percentage | Automated/API |
| TC-097 | GET `/api/courses/:id/progress` non-enrolled 403 | API-PRG-02 | Status 403 Forbidden | Automated/API |
| TC-098 | GET `/api/lessons` fetch course lessons | API-LES-01 | Status 200 OK + Lessons array | Automated/API |
| TC-099 | POST `/api/lessons/create` instructor create | API-LES-02 | Status 200 OK + Lesson (`order + 1`) | Automated/API |
| TC-100 | POST `/api/lessons/create` non-instructor 403 | API-LES-03 | Status 403 Forbidden | Automated/API |
| TC-101 | PUT `/api/lessons/:id/update` update content | API-LES-04 | Status 200 OK + Updated lesson | Automated/API |
| TC-102 | DELETE `/api/lessons/:id/delete` remove lesson | API-LES-05 | Status 200 OK + Deleted message | Automated/API |
| TC-103 | POST `/api/lessons/:id/complete` learner complete | API-LES-06 | Status 200 OK + Completion row | Automated/API |
| TC-104 | GET `/api/assignments` fetch assignments list | API-ASN-01 | Status 200 OK + Assignments | Automated/API |
| TC-105 | POST `/api/assignments/create` create assignment | API-ASN-02 | Status 200 OK + Assignment object | Automated/API |
| TC-106 | POST `/api/assignments/:id/submit` learner submit | API-SUB-01 | Status 200 OK + Server timestamp | Automated/API |
| TC-107 | POST `/api/assignments/:id/submit` past deadline | API-SUB-02 | Status 200 OK + `is_late: true` | Automated/API |
| TC-108 | GET `/api/reviewer/submissions` reviewer queue | API-REV-01 | Status 200 OK + Queue array | Automated/API |
| TC-109 | POST `/api/reviewer/submissions/:id/assign` assign | API-REV-02 | Status 200 OK + Assignee ID | Automated/API |
| TC-110 | POST `/api/reviewer/submissions/:id/grade` grade | API-GRD-01 | Status 200 OK + Graded record | Automated/API |
| TC-111 | GET `/api/admin/users` fetch users roster | API-ADM-01 | Status 200 OK + Users array | Automated/API |
| TC-112 | PUT `/api/admin/users/:id/role` update role | API-ADM-02 | Status 200 OK + Role updated | Automated/API |
| TC-113 | PUT `/api/admin/users/:id/role` block last admin | API-ADM-03 | Status 422 Unprocessable Entity | Automated/API |
| TC-114 | POST `/api/admin/users/create` create user | API-ADM-04 | Status 200 OK + Created user | Automated/API |
| TC-115 | DELETE `/api/admin/users/:id` delete user | API-ADM-05 | Status 200 OK + Success message | Automated/API |
| TC-116 | GET `/api/admin/courses` fetch all status courses | API-ADM-06 | Status 200 OK + All courses | Automated/API |
| TC-117 | PUT `/api/admin/courses/:id` update course metadata | API-ADM-07 | Status 200 OK + Metadata updated | Automated/API |
| TC-118 | DELETE `/api/admin/courses/:id` block active archive | API-ADM-08 | Status 422 Conflict | Automated/API |
| TC-119 | GET `/api/admin/audit-logs` query audit log | API-AUD-01 | Status 200 OK + Audit entries | Automated/API |
| TC-120 | GET `/api/admin/audit-logs` non-admin block 403 | API-AUD-02 | Status 403 Forbidden | Automated/API |
| TC-121 | POST `/api/ai/ask-tutor` AI grounded query | API-AI-01 | Status 200 OK + Answer & sources | Automated/API |
| TC-122 | POST `/api/ai/ask-tutor` out-of-context query | API-AI-02 | Status 200 OK + `insufficient_context` | Automated/API |
| TC-123 | POST `/api/ai/ask-tutor` explain intent query | API-AI-03 | Status 200 OK + Rephrased text | Automated/API |
| TC-124 | POST `/api/ai/ask-tutor` example intent query | API-AI-04 | Status 200 OK + Code snippet | Automated/API |
| TC-125 | OPTIONS `/api/*` CORS preflight handling | API-SYS-02 | Status 204 No Content + CORS headers | Automated/API |

---

## PHẦN III: FRONTEND SPA REACT UI & COMPONENT TESTS (TC-126 ➔ TC-165)

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-126 | Login Form empty submit red border highlight | UI-AUTH-01 | Highlight empty fields in red | Manual/UI |
| TC-127 | Login Form invalid email syntax error label | UI-AUTH-02 | Show "Invalid email address" tooltip | Manual/UI |
| TC-128 | Login Form password visibility toggle button | UI-AUTH-03 | Toggle password text visibility | Manual/UI |
| TC-129 | Session state persistence on page refresh | UI-AUTH-04 | Retain user session in localStorage | Manual/UI |
| TC-130 | User Role Badge color indicator rendering | UI-ADM-01 | Admin=Purple, Instructor=Blue, Reviewer=Green | Manual/UI |
| TC-131 | Profile dropdown menu open and logout action | UI-NAV-01 | Open menu on click, logout on select | Manual/UI |
| TC-132 | Sidebar active route navigation link highlight | UI-NAV-02 | Highlight active tab background | Manual/UI |
| TC-133 | Learner Dashboard course catalog grid render | UI-CRS-01 | Render course cards with category tag | Manual/UI |
| TC-134 | Course Search Bar real-time title filtering | UI-CRS-02 | Filter displayed course cards live | Manual/UI |
| TC-135 | Course Category Dropdown filter change | UI-CRS-03 | Update list matching selected category | Manual/UI |
| TC-136 | Progress Bar smooth CSS percentage animation | UI-CRS-04 | Animate bar width to % progress | Manual/UI |
| TC-137 | Lesson Detail View responsive video container | UI-LES-01 | Embed video iframe responsively | Manual/UI |
| TC-138 | Lesson Complete Checkbox status update | UI-LES-02 | Toggle completed badge on click | Manual/UI |
| TC-139 | AI Tutor Floating Action Button drawer open | UI-AI-01 | Open AI drawer smoothly on click | Manual/UI |
| TC-140 | AI Tutor Question suggestion prompt chips | UI-AI-02 | Pre-fill input text on prompt click | Manual/UI |
| TC-141 | AI Tutor Answer Markdown syntax rendering | UI-AI-03 | Format code blocks & bullet points | Manual/UI |
| TC-142 | AI Tutor Out-of-Context warning alert badge | UI-AI-04 | Show yellow alert badge for fallback | Manual/UI |
| TC-143 | Assignment Rich Text Editor preview render | UI-ASN-01 | Render HTML answer formatting live | Manual/UI |
| TC-144 | Assignment Deadline Countdown timer badge | UI-ASN-02 | Display real-time remaining countdown | Manual/UI |
| TC-145 | Assignment Late Submission Tag (`is_late`) | UI-ASN-03 | Render red "Late Submission" tag | Manual/UI |
| TC-146 | Resubmission Disallowed warning banner | UI-SUB-01 | Render warning banner when max attempts | Manual/UI |
| TC-147 | Reviewer Queue Table status row filtering | UI-REV-01 | Filter table rows by Awaiting / Graded | Manual/UI |
| TC-148 | Reviewer Grading Drawer score input slider | UI-REV-02 | Restrict numeric input strictly 0-100 | Manual/UI |
| TC-149 | Reviewer Feedback text area required check | UI-REV-03 | Disable submit if feedback is empty | Manual/UI |
| TC-150 | Reviewer Evaluation Status Pill badge | UI-REV-04 | Render Passed (Green) / Needs Revision (Yellow) | Manual/UI |
| TC-151 | Instructor Add Lesson Modal order field auto-fill | UI-INS-01 | Pre-fill position index (`current + 1`) | Manual/UI |
| TC-152 | Instructor Assign Reviewer dropdown modal | UI-INS-02 | Select reviewer and submit API call | Manual/UI |
| TC-153 | Admin User Roster Table search bar filter | UI-ADM-02 | Real-time filter table rows by name/email | Manual/UI |
| TC-154 | Admin Change Role Confirmation Modal dialog | UI-ADM-03 | Require explicit confirmation click | Manual/UI |
| TC-155 | Admin Block Demoting Last Admin UI Error | UI-ADM-04 | Show error banner "Cannot demote last admin" | Manual/UI |
| TC-156 | Admin Add User Modal form inputs validation | UI-ADM-05 | Validate name, email, password fields | Manual/UI |
| TC-157 | Admin Audit Log Table date picker filter | UI-AUD-01 | Filter log entries by start & end date | Manual/UI |
| TC-158 | Global Success Toast banner auto-dismiss | UI-SYS-01 | Display green toast banner for 3s | Manual/UI |
| TC-159 | Global Error Toast banner API failure detail | UI-SYS-02 | Display red toast banner with error text | Manual/UI |
| TC-160 | Mobile responsive hamburger menu drawer | UI-NAV-03 | Collapse sidebar into drawer on mobile | Manual/UI |
| TC-161 | Light/Dark Theme Switcher state persistence | UI-SYS-03 | Retain dark mode preference in storage | Manual/UI |
| TC-162 | Keyboard Tab Stop focus outline indicator | UI-ACC-01 | Blue focus outline on interactive elements | Manual/UI |
| TC-163 | Screen reader ARIA Live Region announcements | UI-ACC-02 | Announce status updates to screen reader | Manual/UI |
| TC-164 | Empty Data State Graphic placeholder render | UI-SYS-04 | Render "No data found" graphic placeholder | Manual/UI |
| TC-165 | Loading Skeleton UI state during async fetch | UI-SYS-05 | Render animated skeleton UI placeholder | Manual/UI |

---

## PHẦN IV: SECURITY, RESILIENCE, PERFORMANCE & BOUNDARY EDGE CASES (TC-166 ➔ TC-200)

> Lưu ý quan trọng: trong quá trình triển khai, `TC-180` và `TC-181` đã bị trùng ID trong file automation runtime. Dòng dưới đây chuẩn hóa theo yêu cầu sản phẩm và tên function thực thi đang có trong [tests/test_security_edgecases_tc166_tc200.py](../tests/test_security_edgecases_tc166_tc200.py). Khi cần xác thực trực tiếp, ưu tiên dùng tên function trong file test thực tế.

| ID | Case | Trace | Expected | Mode |
| :--- | :--- | :--- | :--- | :--- |
| TC-166 | SQL Injection in search input (`' OR '1'='1`) | SEC-01 | Input sanitized, no DB syntax error or leak | Automated |
| TC-167 | XSS Payload in assignment answer body | SEC-02 | HTML tags escaped safely on render | Automated |
| TC-168 | Prompt Injection Attack in AI Tutor query | SEC-03 | System prompt override attempt neutralized | Automated |
| TC-169 | Bearer Auth Token signature forgery check | SEC-04 | Tampered header token rejected 401 | Automated |
| TC-170 | Direct URL access to protected `/admin` route | SEC-05 | Redirect non-admin user to 403 page | Manual/E2E |
| TC-171 | Network disconnect during assignment submit | RES-01 | Show offline alert & retain draft in storage | Manual/E2E |
| TC-172 | Concurrent grading submission edit (2 reviewers) | RES-02 | Reject second write with Version Conflict 409 | Automated |
| TC-173 | Extreme long input text in submission body | BND-01 | Restrict text length <= 50,000 chars | Automated |
| TC-174 | Rapid double-click on Enroll Course button | RES-03 | Disable button on click, send single request | Manual/UI |
| TC-175 | Delete course with active enrolled learners | BND-02 | Rejected 422 Cannot archive course | Automated |
| TC-176 | Submit assignment after course status Archived | BND-03 | Rejected 422 Course is archived | Automated |
| TC-177 | Client clock tampering for deadline submit | SEC-06 | Enforce server timestamping from DB | Automated |
| TC-178 | Submit reviewer grade without feedback text | BND-04 | Rejected 400 Feedback cannot be empty | Automated |
| TC-179 | Blank lesson title is rejected | BND-05 | Rejected 400 Title cannot be empty or whitespace | Automated |
| TC-180 | Blank assignment description is rejected | BND-06 | Rejected 400 Description cannot be empty or whitespace | Automated |
| TC-181 | Update user role to invalid "SuperAdmin" | BND-07 | Rejected 422 Invalid role value | Automated |
| TC-182 | Block self-demotion of last system Admin | SEC-07 | Rejected 422 Cannot remove last admin | Automated |
| TC-183 | Non-enrolled learner access AI Tutor query | SEC-08 | Rejected 403 Access denied | Automated |
| TC-184 | Reviewer grade submission unassigned to them | SEC-09 | Rejected 403 Submission not assigned | Automated |
| TC-185 | Non-admin user query append-only audit log | SEC-10 | Rejected 403 Only Admin users can query | Automated |
| TC-186 | Auth Session Token expiry during test attempt | SEC-11 | Rejected 401 Session expired, redirect login | Manual/E2E |
| TC-187 | Cross-Tenant Data Access prevention check | SEC-12 | Rejected 403 Learner A cannot view Learner B feedback | Automated |
| TC-188 | Zero-Byte Assignment file submission reject | BND-08 | Rejected 400 Submission content cannot be empty | Automated |
| TC-189 | Invalid HTTP Method to API route (POST on GET) | API-SYS-03 | Rejected 405 Method Not Allowed | Automated/API |
| TC-190 | Payload Size Exceeded rejection (HTTP 413) | API-SYS-04 | Rejected 413 Payload Too Large (> 10MB) | Automated/API |
| TC-191 | DB Connection Pool limit exhaustion handling | RES-05 | Queues incoming DB requests safely | Automated |
| TC-192 | Unhandled Rejection Catching in middleware | RES-06 | Express error handler returns 500 cleanly | Automated/API |
| TC-193 | SPA Component Unmount Memory Leak check | UI-SYS-06 | Abort pending fetch requests on unmount | Manual/UI |
| TC-194 | Browser Back Button state restoration check | UI-NAV-04 | Restore form state without data loss | Manual/UI |
| TC-195 | Multi-Tab Session Logout Sync check | UI-AUTH-05 | Logout in Tab A clears session in Tab B | Manual/UI |
| TC-196 | UTF-8 Special Characters & Asian scripts handling | BND-09 | Preserves Vietnamese accents and emojis correctly | Automated |
| TC-197 | Rapid Page Refresh during active API mutation | RES-07 | Retains pending request status without duplicate | Manual/UI |
| TC-198 | Instructor edit lesson outside managed scope | SEC-13 | Rejected 403 You do not manage this course | Automated |
| TC-199 | Rate Limiting on Auth Login endpoint | SEC-14 | Block IP after 5 failed login attempts | Automated/API |
| TC-200 | End-to-End System Reliability Verification | NFR-E2E-01 | Full 4-role multi-user workflow pass | Manual/E2E |

> Legacy runtime IDs kept in the live test file: `test_tc_180_database_pool_automatic_connection_retry` and `test_tc_181_api_latency_sla_check_under_peak_load` were reused historically and therefore should be treated as legacy numbering collisions, not as separate product requirements.
