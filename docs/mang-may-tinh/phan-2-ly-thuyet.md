# PHẦN 2: GIAO VẬN & ỨNG DỤNG (LÝ THUYẾT)

Nếu Lớp 3 (Network Layer) trả lời câu hỏi "Nhà ở đâu?", thì Lớp 4 (Transport Layer) trả lời câu hỏi "Gửi hàng kiểu gì? Nhanh hay Cẩn thận?".

---

## 1. HAI PHONG CÁCH GIAO HÀNG (TCP vs UDP)

### TCP (Transmission Control Protocol) - "Anh Cẩn Thận"
*   **Phương châm**: "Chậm mà chắc. Sai là đền".
*   **Quy trình làm việc**:
    1.  **Bắt tay 3 bước**:
        *   Laptop A: *"Alo, anh có nhà không?"* (SYN).
        *   Server: *"Có, tôi đây"* (SYN/ACK).
        *   Laptop A: *"Ok, tôi bắt đầu gửi hàng nhé"* (ACK).
    2.  **Truyền tải**: Gửi gói 1 -> Bên kia nhận được phải báo cáo *"Đã nhận gói 1"*.
    3.  **Sửa lỗi**: Nếu mất gói tin? -> TCP sẽ phát hiện thiếu và **gửi lại bằng được**.
*   **Ứng dụng**: Web tĩnh, Email, Tải File (Những thứ cần độ chính xác 100%. Bạn không muốn tải file game 50GB mà hỏng vì mất 1 byte).

### UDP (User Datagram Protocol) - "Anh Nhanh Nhảu"
*   **Phương châm**: "Nhanh là thắng. Mất kệ nó".
*   **Quy trình làm việc**: Không có bắt tay, không có báo cáo. Laptop A cứ thế "hét lên" và ném dữ liệu vèo vèo sang bên kia.
*   **Ứng dụng**: Gọi Video (Zoom/Meet), Livestream, Game Online (FPS/MOBA).
*   **Tại sao?**: Khi gọi video, nếu mạng lag làm mất 1 tí hình ảnh, UDP sẽ bỏ qua luôn để hiển thị hình ảnh hiện tại (Real-time).
    *   Nếu dùng TCP: Nó sẽ bắt video dừng lại (xoay vòng tròn) để đi tìm lại cái hình ảnh cũ rích bị mất đó -> Cuộc gọi sẽ bị trễ (delay) cả phút -> Không ai dùng TCP để gọi thoại cả.

---

## 2. PORT (CỔNG) LÀ GÌ?

Máy tính giống như một tòa chung cư, có chung 1 địa chỉ (IP). Nhưng bên trong có rất nhiều căn hộ (mỗi phần mềm là một căn hộ) cần nhận thư.
Làm sao người đưa thư biết lá thư này cho ông Trình duyệt Web hay cho ông Game? -> **Nhờ số phòng (Port)**.

Các số phòng nổi tiếng ("Căn hộ VIP"):
*   **80**: Web thường (HTTP).
*   **443**: Web bảo mật (HTTPS) - Có ổ khóa xanh.
*   **25**: Gửi Email (SMTP).
*   **53**: Dịch vụ tên miền (DNS).

> **Công thức gói tin**: `IP_Nguồn:Port_Nguồn` -> `IP_Đích:Port_Đích`.
> Ví dụ: `192.168.1.10:54321` -> `8.8.8.8:53`.

---

## 3. CÔNG NGHỆ MỚI: HTTP/3 (QUIC)

Bạn có thể thắc mắc: *"Sách dạy lướt Web dùng TCP. Tại sao tôi thấy Youtube dùng UDP?"*

*   **Sự thật**: Các ông lớn như Google/Facebook/Youtube đang chuyển sang dùng giao thức mới tên là **QUIC (HTTP/3)** chạy trên nền **UDP**.
*   **Lý do**: TCP quá cẩn thận nên hơi chậm chạp trong việc thiết lập kết nối (mất thời gian bắt tay 3 bước). UDP thì nhanh ngay từ đầu. Google đã cải tiến UDP để nó vừa nhanh (như UDP) vừa tin cậy (gần như TCP) để load video siêu tốc.

---

## 4. LỚP ỨNG DỤNG (APPLICATION LAYER)

Lớp 7 - Nơi người dùng tương tác. Hai dịch vụ quan trọng nhất bạn cần biết:

### DHCP (Dynamic Host Configuration Protocol) - "Lễ tân khách sạn"
*   **Vấn đề**: Không thể để mỗi người tự chọn IP (sẽ bị trùng nhau).
*   **Giải pháp**: Khi bạn vào mạng, máy tính sẽ hét lên *"Cho tôi xin 1 IP"*. Server DHCP (Router) sẽ rà soát kho số và cấp cho bạn 1 số chưa ai dùng (ví dụ `.100`) trong thời hạn nhất định.

### DNS (Domain Name System) - "Danh bạ điện thoại"
*   **Vấn đề**: Máy tính chỉ hiểu số (`142.250...`), con người chỉ nhớ chữ (`google.com`).
*   **Giải pháp**: Khi bạn gõ `google.com`, máy tính âm thầm hỏi DNS Server (`8.8.8.8`): *"Google nhà ở đâu?"*. DNS trả về IP. Lúc đó máy tính mới kết nối được.
*   **Mẹo**: Nếu vào Zalo được (Zalo dùng IP cứng) mà không lướt web được -> 99% lỗi DNS.
