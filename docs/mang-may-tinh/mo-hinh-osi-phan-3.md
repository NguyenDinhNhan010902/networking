# MÔ HÌNH OSI - Phần 3: Lớp Ứng Dụng (Application Layer)

Chúng ta đã đi từ dây cáp (L1) -> Switch (L2) -> Router (L3) -> Giao vận (L4).
Bây giờ là phần gần gũi nhất với người dùng: **Lớp 7 - Application**.

Hôm nay chúng ta sẽ làm quen với 2 "người phục vụ" cần mẫn nhất Internet: **DHCP** và **DNS**.

---

## 1. DHCP (Dynamic Host Configuration Protocol)
*Biệt danh: "Lễ tân khách sạn"*

### Vấn đề
Khi bạn bước vào một quán Cafe, bạn không thể tự ý hét lên: *"Tôi chọn IP 192.168.1.100 nhé!"*. Vì lỡ có người khác đang dùng số đó rồi thì sao? (Xung đột IP).

### Giải pháp
Cần một người quản lý việc cấp phát IP. Đó là **DHCP Server** (Thường nằm ngay trong cục Router Wifi).

### Quy trình "Xin - Cho" (DORA)
1.  **D - Discover**: Máy bạn mới vào mạng, hét lên: *"Có ai ở đây không? Cho tôi xin một cái IP với!"*.
2.  **O - Offer**: DHCP Server nghe thấy, trả lời: *"Chào, tôi còn trống số 192.168.1.50 này, lấy không?"*.
3.  **R - Request**: Máy bạn: *"Ok ngon, cho tôi lấy số .50 đó nhé"*.
4.  **A - Acknowledge**: Server: *"Chốt đơn! Số .50 là của anh trong 24h tới"* (Hết giờ phải xin gia hạn - Lease Time).

> **Thực tế**: Khi bạn chọn chế độ *"Obtain an IP address automatically"* trong Windows, chính là bạn đang kích hoạt quy trình này.

---

## 2. DNS (Domain Name System)
*Biệt danh: "Danh bạ điện thoại"*

### Vấn đề
Máy tính chỉ hiểu số (IP Address: `142.250.1.100`).
Con người chỉ nhớ tên (Domain: `google.com`).

Làm sao để gõ `google.com` mà máy tính tìm được đến đúng nhà?

### Giải pháp
Cần một hệ thống chuyển đổi từ **Tên -> Số**. Đó là **DNS**.

### Quy trình hoạt động
1.  Bạn gõ `google.com` vào trình duyệt.
2.  Máy tính hỏi **DNS Server** (thường là `8.8.8.8` hoặc DNS của nhà mạng): *"Alo, Google.com địa chỉ nhà là bao nhiêu?"*.
3.  DNS Server tra sổ danh bạ và trả về IP: *"Nó ở 142.250.1.100"*.
4.  Máy tính lúc này mới dùng IP đó để kết nối và tải web về.

> **Mẹo Troubleshooting**:
> Nếu bạn vẫn vào Zalo được, vẫn Ping 8.8.8.8 được, nhưng không vào được web -> **99% là lỗi DNS**.
> *Cách sửa*: Đổi DNS trên máy tính sang Google (`8.8.8.8`) hoặc Cloudflare (`1.1.1.1`).

---

## 3. Tổng kết Mạng Căn Bản

Chúc mừng bạn! Bạn đã nắm được luồng đi của một gói tin từ A-Z:

1.  **Physical (L1)**: Cắm dây, bắt sóng Wifi.
2.  **Data Link (L2)**: Dùng MAC để nói chuyện với Router/Switch.
3.  **Network (L3)**: Dùng IP để định hướng đi ra Internet.
4.  **Transport (L4)**: Dùng TCP/UDP để vận chuyển (Cẩn thận hoặc Nhanh).
5.  **Application (L7)**:
    *   **DHCP**: Xin cấp IP tự động.
    *   **DNS**: Dịch tên miền sang IP.

Bây giờ bạn đã có tư duy của một kỹ sư mạng thực thụ: **"Gặp lỗi ở đâu, khoanh vùng ở đó!"**.
