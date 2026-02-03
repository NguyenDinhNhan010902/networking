# PHẦN 1: HẠ TẦNG MẠNG (BÀI TẬP THỰC CHIẾN)

Đây là chuỗi bài tập giúp bạn "làm chủ" 3 lớp mạng đầu tiên. Mục tiêu là: **Tự làm hỏng mạng -> Phân tích lỗi -> Tự sửa lại**.

---

## BÀI TẬP 1: "CẮT CẦU RÚT VÁN" (Default Gateway)

**Mục tiêu**: Chứng minh rằng Lớp 2 (LAN) không cần Gateway, nhưng Lớp 3 (Internet) thì bắt buộc.

### Các bước thực hiện
1.  **Chuẩn bị Laptop A**:
    *   Vào cài đặt mạng IPv4.
    *   Set IP tĩnh: `192.168.1.50` (hoặc số khác trong dải).
    *   Subnet mask: `255.255.255.0`.
    *   **Default Gateway: XÓA TRẮNG (ĐỂ TRỐNG)**.
    *   Lưu lại.

2.  **Kiểm tra Lớp 2 (Nội bộ)**:
    *   Ping tới Laptop B (ví dụ `192.168.1.11`).
    *   Ping tới Router (`192.168.1.1`).
    *   **Dự đoán**: Thành công (Reply). Vì cùng "xóm" (Layer 2), nói chuyện trực tiếp bằng MAC, không cần Gateway.

3.  **Kiểm tra Lớp 3 (Internet)**:
    *   **Dự đoán**: Thất bại. Có thể báo `General failure` hoặc `Destination host unreachable`.

### Phân tích lỗi: "Destination Host Unreachable"
Trong bài thực hành của bạn, bạn đã thấy dòng lỗi:
`Reply from 192.168.1.206: Destination host unreachable.`

*   **Người báo lỗi**: `192.168.1.206` (Chính là Laptop A).
*   **Ý nghĩa**: "Tôi (Laptop A) đã cố gửi đi, nhưng tôi nhận ra là không có đường nào để đến đích cả".
*   **Tại sao**:
    *   Laptop A thấy `8.8.8.8` là người lạ (khác Subnet).
    *   Quy tắc là phải gửi cho Gateway.
    *   Nhưng ô Gateway đang **ĐỂ TRỐNG**.
    *   -> Laptop A bế tắc và tự báo lỗi ngược lại cho chính mình.

*(Lưu ý: Một số trường hợp khác máy có thể báo `General failure` - Lỗi tổng quát, cũng mang ý nghĩa tương tự là không gửi được tin đi).*

---

## BÀI TẬP 2: "BỨC TƯỜNG LỬA" (Troubleshooting Firewall)

**Mục tiêu**: Phân biệt lỗi "Không thấy đường" và lỗi "Bị ghẻ lạnh".

### Tình huống
Bạn Ping Laptop B, nhưng nhận được: `Request timed out`.

### Phân tích lỗi chuyên sâu
*   **Lúc nãy (Bài 1)**:: `General failure` -> Lỗi do mình (không biết đường).
*   **Bây giờ**: `Request timed out` -> Lỗi do bên kia (hoặc đường đi).
    *   Nghĩa là: Gói tin đã gửi đi được. Đã đến cửa nhà Laptop B.
    *   Nhưng Laptop B **im lặng** không trả lời.

### Nguyên nhân & Cách sửa
1.  **Laptop B đổi IP**: Kiểm tra lại `ipconfig` trên máy B.
2.  **Windows Firewall**: Đây là "kẻ thù" số 1. Mặc định Windows chặn Ping từ người lạ.
    *   **Hành động**: Tắt Firewall trên cả 2 máy (Mục Public và Private).
    *   **Kết quả**: Ping lại sẽ thấy `Reply from ... time=5ms`.

---

## BÀI TẬP 3: BIÊN GIỚI MẠNG (Subnet Mask)

**Mục tiêu**: Hiểu quyền lực của Subnet Mask - "Hàng rào" quy định ai là người nhà.

### Thực hành: "Chia rẽ nội bộ"
1.  **Laptop B**: Giữ nguyên (`192.168.1.207` / `255.255.255.0`). -> Xóm 1.
2.  **Laptop A**: Đổi IP sang "xóm khác": `192.168.2.206`. Giữ nguyên Mask `255.255.255.0`.
3.  **Hành động**: Từ Laptop A, Ping Laptop B (`ping 192.168.1.207`).

### Kết quả & Giải thích
*   **Kết quả**: `General failure`.
*   **Tại sao?**: Dù 2 máy cắm chung 1 cục Router, chung 1 Switch, ngồi cạnh nhau. Nhưng **Subnet Mask** bảo rằng:
    *   Laptop A ở xóm `192.168.2`.
    *   Laptop B ở xóm `192.168.1`.
    *   -> Khác xóm = Người dưng.
    *   Laptop A sẽ **không thèm** nói chuyện trực tiếp (Layer 2) với Laptop B nữa, mà sẽ cố tìm Gateway để đi đường vòng (nhưng Gateway cũng không giúp được trong ca này nếu không cấu hình Routing).

---

## BÀI TẬP 4: KHÔI PHỤC HIỆN TRƯỜNG & NETSTAT CƠ BẢN

Trước khi sang phần sau, hãy trả lại IP động cho Laptop A (`Obtain automatically`).

### Làm quen công cụ `arp -a`
Để kiểm chứng ai đang nói chuyện với ai ở Lớp 2.
1.  Ping Laptop B.
2.  Gõ `arp -a`.
3.  Bạn sẽ thấy: `IP Laptop B` đi kèm với `MAC Laptop B`. -> Chứng tỏ 2 máy nói chuyện trực tiếp.

4.  Ping Google (`8.8.8.8`).
5.  Gõ `arp -a`.
6.  Bạn **KHÔNG** thấy dòng 8.8.8.8 nào cả.
    *   **Lý do**: Bạn không bao giờ nói chuyện trực tiếp với Google. Bạn chỉ nói chuyện với Router (Gateway). Nên bạn chỉ thấy MAC của Router mà thôi.
