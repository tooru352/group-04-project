# Hệ thống thiết kế AI LMS

## Phạm vi và nguồn chuẩn

Tài liệu này là tài liệu bàn giao triển khai cho prototype Orbit LMS. Tài liệu định nghĩa token, hợp đồng component, quy tắc responsive và kiểm tra accessibility được dùng bởi các màn hình trong `screen-inventory.md`.

Hành vi đã xác nhận lấy từ requirements và business rules được các tài liệu sản phẩm tham chiếu. Các giá trị hình ảnh là quyết định thiết kế cho MVP, không tạo thêm requirement sản phẩm.

## Cấu trúc file Figma

- `Foundations`: token, thang kiểu chữ, khoảng cách, độ nổi và kiểm tra accessibility.
- `Components`: bộ component tái sử dụng và các biến thể trạng thái.
- `Flows`: frame desktop/mobile S01-S15 và ví dụ cho các trạng thái bắt buộc.
- `Handoff`: mapping story, node ID, phạm vi responsive và trạng thái QA.

## Tokens

### Màu sắc

| Token             | Giá trị   | Mục đích                               | Quy tắc accessibility                                                                                   |
| ----------------- | --------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `color.ink`       | `#18212F` | Chữ chính và control cần nhấn mạnh     | Dùng cho chữ trên `color.surface` và `color.canvas`.                                                    |
| `color.muted`     | `#6B7482` | Metadata và chữ hỗ trợ                 | Chỉ dùng ở cỡ caption/chữ hỗ trợ sau khi kiểm tra tương phản.                                           |
| `color.line`      | `#E3E7ED` | Viền và đường phân cách                | Không dùng làm tín hiệu trạng thái duy nhất.                                                            |
| `color.canvas`    | `#F7F8FA` | Nền ứng dụng                           | Kết hợp chữ `color.ink`.                                                                                |
| `color.surface`   | `#FFFFFF` | Card, panel và input                   | Bề mặt đọc nội dung mặc định.                                                                           |
| `color.navy`      | `#17253A` | Sidebar và khung workspace             | Dùng chữ sáng và kiểm tra tương phản trên frame cuối.                                                   |
| `color.teal`      | `#0D7770` | Progress, thành công và hành động học  | Kết hợp nhãn chữ hoặc icon trạng thái.                                                                  |
| `color.tealSoft`  | `#DFF3EF` | Nền thành công                         | Dùng `color.ink` để chữ dễ đọc.                                                                         |
| `color.coral`     | `#E86D52` | Hành động cần chú ý và màu thương hiệu | Không dùng làm chữ nhỏ trên nền trắng; dùng cho button, icon hoặc nhãn lớn sau khi kiểm tra tương phản. |
| `color.coralSoft` | `#FFF0EB` | Nền lỗi/cần chú ý                      | Dùng `color.ink` cùng icon hoặc nhãn lỗi.                                                               |
| `color.gold`      | `#E4AA43` | Trạng thái sắp đến hạn và cảnh báo     | Không dùng màu đơn lẻ; kết hợp chữ `color.ink` và nhãn/icon cảnh báo.                                   |
| `color.goldSoft`  | `#FFF5DC` | Nền cảnh báo                           | Dùng `color.ink` để chữ dễ đọc.                                                                         |

### Kiểu chữ

| Token             | Giá trị         | Mục đích                                    |
| ----------------- | --------------- | ------------------------------------------- |
| `font.display`    | `Space Grotesk` | Tiêu đề trang, thương hiệu và số liệu chính |
| `font.body`       | `DM Sans`       | Nội dung, nhãn, control và chữ hỗ trợ       |
| `type.display-xl` | `42/46`, 700    | Tiêu đề trang trên desktop                  |
| `type.display-lg` | `32/36`, 700    | Tiêu đề trang trên mobile                   |
| `type.heading-md` | `25/30`, 700    | Tiêu đề section                             |
| `type.heading-sm` | `18/24`, 700    | Tiêu đề card                                |
| `type.body`       | `15/23`, 400    | Chữ nội dung                                |
| `type.caption`    | `12/18`, 600    | Metadata và nhãn trạng thái                 |

### Khoảng cách, bo góc và độ nổi

| Token               | Giá trị                                 |
| ------------------- | --------------------------------------- |
| `space.1`-`space.8` | `4 / 8 / 12 / 16 / 20 / 24 / 32 / 42px` |
| `radius.sm`         | `7px`                                   |
| `radius.md`         | `10px`                                  |
| `radius.pill`       | `999px`                                 |
| `shadow.card`       | `0 5px 22px rgba(24, 33, 47, .03)`      |
| `shadow.floating`   | `0 18px 50px rgba(24, 33, 47, .09)`     |

## Hợp đồng component

