# Báo cáo Đánh giá & Chỉ số Sử dụng AI (Retrospective / AI Metrics)

> **Mục đích & Chức năng của file me này:** Đây là tài liệu tổng kết quy trình làm việc và đánh giá hiệu quả sử dụng AI trong dự án. Tệp ghi lại các chỉ số đo lường chất lượng, những việc AI làm tốt, các lỗi do AI tạo ra (kèm bằng chứng đối chiếu và cách khắc phục), bài học kinh nghiệm thu được và kết luận về việc kiểm soát chất lượng phần mềm khi ứng dụng AI.

---

## 1. Bảng chỉ số đánh giá hiệu quả AI (AI Metrics Summary)

| Chỉ số (Metric) | Kết quả thực tế | Ý nghĩa & Đánh giá |
| --- | --- | --- |
| Traceability từ Yêu cầu đến Story | 30/30 stories được ánh xạ hoàn toàn tới yêu cầu và bằng chứng code | Không còn phạm vi mơ hồ; mọi story đều có nguồn chứng minh rõ ràng |
| Kiểm thử tự động E2E / Regression | 202/202 tests PASSED (`python -m pytest tests -v`) | Hệ thống đạt mức regression kiểm soát tốt và có bằng chứng thực tế |
| An toàn lệnh & Quy tắc nghiệp vụ | 0 quy tắc sai được chấp nhận sau kiểm duyệt | Output của AI phải được đối chiếu trước khi dùng làm source-of-truth |
| Lỗi do AI phát hiện trước khi merge | 6 vấn đề lớn được phát hiện và sửa chữa kịp thời | Đội ngũ duy trì quality gate bằng review thủ công và test tự động |
| Thời gian hỗ trợ từ AI | Tốc độ soạn thảo tài liệu và lập matrix tăng đáng kể | AI giúp tăng tốc chuẩn hóa tài liệu nhưng không thay thế kiểm thử con người |

---

## 2. Những việc AI hỗ trợ tốt (What AI did well)

- Hỗ trợ nhanh chóng trong việc tổng hợp yêu cầu, danh mục nhiệm vụ (task catalog) và bản phác thảo traceability matrix.
- Rút ngắn đáng kể thời gian viết tài liệu kỹ thuật và chuẩn hóa định dạng báo cáo.
- Tạo nhanh các khung template chuẩn như `README`, `RUNBOOK`, `RELEASE`, `CHANGELOG`, `TRACEABILITY`, `AI_USAGE_LOG`.
- Tự động tạo và thực thi các kịch bản kiểm thử tự động quy mô lớn (202 test cases).

---

## 3. Các sai sót của AI được phát hiện kèm bằng chứng (AI mistakes identified)

| STT | Sai sót của AI | Bằng chứng cụ thể (Evidence) | Cách kiểm chứng & Sửa chữa |
| --- | --- | --- | --- |
| 1 | AI đề xuất “Bài nộp sau deadline phải bị hệ thống từ chối hoàn toàn” | `docs/02-vault/source-priority.md`, `docs/08-quality/bug-log.md` | Đối chiếu với requirement chuẩn: Nhóm xác nhận nộp muộn vẫn được chấp nhận và chỉ đánh dấu mác `Is Late`. |
| 2 | AI tự thêm phạm vi (scope) mới không có trong yêu cầu ban đầu | `docs/01-discovery/5.requirements.md`, `docs/03-product/taiga-backlog.md` | Theo quy tắc ưu tiên nguồn tin: Mọi tính năng mới phải có yêu cầu xác nhận; nếu không có phải loại bỏ hoặc ghi rõ là giả định. |
| 3 | AI tạo ma trận truy xuất (traceability) không khớp với code thực tế | `server/index.js`, `server/db.js`, `docs/05-technical/API.md` | Kiểm tra lại các endpoint API thực tế và DB schema, sau đó cập nhật lại ma trận cho khớp 100% với mã nguồn. |
| 4 | AI viết tài liệu theo template chung chung, không sát dự án LMS thực tế | `README.md`, `RELEASE.md`, `CHANGELOG.md` | Chỉnh sửa lại toàn bộ tài liệu để phản ánh đúng các tính năng LMS: RBAC auth, khóa học, bài học, bài tập, chấm điểm và AI Tutor. |
| 5 | AI bỏ qua các trường hợp kiểm tra biên (Edge Cases) như chuỗi rỗng / khoảng trắng | `server/index.js` | Thêm hàm kiểm tra giá trị ngữ nghĩa (`hasMeaningfulText`) và thắt chặt validation trước khi lưu dữ liệu. |
| 6 | AI không tự động khôi phục dữ liệu mẫu sau khi chạy test nâng quyền user | `tests/test_backend_unit_tc001_tc084.py`, `tests/test_api_endpoints_tc085_tc125.py` | Thêm bước cleanup khôi phục vai trò `Learner` cho tài khoản mẫu ngay ở cuối bài test. |

---

## 4. Bài học kinh nghiệm (Lessons learned)

- **Nên tiếp tục (Keep):** Duy trì quy trình Story Spec + Quy tắc nguồn tin + Đánh giá mã nguồn của con người (Human review).
- **Cần cải thiện (Improve):** Bộ benchmark QA cần bổ sung thêm các case xung đột dữ liệu và case thực tế rõ ràng hơn.
- **Dừng lại (Stop):** Không để AI tự suy đoán thêm phạm vi hoặc quy tắc nghiệp vụ mới ngoài yêu cầu.
- **Thử nghiệm tiếp theo (Next):** Tích hợp kiểm thử tự động các kịch bản tương tác người dùng vào đường ống CI/CD.

---

## 5. Kết luận chung (Final takeaway)

AI là một công cụ tuyệt vời giúp tăng tốc độ phát triển phần mềm và tạo tài liệu, nhưng **không bao giờ được sử dụng làm nguồn sự thật duy nhất (source-of-truth)**. Trong dự án này, toàn bộ các sai sót của AI đều được phát hiện và xử lý triệt để thông qua việc đối chiếu với yêu cầu nghiệp vụ, kiểm thử tự động và rà soát mã nguồn thực tế. Điều này đảm bảo hệ thống đạt chất lượng cao nhất về tính đúng đắn, bảo mật và độ tin cậy.
