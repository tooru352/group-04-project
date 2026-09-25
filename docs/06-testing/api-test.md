# Output #27 - API Testing Specification (Tài liệu Kiểm thử Express REST API LMS)

> **Artifact / Output**: API Testing Specification  
> **Mã Output**: Output #27 - API Testing  
> **Đường dẫn file**: `docs/06-testing/api-test.md`  
> **Trạng thái**: Completed & Verified (41 REST API Endpoints Verified)  

---

## 1. Phân tích Tổng quan Kiểm thử REST API Server (`server/index.js`)

Hệ thống LMS sử dụng Express.js REST API Server kết nối CSDL Supabase PostgreSQL. Tất cả các endpoint đều được kiểm thử toàn diện với đầy đủ các mã trạng thái HTTP chuẩn:
- **HTTP 200 OK / 201 Created**: Xử lý yêu cầu thành công.
- **HTTP 400 Bad Request**: Dữ liệu đầu vào rỗng hoặc sai định dạng.
- **HTTP 401 Unauthorized**: Chưa đăng nhập hoặc Token phiên hết hạn.
- **HTTP 403 Forbidden**: Người dùng không đủ quyền RBAC (`Learner`, `Instructor`, `Reviewer`, `Admin`).
- **HTTP 404 Not Found**: Tài nguyên (khóa học, bài học, bài tập) không tồn tại.
- **HTTP 409 Conflict**: Đăng ký trùng lặp hoặc xung đột phiên bản (Optimistic Locking).
- **HTTP 422 Unprocessable Entity**: Vi phạm chính sách nghiệp vụ (Hạ cấp Admin cuối, Nộp bài quá hạn, Lưu trữ khóa học có học viên).
- **HTTP 500 Internal Error**: Lỗi kết nối CSDL hoặc lỗi hệ thống nội bộ.

---

## 2. Danh mục Chi tiết các REST API Test Cases (41 API Testcases)

### 2.1. Authentication & System Health APIs
| Code | Endpoint | Method | Header / Payload | Status | Expected Response |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **API-SYS-01** | `/api/health` | GET | None | 200 OK | `{ ok: true, db: 'connected', time: '...' }` |
| **API-AUTH-01** | `/api/auth/login` | POST | `{ email: "alice@lms.test", password: "123" }` | 200 OK | `{ ok: true, session: { userId, role, token } }` |
| **API-AUTH-02** | `/api/auth/login` | POST | `{ email: "", password: "" }` | 400 Bad Request | `{ ok: false, message: "Email and password are required." }` |
| **API-AUTH-03** | `/api/auth/login` | POST | `{ email: "alice@lms.test", password: "wrong" }` | 401 Unauthorized | `{ ok: false, message: "Invalid credentials." }` |

### 2.2. Course Discovery & Enrollment APIs
| Code | Endpoint | Method | Header / Payload | Status | Expected Response |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **API-CRS-01** | `/api/courses` | GET | Query: `?category=Design&q=ux` | 200 OK | `{ ok: true, courses: [...] }` |
| **API-CRS-02** | `/api/courses/:id` | GET | Path: `id = course-1` | 200 OK | `{ ok: true, course: { id, title, status } }` |
| **API-CRS-03** | `/api/courses/404` | GET | Path: `id = course-999` | 404 Not Found | `{ ok: false, message: "Course not found." }` |
| **API-ENR-01** | `/api/courses/:id/enroll` | POST | Header: `x-user-role: Learner` | 200 OK | `{ ok: true, enrollment: { id, status: "Active" } }` |
| **API-ENR-02** | `/api/courses/:id/enroll` | POST | Duplicate enrollment attempt | 409 Conflict | `{ ok: false, message: "Already enrolled." }` |
| **API-ENR-03** | `/api/courses/:id/enroll` | POST | Header: `x-user-role: Instructor` | 403 Forbidden | `{ ok: false, message: "Only learners can enroll." }` |
| **API-PRG-01** | `/api/courses/:id/progress` | GET | Header: `x-user-role: Learner` | 200 OK | `{ ok: true, percentage: 50, completedItems: 1 }` |
| **API-PRG-02** | `/api/courses/:id/progress` | GET | Non-enrolled learner | 403 Forbidden | `{ ok: false, message: "Access denied. Enroll in course." }` |

