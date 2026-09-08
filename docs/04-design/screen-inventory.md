# Danh sách màn hình và ma trận trạng thái

## Danh sách màn hình

| ID  | Màn hình / frame            | Vai trò               | Story chính                                | Component chính                               | Figma frame ID |
| --- | --------------------------- | --------------------- | ------------------------------------------ | --------------------------------------------- | -------------- |
| S01 | Login                       | Tất cả vai trò        | US-LMS-01, US-LMS-02                       | Chọn vai trò, Button, Input, trạng thái lỗi   | `10:6`         |
| S02 | Learner Dashboard           | Learner               | US-LMS-08                                  | Thẻ số liệu, Progress, thẻ Course, Toast      | `10:7`         |
| S03 | Course List                 | Learner               | US-LMS-04                                  | Thẻ Course, trạng thái rỗng, Button           | `10:8`         |
| S04 | Course Detail               | Learner               | US-LMS-05, US-LMS-08, US-LMS-09            | Badge, Progress, danh sách Lesson, Assignment | `10:9`         |
| S05 | Lesson Detail               | Learner               | US-LMS-06, US-LMS-07                       | Thẻ nội dung, Progress, Button, AI Tutor      | `10:10`        |
| S06 | Assignment Detail           | Learner               | US-LMS-10, US-LMS-13                       | Thẻ yêu cầu, Input, Deadline, Button          | `10:11`        |
| S07 | Submit Assignment           | Learner               | US-LMS-11, US-LMS-12                       | Textarea, ModalConfirm, Button                | `10:12`        |
| S08 | Submission Result           | Learner               | US-LMS-12, US-LMS-16                       | Badge trạng thái, Toast, thẻ Feedback         | `10:13`        |
| S09 | Instructor Dashboard        | Instructor            | US-LMS-14                                  | Thẻ số liệu, danh sách Submission, Badge      | `10:14`        |
| S10 | Submission Review / Grading | Instructor / Reviewer | US-LMS-15, US-LMS-18                       | Input, Textarea, Button, trạng thái lỗi       | `10:15`        |
| S11 | Feedback                    | Learner / Instructor  | US-LMS-15, US-LMS-16                       | Thẻ Feedback, Grade, StateBlock               | `10:16`        |
| S12 | AI Tutor                    | Learner               | US-LMS-22, US-LMS-23, US-LMS-24, US-LMS-25 | VoiceControl, Chat, nhãn nguồn, StateBlock    | `10:17`        |
| S13 | Reviewer Dashboard          | Reviewer              | US-LMS-17, US-LMS-18                       | Hàng đợi review, Badge, trạng thái rỗng       | `10:18`        |
| S14 | Admin Console               | Admin                 | US-LMS-26, US-LMS-27                       | Tab, danh sách/bảng, trạng thái quyền         | `10:19`        |
| S15 | State Lab                   | QA / Reviewer         | NFR-LMS-06                                 | StateBlock, Toast, ModalConfirm               | `10:20`        |

## Ma trận trạng thái

| Trạng thái              | Áp dụng cho                         | Hành vi bắt buộc                                  | Khôi phục / bước tiếp theo                    |
| ----------------------- | ----------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| Mặc định                | Tất cả màn hình                     | Nội dung sẵn sàng; chỉ có một CTA chính rõ ràng   | Tiếp tục luồng                                |
| Đang tải                | Dashboard, Course List, AI Tutor    | Hiển thị tiến trình, giữ bố cục ổn định           | Chờ; cho phép Retry nếu tải lỗi               |
| Rỗng                    | Course List, Reviewer Dashboard     | Giải thích không có kết quả và lý do              | Xem danh sách hoặc điều chỉnh nguồn           |
| Lỗi                     | Login, Submit, Grading, tải dữ liệu | Nêu lỗi và giữ dữ liệu đã nhập                    | Thử lại hoặc sửa trường                       |
| Từ chối quyền           | Course Detail, Lesson, Submission   | Nêu giới hạn truy cập, không lộ nội dung          | Enroll, quay lại hoặc liên hệ người phụ trách |
| Chưa hoàn thành         | Lesson, Assignment, Course          | Hiển thị phần việc còn lại                        | Mở mục bắt buộc tiếp theo                     |
| Đã nộp                  | Submission Result                   | Hiển thị trạng thái, timestamp và đang chờ chấm   | Xem Course hoặc nộp lại nếu policy cho phép   |
| Late submission         | Submission Result                   | Hiển thị chữ Late, timestamp và cảnh báo          | Xem kết quả; không ngụ ý có thể hoàn tác      |
| Đã chấm điểm            | Submission Result, Review           | Hiển thị điểm số và trạng thái                    | Mở Feedback                                   |
| Feedback available      | Submission Result, Feedback         | Attach feedback to the exact submission           | Review feedback and next step                 |
| AI Tutor đang xử lý     | AI Tutor                            | Hiển thị `Processing...`; ngăn gửi trùng          | Dừng hoặc chờ phản hồi                        |
| AI Tutor trả lời        | AI Tutor                            | Trả lời trong ngữ cảnh Lesson và hiện nguồn       | Hỏi tiếp                                      |
| AI Tutor thiếu dữ liệu  | AI Tutor                            | Hiển thị chính xác `KHÔNG ĐỦ DỮ LIỆU`, không đoán | Hỏi về Lesson hiện tại                        |
| Xác nhận (Confirmation) | Submit Assignment                   | Nêu hệ quả cùng Cancel và Confirm                 | Hủy hoặc xác nhận                             |
| Thành công              | Enroll, Complete, Submit, Save      | Xác nhận kết quả gần thao tác vừa thực hiện       | Tiếp tục đến màn hình liên quan               |
| Voice chờ               | AI Tutor                            | Hiển thị thao tác microphone và `Ready to listen` | Bắt đầu nghe                                  |
| Voice đang nghe         | AI Tutor                            | Hiển thị `Listening...` và thao tác Stop          | Dừng hoặc hoàn tất câu nói                    |
| Voice lỗi (Voice error) | AI Tutor                            | Giải thích lỗi microphone                         | Thử lại hoặc nhập câu hỏi                     |

