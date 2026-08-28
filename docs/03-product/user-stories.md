# Draft User Stories - AI Learning Management System

**Status:** Draft, chờ duyệt danh sách story  
**Nguồn:** [PRD.md](PRD.md) và confirmed requirements trong `docs/02-vault/02-requirements/5.requirements.md`  
**Quy ước:** Mỗi story có estimate đề xuất 1–3 points. Chưa tạo task.

## Definition of Ready

- Mỗi story có user value rõ ràng.
- Mỗi story có Requirement IDs source.
- Acceptance Criteria có thể kiểm thử theo Given/When/Then.
- Dependency hoặc TBD được ghi rõ.
- Story không vượt quá 3 points và không gộp nhiều giá trị độc lập.

## Story backlog

### EP1 - Identity, Role và Access Control

#### US-LMS-01 - Đăng nhập bằng tài khoản hợp lệ

**Title:** Login bằng tài khoản hợp lệ  
**Estimate đề xuất:** 2 points  
**User Story:** As a user, I want to log in with a valid account, so that I can access the LMS according to my role.  
**Context:** Đây là entry point để người dùng sử dụng các chức năng được phân quyền.  
**Requirement IDs:** `REQ-LMS-01`  
**Acceptance Criteria:**

- Given người dùng có tài khoản hợp lệ, When nhập thông tin và chọn Login, Then hệ thống cho phép truy cập workspace.
- Given thông tin đăng nhập không hợp lệ, When người dùng submit, Then hệ thống không tạo phiên truy cập và hiển thị lỗi.
**Out of Scope:** Đăng ký tài khoản, quên mật khẩu, SSO và authentication provider cụ thể.  
**Dependencies:** User account store và authentication mechanism — **TBD**.

#### US-LMS-02 - Nhận diện role của người dùng

**Title:** Nhận diện Learner, Instructor, Reviewer và Admin  
**Estimate đề xuất:** 2 points  
**User Story:** As a user, I want the system to identify my role, so that I see and use the functions assigned to me.  
**Context:** LMS có bốn role được xác nhận trong requirement.  
**Requirement IDs:** `REQ-LMS-02`  
**Acceptance Criteria:**

- Given account có một role hợp lệ, When đăng nhập, Then hệ thống gắn phiên với đúng role.
- Given người dùng mở chức năng theo role, When role không được phép, Then chức năng không được cấp quyền.
**Out of Scope:** Thiết kế permission matrix chi tiết ngoài các role đã xác nhận.  
**Dependencies:** US-LMS-01; role/permission model — **TBD**.

#### US-LMS-03 - Bảo vệ quyền truy cập và dữ liệu

**Title:** Chặn truy cập ngoài quyền được cấp  
**Estimate đề xuất:** 3 points  
**User Story:** As a system owner, I want access to be checked before protected actions, so that learning data is not accessed or changed by unauthorized users.  
**Context:** Đây là cross-cutting capability áp dụng cho các chức năng cần quyền.  
**Requirement IDs:** `NFR-LMS-01`, `NFR-LMS-02`, `NFR-LMS-04`  
**Acceptance Criteria:**

- Given user không có quyền với resource, When yêu cầu truy cập, Then hệ thống từ chối và không trả dữ liệu.
- Given user không có quyền chỉnh sửa, When gửi mutation, Then hệ thống từ chối và dữ liệu không thay đổi.
- Given truy cập bị từ chối, When hiển thị kết quả, Then hệ thống cung cấp permission-denied feedback.
**Out of Scope:** Encryption, threat model và security operations cụ thể.  
**Dependencies:** US-LMS-02; authorization middleware và data access policy — **TBD**.

### EP2 - Course Discovery và Enrollment

#### US-LMS-04 - Xem danh sách Course

**Title:** Xem các Course có trên hệ thống  
**Estimate đề xuất:** 2 points  
**User Story:** As a Learner, I want to view available Courses, so that I can choose what to learn.  
**Context:** Course List là điểm bắt đầu cho việc khám phá nội dung.  
**Requirement IDs:** `REQ-LMS-03`  
**Acceptance Criteria:**