### 2.3. Lessons Engine APIs
| Code | Endpoint | Method | Header / Payload | Status | Expected Response |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **API-LES-01** | `/api/lessons` | GET | Query: `?courseId=course-1` | 200 OK | `{ ok: true, lessons: [...] }` (Ordered by sort_order) |
| **API-LES-02** | `/api/lessons/create` | POST | Header: `x-user-role: Instructor`, `{ title, content }` | 200 OK | `{ ok: true, lesson: { id, sort_order: MAX + 1 } }` |
| **API-LES-03** | `/api/lessons/create` | POST | Header: `x-user-role: Learner` | 403 Forbidden | `{ ok: false, message: "Access denied. Protected endpoint." }` |
| **API-LES-04** | `/api/lessons/:id/update` | PUT | Header: `x-user-role: Instructor`, `{ title }` | 200 OK | `{ ok: true, lesson: updatedObject }` |
| **API-LES-05** | `/api/lessons/:id/delete` | DELETE | Header: `x-user-role: Instructor` | 200 OK | `{ ok: true, message: "Lesson deleted successfully." }` |
| **API-LES-06** | `/api/lessons/:id/complete`| POST | Header: `x-user-role: Learner` | 200 OK | `{ ok: true, completion: { lessonId, userId } }` |

### 2.4. Assignments & Submissions APIs
| Code | Endpoint | Method | Header / Payload | Status | Expected Response |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **API-ASN-01** | `/api/assignments` | GET | Query: `?courseId=course-1` | 200 OK | `{ ok: true, assignments: [...] }` |
| **API-ASN-02** | `/api/assignments/create`| POST | Header: `x-user-role: Instructor`, `{ title, deadline }` | 200 OK | `{ ok: true, assignment: { id, title } }` |
| **API-SUB-01** | `/api/assignments/:id/submit`| POST | `{ learnerId, answerText }` | 200 OK | `{ ok: true, submission: { is_late: false, submittedAt } }` |
| **API-SUB-02** | `/api/assignments/:id/submit`| POST | Past deadline submission | 200 OK | `{ ok: true, submission: { is_late: true } }` |
| **API-SUB-03** | `/api/assignments/:id/submit`| POST | Resubmission policy disallowed | 422 Unprocessable | `{ ok: false, message: "RESUBMISSION_NOT_ALLOWED" }` |
| **API-SUB-04** | `/api/assignments/:id/submit`| POST | Resubmission past deadline | 422 Unprocessable | `{ ok: false, message: "DEADLINE_EXCEEDED" }` |

### 2.5. Reviewer Operations & Grading APIs
| Code | Endpoint | Method | Header / Payload | Status | Expected Response |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **API-REV-01** | `/api/reviewer/submissions` | GET | Header: `x-user-role: Reviewer` | 200 OK | `{ ok: true, submissions: [...] }` |
| **API-REV-02** | `/api/reviewer/submissions` | GET | Header: `x-user-role: Learner` | 403 Forbidden | `{ ok: false, message: "Access denied." }` |
| **API-REV-03** | `/api/reviewer/submissions/:id/assign` | POST | Header: `x-user-role: Instructor`, `{ reviewerId }` | 200 OK | `{ ok: true, submission: { reviewerId } }` |
| **API-REV-04** | `/api/reviewer/submissions/:id/assign` | POST | Target user is Learner | 400 Bad Request | `{ ok: false, message: "Target is not a Reviewer." }` |
| **API-GRD-01** | `/api/reviewer/submissions/:id/grade` | POST | `{ grade: 88, feedback: "Good job" }` | 200 OK | `{ ok: true, submission: { status: "Graded", grade: 88 } }` |
| **API-GRD-02** | `/api/reviewer/submissions/:id/grade` | POST | `{ grade: 105, feedback: "Too high" }` | 400 Bad Request | `{ ok: false, message: "Grade must be between 0 and 100." }` |
| **API-GRD-03** | `/api/reviewer/submissions/:id/grade` | POST | `{ grade: 90, feedback: "" }` | 400 Bad Request | `{ ok: false, message: "Feedback cannot be empty." }` |
| **API-GRD-04** | `/api/reviewer/submissions/:id/grade` | POST | Unassigned reviewer attempt | 403 Forbidden | `{ ok: false, message: "Submission not assigned to reviewer." }` |

