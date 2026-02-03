# TỔNG QUAN LÝ THUYẾT MẠNG CỐT LÕI

Phần này dành cho việc **tra cứu kiến thức nền tảng**. Viết ngắn gọn, súc tích, chuẩn định nghĩa.

---

## 1. MÔ HÌNH OSI (7 LỚP)

Quy trình đóng gói dữ liệu từ phần mềm xuống dây cáp.

| Layer | Tên | Vai trò | Dữ liệu | Ví dụ thiết bị/Giao thức |
| :--- | :--- | :--- | :--- | :--- |
| **7** | **Application** | Giao diện người dùng | Data | HTTP, DNS, DHCP, Chrome |
| **4** | **Transport** | Vận chuyển tin cậy/nhanh | Segment | TCP, UDP |
| **3** | **Network** | Định tuyến (Tìm đường đi) | Packet | IP, Router |
| **2** | **Data Link** | Kết nối nội bộ (LAN) | Frame | MAC, Switch |
| **1** | **Physical** | Truyền tín hiệu vật lý | Bit | Cáp quang, Wifi, Hub |

---

## 2. CÁC GIAO THỨC QUAN TRỌNG

### IP (Internet Protocol - Layer 3)
*   **Địa chỉ nhà**. Giúp định danh thiết bị trên mạng.
*   **IPv4**: `192.168.1.1` (Sắp hết).
*   **IPv6**: `2402:800...` (Dài ngoằng, hiện đại).

### TCP vs UDP (Layer 4)
*   **TCP**: Cẩn thận, chậm, chắc chắn (Web, Mail).
*   **UDP**: Nhanh, liều, chấp nhận mất gói (Video call, Game).

### DHCP (Layer 7)
*   **Lễ tân phát số**. Tự động cấp IP cho máy tính khi vào mạng.
*   Không có DHCP -> Phải set IP tĩnh bằng tay (rất cực và dễ trùng).

### DNS (Layer 7)
*   **Danh bạ điện thoại**. Dịch tên miền (`google.com`) sang IP (`142.250...`).
*   DNS phổ biến: Google (`8.8.8.8`), Cloudflare (`1.1.1.1`).

---

## 3. THIẾT BỊ MẠNG

### Router (Bộ định tuyến)
*   Mục đích: Kết nối các mạng khác nhau (LAN này sang LAN kia, hoặc LAN sang Internet).
*   Làm việc tại Lớp 3.
*   Hiểu IP.

### Switch (Bộ chuyển mạch)
*   Mục đích: Kết nối các máy trong cùng 1 mạng (cùng phòng).
*   Làm việc tại Lớp 2.
*   Hiểu MAC.