- Given Learner có quyền truy cập, When mở Course List, Then hệ thống hiển thị các Course có trên hệ thống.
- Given không có Course phù hợp, When mở danh sách, Then hệ thống hiển thị empty state.
**Out of Scope:** Recommendation, search ranking và filter nâng cao.  
**Dependencies:** Course data model; US-LMS-03.

#### US-LMS-05 - Đăng ký Course

**Title:** Enroll vào một Course  
**Estimate đề xuất:** 2 points  
**User Story:** As a Learner, I want to enroll in a Course, so that I can access its learning content.  
**Context:** Enrollment là điều kiện trước khi Learner học Lesson.  
**Requirement IDs:** `REQ-LMS-04`  
**Acceptance Criteria:**

- Given Learner chưa enroll Course, When chọn Enroll, Then enrollment được ghi nhận.
- Given enrollment thành công, When Learner xem Course, Then trạng thái enrolled được hiển thị.
- Given Learner đã enroll, When mở lại Course, Then hệ thống không tạo enrollment trùng.
**Out of Scope:** Payment, approval workflow và certificate.  
**Dependencies:** US-LMS-03; enrollment data model; US-LMS-03/BR-LMS-02.

### EP3 - Learning Content và Progress

#### US-LMS-06 - Xem Lesson đã được phép

**Title:** Xem Lesson của Course đã đăng ký  
**Estimate đề xuất:** 2 points  
**User Story:** As a Learner, I want to view Lessons in my enrolled Course, so that I can study the Course content.  
**Context:** Learner chỉ được xem nội dung Course đã enroll.  
**Requirement IDs:** `REQ-LMS-05`  
**Acceptance Criteria:**

- Given Learner đã enroll Course, When chọn Course, Then danh sách Lesson của Course được hiển thị.
- Given Learner chưa enroll Course, When yêu cầu mở Lesson, Then hệ thống từ chối truy cập.
**Out of Scope:** Học theo thứ tự hoặc khóa Lesson ngoài quyết định đã xác nhận.  
**Dependencies:** US-LMS-05; Course/Lesson relationship; `BR-LMS-02`, `BR-LMS-03`.

#### US-LMS-07 - Đánh dấu Lesson hoàn thành

**Title:** Đánh dấu Lesson đã hoàn thành  
**Estimate đề xuất:** 2 points  
**User Story:** As a Learner, I want to mark a Lesson complete, so that my learning activity is recorded.  
**Context:** Completion là input cho Progress và Course Completion.  
**Requirement IDs:** `REQ-LMS-06`  
**Acceptance Criteria:**

- Given Learner đang xem Lesson chưa hoàn thành, When chọn Mark as complete, Then hệ thống ghi nhận Lesson completed.
- Given Lesson đã completed, When Learner mở lại, Then trạng thái completed vẫn được hiển thị.
**Out of Scope:** Tự động xác định completion từ thời gian đọc hoặc điểm số.  
**Dependencies:** US-LMS-06; learner lesson completion record.

#### US-LMS-08 - Xem Learning Progress

**Title:** Theo dõi Learning Progress trong Course  
**Estimate đề xuất:** 3 points  
**User Story:** As a Learner, I want to see my progress in each Course, so that I know what I have completed and what remains.  
**Context:** Progress phải phản ánh trạng thái Lesson và Assignment theo rule đã xác nhận.  
**Requirement IDs:** `REQ-LMS-20`, `NFR-LMS-06`  
**Acceptance Criteria:**

- Given Learner có trạng thái completion, When mở Course, Then Progress của Course được hiển thị.
- Given Learner hoàn thành một item, When Progress được cập nhật, Then trạng thái và giá trị hiển thị nhất quán.
- Given Progress được hiển thị, When Learner xem màn hình, Then Lesson status và Progress dễ nhận biết.
**Out of Scope:** Advanced analytics, cohort comparison và predictive progress.  
**Dependencies:** US-LMS-07; Assignment completion; progress calculation — **TBD** theo `BR-LMS-13`.

#### US-LMS-09 - Ghi nhận Course Completed

**Title:** Xác định Course Completed khi đủ điều kiện  
**Estimate đề xuất:** 3 points  
**User Story:** As a Learner, I want the system to recognize Course completion, so that I know when I have fulfilled the Course requirements.  
**Context:** Course chỉ completed khi đủ Lesson bắt buộc và Assignment bắt buộc.  
**Requirement IDs:** `REQ-LMS-21`  
**Acceptance Criteria:**

