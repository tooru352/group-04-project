## 18.24. Output #24 - AI Implementation Prompt + Verification

# AI Implementation Prompt Pack for LMS

Mỗi phần dưới đây là 1 prompt độc lập, sẵn copy cho chat để AI triển khai từng task riêng biệt theo story/spec thực tế của repo.

Source of truth: repo story specs + TRACEABILITY matrix. Scope này chỉ gồm US-LMS-01..US-LMS-30, với task naming chuẩn theo TASK-01..TASK-30 để đồng nhất với tài liệu hiện có.

---

## Task 01 - Login

# AI Implementation Prompt

TASK: TASK-01 - Implement POST /api/auth/login
STORY: US-LMS-01
CONTEXT:
Story Spec + REQ-LMS-01 + auth module + current User/session implementation.

## Rules
- Email và password phải không rỗng.
- Không tiết lộ user tồn tại hay không khi login thất bại.
- Chỉ lưu hash password, không log raw password.
- Trả về token/role/userId sau khi xác thực thành công.
- Không refactor ngoài auth nếu không cần.

## Before coding
1. Nêu implementation plan 3-7 bước.
2. Liệt kê các file dự kiến sửa/tạo và lý do.
3. Liệt kê test case sẽ thêm/chạy.
4. Nêu các rủi ro regression/security/assumption.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 1
npm run typecheck → passed

