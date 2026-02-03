# THỰC HÀNH MẠNG: TỪ CƠ BẢN ĐẾN NÂNG CAO

Đây là chuỗi bài tập thực chiến giúp bạn hiểu sâu về cách hoạt động của mạng thông qua việc... tự làm hỏng nó rồi sửa lại.

> **Mục tiêu**: Thay vì học thuộc lòng, bạn sẽ học cách tư duy của người kỹ sư Troubleshooting (xử lý sự cố).

---

## BÀI TẬP 1: "CẮT CẦU RÚT VÁN" (Default Gateway)

**Mục tiêu**: Chứng minh rằng **Lớp 2 (LAN)** không cần Router/Gateway để hoạt động, nhưng **Lớp 3 (Internet)** thì bắt buộc phải có.

### 1. Thực hiện
1.  **Laptop A**: Set IP tĩnh `192.168.1.50`, Subnet `255.255.255.0`.
2.  **Quan trọng**: XÓA TRẮNG ô **Default Gateway**.
3.  **Ping thử**:
    - Ping Laptop B (cùng mạng): `ping 192.168.1.11` -> **Thành công**.
    - Ping Google (`8.8.8.8`): -> **Thất bại**.

::: details 💡 Bấm để xem Giải thích
Vì Laptop A và Laptop B cùng mạng (Layer 2), chúng nói chuyện trực tiếp bằng MAC Address, không cần Router dẫn đường. Nhưng muốn ra Internet (Layer 3), bắt buộc phải có Gateway.
:::

---

## BÀI TẬP 2: "BỨC TƯỜNG LỬA" (Firewall Troubleshooting)

### 1. Tình huống
Bạn Ping thấy lỗi `Request timed out` (Hết thời gian chờ).

### 2. Phân tích
*   **Hiện tượng**: Gói tin đã gửi đi được, nhưng không thấy phản hồi.
*   **Suy luận**: Máy đích (Laptop B) VẪN SỐNG, nhưng nó đang "lờ" mình đi.
*   **Thủ phạm**: 99% là **Windows Firewall**.

### 3. Cách sửa
Vào **Windows Defender Firewall** -> Chọn **Turn off** cho cả Private và Public network trên cả 2 máy.

---

## BÀI TẬP 3: BIÊN GIỚI MẠNG (SUBNET MASK)

Bài này sẽ giúp bạn hiểu ý nghĩa của con số `255.255.255.0`.

### 1. Chuẩn bị (Gây lỗi)
*   **Laptop B**: Giữ nguyên (`192.168.1.207` / `255.255.255.0`).
*   **Laptop A**: Đổi IP sang "xóm khác": `192.168.2.206`. Giữ nguyên Mask `255.255.255.0`. Bỏ trống Gateway.
*   **Hành động**: Từ Laptop A, gõ `ping 192.168.1.207`.

### 2. Kết quả & Giải thích
Bạn sẽ nhận được lỗi: **`PING: transmit failed. General failure.`**

::: details 🔍 Phân tích chuyên sâu: General Failure vs Request Timed Out
Đây là kiến thức cực kỳ đắt giá để chuẩn đoán bệnh:

1.  **Request timed out**:
    *   **Nghĩa là**: "Tôi đã gửi thư đi rồi, nhưng chờ mãi không thấy hồi âm".
    *   **Kết luận**: Đường thông, xe chạy được, nhưng bên kia không nhận hoặc bị chặn (Firewall).

2.  **General failure** (Lỗi tổng quát):
    *   **Nghĩa là**: "Tôi không biết đường nào mà gửi đi cả!".
    *   **Tại sao?**: Laptop A nhìn IP đích `192.168.1.207`. Nó so với Mask của nó và nhận ra đây là IP ngoại mạng (khác xóm). Nó tìm Gateway để nhờ chuyển đi nhưng... Gateway đang để trống. => **Bế tắc ngay tại máy gửi**.
:::

---

## BÀI TẬP 4: KHÔI PHỤC HIỆN TRƯỜNG

Trước khi qua bài mới, hãy trả lại mọi thứ về trạng thái bình thường để đảm bảo kết nối.

1.  **Laptop A**: Chuyển lại IP về `Obtain an IP address automatically` (hoặc set tĩnh đúng dải `192.168.1.x`).
2.  **Kiểm tra**: Ping lại Laptop B thấy `Reply from...` là OK.

---

## BÀI TẬP 5: SOI CỔNG (PORT) - LỚP 4

Chúng ta sẽ dùng lệnh `netstat` để xem máy tính đang mở những "cửa" (Port) nào.

### 1. Thực hiện
1.  Mở trình duyệt, vào Youtube bật 1 video (để tạo kết nối).
2.  Vào CMD, gõ:
    ```cmd
    netstat -an
    ```

### 2. Phân tích kết quả
Bạn sẽ thấy danh sách các kết nối:
*   **Proto**: `TCP` hoặc `UDP`.
*   **Local Address**: `IP_CỦA_BẠN : CỔNG` (Ví dụ `192.168.1.206:54321`).

> **Ghi nhớ**:
> *   **IP**: Địa chỉ tòa nhà.
> *   **Port**: Số phòng căn hộ.
> *   Web thường dùng Port 80, 443.
