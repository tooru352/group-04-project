# Backlog Taiga - AI Learning Management System

## EP1 - Identity, Role và Access Control

### US-LMS-01 - Đăng nhập bằng tài khoản hợp lệ
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-01 | T-01 | Xây dựng form đăng nhập và validation đầu vào | FE | 3h | Form login, báo lỗi sai thông tin |
| US-LMS-01 | T-02 | Triển khai API đăng nhập và tạo session/token | BE | 5h | POST /auth/login, token/session |
| US-LMS-01 | T-03 | Chuyển hướng sau đăng nhập và xử lý lỗi | FE/BE | 3h | Redirect theo role, lỗi rõ ràng |

### US-LMS-02 - Nhận diện role của người dùng
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-02 | T-01 | Xác định model role và mapping account-role | BE | 4h | Role model rõ ràng |
| US-LMS-02 | T-02 | Xây dựng dashboard theo role | FE | 4h | Learner/Instructor/Reviewer/Admin view |
| US-LMS-02 | T-03 | Thêm kiểm tra quyền khi mở chức năng | FE/BE | 3h | Chặn tính năng không được phép |

### US-LMS-03 - Bảo vệ quyền truy cập và dữ liệu
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-03 | T-01 | Triển khai route guard / permission guard | FE | 4h | Chặn màn hình không có quyền |
| US-LMS-03 | T-02 | Triển khai kiểm tra quyền ở backend | BE | 5h | Kiểm tra access trước khi trả dữ liệu |
| US-LMS-03 | T-03 | Thêm trạng thái từ chối truy cập và test negative case | FE/QA | 3h | Permission denied, test lỗi |

---

## EP2 - Course Discovery và Enrollment

### US-LMS-04 - Xem danh sách Course
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-04 | T-01 | Xây dựng giao diện danh sách Course | FE | 3h | Cards course, trạng thái sẵn sàng |
| US-LMS-04 | T-02 | Triển khai API danh sách Course | BE | 4h | GET /courses |
| US-LMS-04 | T-03 | Thêm empty state khi không có Course | FE | 2h | Empty state rõ ràng |

### US-LMS-05 - Đăng ký Course
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-05 | T-01 | Xây dựng nút enroll và thông báo thành công | FE | 3h | Button Enroll, toast/thông báo |
| US-LMS-05 | T-02 | Triển khai API enrollment và validation | BE | 5h | POST /enrollments |
| US-LMS-05 | T-03 | Chặn đăng ký trùng và lưu trạng thái enrolled | BE/QA | 3h | Không tạo enrollment trùng |

---

## EP3 - Learning Content và Progress

### US-LMS-06 - Xem Lesson đã được phép
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-06 | T-01 | Xây dựng màn hình danh sách Lesson | FE | 3h | Lesson list theo course |
| US-LMS-06 | T-02 | Kiểm tra quyền enroll trước khi mở Lesson | BE | 4h | Chặn nếu chưa enroll |
| US-LMS-06 | T-03 | Xây dựng màn hình chi tiết Lesson | FE | 4h | Nội dung lesson rõ ràng |

### US-LMS-07 - Đánh dấu Lesson hoàn thành
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-07 | T-01 | Thêm nút hoàn thành lesson và trạng thái UI | FE | 3h | Nút Mark as complete |
| US-LMS-07 | T-02 | Triển khai API cập nhật lesson completed | BE | 4h | Lưu trạng thái hoàn thành |
| US-LMS-07 | T-03 | Chặn ghi nhận hoàn thành trùng lặp | BE/QA | 2h | Không lưu 2 lần |

### US-LMS-08 - Xem Learning Progress
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-08 | T-01 | Tính toán progress theo course | BE | 5h | % tiến độ chính xác |
| US-LMS-08 | T-02 | Hiển thị progress bar và trạng thái lesson | FE | 3h | UI tiến độ rõ ràng |
| US-LMS-08 | T-03 | Test tính nhất quán của progress | QA/BE | 3h | Test cập nhật progress |

### US-LMS-09 - Ghi nhận Course Completed
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-09 | T-01 | Xác định rule Course completed | BE | 4h | Quy tắc hoàn thành course |
| US-LMS-09 | T-02 | Triển khai tính toán trạng thái completed | BE | 5h | Cập nhật course status |
| US-LMS-09 | T-03 | Hiển thị badge Completed trong UI | FE | 2h | Trạng thái completed rõ ràng |

---

## EP4 - Assignment và Submission