- Given còn Lesson hoặc Assignment bắt buộc chưa hoàn thành, When hệ thống kiểm tra, Then Course không được ghi nhận Completed.
- Given tất cả Lesson và Assignment bắt buộc đã hoàn thành, When hệ thống kiểm tra, Then Course được ghi nhận Completed.
**Out of Scope:** Certificate, graduation workflow và rule mới về completion.  
**Dependencies:** US-LMS-07; Assignment completion; `BR-LMS-12`, `BR-LMS-13`.

### EP4 - Assignment và Submission

#### US-LMS-10 - Xem yêu cầu và Deadline

**Title:** Xem yêu cầu và Deadline Assignment  
**Estimate đề xuất:** 2 points  
**User Story:** As a Learner, I want to see Assignment instructions and Deadline, so that I can prepare and submit my work correctly.  
**Context:** Assignment detail phải làm rõ yêu cầu bài và thời hạn.  
**Requirement IDs:** `REQ-LMS-07`, `NFR-LMS-06`  
**Acceptance Criteria:**

- Given Assignment tồn tại trong Course, When Learner mở Assignment, Then instructions và Deadline được hiển thị.
- Given Assignment có trạng thái, When Learner mở detail, Then trạng thái hiện tại được hiển thị cùng thông tin bài.
**Out of Scope:** Tạo hoặc chỉnh sửa Assignment của Instructor.  
**Dependencies:** Assignment data model; Course enrollment authorization.

#### US-LMS-11 - Submit Assignment

**Title:** Nộp bài Assignment  
**Estimate đề xuất:** 3 points  
**User Story:** As a Learner, I want to submit my Assignment, so that my work can be evaluated.  
**Context:** Learner cần một Submission flow có thể ghi nhận kết quả.  
**Requirement IDs:** `REQ-LMS-08`  
**Acceptance Criteria:**

- Given Learner có bài làm hợp lệ, When chọn Submit, Then hệ thống tạo Submission cho Assignment.
- Given Submission thành công, When kết thúc thao tác, Then trạng thái Submission được hiển thị.
- Given bài làm không hợp lệ, When submit, Then hệ thống không tạo Submission và hiển thị lỗi.
**Out of Scope:** Chấm điểm tự động, plagiarism detection và file format chưa được xác nhận.  
**Dependencies:** US-LMS-10; Submission model; input/file handling — **TBD**.

#### US-LMS-12 - Ghi nhận timestamp và Late

**Title:** Xác định Late Submission theo Deadline  
**Estimate đề xuất:** 3 points  
**User Story:** As a Learner, I want my submission time and lateness to be recorded, so that the submission status is transparent.  
**Context:** Late được xác định bằng thời điểm Submit so với Deadline.  
**Requirement IDs:** `REQ-LMS-09`  
**Acceptance Criteria:**

- Given Submission được tạo, When hệ thống lưu kết quả, Then submitted-at timestamp được ghi nhận.
- Given submitted-at sau Deadline, When hệ thống xác định status, Then Submission được đánh dấu Late.
- Given submitted-at không sau Deadline, When hệ thống xác định status, Then Submission không bị đánh dấu Late.
**Out of Scope:** Grace period hoặc thay đổi Deadline ngoài dữ liệu được cung cấp.  
**Dependencies:** US-LMS-11; authoritative clock/timezone — **TBD**; `BR-LMS-04`.

#### US-LMS-13 - Submit lại trước Deadline

**Title:** Submit lại Assignment khi được phép  
**Estimate đề xuất:** 2 points  
**User Story:** As a Learner, I want to resubmit before the Deadline when allowed, so that I can improve my work.  
**Context:** Resubmission phụ thuộc vào cấu hình của Assignment và Deadline.  
**Requirement IDs:** `REQ-LMS-10`  
**Acceptance Criteria:**

- Given Assignment cho phép resubmission và chưa qua Deadline, When Learner submit lần nữa, Then hệ thống nhận Submission mới.
- Given Assignment không cho phép resubmission hoặc đã qua Deadline, When Learner cố submit lại, Then hệ thống không cho phép theo policy tương ứng.
**Out of Scope:** Chọn Submission nào để Grade; policy sau Deadline ngoài rule đã xác nhận.  
**Dependencies:** US-LMS-12; Assignment `allows-resubmission`; `BR-LMS-05`.