## Liên kết frame và component

Các trường dưới đây được chuẩn bị để đồng bộ MCP/Figma. Thay `TBD` sau khi plugin Figma tạo xong file:

## Mapping node được MCP tạo

Gói MCP đã tạo các frame có cấu trúc sau trên `Page 1` hiện tại của Figma:

| Khu vực     | Figma node ID | Nội dung                            |
| ----------- | ------------- | ----------------------------------- |
| Foundations | `10:2`        | Token và tóm tắt accessibility      |
| Components  | `10:3`        | Frame trạng thái component C01-C08  |
| Flows       | `10:4`        | Frame màn hình S01-S15              |
| Handoff     | `10:5`        | Tóm tắt nguồn, story và bàn giao QA |

| Screen                          | Figma node ID |
| ------------------------------- | ------------- |
| S01 Login                       | `10:6`        |
| S02 Learner Dashboard           | `10:7`        |
| S03 Course List                 | `10:8`        |
| S01 Login / High Fidelity       | `11:3`        |
| S04 Course Detail               | `10:9`        |
| S05 Lesson Detail               | `10:10`       |
| S06 Assignment Detail           | `10:11`       |
| S07 Submit Assignment           | `10:12`       |
| S08 Submission Result           | `10:13`       |
| S09 Instructor Dashboard        | `10:14`       |
| S10 Submission Review / Grading | `10:15`       |
| S11 Feedback                    | `10:16`       |
| S12 AI Tutor                    | `10:17`       |
| S13 Reviewer Dashboard          | `10:18`       |
| S14 Admin Console               | `10:19`       |
| S15 State Lab                   | `10:20`       |

| Thành phẩm                  | User story / tham chiếu QA                 | Figma node ID | Figma URL |
| --------------------------- | ------------------------------------------ | ------------- | --------- |
| Frame `S01-S15`             | Mapping story ở trên                       | `10:4`        | `TBD`     |
| Bộ component `Button`       | Tất cả story có CTA                        | `10:3`        | `TBD`     |
| Bộ component `Input`        | US-LMS-01, US-LMS-11, US-LMS-15            | `10:3`        | `TBD`     |
| Bộ component `VoiceControl` | US-LMS-22, US-LMS-23                       | `10:3`        | `TBD`     |
| Bộ component `ModalConfirm` | US-LMS-11                                  | `10:3`        | `TBD`     |
| Bộ component `Toast`        | US-LMS-05, US-LMS-07, US-LMS-11, US-LMS-15 | `10:3`        | `TBD`     |
| Bộ component `StateBlock`   | NFR-LMS-06 và State Lab                    | `10:3`        | `TBD`     |

`10:3` là node cha của page Components. Child-node ID riêng của từng component và Figma URL đầy đủ chưa có trong workspace, nên giữ `TBD` để tránh ghi sai liên kết.

## Trường theo dõi bàn giao

| Thành phẩm  | Page          | Desktop frame ID | Mobile frame ID     | Component IDs | Trạng thái                       |
| ----------- | ------------- | ---------------- | ------------------- | ------------- | -------------------------------- |
| Foundations | `Foundations` | `10:2`           | Theo rule `< 768px` | `10:2`        | Đã có node cha                   |
| Components  | `Components`  | `10:3`           | Theo rule `< 768px` | `10:3`        | Đã có node cha                   |
| Flows       | `Flows`       | `10:4`           | Theo rule `< 768px` | `10:4`        | Đã có node cha; screen ID đã map |
| Handoff     | `Handoff`     | `10:5`           | Theo rule `< 768px` | `10:5`        | Đã có node cha                   |

## Checklist nghiệm thu QA

- [ ] Mỗi màn hình có frame desktop và mobile, hoặc có quy tắc responsive rõ ràng.
- [ ] Mỗi trạng thái bắt buộc trong ma trận có frame hoặc biến thể component để kiểm tra.
- [ ] Đã kiểm tra thứ tự bàn phím, vòng focus và vùng chạm tối thiểu 44x44px.
- [ ] Chữ và ý nghĩa trạng thái không phụ thuộc vào màu đơn lẻ.
- [ ] Đã kiểm tra tương phản cho chữ, control và chỉ báo trạng thái.
- [ ] Mỗi frame và component liên kết đúng User Story và Figma node.
