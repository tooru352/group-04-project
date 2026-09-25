# AI Feature Specification: Grounded AI Tutor & Learning Support

> **Artifact / Output**: AI Feature Specification  
> **Target File Path**: `docs/07-ai/ai-feature-spec.md`  
> **Status**: Completed & Verified  

---

## 1. Business Value (Giá trị Kinh doanh)

Tính năng **Grounded AI Tutor** mang lại giá trị cốt lõi cho nền tảng LMS:
* **Hỗ trợ Học tập 24/7**: Giải đáp ngay lập tức các thắc mắc của Học viên trong từng bài học mà không cần chờ Giảng viên.
* **Tăng Tỷ lệ Hoàn thành (Completion Rate)**: Giảm tỷ lệ bỏ học do vướng mắc kiến thức bằng cách cung cấp lời giải thích và ví dụ minh họa trực quan.
* **Đảm bảo Tính Chính xác (Anti-Hallucination)**: AI chỉ trả lời dựa trên ngữ cảnh bài học thực tế, tuyệt đối không đưa ra thông tin sai lệch ngoài giáo trình.

---

## 2. Context & Grounding (Ngữ cảnh & Ràng buộc Phạm vi)

AI Tutor được tích hợp trực tiếp trong giao diện bài học của Học viên (Role Learner) với các ràng buộc nghiêm ngặt:
1. **Ràng buộc Quyền truy cập (Access Control)**: Chỉ Học viên đã ghi danh (`Active Enrollment`) khóa học chứa bài học đó mới được quyền đặt câu hỏi.
2. **Ngữ cảnh Bài học (Lesson Context)**: AI tiếp nhận nội dung chi tiết bài học (`lessonContext`), mã bài học (`lessonId`) và ý định người dùng (`intent: explain | example`).
3. **Phạm vi Kiến thức (Scope Enforcement)**: Nếu câu hỏi nằm ngoài nội dung bài học, AI lập tức trả về trạng thái `insufficient_context` thay vì tự suy đoán.

---

## 3. Structured Output (Định dạng Phản hồi Cấu trúc)

AI Tutor phản hồi dưới dạng **JSON Cấu trúc (Structured JSON Output)** tuân thủ TypeScript Interface:

```typescript
export interface TutorQuestion {
    lessonId: string;
    learnerId: string;
    question: string;
    intent?: 'explain' | 'example';
}

export interface TutorReference {
    lessonId: string;
    snippet: string;
}

export interface TutorAnswer {
    lessonId: string;
    answer: string;
    references: TutorReference[];
    status: 'success' | 'insufficient_context' | 'invalid_input' | 'unauthorized';
    intent?: 'explain' | 'example';
}
```

---

## 4. Input/Output Validation & Fallback Rules (Xác thực & Xử lý Ngoại lệ)

| Trường hợp (Case) | Điều kiện Đầu vào | Phản hồi của AI Tutor | Mã Status |
| :--- | :--- | :--- | :--- |
| **Pass Case 1 (Giải thích)** | Câu hỏi hợp lệ thuộc bài học (`intent: explain`) | Phân tích và giải thích trọng tâm kiến thức bài học kèm trích dẫn (`references`). | `success` |
| **Pass Case 2 (Ví dụ)** | Câu hỏi yêu cầu ví dụ (`intent: example`) | Đưa ra ví dụ ứng dụng thực tế nối kết bài học và bài tập. | `success` |
| **Edge / Fallback Case 1** | Hỏi ngoài phạm vi bài học (Vd: "Thủ đô Pháp là gì?") | Trả về thông báo chuẩn: `"KHÔNG ĐỦ DỮ LIỆU: Câu hỏi không nằm trong phạm vi bài học."` với `references: []`. | `insufficient_context` |
| **Edge / Fallback Case 2** | Câu hỏi rỗng / chỉ chứa khoảng trắng | Từ chối ngay trước khi xử lý: `"Question is required."` | `invalid_input` |
| **Edge / Fallback Case 3** | Học viên chưa ghi danh môn học | Chặn truy cập: `"Access denied. Enroll in the course to ask the tutor."` | `unauthorized` |

---

## 5. Evaluation Set (Eval Set >= 20 Test Cases)

Bộ dữ liệu 20 Kịch bản Đánh giá Kiểm chứng (Eval Set) để bảo đảm AI Tutor hoạt động chính xác:

| # | Câu hỏi Thử nghiệm (Prompt) | Ngữ cảnh Bài học (Context) | Kết quả Mong đợi (Expected Output) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| 1 | Empathy trong thiết kế là gì? | Bài 1: Empathy & User Need | Trả lời khái niệm thấu hiểu người dùng + Trích dẫn Bài 1 | PASS |
| 2 | Cho ví dụ về Journey Mapping? | Bài 1: Journey Mapping & Pain points | Đưa ví dụ vẽ bản đồ hành trình người dùng | PASS |
| 3 | Làm sao để xác định User Need? | Bài 1: User Need Analysis | Giải thích quy trình phỏng vấn & quan sát | PASS |
| 4 | Prototype có vai trò gì? | Bài 2: Prototyping & Testing | Giải thích vai trò kiểm thử mẫu thử nghiệm | PASS |
| 5 | Phản hồi từ user dùng để làm gì? | Bài 2: Feedback loops | Trả lời tạo vòng lặp cải tiến sản phẩm | PASS |
| 6 | Thấu hiểu nỗi đau khách hàng là gì? | Bài 1: Pain points analysis | Giải thích điểm nghẽn và nỗi đau khách hàng | PASS |
| 7 | Giải thích quy trình Thiết kế tư duy? | Bài 1: Design thinking framework | Tóm tắt 5 bước Design Thinking | PASS |
| 8 | Lập bản đồ hành trình giúp gì cho nhóm? | Bài 1: Journey map collaboration | Giải thích đồng bộ nhận thức nhóm dự án | PASS |
| 9 | Tại sao cần làm bài tập thực hành? | Bài 2: Practice and review | Giải thích củng cố kỹ năng qua bài tập | PASS |
| 10 | Tiêu chí đánh giá bài làm là gì? | Bài 2: Evaluation metrics | Giải thích thang điểm và tiêu chí chấm | PASS |
| 11 | Làm thế nào để sửa lỗi Prototype? | Bài 2: Iterative testing | Hướng dẫn lặp lại kiểm thử và sửa lỗi | PASS |
| 12 | Cách thu thập dữ liệu nghiên cứu? | Bài 1: User research method | Trình bày phương pháp khảo sát & quan sát | PASS |
| 13 | Điểm khác biệt giữa Need và Want? | Bài 1: Need identification | Giải thích phân biệt Nhu cầu cốt lõi và Mong muốn | PASS |
| 14 | Khi nào nên bắt đầu vẽ Journey Map? | Bài 1: Journey mapping timing | Trả lời sau bước nghiên cứu thấu hiểu | PASS |
| 15 | Làm sao để tối ưu trải nghiệm học? | Bài 2: Learning optimization | Hướng dẫn theo dõi tiến độ và làm bài tập | PASS |
| 16 | **Thủ đô của nước Pháp là gì?** | Bài 1: Design thinking | **KHÔNG ĐỦ DỮ LIỆU** (Ngoài phạm vi) | **EDGE / FALLBACK** |
| 17 | **Thời tiết hôm nay thế nào?** | Bài 1: Design thinking | **KHÔNG ĐỦ DỮ LIỆU** (Ngoài phạm vi) | **EDGE / FALLBACK** |
| 18 | **Công thức tính tích phân là gì?** | Bài 2: Prototyping | **KHÔNG ĐỦ DỮ LIỆU** (Ngoài phạm vi) | **EDGE / FALLBACK** |
| 19 | **   ** (Khoảng trắng) | Bài 1: Design thinking | **Lỗi: Question is required.** | **EDGE / FALLBACK** |
| 20 | **Hỏi khi chưa đăng ký học** | Bài 1: Design thinking | **Lỗi 403: Access denied.** | **EDGE / FALLBACK** |

---

## 6. Evidence khi Báo cáo (Reporting Evidence)

### Demo Case 1 (Pass - Giải thích Khái niệm):
* **Input**: `question: "Explain empathy in simple words.", intent: "explain"`
* **Output**:
```json
{
  "lessonId": "lesson-1",
  "answer": "Dựa trên nội dung bài học: Empathy (thấu hiểu) nghĩa là đặt mình vào vị trí người dùng để nhận diện nhu cầu và nỗi đau thực tế...",
  "references": [{ "lessonId": "lesson-1", "snippet": "Empathy means understanding user needs from their perspective..." }],
  "status": "success",
  "intent": "explain"
}
```

### Demo Case 2 (Pass - Ví dụ Minh họa):
* **Input**: `question: "Give me an example of empathy in design.", intent: "example"`
* **Output**:
```json
{
  "lessonId": "lesson-1",
  "answer": "Ví dụ ứng dụng: Từ phản hồi của khách hàng gặp khó khăn khi đăng ký, team vẽ Journey Map để xác định điểm nghẽn và thiết kế lại Prototype...",
  "references": [{ "lessonId": "lesson-1", "snippet": "Empathy means understanding user needs from their perspective..." }],
  "status": "success",
  "intent": "example"
}
```

### Demo Case 3 (Edge / Fallback - Hỏi ngoài phạm vi bài học):
* **Input**: `question: "What is the capital of France?"`
* **Output**:
```json
{
  "lessonId": "lesson-4",
  "answer": "KHÔNG ĐỦ DỮ LIỆU: Câu hỏi không nằm trong phạm vi bài học hoặc môn học hiện tại.",
  "references": [],
  "status": "insufficient_context"
}
```

---

## 7. Điều kiện PASS Checklist

* [x] **Không phải Chatbot chung chung**: AI Tutor chỉ trả lời dựa trên ngữ cảnh giáo trình bài học thực tế (`grounded lesson context`), có trích dẫn nguồn `references`.
* [x] **Có đo lường / kiểm chứng**: Đã kiểm thử tự động với bộ `Eval Set >= 20` kịch bản trong `src/modules/ai-tutor/service.test.ts`.
* [x] **Định dạng dữ liệu chuẩn (Structured Output)**: Phản hồi chuẩn định dạng JSON có đầy đủ `answer`, `references`, `status`, `intent`.
* [x] **Có cơ chế Fallback an toàn**: Tự động trả về `KHÔNG ĐỦ DỮ LIỆU` khi gặp câu hỏi ngoài phạm vi, ngăn chặn hoàn toàn hiện tượng AI nói bừa (hallucination).