### EP5 - Assessment, Grade và Feedback

#### US-LMS-14 - Instructor xem Submission

**Title:** Xem Submission của Learner trong Course  
**Estimate đề xuất:** 3 points  
**User Story:** As an Instructor, I want to view Learner Submissions in my Course, so that I can assess submitted work.  
**Context:** Instructor chỉ xem Submission trong Course thuộc phạm vi quản lý.  
**Requirement IDs:** `REQ-LMS-14`  
**Acceptance Criteria:**

- Given Instructor quản lý Course, When mở Submission list, Then các Submission của Learner trong Course được hiển thị.
- Given Learner chưa nộp, When Instructor xem danh sách, Then Learner được phân biệt là chưa nộp.
- Given Instructor không quản lý Course, When yêu cầu xem Submission, Then truy cập bị từ chối.
**Out of Scope:** Reviewer assignment và analytics nâng cao.  
**Dependencies:** US-LMS-03; US-LMS-11; authorization scope; `BR-LMS-06`, `BR-LMS-07`.

#### US-LMS-15 - Instructor Grade và Feedback

**Title:** Grade Submission và gửi Feedback  
**Estimate đề xuất:** 3 points  
**User Story:** As an Instructor, I want to grade a Submission and provide Feedback, so that the Learner understands the result and how to improve.  
**Context:** Grade và Feedback phải gắn với Submission cụ thể.  
**Requirement IDs:** `REQ-LMS-15`  
**Acceptance Criteria:**

- Given Instructor được phép đánh giá Submission, When nhập Grade và Feedback rồi lưu, Then kết quả được lưu cho Submission đó.
- Given Grade/Feedback được lưu, When mở lại Submission, Then kết quả đã lưu được hiển thị.
- Given Instructor không có quyền, When cố lưu kết quả, Then hệ thống từ chối thao tác.
**Out of Scope:** Rubric engine, AI grading và moderation workflow.  
**Dependencies:** US-LMS-14; Grade/Feedback model; `BR-LMS-07`, `BR-LMS-10`.

#### US-LMS-16 - Learner xem Grade và Feedback

**Title:** Xem Grade và Feedback của Submission  
**Estimate đề xuất:** 2 points  
**User Story:** As a Learner, I want to see my Grade and Feedback, so that I can understand my assessment result.  
**Context:** Learner chỉ xem được kết quả của Submission thuộc chính mình.  
**Requirement IDs:** `REQ-LMS-19`  
**Acceptance Criteria:**

- Given Submission đã được đánh giá, When Learner mở kết quả, Then Grade và Feedback được hiển thị.
- Given Submission thuộc Learner khác, When Learner yêu cầu xem, Then hệ thống từ chối truy cập.
**Out of Scope:** Khiếu nại điểm, appeal workflow và chỉnh sửa Feedback.  
**Dependencies:** US-LMS-15; Learner identity; `BR-LMS-11`.

### EP6 - Reviewer Workflow

#### US-LMS-17 - Phân công Reviewer

**Title:** Phân công Reviewer cho Submission  
**Estimate đề xuất:** 2 points  
**User Story:** As an Instructor or Admin, I want to assign a Reviewer to a Submission, so that the Submission can be evaluated by the responsible reviewer.  
**Context:** Chỉ Instructor hoặc Admin có quyền thực hiện assignment này.  
**Requirement IDs:** `REQ-LMS-16`  
**Acceptance Criteria:**

- Given Instructor/Admin có quyền và Reviewer hợp lệ, When chọn assign, Then Submission được gắn với Reviewer.
- Given user không phải Instructor/Admin, When cố assign, Then thao tác bị từ chối.
**Out of Scope:** Auto-assignment, workload balancing và reviewer notification.  
**Dependencies:** User/Role model; Submission model; `BR-LMS-09`.

#### US-LMS-18 - Reviewer xem Submission được phân công

