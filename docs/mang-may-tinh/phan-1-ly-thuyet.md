# PHẦN 1: HẠ TẦNG MẠNG (LÝ THUYẾT)

> "Thay vì học thuộc lòng 7 lớp như vẹt, tôi sẽ dạy bạn cách tư duy của một người kỹ sư mạng khi gặp lỗi. Khi mạng hỏng, ta phải 'khám bệnh' từ dưới lên trên."

Phần này tập trung vào **Ba lớp hạ tầng (Layer 1, 2, 3)**. Đây là nơi xảy ra **80%** các lỗi mạng cơ bản.

---

## 1. VÍ DỤ ĐỜI THỰC: "CÔNG TY VÀ BƯU ĐIỆN"

Hãy tưởng tượng 2 Laptop của bạn đang nằm trong một tòa nhà văn phòng (Mạng LAN).

### Layer 2 (Data Link) - "Chuyện trong phòng làm việc"
*   **Tình huống**: Bạn muốn đưa tài liệu cho đồng nghiệp ngồi ngay bàn đối diện (cùng phòng).
*   **Cách làm**: Bạn không cần ghi địa chỉ nhà, số điện thoại, hay ra bưu điện gửi. Bạn chỉ cần biết mặt người đó (**MAC Address**), đi tới và đưa tận tay.
*   **Phạm vi**: Chỉ hoạt động trong nội bộ một căn phòng (một mạng LAN).
*   **Thiết bị**: Nếu phòng rộng, bạn cần một người chuyển phát nhanh nội bộ đi bộ đưa giấy tờ qua lại, đó là cái **Switch** (Bộ chia mạng).

### Layer 3 (Network) - "Chuyện gửi thư đi Mỹ"
*   **Tình huống**: Bạn muốn gửi tài liệu cho đối tác ở Mỹ (Google).
*   **Cách làm**: Bạn không thể "đi bộ" sang Mỹ được. Bạn phải bỏ tài liệu vào phong bì, ghi rõ Địa chỉ nhà/Quốc gia (**IP Address**). Sau đó bạn đưa phong bì đó cho bộ phận bưu tá tòa nhà (**Gateway/Router**).
*   **Hành động**: Bưu tá (Router) sẽ nhìn địa chỉ đó và nói: *"À, cái này đi Mỹ, phải ra sân bay"*.
*   **Phạm vi**: Kết nối các mạng khác nhau (Từ nhà bạn -> Nhà mạng -> Mỹ).

---

## 2. KỸ THUẬT CHI TIẾT (DEEP DIVE)

### Lớp 1: Physical Layer (Lớp Vật Lý) - "Con đường và Cái xe"
*   **Lý thuyết**: Đây là những gì bạn sờ thấy được: Dây cáp mạng (RJ45), Sóng Wifi, Cục Router, Card mạng. Dữ liệu ở đây chỉ là các tín hiệu điện (0 và 1) hoặc sóng vô tuyến.
*   **Troubleshooting**:
    *   Khi mạng mất, câu đầu tiên bạn hỏi: *"Dây mạng có lỏng không?", "Cục Wifi có sáng đèn không?"*.
    *   Nếu đèn cổng LAN trên Router tắt ngóm -> **Lỗi Layer 1** (Hư dây, hư cổng, hoặc chưa cắm điện).
*   **Đơn vị dữ liệu**: Bit.

### Lớp 2: Data Link Layer (Lớp Liên kết dữ liệu) - "Số nhà trong xóm"
*   **Lý thuyết**: Để các máy trong cùng một mạng nói chuyện được với nhau, chúng dùng địa chỉ vật lý là **MAC Address** (ví dụ: `A4-5D-36...`). Đây là địa chỉ cứng, khắc trên card mạng.
*   **Hoạt động**: Khi Laptop A gửi cho Laptop B (cùng wifi):
    1.  Laptop A hét lên: *"Ai có IP 192.168.1.11?"* (Giao thức **ARP**).
    2.  Laptop B trả lời: *"Tôi đây, mặt mũi (MAC) của tôi là BB-BB-BB..."*.
    3.  Laptop A bắn tín hiệu tới đúng cái MAC đó.
*   **Troubleshooting**: Nếu 2 máy cùng cắm vào 1 cục Router mà không Ping thấy nhau -> Có thể do tính năng "AP Isolation" (cô lập thiết bị) hoặc sai MAC. Lỗi "Xung đột IP" thực chất là vấn đề ARP ở lớp này.
*   **Đơn vị dữ liệu**: Frame.

### Lớp 3: Network Layer (Lớp Mạng) - "Hệ thống định vị toàn cầu"
*   **Lý thuyết**: Để đi từ nhà bạn sang một mạng khác (như Google), ta cần **IP Address** và người dẫn đường là **Router**. Router đọc IP để biết gói tin cần đi ngã rẽ nào.
*   **Hoạt động**: Khi Laptop A vào `google.com` (IP: `8.8.8.8`).
    1.  Laptop A so sánh IP đích (`8.8.8.8`) với IP mình (`192.168.1.10`) -> Thấy **KHÁC dải mạng**.
    2.  Laptop A biết phải gửi gói tin cho **Default Gateway** (Router).
    3.  Router nhận gói, đọc IP đích, tra bản đồ (**Routing Table**) và đẩy ra Internet.
*   **Troubleshooting**: Ping `8.8.8.8` mà thấy `Request timed out` -> Lỗi Lớp 3 (IP sai, Gateway sai).
*   **Đơn vị dữ liệu**: Packet (Gói tin).

---

## 3. HÌNH ẢNH MINH HỌA (QUY TRÌNH ĐÓNG GÓI)

Để dễ hình dung dữ liệu đi như thế nào, hãy tưởng tượng sự "Đóng gói lồng nhau":

1.  **Gói hàng (Data)**: "Chào Google".
2.  **Đóng hộp Lớp 3 (Network Packet)**: Dán nhãn `Từ: 192.168.1.10` - `Đến: 8.8.8.8`.
3.  **Đóng thùng Lớp 2 (Data Link Frame)**: Vì máy tính phải gửi cái hộp Lớp 3 này tới Router, nên nó đóng vào cái thùng to hơn và dán nhãn MAC: `Từ: MAC Laptop A` - `Đến: MAC Router`.

> **Mấu chốt quan trọng**:
> Khi đến Router, Router **xé cái thùng Lớp 2 vứt đi**, đọc địa chỉ trên hộp Lớp 3, rồi lại đóng vào cái thùng Lớp 2 mới để gửi cho nhà mạng.
> -> **MAC thay đổi qua từng trạm, nhưng IP (nguồn và đích) thì giữ nguyên suốt hành trình.**

---

## 4. BẢNG TỔNG HỢP (Dán lên tường)

| Layer | Tên gọi | Thiết bị / Khái niệm | Dữ liệu | Câu hỏi sửa lỗi (Troubleshooting) |
| :--- | :--- | :--- | :--- | :--- |
| **L3** | Network | Router, IP Address | Packet | "IP đúng chưa? Có thông ra Gateway không?" |
| **L2** | Data Link | Switch, MAC Address | Frame | "Đèn cổng mạng sáng xanh hay cam? Có bị chặn MAC không?" |
| **L1** | Physical | Dây cáp, Sóng Wifi | Bit | "Dây có đứt không? Cắm chặt chưa?" |
