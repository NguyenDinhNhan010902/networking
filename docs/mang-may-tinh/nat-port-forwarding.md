# NAT & Port Forwarding: Giải Mã "Sự Tráo Đổi Linh Hồn" Của Gói Tin

Để hiểu sâu về NAT và Port Forwarding, chúng ta phải quay ngược thời gian về Khủng hoảng Internet những năm 90 và mổ xẻ gói tin để xem Router đã "phẫu thuật" nó như thế nào.

---

## 1. GỐC RỄ VẤN ĐỀ: CUỘC KHỦNG HOẢNG THIẾU SỐ NHÀ (IPV4 EXHAUSTION)

### Vấn đề:
Địa chỉ IPv4 có dạng `xxx.xxx.xxx.xxx`. Tổng cộng chỉ có khoảng **4.3 tỷ địa chỉ**.
Đến những năm 90, các kỹ sư nhận ra: *"Chết rồi, thế giới có hàng chục tỷ thiết bị (PC, điện thoại, IOT). 4.3 tỷ số nhà không đủ chia!"*

### Giải pháp cứu thế: NAT (Network Address Translation)
Họ chia thế giới thành 2 loại địa chỉ:

1.  **IP Public (IP Công cộng - IP WAN)**: Số lượng có hạn, phải thuê tiền, **duy nhất trên toàn cầu**. (Ví dụ: Số nhà mặt phố).
2.  **IP Private (IP Nội bộ - IP LAN)**: Miễn phí, tự do đặt (`192.168.x.x`, `10.x.x.x`). Nhà nào cũng giống nhà nào. (Ví dụ: Số phòng trong nhà).

👉 **NAT sinh ra để**: Cho phép hàng nghìn thiết bị Private (trong nhà) dùng chung **MỘT** IP Public (mặt phố) để ra Internet.

---

## 2. CƠ CHẾ HOẠT ĐỘNG: "SỰ TRÁO ĐỔI LINH HỒN" (OUTBOUND NAT)

Đây là những gì diễn ra **BÊN TRONG RAM** của Router khi bạn vào Google. Hãy nhìn sâu vào cấu trúc gói tin (Packet Header).

### Kịch bản:
*   **Laptop A (LAN)**: IP `192.168.1.10` - Cổng `5000`.
*   **Router (WAN)**: IP `14.0.0.1`.
*   **Google (Server)**: IP `8.8.8.8`.

### Quá trình "Phẫu thuật" gói tin chiều đi:

#### 1. Gói tin gốc (Từ Laptop A):
*   **Nguồn (Source)**: `192.168.1.10 : 5000`
*   **Đích (Dest)**: `8.8.8.8 : 80`
*   ➡️ Gói tin này đi đến Router.

#### 2. Hành động của Router (NAT - Source NAT):
Router chặn lại và bảo: *"Này, mày mang cái tên 192.168... ra đường thì Google không biết đường trả lời đâu (vì đó là địa chỉ nội bộ). Để tao thay mặt cho."*

Router thực hiện **ghi đè (rewrite)** phần đầu gói tin:
*   **Sửa Nguồn**: Từ `192.168.1.10` thành `14.0.0.1` (IP mặt phố của Router).
*   **Sửa Cổng**: Để phân biệt Laptop A với các máy khác, Router gán cho nó một cổng tạm thời trên Router, ví dụ cổng `60001`.

#### 3. Gói tin sau khi Router sửa (Ra Internet):
*   **Nguồn**: `14.0.0.1 : 60001` <--- *(Đã bị biến hình)*
*   **Đích**: `8.8.8.8 : 80`

#### 4. Bảng nhớ (NAT Table - Conntrack):
**Quan trọng nhất!** Router ghi vào cuốn sổ tay trong RAM (RAM Router):
> *"Lúc 7:00AM, tao đã đổi gói tin của thằng `192.168.1.10:5000` thành `14.0.0.1:60001` để đi gặp Google."*

---

## 3. CƠ CHẾ CỦA PORT FORWARDING (INBOUND NAT)

NAT chiều đi (ở trên) là tự động. Nhưng chiều về (hoặc chiều người lạ chủ động vào) thì Router bị "ngáo" nếu không được dạy trước.

### Vấn đề:
Một người bạn từ Mỹ (IP `1.2.3.4`) muốn truy cập Web Server trên Laptop A của bạn.
Họ gửi thư đến địa chỉ Public IP của bạn: `14.0.0.1`.

**Gói tin đến cửa Router:**
*   **Nguồn**: `1.2.3.4`
*   **Đích**: `14.0.0.1 : 80` (Cổng Web)