### US-LMS-10 - Xem yêu cầu và Deadline
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-10 | T-01 | Xây dựng màn hình chi tiết Assignment | FE | 3h | Title, instruction, deadline |
| US-LMS-10 | T-02 | Hiển thị deadline và trạng thái hiện tại | FE/BE | 3h | Status rõ ràng |
| US-LMS-10 | T-03 | Load dữ liệu Assignment từ API | BE | 4h | GET /assignments/:id |

### US-LMS-11 - Submit Assignment
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-11 | T-01 | Xây dựng form nộp bài và validation | FE | 4h | Form submit, lỗi dữ liệu |
| US-LMS-11 | T-02 | Triển khai API submit bài | BE | 5h | POST /submissions |
| US-LMS-11 | T-03 | Thêm xác nhận nộp bài thành công | FE | 2h | Confirmation message |

### US-LMS-12 - Ghi nhận timestamp và Late
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-12 | T-01 | Lưu timestamp submit | BE | 3h | submitted-at |
| US-LMS-12 | T-02 | Tính trạng thái Late/On Time | BE | 4h | Status đúng |
| US-LMS-12 | T-03 | Hiển thị badge Late trên UI | FE | 2h | Trạng thái muộn rõ ràng |

### US-LMS-13 - Submit lại trước Deadline
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-13 | T-01 | Kiểm tra quy tắc resubmission | BE | 3h | Rule cho phép submit lại |
| US-LMS-13 | T-02 | Cho phép resubmit trước deadline | FE/BE | 4h | Submit lại hợp lệ |
| US-LMS-13 | T-03 | Chặn resubmit nếu không được phép | BE/QA | 3h | Reject với message rõ ràng |

---

## EP5 - Assessment, Grade và Feedback

### US-LMS-14 - Instructor xem Submission
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-14 | T-01 | Xây dựng danh sách submission của instructor | FE | 4h | List submissions |
| US-LMS-14 | T-02 | Phân loại submitted và not submitted | FE/BE | 3h | Trạng thái rõ ràng |
| US-LMS-14 | T-03 | Kiểm tra quyền xem theo course scope | BE | 4h | Chỉ xem dữ liệu được phép |

### US-LMS-15 - Instructor Grade và Feedback
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-15 | T-01 | Xây dựng form chấm điểm và feedback | FE | 4h | Form grade/comment |
| US-LMS-15 | T-02 | Lưu grade và feedback vào backend | BE | 5h | API lưu kết quả |
| US-LMS-15 | T-03 | Hiển thị kết quả đã chấm ở detail | FE/BE | 3h | Grade + feedback hiển thị |

### US-LMS-16 - Learner xem Grade và Feedback
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-16 | T-01 | Xây dựng màn hình xem điểm và feedback | FE | 3h | UI results |
| US-LMS-16 | T-02 | Chặn xem submission của người khác | BE | 4h | Không truy cập sai người |
| US-LMS-16 | T-03 | Hiển thị trạng thái đã chấm | FE/BE | 2h | Grade status rõ ràng |

---

## EP6 - Reviewer Workflow

### US-LMS-17 - Phân công Reviewer
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-17 | T-01 | Xây dựng giao diện assign reviewer | FE | 3h | Chọn reviewer |
| US-LMS-17 | T-02 | Triển khai API assign reviewer | BE | 4h | Lưu reviewer cho submission |
| US-LMS-17 | T-03 | Chỉ Instructor/Admin mới được assign | BE | 3h | Quyền rõ ràng |

### US-LMS-18 - Reviewer xem Submission được phân công
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-18 | T-01 | Xây dựng dashboard reviewer | FE | 3h | Danh sách submission được assign |
| US-LMS-18 | T-02 | Triển khai query reviewer-only | BE | 4h | Chỉ trả về submission đúng reviewer |
| US-LMS-18 | T-03 | Chặn truy cập không được assign | BE | 3h | Permission denied |

### US-LMS-19 - Reviewer Grade và Feedback
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-19 | T-01 | Xây dựng form review | FE | 4h | Form chấm review |
| US-LMS-19 | T-02 | Lưu review result vào backend | BE | 5h | Grade + feedback của reviewer |
| US-LMS-19 | T-03 | Chỉ reviewer được assign mới lưu được | BE | 3h | Kiểm soát quyền chấm |

---

## EP7 - Course và System Administration

### US-LMS-20 - Instructor quản lý Course
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-20 | T-01 | Xây dựng form tạo/chỉnh sửa Course | FE | 4h | Form CRUD course |
| US-LMS-20 | T-02 | Triển khai API CRUD Course | BE | 5h | Create/update/delete course |
| US-LMS-20 | T-03 | Kiểm tra quyền sở hữu course | BE | 3h | Chặn sửa ngoài scope |

