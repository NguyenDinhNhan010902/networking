# MÔ HÌNH OSI & TCP/IP - Phần 1: Ba lớp hạ tầng

> Thay vì học thuộc lòng 7 lớp như vẹt, tôi sẽ dạy bạn cách tư duy của một người kỹ sư mạng khi gặp lỗi. Khi mạng hỏng, ta phải "khám bệnh" từ dưới lên trên.

Hôm nay là **Phần 1: Ba lớp hạ tầng (Layer 1, 2, 3)**. Đây là nơi xảy ra **80%** các lỗi mạng cơ bản.

---

## 1. Lớp 1: Physical Layer (Lớp Vật Lý)
*Biệt danh: "Con đường và Cái xe"*

### Lý thuyết làm việc
Đây là những gì bạn sờ thấy được: **Dây cáp mạng (RJ45), Sóng Wifi, Cục Router, Card mạng**.
Dữ liệu ở đây chỉ là các tín hiệu điện (0 và 1) hoặc sóng vô tuyến.

### Áp dụng Troubleshooting (Thực tế)
Khi mạng mất, câu đầu tiên bạn hỏi: *"Dây mạng có lỏng không?", "Cục Wifi có sáng đèn không?"*.
> [!TIP]
> Nếu đèn cổng LAN trên Router tắt ngóm -> **Lỗi Layer 1** (Hư dây, hư cổng, hoặc chưa cắm điện).

*   **Đơn vị dữ liệu:** Bit.

---

## 2. Lớp 2: Data Link Layer (Lớp Liên kết dữ liệu)
*Biệt danh: "Số nhà trong xóm"*

### Lý thuyết làm việc
Để các máy trong cùng một mạng (ví dụ: cùng kết nối 1 cục Wifi) nói chuyện được với nhau, chúng dùng địa chỉ vật lý là **MAC Address**.
Thiết bị đại diện cho lớp này là cái **Switch** (Bộ chia mạng).

### Áp dụng Troubleshooting
Nếu 2 máy cùng cắm vào 1 cục Router mà không Ping thấy nhau -> Có thể do tính năng "AP Isolation" (cô lập thiết bị) trên Router, hoặc sai MAC.
> [!NOTE]
> Lỗi phổ biến: "Xung đột IP" thực chất là vấn đề liên quan đến ARP ở lớp này.

*   **Đơn vị dữ liệu:** Frame.

---

## 3. Lớp 3: Network Layer (Lớp Mạng)
*Biệt danh: "Hệ thống định vị toàn cầu"*

### Lý thuyết làm việc
Để đi từ nhà bạn sang nhà Google (Mỹ), ta cần địa chỉ **IP Address** và người dẫn đường là **Router**. Router đọc IP để biết gói tin cần đi ngã rẽ nào.

### Áp dụng Troubleshooting
Bạn gõ `ping 8.8.8.8` mà thấy **Request timed out** -> **Lỗi Lớp 3** (IP sai, Gateway sai, hoặc Router không biết đường đi).
Đây là lớp quan trọng nhất để bạn cấu hình IP Tĩnh/Động.

*   **Đơn vị dữ liệu:** Packet (Gói tin).

---

## BẢNG TỔNG HỢP (Dùng để dán lên tường)
Tôi đã vẽ lại mô hình này dưới dạng "Bảng chuẩn đoán bệnh" cho bạn:

| Lớp (Layer) | Tên gọi | Thiết bị / Khái niệm chính | Dữ liệu | Câu hỏi khi sửa lỗi |
| :--- | :--- | :--- | :--- | :--- |
| **L3** | Network | Router, IP Address | Packet | "IP đúng chưa? Có thông ra Gateway không?" |
| **L2** | Data Link | Switch, MAC Address | Frame | "Đèn cổng mạng sáng xanh hay cam? Có bị chặn MAC không?" |
| **L1** | Physical | Dây cáp, Sóng Wifi, Hub | Bit | "Dây có đứt không? Cắm chặt chưa? Wifi có sóng không?" |

---

## 4. VÍ DỤ ĐỜI THỰC: "CÔNG TY VÀ BƯU ĐIỆN"
Hãy tưởng tượng 2 Laptop của bạn đang nằm trong một tòa nhà văn phòng (Mạng LAN).