**Router bối rối:**
Router cầm gói tin này và tự hỏi: *"Thằng này gửi đến cổng 80 của mình. Nhưng trong nhà có 10 cái máy tính, máy nào là máy chạy Web? Hay là gửi cho mình?"*.
Nếu không ai dặn gì -> Router vứt gói tin vào thùng rác (**DROP**).

### Giải pháp: PORT FORWARDING (DNAT - Destination NAT)
Bạn cài đặt một **"Luật bất biến"** vào não Router:
> *"Hễ có ai gõ cửa cổng 80 (Web) ở ngoài mặt tiền, thì **DỊCH CHUYỂN NGAY (Forward)** vào cho thằng `192.168.1.10` bên trong."*

### Quá trình "Phẫu thuật" gói tin chiều vào (khi có Port Forwarding):

#### 1. Gói tin đến từ Mỹ:
*   **Nguồn**: `1.2.3.4`
*   **Đích**: `14.0.0.1 : 80`

#### 2. Hành động của Router (DNAT):
Router tra bảng luật Port Forwarding. Thấy khớp!
Nó thực hiện **ghi đè (rewrite)** địa chỉ ĐÍCH:
*   **Sửa Đích**: Từ `14.0.0.1` thành `192.168.1.10`.

#### 3. Gói tin đi vào mạng LAN:
*   **Nguồn**: `1.2.3.4` (Vẫn giữ nguyên để Laptop A biết ai gửi).
*   **Đích**: `192.168.1.10 : 80` <--- *(Đã đến đúng máy)*.

---

## 4. BẢNG SO SÁNH "GỐC RỄ" (CHO DÂN KỸ THUẬT)

| Đặc điểm | NAT (Thường dùng để lướt web) | PORT FORWARDING (Dùng để làm Server) |
| :--- | :--- | :--- |
| **Tên chuyên ngành** | **SNAT** (Source NAT) / Masquerade | **DNAT** (Destination NAT) |
| **Bản chất** | Router sửa địa chỉ **NGUỒN** (Source IP) | Router sửa địa chỉ **ĐÍCH** (Destination IP) |
| **Mục đích** | Giấu IP nội bộ đi ra ngoài. | Dẫn đường cho khách từ ngoài vào đúng IP nội bộ. |
| **Hướng khởi tạo** | Từ **TRONG** ra **NGOÀI**. | Từ **NGOÀI** vào **TRONG**. |
| **Cấu hình** | Tự động (Router làm sẵn). | Thủ công (Bạn phải tự cài). |

---

## 5. CÂU HỎI TƯ DUY & TÌNH HUỐNG (PORT MAPPING)

### Tình huống:
Bạn mở Port Forwarding cổng 80 cho **Laptop A** (`192.168.1.10`).
Cùng lúc đó, em trai bạn dùng **Laptop B** (`192.168.1.11`) cũng chạy một Web Server.

**Câu hỏi**: Trên cùng một cục Router đó, bạn có thể tiếp tục mở Port Forwarding cổng 80 cho Laptop B được nữa không? Tại sao?

### Đáp án:
👉 **KHÔNG ĐƯỢC**.
Vì **Router sẽ bị "loạn não" (Conflict)**. Một địa chỉ Public IP mặt ngoài chỉ có một cổng 80. Router không thể biết gói tin đến cổng 80 là dành cho Laptop A hay Laptop B.

### Giải pháp: PORT MAPPING (Ánh xạ cổng)
Đây là "Phép biến hóa của NAT" hay còn gọi là **Port Translation**.

**Kịch bản:**
1.  **Laptop A (Của bạn)**: Dùng cổng chuẩn `80`.
    *   Khách gõ: `http://14.0.0.1` -> Vào máy bạn.
2.  **Laptop B (Của em)**: Dùng cổng "lệch" `8080` (hoặc 8888).
    *   Khách gõ: `http://14.0.0.1:8080` -> Vào máy em bạn.

**Cấu hình trên Router sẽ trông như thế này:**

| Tên Luật | External Port (Cổng Ngoài - WAN) | Internal IP (IP Trong - LAN) | Internal Port (Cổng Trong) |
| :--- | :--- | :--- | :--- |
| **Web_LaptopA** | **80** | 192.168.1.10 | **80** |
| **Web_LaptopB** | **8080** | 192.168.1.11 | **80** |

👉 **Điều kỳ diệu**: Laptop B không cần sửa code đổi cổng gì cả, nó vẫn chạy cổng 80 bình thường. Router đã âm thầm thực hiện cú "lừa": **Nhận cổng 8080 ở ngoài, nhưng khi đưa vào trong thì tự sửa thành cổng 80 cho Laptop B**.