**Title:** Xem Submission được phân công  
**Estimate đề xuất:** 2 points  
**User Story:** As a Reviewer, I want to view Submissions assigned to me, so that I can evaluate my assigned work.  
**Context:** Reviewer chỉ được xem Submission được phân công.  
**Requirement IDs:** `REQ-LMS-17`  
**Acceptance Criteria:**

- Given Submission được assign cho Reviewer, When Reviewer mở danh sách, Then Submission đó được hiển thị.
- Given Submission không được assign cho Reviewer, When Reviewer yêu cầu xem, Then truy cập bị từ chối.
**Out of Scope:** Xem toàn bộ Course hoặc Submission không được phân công.  
**Dependencies:** US-LMS-17; authorization scope; `BR-LMS-08`.

#### US-LMS-19 - Reviewer Grade và Feedback

**Title:** Reviewer đánh giá Submission được phân công  
**Estimate đề xuất:** 3 points  
**User Story:** As a Reviewer, I want to grade and provide Feedback on assigned Submissions, so that the Learner receives an assessed result.  
**Context:** Reviewer có capability tương ứng nhưng chỉ trong phạm vi Submission được phân công.  
**Requirement IDs:** `REQ-LMS-18`  
**Acceptance Criteria:

- Given Reviewer được assign Submission, When nhập Grade và Feedback rồi lưu, Then kết quả được gắn với Submission.
- Given Reviewer không được assign Submission, When cố lưu đánh giá, Then hệ thống từ chối.
**Out of Scope:** Phân công Reviewer, đánh giá ngoài assignment và thay đổi quyền.  
**Dependencies:** US-LMS-18; Grade/Feedback model; `BR-LMS-08`, `BR-LMS-10`.

### EP7 - Course và System Administration

#### US-LMS-20 - Instructor quản lý Course

**Title:** Tạo, chỉnh sửa và quản lý Course  
**Estimate đề xuất:** 3 points  
**User Story:** As an Instructor, I want to manage Courses in my authorized scope, so that Learners can access maintained learning offerings.  
**Context:** Requirement xác nhận create/edit/manage Course, nhưng workflow chi tiết chưa được đặc tả.  
**Requirement IDs:** `REQ-LMS-11`  
**Acceptance Criteria:**

- Given Instructor có quyền, When tạo hoặc chỉnh sửa Course, Then hệ thống lưu thay đổi trong phạm vi được phép.
- Given Instructor không có quyền với Course, When cố chỉnh sửa, Then hệ thống từ chối.
**Out of Scope:** Course template, publishing workflow và catalog ranking.  
**Dependencies:** Course management UI/API — **TBD**; `BR-LMS-06`.

#### US-LMS-21 - Instructor quản lý Lesson

**Title:** Tạo, chỉnh sửa và quản lý Lesson  
**Estimate đề xuất:** 3 points  
**User Story:** As an Instructor, I want to manage Lessons within my Course, so that Learners can study current content.  
**Context:** Lesson phải thuộc Course và chịu authorization scope của Instructor.  
**Requirement IDs:** `REQ-LMS-12`  
**Acceptance Criteria:

- Given Instructor quản lý Course, When tạo hoặc chỉnh sửa Lesson thuộc Course, Then thay đổi được lưu.
- Given Lesson thuộc Course ngoài scope, When Instructor cố chỉnh sửa, Then hệ thống từ chối.
**Out of Scope:** Video authoring, versioning và prerequisite sequencing.  
**Dependencies:** US-LMS-20; Lesson management UI/API — **TBD**; `BR-LMS-06`.

#### US-LMS-22 - Instructor quản lý Assignment

**Title:** Tạo, chỉnh sửa và quản lý Assignment  
**Estimate đề xuất:** 3 points  
**User Story:** As an Instructor, I want to manage Assignments within my Course, so that Learners have valid tasks and Deadlines.  
**Context:** Assignment gồm yêu cầu, Deadline và các cấu hình liên quan đã được xác nhận trong scope.  
**Requirement IDs:** `REQ-LMS-13`  
**Acceptance Criteria:

- Given Instructor quản lý Course, When tạo hoặc chỉnh sửa Assignment, Then Assignment được lưu thuộc Course đó.
- Given Instructor không quản lý Course, When cố chỉnh sửa Assignment, Then hệ thống từ chối.
**Out of Scope:** Auto-grading, question bank và plagiarism detection.  
**Dependencies:** US-LMS-20; Assignment management UI/API — **TBD**; `BR-LMS-06`.

