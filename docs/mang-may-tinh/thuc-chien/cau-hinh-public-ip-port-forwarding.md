# Hướng Dẫn Cấu Hình Public IP & Port Forwarding (Thực Chiến)

Đây là quy trình chuẩn để đưa một Web Server hoặc AI Server từ máy tính cá nhân (Localhost) ra ngoài Internet, cho phép truy cập từ bất kỳ đâu.

---

## 1. MỤC TIÊU & CHUẨN BỊ

### Mục tiêu
Cho phép truy cập vào Server nội bộ (Laptop chạy Python/AI Model) từ mạng Internet bên ngoài (4G, Wifi khác) thông qua địa chỉ IP Công cộng.

### Chuẩn bị
*   **Server (Laptop A)**: Đang chạy ứng dụng (ví dụ: Web/AI) tại cổng `8888`.
*   **Router**: Modem nhà mạng (Ví dụ: Viettel ZTE/Huawei).
*   **Client**: Điện thoại dùng 4G để kiểm tra độc lập.

---

## 2. QUY TRÌNH THỰC HIỆN

### GIAI ĐOẠN 1: XỬ LÝ SỰ CỐ IP (QUAN TRỌNG NHẤT - CGNAT)

Hiện tại các nhà mạng thường sử dụng công nghệ CGNAT (Carrier-Grade NAT) để tiết kiệm IP, khiến IP tại modem là IP ảo. **Cần xử lý bước này trước tiên thì các bước sau mới có tác dụng.**

#### 1. Dấu hiệu nhận biết:
*   **Trong Router** (Mục Internet > Status): IP Address hiển thị dải `10.x.x.x` hoặc `100.x.x.x`.
*   **Trên Web** (whatismyip.com): IP hiển thị dải khác (ví dụ `113.x.x.x` hoặc `14.x.x.x`).
*   👉 **Kết luận**: IP Router và IP Public **KHÔNG TRÙNG NHAU** -> Mạng đang bị CGNAT -> **Không thể mở cổng**.

#### 2. Cách khắc phục:
Gọi tổng đài kỹ thuật (Ví dụ Viettel: `1800 8119`).

> **Kịch bản giao tiếp (Script) cho bạn:**
>
> "Chào tổng đài, nhà mình đang cần lắp đặt Camera giám sát. Nhờ kỹ thuật viên kiểm tra và gỡ bỏ CGNAT, **mở dải IP Public** cho đường truyền nhà mình để mình xem Camera từ xa. Hiện tại modem đang nhận dải IP 10.x nên không xem được."

**Kết quả mong đợi**: Sau khi nhà mạng reset, IP trong Router phải đổi sang đầu số công cộng (ví dụ `14.x`, `113.x`, `171.x`, `27.x`...) và **TRÙNG KHỚP** với IP trên `whatismyip.com`.

---

### GIAI ĐOẠN 2: CỐ ĐỊNH IP MÁY CHỦ (DHCP STATIC BINDING)

Để tránh việc Server bị đổi IP sau khi khởi động lại (làm mất cấu hình Port Forwarding).

1.  **Truy cập Router**: Đăng nhập trang quản trị (thường là `192.168.1.1`).
2.  **Đường dẫn**: Vào `Local Network` -> `LAN` -> `DHCP Binding` (hoặc `Allocated Address`).
3.  **Tạo mới (Create New Item)**:

| Thông số | Giá trị (Ví dụ) |
| :--- | :--- |
| **Name** | `AI_Server_Static` |
| **MAC Address** | `14:f6:d8:68:01:0a` (MAC của Laptop A) |
| **IP Address** | `192.168.1.206` (IP này nằm ngoài dải cấp động là tốt nhất) |

*Lưu ý: Sau khi cấu hình, cần khởi động lại Laptop hoặc dùng lệnh `ipconfig /release` và `ipconfig /renew` để máy nhận IP mới này.*

---

### GIAI ĐOẠN 3: MỞ CỔNG (PORT FORWARDING)

Tạo "đường hầm" cho người ngoài truy cập vào ứng dụng.

1.  **Đường dẫn**: Vào `Internet` -> `Security` (hoặc NAT) -> `Port Forwarding`.
2.  **Tạo mới (Create New Item)**:

| Thông số | Cấu hình | Giải thích |
| :--- | :--- | :--- |
| **Name** | `Web_AI_Project` | Tên gợi nhớ. |
| **Protocol** | `TCP` (hoặc TCP/UDP) | Web thường dùng TCP. |
| **WAN Connection** | `Auto` | Hoặc chọn cấu hình `omci_ipv4_pppoe`. |
| **WAN Host IP** | `0.0.0.0` (hoặc Bỏ trống) | **Quan trọng**: Cho phép mọi IP truy cập. |
| **LAN Host** | `192.168.1.206` | IP tĩnh đã gán ở Giai đoạn 2. |
| **WAN Port** | `8888` ~ `8888` | Cổng khách sẽ gõ vào (`:8888`). |
| **LAN Host Port** | `8888` ~ `8888` | Cổng Server đang chạy thực tế. |

3.  **Kích hoạt**: Tích chọn `On` hoặc `Enable`. Nhấn **Apply**.

---

### GIAI ĐOẠN 4: KIỂM TRA (TESTING)

1.  **Bật Server (Trên Laptop A)**:
    Mở CMD và chạy lệnh khởi tạo Web Server thử nghiệm:
    ```bash
    python -m http.server 8888
    ```
2.  **Tắt Firewall (Nếu cần)**:
    Nếu không truy cập được, vào *Windows Defender Firewall* và chọn **Turn off** cho cả Private và Public Network (chỉ làm khi debug).
3.  **Truy cập từ xa (Trên điện thoại)**:
    *   Tắt Wifi, **bật 4G** (Bắt buộc phải dùng mạng khác mạng LAN).
    *   Lấy IP Public tại: `whatismyip.com` (Ví dụ: `113.190.x.x`).
    *   Truy cập trình duyệt: `http://113.190.x.x:8888`

---

## 3. GIẢI THÍCH THUẬT NGỮ (GLOSSARY)

*   **CGNAT**: Cơ chế nhà mạng dùng chung 1 IP công cộng cho nhiều hộ gia đình. Cần gỡ bỏ mới làm Server được.
*   **DHCP Reservation (Binding)**: Đặt chỗ trước 1 IP cụ thể cho 1 thiết bị cụ thể dựa trên địa chỉ vật lý (MAC).
*   **Port Forwarding**: Hành động Router chuyển tiếp gói tin từ cổng Internet vào đúng thiết bị trong mạng LAN.
*   **Public IP (WAN IP)**: Địa chỉ "nhà mặt tiền" của bạn trên Internet.
*   **Private IP (LAN IP)**: Địa chỉ nội bộ trong nhà (ví dụ `192.168.1.x`), Internet không nhìn thấy trực tiếp.