### Layer 2 (Data Link) - "Chuyện trong phòng làm việc"
*   **Tình huống:** Bạn muốn đưa tài liệu cho đồng nghiệp ngồi ngay bàn đối diện (cùng phòng).
*   **Cách làm:** Bạn không cần ghi địa chỉ nhà, số điện thoại, hay ra bưu điện gửi. Bạn chỉ cần biết mặt người đó (MAC Address), đi tới và đưa tận tay.
*   **Phạm vi:** Chỉ hoạt động trong nội bộ một căn phòng (một mạng LAN).
*   **Thiết bị:** Nếu phòng rộng, bạn cần một người chuyển phát nhanh nội bộ đi bộ đưa giấy tờ qua lại, đó là cái **Switch** (Bộ chia mạng).

### Layer 3 (Network) - "Chuyện gửi thư đi Mỹ"
*   **Tình huống:** Bạn muốn gửi tài liệu cho đối tác ở Mỹ (Google).
*   **Cách làm:** Bạn không thể "đi bộ" sang Mỹ được. Bạn phải bỏ tài liệu vào phong bì, ghi rõ Địa chỉ nhà/Quốc gia (IP Address). Sau đó bạn đưa phong bì đó cho bộ phận bưu tá tòa nhà (Gateway/Router).
*   **Hành động:** Bưu tá (Router) sẽ nhìn địa chỉ đó và nói: *"À, cái này đi Mỹ, phải ra sân bay"*.
*   **Phạm vi:** Kết nối các mạng khác nhau (Từ nhà bạn -> Nhà mạng -> Mỹ).

---

## 5. KỸ THUẬT CHI TIẾT (Áp dụng vào 2 Laptop của bạn)
Bây giờ hãy nhìn vào hệ thống mạng bạn đang có.

### LAYER 2: DATA LINK (MAC Address & Switch)
Lớp này trả lời câu hỏi: *"Trong cùng một mạng, máy nào là máy nào?"*

*   **Địa chỉ:** Dùng **MAC Address** (ví dụ: `A4-5D-36...`). Đây là địa chỉ cứng, khắc trên card mạng.
*   **Hoạt động:** Khi Laptop A muốn gửi file cho Laptop B (cùng wifi).
    1.  Laptop A hét lên: *"Ai có IP 192.168.1.11?"* (Giao thức **ARP**).
    2.  Laptop B trả lời: *"Tôi đây, mặt mũi (MAC) của tôi là BB-BB-BB..."*.
    3.  Laptop A đóng gói dữ liệu và bắn trực tiếp tín hiệu qua sóng Wifi tới đúng cái MAC `BB-BB-BB...`.
*   **Vai trò của Router lúc này:** Router Wifi của bạn lúc này chỉ đóng vai trò là cái cầu nối (**Bridge/Switch**) để 2 máy nhìn thấy nhau. Nó không cần định tuyến gì cả.

### LAYER 3: NETWORK (IP Address & Router)
Lớp này trả lời câu hỏi: *"Làm sao để đi đến một mạng khác?"*

*   **Địa chỉ:** Dùng **IP Address** (ví dụ: `192.168.1.10`). Đây là địa chỉ logic, giúp định vị nhóm mạng.
*   **Hoạt động:** Khi Laptop A muốn vào `google.com` (IP: `8.8.8.8`).
    1.  Laptop A nhìn IP đích (`8.8.8.8`) và so sánh với IP mình (`192.168.1.10`) -> Thấy **KHÁC** dải mạng.
    2.  Laptop A biết nó không thể tự gửi trực tiếp được. Nó phải gửi gói tin cho **Default Gateway** (Cổng ra - chính là Router `192.168.1.1`).
    3.  Router nhận gói tin, đọc địa chỉ IP đích (`8.8.8.8`), tra bản đồ (**Routing Table**) và đẩy gói tin ra đường Internet (cổng WAN).

---

## 6. HÌNH ẢNH MINH HỌA (ĐÓNG GÓI - ENCAPSULATION)
Để dễ hình dung dữ liệu đi như thế nào, hãy tưởng tượng sự "Đóng gói lồng nhau":