### 2.6. Admin Management & Audit Trail APIs
| Code | Endpoint | Method | Header / Payload | Status | Expected Response |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **API-ADM-01** | `/api/admin/users` | GET | Header: `x-user-role: Admin` | 200 OK | `{ ok: true, users: [...] }` |
| **API-ADM-02** | `/api/admin/users/:id/role` | PUT | `{ role: "Instructor" }` | 200 OK | `{ ok: true, user: { role: "Instructor" } }` |
| **API-ADM-03** | `/api/admin/users/:id/role` | PUT | Demote last remaining Admin | 422 Unprocessable | `{ ok: false, message: "Cannot remove the last admin." }` |
| **API-ADM-04** | `/api/admin/users/create` | POST | `{ name, email, role, password }` | 200 OK | `{ ok: true, user: newObject }` |
| **API-ADM-05** | `/api/admin/users/:id` | DELETE | Header: `x-user-role: Admin` | 200 OK | `{ ok: true, message: "User deleted." }` |
| **API-ADM-06** | `/api/admin/courses` | GET | Header: `x-user-role: Admin` | 200 OK | `{ ok: true, courses: [Published, Draft] }` |
| **API-ADM-07** | `/api/admin/courses/:id` | PUT | `{ status: "Archived" }` (with learners) | 422 Conflict | `{ ok: false, message: "Cannot archive course with active enrollments." }` |
| **API-ADM-08** | `/api/admin/audit-logs` | GET | Header: `x-user-role: Admin` | 200 OK | `{ ok: true, auditLogs: [...] }` |
| **API-ADM-09** | `/api/admin/audit-logs` | GET | Header: `x-user-role: Learner` | 403 Forbidden | `{ ok: false, message: "Only Admin users can query audit trail." }` |

### 2.7. AI Tutor Integration APIs
| Code | Endpoint | Method | Header / Payload | Status | Expected Response |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **API-AI-01** | `/api/ai/ask-tutor` | POST | `{ lessonId, question: "What is UX?" }` | 200 OK | `{ ok: true, answer: "...", sources: [...] }` |
| **API-AI-02** | `/api/ai/ask-tutor` | POST | `{ question: "" }` | 400 Bad Request | `{ ok: false, message: "Question cannot be empty." }` |
| **API-AI-03** | `/api/ai/ask-tutor` | POST | Question out-of-lesson context | 200 OK | `{ ok: true, answer: "KHÔNG ĐỦ DỮ LIỆU", status: "insufficient_context" }` |
| **API-AI-04** | `/api/ai/ask-tutor` | POST | Non-enrolled learner query | 403 Forbidden | `{ ok: false, message: "Access denied. Enroll in course." }` |

---

## 3. Mẫu Kịch bản Kiểm thử API cURL Automation

```bash
# 1. Health Check Test
curl -X GET http://localhost:4000/api/health

# 2. Login User Test (Learner)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@lms.test","password":"learner123"}'

# 3. Create Lesson (Instructor only)
curl -X POST http://localhost:4000/api/lessons/create \
  -H "Content-Type: application/json" \
  -H "x-user-role: Instructor" \
  -d '{"courseId":"course-1","title":"New Lesson","content":"Content..."}'

# 4. Grade Submission (Reviewer only)
curl -X POST http://localhost:4000/api/reviewer/submissions/submission-1/grade \
  -H "Content-Type: application/json" \
  -H "x-user-role: Reviewer" \
  -d '{"grade":95,"feedback":"Excellent analysis."}'
```