### US-LMS-21 - Instructor quản lý Lesson
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-21 | T-01 | Xây dựng quản lý Lesson UI | FE | 4h | Add/edit lesson |
| US-LMS-21 | T-02 | Triển khai CRUD Lesson API | BE | 5h | Lesson create/update/delete |
| US-LMS-21 | T-03 | Kiểm tra authorization theo course | BE | 3h | Không sửa lesson ngoài scope |

### US-LMS-22 - Instructor quản lý Assignment
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-22 | T-01 | Xây dựng form tạo/chỉnh sửa Assignment | FE | 4h | Form assignment |
| US-LMS-22 | T-02 | Triển khai CRUD Assignment API | BE | 5h | Assignment create/update/delete |
| US-LMS-22 | T-03 | Validate deadline và cấu hình bắt buộc | BE/QA | 3h | Rule hợp lệ |

### US-LMS-23 - Admin quản lý User và Role
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-23 | T-01 | Xây dựng màn hình quản lý User và Role | FE | 4h | Admin panel |
| US-LMS-23 | T-02 | Triển khai API cập nhật User/Role | BE | 5h | Update role cho user |
| US-LMS-23 | T-03 | Chỉ Admin mới được truy cập | BE | 3h | Truy cập bị chặn nếu không phải Admin |

### US-LMS-24 - Admin quản lý Course và dữ liệu vận hành
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-24 | T-01 | Xác định phạm vi dữ liệu admin quản lý | BE | 3h | Scope rõ ràng |
| US-LMS-24 | T-02 | Xây dựng màn hình quản trị dữ liệu | FE | 4h | UI admin |
| US-LMS-24 | T-03 | Lưu dữ liệu admin theo authorization | BE | 4h | API lưu dữ liệu đúng scope |

---

## EP8 - Grounded AI Tutor

### US-LMS-25 - Đặt câu hỏi cho AI Tutor
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-25 | T-01 | Xây dựng trigger AI Tutor trong Lesson Detail | FE | 3h | Nút mở tutor từ lesson |
| US-LMS-25 | T-02 | Thêm validation input câu hỏi rỗng | FE | 2h | Không gửi câu hỏi trống |
| US-LMS-25 | T-03 | Gửi câu hỏi kèm context của lesson | FE/BE | 5h | Request có context + loading state |

### US-LMS-26 - Trả lời theo Course/Lesson context
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-26 | T-01 | Xây dựng schema phản hồi grounded | BE | 3h | Contract answer + source + status |
| US-LMS-26 | T-02 | Tạo service truy xuất context từ course/lesson | BE | 5h | Context liên quan đúng bài |
| US-LMS-26 | T-03 | Triển khai sinh câu trả lời dựa trên lesson context | BE | 6h | Trả lời không suy đoán |

### US-LMS-27 - Giải thích hoặc đưa ví dụ liên quan
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-27 | T-01 | Triển khai logic giải thích đơn giản hơn | BE | 4h | Câu trả lời dễ hiểu hơn |
| US-LMS-27 | T-02 | Tạo ví dụ liên quan dựa trên bài học | BE | 5h | Ví dụ grounded trong lesson |
| US-LMS-27 | T-03 | Hiển thị giải thích và ví dụ kèm source | FE | 3h | UI hiển thị answer + source |

### US-LMS-28 - Báo thiếu dữ liệu, không suy đoán
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-28 | T-01 | Kiểm tra thiếu context trước khi trả lời | BE | 4h | Không trả lời khi thiếu dữ liệu |
| US-LMS-28 | T-02 | Hiển thị “KHÔNG ĐỦ DỮ LIỆU” | FE/BE | 3h | Message rõ ràng |
| US-LMS-28 | T-03 | Thêm test hồi quy cho rule không suy đoán | QA/BE | 3h | Test negative case |


### US-LMS-29 - Dữ liệu học tập nhất quán
| Story | Task | Title | Owner | Est | Expected output |
|---|---|---|---|---:|---|
| US-LMS-29 | T-01 | Xác định rule nhất quán dữ liệu | BE | 4h | Rule consistency |
| US-LMS-29 | T-02 | Triển khai cập nhật dữ liệu nhất quán | BE | 6h | Không lưu trạng thái chồng chéo |
| US-LMS-29 | T-03 | Thêm test rollback và consistency | QA/BE | 3h | Test partial failure |

---

## Status board chuẩn
- New
- Ready
- In Progress
- Review
- QA
- Done

## Quy tắc Done
- Story chỉ Done khi AC pass
- Đã có evidence/test
- Không còn blocker
- Tất cả task liên quan đã hoàn thành