1.  **Gói hàng (Data):** "Chào Google".
2.  **Đóng hộp Lớp 3 (Network Packet):** Dán nhãn `Từ: 192.168.1.10` - `Đến: 8.8.8.8`.
3.  **Đóng thùng Lớp 2 (Data Link Frame):** Vì máy tính phải gửi cái hộp Lớp 3 này tới Router (để Router gửi đi tiếp), nên nó đóng vào cái thùng to hơn và dán nhãn MAC: `Từ: MAC Laptop A` - `Đến: MAC Router`.

> **Mấu chốt:**
> Khi đến Router, Router **xé cái thùng Lớp 2 vứt đi**, đọc địa chỉ trên hộp Lớp 3, rồi lại đóng vào cái thùng Lớp 2 mới để gửi cho nhà mạng.
> -> **MAC thay đổi qua từng trạm, nhưng IP (nguồn và đích) thì giữ nguyên suốt hành trình.**

---

## 7. THỰC HÀNH KIỂM CHỨNG (LAB 1 & 2)

### LAB 1: Phân biệt Lỗi L1 và L3
Để hiểu rõ sự tách biệt giữa 3 lớp này, bạn hãy làm bài Lab sau trên 2 Laptop của bạn (Laptop A và Laptop B).
**Mục tiêu**: Phân biệt lỗi Lớp 1 và Lớp 3.

#### Bước 1: Giả lập lỗi Lớp 1 (Vật lý)
1.  Trên Laptop A, bạn hãy tắt công tắc Wifi (hoặc ngắt kết nối Wifi trên thanh taskbar).
2.  Mở CMD, gõ: `ping 192.168.1.1`
3.  **Quan sát**: Bạn sẽ thấy báo lỗi kiểu `General failure` hoặc `Transmit failed`.

> **Giải thích**: Không có đường truyền vật lý, máy tính không thể gửi bất cứ thứ gì đi.

#### Bước 2: Giả lập lỗi Lớp 3 (IP/Mạng)
1.  Bật lại Wifi trên Laptop A, đảm bảo kết nối lại vào Router.
2.  Chỉnh IP tĩnh của Laptop A sang một lớp mạng sai. (Ví dụ: Router `192.168.1.1` -> Laptop A `192.168.100.10`).
3.  Vào CMD, gõ: `ping 192.168.1.1`
4.  **Quan sát**: Bạn sẽ thấy `Request timed out` hoặc `Destination host unreachable`.

---

### LAB 2: Soi bảng ARP (Quan trọng)
Bạn hãy làm bài thực hành này để thấy rõ sự khác biệt giữa Lớp 2 và Lớp 3.
**Công cụ:** Lệnh `arp -a` (đại diện L2) và `tracert` (đại diện L3).

#### Bước 1: Kiểm chứng Lớp 2 (Nội bộ LAN)
1.  Từ Laptop A, Ping Laptop B (`ping 192.168.1.xx`).
2.  Gõ lệnh: `arp -a`
3.  **Kết quả:** Bạn sẽ thấy IP Laptop B đi kèm với **MAC của Laptop B**.

> **Kết luận:** Trong mạng LAN, máy tính nói chuyện trực tiếp với MAC của nhau.

#### Bước 2: Kiểm chứng Lớp 3 (Ra ngoài Internet)
1.  Từ Laptop A, Ping Google (`ping 8.8.8.8`).
2.  Gõ lại `arp -a` một lần nữa.
3.  Hãy tìm dòng IP `8.8.8.8`.

> **Kết quả:** Bạn sẽ **KHÔNG thấy** dòng nào là `8.8.8.8` trong bảng ARP cả! Hoặc nếu có thì MAC của nó chính là MAC của Router (Gateway).
>
> **Tại sao?** Vì Laptop A không bao giờ nói chuyện trực tiếp với Google. Nó chỉ nói chuyện với Router.

**Chứng minh:** Hãy nhìn MAC của dòng Gateway (`192.168.1.1`). Đó là "cánh cửa" duy nhất mà Laptop A biết để đi ra Lớp 3.