#### US-LMS-23 - Admin quản lý User và Role

**Title:** Quản lý User và Role  
**Estimate đề xuất:** 3 points  
**User Story:** As an Admin, I want to manage Users and Roles, so that access to the LMS remains accurate.  
**Context:** Admin chịu trách nhiệm quản lý identity và role system.  
**Requirement IDs:** `REQ-LMS-26`  
**Acceptance Criteria:**

- Given Admin có quyền, When cập nhật User hoặc Role, Then thay đổi được lưu.
- Given user không phải Admin, When yêu cầu quản lý User/Role, Then truy cập bị từ chối.
**Out of Scope:** Identity provider provisioning, billing và audit report UI.  
**Dependencies:** User/Role model; authorization; `BR-LMS-01`, `BR-LMS-17`.

#### US-LMS-24 - Admin quản lý Course và dữ liệu vận hành

**Title:** Quản lý Course và dữ liệu cần thiết cho vận hành  
**Estimate đề xuất:** 3 points  
**User Story:** As an Admin, I want to manage Courses and required operational data, so that the LMS can operate reliably.  
**Context:** Requirement không liệt kê chi tiết từng loại operational data; phạm vi cụ thể là **TBD**.
**Requirement IDs:** `REQ-LMS-27`  
**Acceptance Criteria:**

- Given Admin có quyền, When quản lý Course hoặc dữ liệu được xác định trong phạm vi, Then thay đổi được lưu đúng scope.
- Given user không phải Admin, When cố quản lý dữ liệu admin, Then hệ thống từ chối.
**Out of Scope:** Bất kỳ dữ liệu nào chưa được định nghĩa hoặc tự mở rộng thành feature mới.  
**Dependencies:** US-LMS-20; Admin data scope — **TBD**; `BR-LMS-17`.

### EP8 - Grounded AI Tutor

#### US-LMS-25 - Đặt câu hỏi cho AI Tutor

**Title:** Đặt câu hỏi cho AI Tutor trong quá trình học  
**Estimate đề xuất:** 2 points  
**User Story:** As a Learner, I want to ask the AI Tutor questions while learning, so that I can get help without leaving my Course context.  
**Context:** AI Tutor là capability hỗ trợ trong Course/Lesson.  
**Requirement IDs:** `REQ-LMS-22`  
**Acceptance Criteria:

- Given Learner đang học và có AI Tutor, When nhập câu hỏi, Then hệ thống gửi câu hỏi trong Lesson context.
- Given input rỗng, When Learner gửi, Then hệ thống không tạo câu hỏi và hiển thị validation.
**Out of Scope:** Chatbot độc lập, voice input và conversation history dài hạn.  
**Dependencies:** US-LMS-06; AI Tutor interface/service — **TBD**; `BR-LMS-14`.

#### US-LMS-26 - Trả lời theo Course/Lesson context

**Title:** Trả lời câu hỏi dựa trên Course/Lesson context  
**Estimate đề xuất:** 3 points  
**User Story:** As a Learner, I want the AI Tutor to answer from Course/Lesson content, so that the guidance is relevant and grounded.  
**Context:** Context được cung cấp là nguồn duy nhất cho câu trả lời.  
**Requirement IDs:** `REQ-LMS-23`, `NFR-LMS-05`  
**Acceptance Criteria:

- Given context đủ, When AI xử lý câu hỏi, Then câu trả lời tham chiếu nội dung Course/Lesson được cung cấp.
- Given context không đủ, When AI xử lý câu hỏi, Then hệ thống không tự suy đoán và chuyển sang insufficient-context.
**Out of Scope:** External knowledge retrieval, personalized recommendation và autonomous action.  
**Dependencies:** AI context retrieval/prompt contract — **TBD**; `BR-LMS-14`, `BR-LMS-15`.

#### US-LMS-27 - Giải thích hoặc đưa ví dụ liên quan

**Title:** Giải thích lại nội dung khó bằng ví dụ  
**Estimate đề xuất:** 3 points  
**User Story:** As a Learner, I want the AI Tutor to explain difficult content or give a related example, so that I can understand the Lesson more easily.  
**Context:** Đây là dạng response được xác nhận trong AI Tutor requirements.  
**Requirement IDs:** `REQ-LMS-24`  
**Acceptance Criteria:

- Given câu hỏi yêu cầu giải thích, When AI có đủ context, Then response diễn đạt lại nội dung dễ hiểu hơn.
- Given câu hỏi yêu cầu ví dụ, When AI có đủ context, Then response đưa ví dụ liên quan đến Course/Lesson.
**Out of Scope:** Lesson Summary, AI Study Plan và nội dung ngoài context.  
**Dependencies:** US-LMS-26; AI response policy — **TBD**.

#### US-LMS-28 - Báo thiếu dữ liệu, không suy đoán

**Title:** Báo `KHÔNG ĐỦ DỮ LIỆU` khi thiếu context  
**Estimate đề xuất:** 2 points  
**User Story:** As a Learner, I want the AI Tutor to say when it lacks enough context, so that I am not misled by an invented answer.  
**Context:** Đây là safety behavior bắt buộc cho AI Tutor.  
**Requirement IDs:** `REQ-LMS-25`, `NFR-LMS-05`  
**Acceptance Criteria:

- Given Course/Lesson context không đủ, When Learner hỏi câu ngoài context, Then hệ thống hiển thị chính xác `KHÔNG ĐỦ DỮ LIỆU`.
- Given trạng thái insufficient-context, When response được hiển thị, Then không có thông tin suy đoán hoặc nguồn ngoài Course/Lesson.
**Out of Scope:** Human escalation, external search và answer confidence scoring.  
**Dependencies:** US-LMS-26; context sufficiency check — **TBD**; `BR-LMS-15`.

## Non-functional cross-cutting stories

#### US-LMS-29 - Dữ liệu học tập nhất quán

**Title:** Lưu trữ nhất quán dữ liệu học tập  
**Estimate đề xuất:** 3 points  
**User Story:** As a system owner, I want Course, Lesson, Assignment, Submission, Grade, Feedback and Progress data to remain consistent, so that users can trust the LMS state.  
**Context:** Đây là NFR áp dụng xuyên suốt nhiều capability, không thuộc một persona đơn lẻ.
**Requirement IDs:** `NFR-LMS-03`  
**Acceptance Criteria:

- Given một thao tác cập nhật hợp lệ, When hệ thống hoàn tất, Then các entity liên quan phản ánh cùng trạng thái hợp lệ.
- Given thao tác cập nhật thất bại, When hệ thống trả lỗi, Then không lưu trạng thái một phần gây mâu thuẫn.
**Out of Scope:** Database vendor, disaster recovery và data migration plan.  
**Dependencies:** Data model, transaction boundary và persistence strategy — **TBD**.

#### US-LMS-30 - Truy vết thao tác quan trọng

**Title:** Truy vết Grade, Feedback và thay đổi quyền  
**Estimate đề xuất:** 3 points  
**User Story:** As a system owner, I want important assessment and access changes to be traceable, so that the system supports accountability.  
**Context:** Auditability là Should NFR cho các thao tác quan trọng.
**Requirement IDs:** `NFR-LMS-07`  
**Acceptance Criteria:

- Given Grade hoặc Feedback được thay đổi, When thao tác hoàn tất, Then hệ thống có record truy vết.
- Given quyền người dùng được thay đổi, When thao tác hoàn tất, Then hệ thống có record actor và thời điểm.
**Out of Scope:** Audit dashboard, retention period và compliance certification.  
**Dependencies:** Audit log schema và retention policy — **TBD**.

## Split review trước khi tạo task

Không có story nào vượt quá 3 points. Các requirement lớn như Course management, Assignment management, authorization và AI Tutor đã được tách thành các story riêng theo một giá trị độc lập. Không tạo task cho đến khi danh sách story này được duyệt.

## Coverage note

- Functional requirements `REQ-LMS-01` đến `REQ-LMS-27` đều được tham chiếu trong ít nhất một story.
- Non-functional requirements `NFR-LMS-01` đến `NFR-LMS-07` đều được tham chiếu trong ít nhất một story.
- Các Business Rule liên quan được ghi tại Context/Dependencies; không có rule mới được tạo trong tài liệu này.