| ID  | Component          | Biến thể/trạng thái                                                               | Hành vi bắt buộc                                                               |
| --- | ------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| C01 | Button             | primary, coral, ghost; default, hover, focus, disabled, loading                   | Dùng một động từ rõ; khi tải phải ngăn thao tác trùng và thông báo tiến trình. |
| C02 | Input              | text, textarea; default, focus, error, disabled                                   | Có nhãn luôn hiển thị, chữ hỗ trợ/lỗi; giữ dữ liệu khi lỗi.                    |
| C03 | VoiceControl       | idle, listening, processing, stopped, disabled, error                             | Hiển thị chữ trạng thái; Stop/Escape dừng nghe; vẫn cho phép nhập chữ.         |
| C04 | Card               | default, interactive, selected, disabled, loading, error                          | Kích thước ổn định; trạng thái thể hiện bằng chữ và màu/icon.                  |
| C05 | ModalConfirm       | default, loading, error, cancel, confirm                                          | Nêu hệ quả trước; khóa focus trong modal; Enter xác nhận; Escape hủy.          |
| C06 | Toast              | success, error, warning, info, loading                                            | Hiển thị gần thao tác; thao tác khôi phục dùng được bằng bàn phím.             |
| C07 | StateBlock         | empty, loading, error, permission denied, incomplete, success                     | Giải thích trạng thái và đưa ra bước tiếp theo hữu ích.                        |
| C08 | Badge and Progress | enrolled, submitted, late, graded, feedback available; 0%, in progress, completed | Luôn có nhãn trạng thái dễ đọc; progress có chữ và phần trăm.                  |

## Quy tắc responsive

- Desktop: `>= 1024px`; 244px sidebar, content max-width 1220px, two-column detail layouts.
- Tablet: `768-1023px`; giữ điều hướng, giảm padding nội dung còn 28px và xếp nội dung phụ dưới nội dung chính.
- Mobile: `< 768px`; điều hướng đầu trang gọn, card một cột, CTA chính rộng toàn khung và vùng chạm tối thiểu `44x44px`.
- Giữ deadline, tiến độ, trạng thái, lỗi và thao tác khôi phục ở mọi breakpoint.
- Trên mobile, thao tác trong modal xếp dọc; thao tác xác nhận hoặc hủy có tác động lớn đặt cuối.
- Không để trạng thái tải, kiểm tra dữ liệu hoặc nội dung trạng thái làm control đổi kích thước hay chồng lấn.

## Tiêu chí accessibility

- Mỗi input có nhãn luôn hiển thị; placeholder không thay thế cho nhãn.
- Thứ tự bàn phím đi theo thứ tự đọc bằng mắt. Mọi control có thao tác đều dùng được bằng phím và có outline focus 2px rõ ràng.
- Focus phải dùng `color.teal` hoặc `color.coral` cùng một dấu hiệu không phụ thuộc màu như outline, chữ hoặc icon.
- Chữ và control phải đạt tương phản WCAG AA trên frame Figma cuối. Kiểm tra cả chữ, focus và tổ hợp trạng thái, không chỉ bảng màu gốc.
- Ý nghĩa trạng thái không phụ thuộc màu đơn lẻ: dùng nhãn, icon hoặc chữ hỗ trợ.
- Nội dung lỗi nêu vấn đề, giữ dữ liệu đã nhập và đưa ra cách sửa hoặc thử lại.
- Trạng thái voice được thông báo bằng `Listening...`, `Processing...`, `Stopped` hoặc lỗi có hướng xử lý.
- Xác nhận Submit Assignment và các thao tác có hệ quả trước khi ghi nhận.

## Bảng kiểm tương phản và tương tác

| Hạng mục          | Cách kiểm tra                                      | Tiêu chí đạt                                                  | Phạm vi kiểm tra                                   |
| ----------------- | -------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| Chữ nội dung      | Dùng công cụ đo tương phản trên frame Figma        | Đạt WCAG AA cho chữ thường                                    | `color.ink` trên `color.surface` và `color.canvas` |
| Chữ phụ/caption   | Đo từng tổ hợp thực tế, không suy ra từ token      | Đạt WCAG AA hoặc đổi sang token đậm hơn                       | Metadata, helper text, badge                       |
| Button và control | Đo chữ/nền và trạng thái focus                     | Chữ đọc được ở default, hover, disabled và loading            | C01, C02, C05                                      |
| Trạng thái        | Kiểm tra khi bỏ màu khỏi màn hình                  | Vẫn hiểu được nhờ nhãn, icon hoặc chữ                         | C06, C07, C08                                      |
| Focus bàn phím    | Dùng Tab, Shift+Tab, Enter và Escape               | Thứ tự hợp lý, focus luôn nhìn thấy, modal không thoát focus  | Tất cả frame có thao tác                           |
| Nhãn và lỗi       | Kiểm tra label, `aria-describedby` và nội dung lỗi | Label không phụ thuộc placeholder; lỗi nêu vấn đề và cách sửa | Login, Submit, Grading, AI Tutor                   |
| Vùng chạm         | Đo kích thước control trên frame mobile            | Tối thiểu `44x44px`                                           | Button, VoiceControl, icon action                  |

## Quy tắc bàn giao

Chỉ đánh dấu frame là `Ready for dev` sau khi đã kiểm tra phạm vi desktop/mobile, trạng thái bắt buộc, thao tác bàn phím/focus, tương phản, vùng chạm 44px và mapping story trong `screen-inventory.md`. Các Figma child-node ID chưa biết phải giữ rõ là `TBD`; chỉ thay thế sau khi export component cuối cùng, không tự đoán.