npm test → passed (tests 3, pass 3, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- login với credential hợp lệ thành công
- login sai trả về lỗi generic
- input trống trả về lỗi required
---

## Task 02 - Role Resolution

# AI Implementation Prompt

TASK: TASK-02 - Implement role resolution and protected route gating
STORY: US-LMS-02
CONTEXT:
Story Spec + REQ-LMS-02 + auth middleware + current session/user role models.

## Rules
- Role phải được xác định server-side từ token/session.
- Client không được tin cậy để truyền role.
- Role hợp lệ: LEARNER, INSTRUCTOR, REVIEWER, ADMIN.
- Nếu role không hợp lệ → 403 hoặc redirect phù hợp.
- Không refactor module ngoài auth nếu không cần.

## Before coding
1. Nêu implementation plan 3-7 bước.
2. Liệt kê các file dự kiến sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 2
npm run typecheck → passed

npm test → passed (tests 6, pass 6, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- role được xác định server-side
- client không được tin tưởng để khai role
- route bị chặn đúng khi không đủ quyền
---

## Task 03 - Authorization Middleware

# AI Implementation Prompt

TASK: TASK-03 - Implement authz middleware and ownership checks
STORY: US-LMS-03
CONTEXT:
Story Spec + NFR-LMS-01/02/04 + current protected endpoints.

## Rules
- 401 cho token không hợp lệ hoặc thiếu token.
- 403 cho role không đủ hoặc ownership sai.
- Kiểm tra quyền trước khi đọc/ghi dữ liệu nhạy cảm.
- Log access denied mà không leak protected data.
- Không refactor module ngoài auth nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file dự kiến sửa/tạo.
3. Nêu test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 3
npm run typecheck → passed

npm test → passed (tests 9, pass 9, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- Thêm authentication gate cho protected resource.
- Không tin client tự gửi role.
- Role quyết định theo server-side session.
- Ownership mismatch bị chặn.
- Chỉ cho phép access khi thỏa điều kiện bảo mật tối thiểu.

## Task 04 - Course List

# AI Implementation Prompt

TASK: TASK-04 - Implement GET /api/courses
STORY: US-LMS-04
CONTEXT:
Story Spec + REQ-LMS-03 + course catalog module.

## Rules
- Chỉ Learner đã xác thực mới được truy cập.
- Chỉ hiển thị Course active cho Learner.
- Xử lý empty state khi không có course.
- Không refactor module ngoài courses nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 4
npm run typecheck → passed

npm test → passed (tests 11,pass 11, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- Learner chỉ thấy course active
- Không hiển thị Draft/Archived
- Không cần client-side role giả
- Authz từ Task 3 vẫn là nguồn quyền
---

## Task 05 - Enrollment

# AI Implementation Prompt

TASK: TASK-05 - Implement POST /api/enrollments
STORY: US-LMS-05
CONTEXT:
Story Spec + REQ-LMS-04 + course enrollment module.

## Rules
- Chỉ Learner mới được enroll.
- Mỗi user/course chỉ được có 1 active enrollment.
- Nếu đã enroll thì không tạo bản ghi trùng.
- Không cho phép role khác thực hiện.
- Không refactor module ngoài courses/enrollment nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file dự kiến sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 5
npm run typecheck → passed

npm test → passed (tests 14, pass 14, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- learner-only enrollment được validate đúng theo quyền truy cập
- duplicate enrollment bị chặn với lỗi 'Already enrolled.'
- non-Learner role bị chặn với lỗi 'Only learners can enroll.'
- enrollment record trả về schema đúng: id, courseId, userId, status, createdAt
- course status + duplicate guard không gây trùng dữ liệu giữa các user
---

## Task 06 - Lesson Detail

# AI Implementation Prompt

TASK: TASK-06 - Implement GET /api/lessons/{lessonId}
STORY: US-LMS-06
CONTEXT:
Story Spec + REQ-LMS-05 + Lesson module + enrollment validation.

## Rules
- Chỉ Learner đã enroll trong Course mới được đọc Lesson.
- Lesson inactive/unpublished không được mở cho Learner.
- Nếu lesson không tồn tại → 404.
- Không refactor ngoài lessons nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 6
npm run typecheck → passed

npm test → passed (tests 18, pass 18, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- truy cập lesson chỉ cho learner đã enroll trong course đó
- lesson không published/không thuộc course đã enroll bị chặn với lỗi rõ ràng
- lesson không tồn tại trả về 'Lesson not found.'
- role khác Learner bị chặn với 'Only Learners can view lessons.'
- schema lesson trả về đúng { id, courseId, title, content, duration, status }
---

## Task 07 - Lesson Completion

# AI Implementation Prompt

TASK: TASK-07 - Implement POST /api/lessons/{lessonId}/complete
STORY: US-LMS-07
CONTEXT:
Story Spec + REQ-LMS-06 + lesson completion module.

## Rules
- Chỉ Learner enrolled mới được mark complete.
- Không tạo duplicate completion record.
- Thực hiện server-side authorization và idempotent behavior.
- Không refactor ngoài lessons nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 7
npm run typecheck → passed

npm test → passed (tests 22, pass 22, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- lesson completion chỉ được ghi khi learner đã enroll vào course đó
- duplicate completion bị chặn với lỗi 'Already completed.'
- non-enrolled learner bị chặn với lỗi rõ ràng
- role khác Learner bị từ chối với 'Only Learners can complete lessons.'
- payload trả về đúng { lessonId, userId, completedAt, status: 'completed' }
---

## Task 08 - Course Progress

# AI Implementation Prompt

TASK: TASK-08 - Implement GET /api/courses/{courseId}/progress
STORY: US-LMS-08
CONTEXT:
Story Spec + REQ-LMS-20 + progress calculation logic.

## Rules
- Progress tính dựa trên LessonCompletion và Submission.
- Chỉ tính required items.
- Learner phải enroll trong Course.
- 0% là trạng thái hợp lệ, không phải error.
- Không refactor ngoài courses/progress nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 8
npm run typecheck → passed

npm test → passed (tests 25, pass 25, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- progress tính theo required lessons của course và chỉ tính cho learner đã enroll
- 0% được xử lý hợp lệ khi chưa có lesson nào hoàn thành
- non-enrolled learner bị chặn với thông báo rõ ràng
- payload trả về đúng { courseId, totalItems, completedItems, percentage, lessonStatuses }
- logic dựa trên completion state thực tế, không tin client
---

## Task 09 - Course Completion

# AI Implementation Prompt

TASK: TASK-09 - Implement auto course completion evaluation
STORY: US-LMS-09
CONTEXT:
Story Spec + REQ-LMS-21 + completion evaluation + enrollment state.

## Rules
- Course chỉ marked completed khi tất cả required lessons và assignments hoàn thành.
- Không tự declare hoàn thành từ client.
- Nếu thiếu 1 item thì không set completed.
- Log event khi completion thay đổi.
- Không refactor ngoài courses/progress nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 9
npm run typecheck → passed

npm test → passed (tests 28, pass 28, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- completion chỉ được đánh dấu khi tất cả required lessons và assignments done
- course vẫn ở In Progress nếu thiếu 1 item duy nhất
- non-enrolled learner bị chặn trước khi đánh giá completion
- payload trả về đúng học trạng thái { courseId, totalItems, completedItems, percentage, isCompleted, lessonStatuses }
- server-side evaluation không tin client
---

## Task 10 - Assignment Detail

# AI Implementation Prompt

TASK: TASK-10 - Implement GET /api/assignments/{assignmentId}
STORY: US-LMS-10
CONTEXT:
Story Spec + REQ-LMS-07 + NFR-LMS-06 + current Assignment module.

## Rules
- Chỉ Learner đã đăng nhập mới được xem Assignment Detail.
- Learner phải được Enroll trong Course chứa Assignment.
- Không cho phép learner chỉnh sửa Assignment qua API này.
- Trả về thông tin read-only: id, courseId, title, description, deadline, maxAttempts, submissionStatus.
- Không refactor module ngoài Assignment nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 10
npm run typecheck → passed

npm test → passed (tests 32, pass 32, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- assignment detail mở chỉ khi learner thuộc course và đã auth
- non-enrolled learner bị chặn với 'Access denied. Enroll in the course to view this assignment.'
- missing assignment trả về 'Assignment not found.'
- role khác Learner bị chặn với 'Only Learners can view assignments.'
- response read-only đúng schema { id, courseId, title, description, deadline, maxAttempts, submissionStatus }
---

## Task 11 - Submit Assignment

# AI Implementation Prompt

TASK: TASK-11 - Implement POST /api/submissions
STORY: US-LMS-11
CONTEXT:
Story Spec + REQ-LMS-08 + NFR-LMS-06 + API contract + current Assignment/Submission module.

## Rules
- Chỉ Learner đã đăng nhập mới được Submit.
- Learner chỉ được Submit Assignment thuộc Course mà mình đã Enroll.
- answerContent không được rỗng.
- Submission sau Deadline vẫn được phép nhưng phải được đánh dấu Late.
- Không được tự thay đổi Grade khi Submit.
- Không refactor module ngoài Assignment/Submission nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 11
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 36
- pass 36
- fail 0
- duration_ms 432.5986

Human diff review:
- submit bị chặn nếu không thuộc course đã enroll hoặc answer rỗng
- late status được đánh từ server time, không tin client
- grade không được tự set khi submit
- request context phải có userRole và enrolledCourseIds để match contract thực tế
---

## Task 12 - Late Submission

# AI Implementation Prompt

TASK: TASK-12 - Implement late-submission handling for POST /api/submissions
STORY: US-LMS-12
CONTEXT:
Story Spec + REQ-LMS-09 + Business Rules về Deadline + current Submission model.

## Rules
- submittedAt phải là timestamp do server tạo, không nhận từ client.
- Nếu submittedAt > deadline thì đặt isLate = true và status = late.
- Nếu Assignment không có deadline thì không gán Late.
- Không cho phép client override timestamp.
- Không refactor module ngoài Submission nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 12
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 36
- pass 36
- fail 0
- duration_ms 432.5986

Human diff review:
- server time quyết định late status, không chấp nhận client timestamp
- deadline logic rõ ràng và nhất quán
- non-deadline assignment không bị đánh late sai
- request payload không được tin cậy cho submittedAt; server ghi timestamp thực tế khi xử lý request
---

## Task 13 - Resubmission Policy

# AI Implementation Prompt

TASK: TASK-13 - Implement resubmission policy in POST /api/submissions
STORY: US-LMS-13
CONTEXT:
Story Spec + REQ-LMS-10 + Business Rules về resubmission + Assignment/Submission module.

## Rules
- Chỉ cho phép resubmit khi allowsResubmission = true.
- Chỉ cho phép resubmit nếu now < deadline.
- Submission mới phải tạo record mới và cố định previous submission là superseded.
- Nếu không được phép, trả về lỗi rõ ràng: RESUBMISSION_NOT_ALLOWED hoặc PAST_DEADLINE.
- Không refactor module ngoài Assignment/Submission nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 13
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 40
- pass 40
- fail 0
- duration_ms 517.3296

Human diff review:
- policy resubmission dựa trên assignment rule và deadline
- previous submission được giữ nguyên để audit/history
- tiền lệ lỗi rõ ràng khi không được cho phép submit lại
- attempt tracking được tính theo learner + assignment, không phụ thuộc client input
---

## Task 14 - Instructor Submission List

# AI Implementation Prompt

TASK: TASK-14 - Implement GET /api/instructor/courses/{courseId}/submissions
STORY: US-LMS-14
CONTEXT:
Story Spec + REQ-LMS-14 + Instructor scope + current Submission/Instructor module.

## Rules
- Chỉ Instructor mới được gọi API này.
- Instructor chỉ thấy Submission thuộc Course mà họ quản lý.
- Nếu learner chưa nộp thì hiển thị trạng thái Not Submitted.
- Không trả về Submission của các course ngoài scope.
- Không refactor module ngoài Instructor/Submission nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 14
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 55
- pass 55
- fail 0
- duration_ms 962.1708ms

Human diff review:
- instructor chỉ thấy submission thuộc course trong scope của mình
- trạng thái Not Submitted được xử lý rõ ràng
- không leak dữ liệu course ngoài quyền quản lý
---

## Task 15 - Grade Submission

# AI Implementation Prompt

TASK: TASK-15 - Implement POST /api/submissions/{submissionId}/grade
STORY: US-LMS-15
CONTEXT:
Story Spec + REQ-LMS-15 + Business Rules về grading + current Submission/Grade module.

## Rules
- Chỉ Instructor hoặc Reviewer có quyền grade hợp lệ mới được thực hiện.
- Không cho phép Learner tự update grade.
- Submission phải tồn tại và ở trạng thái hợp lệ.
- Grade phải nằm trong vùng cho phép của Assignment hoặc hệ thống.
- Không refactor module ngoài Submission/Review nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 15
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 55
- pass 55
- fail 0
- duration_ms 962.1708ms

Human diff review:
- grading chỉ cho phép actor có quyền đúng
- learner không thể tự chấm điểm
- grade range và trạng thái submission được kiểm tra trước khi ghi
---

## Task 16 - View Feedback

# AI Implementation Prompt

TASK: TASK-16 - Implement GET /api/submissions/{submissionId}/feedback
STORY: US-LMS-16
CONTEXT:
Story Spec + REQ-LMS-19 + current Submission/Feedback module.

## Rules
- Chỉ Learner sở hữu Submission mới được xem feedback.
- Nếu chưa được grade thì trả về trạng thái Awaiting Grading thay vì lỗi.
- Không cho phép người khác xem feedback của submission không thuộc quyền.
- Không refactor module ngoài Submission/Feedback nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 16
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 55
- pass 55
- fail 0
- duration_ms 962.1708ms

Human diff review:
- learner chỉ xem feedback của submission của chính mình
- trạng thái Awaiting Grading được phản hồi đúng khi chưa chấm
- không leak dữ liệu từ submission khác
---

## Task 17 - Assign Reviewer

# AI Implementation Prompt

TASK: TASK-17 - Implement PATCH /api/submissions/{submissionId}/assign
STORY: US-LMS-17
CONTEXT:
Story Spec + REQ-LMS-16 + current Submission/Reviewer assignment flow.

## Rules
- Chỉ Instructor hoặc Admin được phân công reviewer.
- Reviewer phải hợp lệ và có quyền review.
- Submission phải tồn tại và ở trạng thái hợp lệ.
- Không override quyền truy cập của các actor không được phép.
- Không refactor module ngoài Submission/Review nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 17
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 55
- pass 55
- fail 0
- duration_ms 962.1708ms

Human diff review:
- reviewer assignment chỉ cho phép instructor/admin trong scope phù hợp
- reviewer không hợp lệ bị chặn ở module validation
- workflow tránh override quyền truy cập không được phép
---

## Task 18 - Reviewer Queue

# AI Implementation Prompt

TASK: TASK-18 - Implement GET /api/reviewer/submissions
STORY: US-LMS-18
CONTEXT:
Story Spec + REQ-LMS-17 + current Reviewer dashboard and Submission module.

## Rules
- Reviewer chỉ thấy submissions được assign cho chính mình.
- Không cho phép xem submission chưa assign.
- Trả về danh sách queue có learnerName, assignmentTitle, submittedAt, status.
- Không refactor module ngoài Reviewer/Submission nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 18
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 55
- pass 55
- fail 0
- duration_ms 962.1708ms

Human diff review:
- reviewer chỉ thấy queue được assign cho mình
- submissions chưa assign không xuất hiện
- response payload hiển thị đúng thông tin cần thiết cho review queue
---

## Task 19 - Reviewer Grading

# AI Implementation Prompt

TASK: TASK-19 - Implement POST /api/submissions/{submissionId}/grade for Reviewer
STORY: US-LMS-19
CONTEXT:
Story Spec + REQ-LMS-18 + Business Rules về reviewer assignment + reviewing flow.

## Rules
- Chỉ Reviewer được assign cho submission mới có thể grade.
- Reviewer không được grade submission không thuộc quyền.
- Grade phải nằm trong phạm vi cho phép của Assignment.
- Chỉ tạo GradeFeedback và cập nhật trạng thái khi hợp lệ.
- Không refactor module ngoài Submission/Review nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 19
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 55
- pass 55
- fail 0
- duration_ms 962.1708ms

Human diff review:
- reviewer chỉ grade submission được assign cho mình
- grade range và validation được kiểm tra trước khi cập nhật
- state transition của submission theo review flow được giữ nhất quán
---

## Task 20 - Instructor Course Management

# AI Implementation Prompt

TASK: TASK-20 - Implement instructor course create/update APIs
STORY: US-LMS-20
CONTEXT:
Story Spec + REQ-LMS-11 + instructor scope + course management.

## Rules
- Chỉ INSTRUCTOR mới được create/update course trong scope của họ.
- Không cho chỉnh course ngoài scope.
- Tên course không được rỗng.
- Status chỉ nhận active/inactive.
- Không refactor ngoài courses nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 20
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 55
- pass 55
- fail 0
- duration_ms 962.1708ms

Human diff review:
- instructor chỉ quản lý course trong scope của họ
- validation tên và status được thực hiện ở server-side
- không thay đổi dữ liệu ngoài quyền quản lý
---

## Task 21 - Instructor Lesson Management

# AI Implementation Prompt

TASK: TASK-21 - Implement instructor lesson create/update APIs
STORY: US-LMS-21
CONTEXT:
Story Spec + REQ-LMS-12 + lesson management + course ownership.

## Rules
- Chỉ Instructor quản lý Course đó mới được tạo/sửa lesson.
- Title/content không được rỗng.
- lesson phải thuộc course hợp lệ.
- Không cho sửa lesson ở course ngoài scope.
- Không refactor ngoài lessons nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 21
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 58
- pass 58
- fail 0
- duration_ms 711.1817ms

Human diff review:
- lesson create/update bị chặn nếu course không thuộc scope của instructor
- dữ liệu title/content bắt buộc hợp lệ
- lesson không thể truy cập trái phép ở course khác
---

## Task 22 - Instructor Assignment Management

# AI Implementation Prompt

TASK: TASK-22 - Implement instructor assignment create/update APIs
STORY: US-LMS-22
CONTEXT:
Story Spec + REQ-LMS-13 + assignment management + course scope.

## Rules
- Chỉ Instructor quản lý Course đó mới được tạo/sửa assignment.
- Title không được rỗng; deadline phải hợp lệ; maxAttempts >= 1.
- Không cho chỉnh assignment ở course ngoài scope.
- Không refactor ngoài assignments nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 22
Command run:
node --test --experimental-strip-types "src/**/*.test.ts"

Result:
- tests 61
- pass 61
- fail 0
- duration_ms 736.7048ms

Human diff review:
- assignment create/update chỉ ra khỏi course scope bị chặn
- title/deadline/maxAttempts được validate trước khi lưu
- không có refactor ngoài module assignment
---

## Task 23 - Admin User Role Management

# AI Implementation Prompt

TASK: TASK-23 - Implement admin user/role management APIs
STORY: US-LMS-23
CONTEXT:
Story Spec + REQ-LMS-26 + admin console + user role updates.

## Rules
- Chỉ ADMIN mới được thay đổi role.
- Role phải thuộc tập hợp hợp lệ.
- Không cho tự demote last admin.
- Audit role change.
- Không refactor ngoài admin/users nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 23
npm run typecheck → passed (exit 0)

node --test --experimental-strip-types "src/**/*.test.ts" → passed (tests 67, pass 67, fail 0)

npm run lint → passed (placeholder script output: "Lint: not configured for this repo yet; task-level validation is performed via typecheck + tests.")

npm run build → passed (placeholder script output: "Build: no app bundler configured in this repo yet; task evidence uses typecheck + tests.")

Human diff review:
- chỉ admin mới có quyền cập nhật role và non-admin bị chặn
- role phải thuộc tập hợp hợp lệ LEARNER/INSTRUCTOR/REVIEWER/ADMIN
- last admin không thể tự demote; audit log ghi lại oldRole/newRole/timestamp
- không refactor ngoài users module; logic nằm trong service.ts + types.ts
---

## Task 24 - Admin Course Management

# AI Implementation Prompt

TASK: TASK-24 - Implement admin course management APIs
STORY: US-LMS-24
CONTEXT:
Story Spec + REQ-LMS-27 + admin console + global course management.

## Rules
- Chỉ ADMIN mới được quản lý toàn bộ course system-wide.
- Không cho phép non-admin truy cập.
- Không xoá course nếu đang có active enrollments.
- Audit các thay đổi quản trị.
- Không refactor ngoài admin/courses nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 24
npm run typecheck → passed (exit 0)

node --test --experimental-strip-types "src/**/*.test.ts" → passed (tests 73, pass 73, fail 0)

npm run lint → passed (placeholder script output: "Lint: not configured for this repo yet; task-level validation is performed via typecheck + tests.")

npm run build → passed (placeholder script output: "Build: no app bundler configured in this repo yet; task evidence uses typecheck + tests.")

Human diff review:
- toàn bộ admin course management giới hạn ở Admin và không cho non-admin truy cập
- course status validation được bảo vệ, và archive bị chặn khi còn active enrollment
- audit log ghi adminId/courseId/action/timestamp sau khi cập nhật
- hệ thống trả về dữ liệu đầy đủ và không refactor ngoài admin module
---

## Task 25 - AI Tutor Ask

# AI Implementation Prompt

TASK: TASK-25 - Implement POST /api/tutor/ask
STORY: US-LMS-25
CONTEXT:
Story Spec + REQ-LMS-22 + AI tutor module + course/lesson context retrieval.

## Rules
- Chỉ Learner đã enroll trong Course/Lesson mới được gọi AI Tutor.
- Question không được rỗng.
- Không được trả về answer mà không có context hợp lệ.
- Log latency/session metadata; không log PII nhạy cảm.
- Không refactor ngoài ai-tutor nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 25
npm run typecheck → passed (exit 0)

node --test --experimental-strip-types "src/**/*.test.ts" → passed (tests 77, pass 77, fail 0)

npm run lint → passed (placeholder script output: "Lint: not configured for this repo yet; task-level validation is performed via typecheck + tests.")

npm run build → passed (placeholder script output: "Build: no app bundler configured in this repo yet; task evidence uses typecheck + tests.")

Human diff review:
- AI tutor chỉ cho learner đã enroll trong lesson mới có quyền hỏi
- câu hỏi rỗng bị chặn trước khi gọi logic tutor
- trả về grounded answer bằng lesson context; nếu không có context đủ thì answer status = insufficient-data và references = []
- không refactor ngoài ai-tutor module
---

## Task 26 - AI Grounded Answer

# AI Implementation Prompt

TASK: TASK-26 - Implement grounded answer generation in AI Tutor
STORY: US-LMS-26
CONTEXT:
Story Spec + REQ-LMS-23 + NFR-LMS-05 + AI tutor grounding rules.

## Rules
- Answer phải được căn cứ trong Course/Lesson context.
- Nếu thiếu context, không suy đoán.
- Trả về references và status tương ứng.
- Không hiển thị raw LLM output nếu chưa được validate.
- Không refactor ngoài ai-tutor nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 26
npm run typecheck → passed (exit 0)

node --test --experimental-strip-types "src/**/*.test.ts" → passed (tests 77, pass 77, fail 0)

npm run lint → passed (placeholder script output: "Lint: not configured for this repo yet; task-level validation is performed via typecheck + tests.")

npm run build → passed (placeholder script output: "Build: no app bundler configured in this repo yet; task evidence uses typecheck + tests.")

Human diff review:
- answer được chặn nếu thiếu grounding context và trả về status = insufficient_context
- success response có references dạng [{ lessonId, snippet }] và status = success
- logic giữ trong ai-tutor module, không trả raw model output không được validate
---

## Task 27 - AI Explain Example

# AI Implementation Prompt

TASK: TASK-27 - Implement explain/example flow in AI Tutor
STORY: US-LMS-27
CONTEXT:
Story Spec + REQ-LMS-24 + AI tutor explanation and example generation.

## Rules
- Explanation/example phải dựa chỉ trên context hiện có.
- Không đưa khái niệm ngoài lesson hoặc thêm thông tin không có căn cứ.
- Nếu không đủ context, trả về insufficient_context.
- Không refactor ngoài ai-tutor nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 27
npm run typecheck → passed

npm test → passed (tests 27, pass 27, fail 0)

npm run build → placeholder script chạy thành công

npm run lint → placeholder script chạy thành công

Human diff review:
- explanation/example chỉ dựa trên lesson context có sẵn
- thiếu context trả về insufficient_context rõ ràng
- không học thuyết hoặc khái niệm ngoài phạm vi được thêm vào
---

## Task 28 - AI Insufficient Context

# AI Implementation Prompt

TASK: TASK-28 - Implement insufficient-context handling in AI Tutor
STORY: US-LMS-28
CONTEXT:
Story Spec + REQ-LMS-25 + NFR-LMS-05 + AI safety rules.

## Rules
- Khi không đủ dữ liệu, trả về đúng chuỗi: KHÔNG ĐỦ DỮ LIỆU.
- Không guess, không fabricating answer.
- Chỉ sử dụng context được cung cấp; không truy cập dữ liệu ngoài phạm vi.
- Không refactor ngoài ai-tutor nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 28
npm run typecheck → passed (exit 0)

node --test --experimental-strip-types "src/**/*.test.ts" → passed (tests 79, pass 79, fail 0)

npm run lint → passed (placeholder script output: "Lint: not configured for this repo yet; task-level validation is performed via typecheck + tests.")

npm run build → passed (placeholder script output: "Build: no app bundler configured in this repo yet; task evidence uses typecheck + tests.")

Human diff review:
- out-of-scope questions trả về đúng chuỗi KHÔNG ĐỦ DỮ LIỆU
- references = [] và không có guessing hoặc invented facts
- logic nằm trong ai-tutor và chặn raw LLM response trước khi hiển thị
---

Human diff review:
- insufficient context được trả đúng theo contract
- không guess hoặc fabricate answer khi thiếu data
- AI tutor chỉ sử dụng context trong phạm vi được phép
---

## Task 29 - Data Consistency Guardrails

# AI Implementation Prompt

TASK: TASK-29 - Implement consistency guardrails for lesson/course/submission writes
STORY: US-LMS-29
CONTEXT:
Story Spec + NFR-LMS-03 + state consistency across Course/Lesson/Assignment/Submission writes.

## Rules
- Tất cả viết liên quan cần transaction hoặc atomic flow nơi phù hợp.
- Không để state mâu thuẫn giữa completion/progress/submission.
- Domain write phải bảo vệ state consistency.
- Không refactor ngoài modules liên quan nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 29
npm run typecheck → passed (exit 0)

node --test --experimental-strip-types "src/**/*.test.ts" → passed (tests 81, pass 81, fail 0)

npm run lint → passed (placeholder script output: "Lint: not configured for this repo yet; task-level validation is performed via typecheck + tests.")

npm run build → passed (placeholder script output: "Build: no app bundler configured in this repo yet; task evidence uses typecheck + tests.")

Human diff review:
- shared transaction guardrail and optimistic lock check were added to guard cross-write consistency
- rollback path restores prior state on simulated failure
- version mismatch returns the required CONFLICT payload: { error: "CONFLICT", message: "Resource was updated by another request. Please retry." }
- no unrelated broad refactor beyond the shared transaction guardrail and its tests
---

## Task 30 - Audit Trail

# AI Implementation Prompt

TASK: TASK-30 - Implement audit trail for critical LMS actions
STORY: US-LMS-30
CONTEXT:
Story Spec + NFR-LMS-07 + audit/event logging + admin reporting.

## Rules
- AuditEvent là append-only, không sửa/xoá record khi đã tạo.
- Chỉ ADMIN được query audit trail.
- Không lưu secret/password/raw answer trong metadata.
- Ghi audit cho grading, role change, review assignment, và critical action khác.
- Không refactor module ngoài admin/audit nếu không cần.

## Before coding
1. Nêu implementation plan.
2. Liệt kê file sửa/tạo.
3. Liệt kê test case.
4. Nêu rủi ro.

## After coding
Chạy:
- lint
- typecheck
- targeted tests
- build

Báo lại output thực tế của từng bước.
## VERIFICATION EVIDENCE 30
npm run typecheck → passed (exit 0)

node --test --experimental-strip-types "src/**/*.test.ts" → passed (tests 83, pass 83, fail 0)

npm run lint → passed (placeholder script output: "Lint: not configured for this repo yet; task-level validation is performed via typecheck + tests.")

npm run build → passed (placeholder script output: "Build: no app bundler configured in this repo yet; task evidence uses typecheck + tests.")

Human diff review:
- audit trail is append-only and admin-only as required
- non-admin access to the query API is rejected with a clear authorization error
- audit log records are filtered by actor/action/date and return the expected read contract with id, actorId, action, target, metadata, createdAt
- no raw secrets or answer payloads are stored in the audit metadata
---

## Verification Evidence Mẫu

$ npm run lint
0 errors

$ npm run typecheck
passed

$ npm test -- submissions
12 passed, 0 failed

$ npm run build
build completed successfully

Human diff review:
- Không nhận client timestamp khi tạo submission.
- Deadline và late-status logic dựa trên server time.
- Authorization scope đúng theo Course/Owner/Reviewer rules.
- Không có unrelated refactor ngoài Assignment/Submission.

