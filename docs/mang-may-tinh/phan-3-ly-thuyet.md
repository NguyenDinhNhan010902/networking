# PHẦN 3: ỨNG DỤNG (LÝ THUYẾT)

Chúng ta đã đi từ dây cáp (L1) -> Switch (L2) -> Router (L3) -> Giao vận (L4).
Bây giờ là phần gần gũi nhất với người dùng: **Lớp 7 - Application (Lớp Ứng Dụng)**.

**NHỮNG NGƯỜI PHỤC VỤ THẦM LẶNG (DHCP & DNS)**
Nếu không có 2 giao thức này, bạn sẽ phải nhớ hàng tỷ con số IP thay vì tên miền `google.com`.

---

## 1. DHCP (Dynamic Host Configuration Protocol) - "Lễ tân phát số"

### Vấn đề
Mỗi lần bạn vào quán Cafe, bạn có cần tự nghĩ ra IP để điền vào máy không?
**Không**. Nếu hàng trăm khách hàng ai cũng tự điền, chắc chắn sẽ xảy ra "đánh nhau" (Trùng IP).

### Giải pháp
Có một anh Lễ tân (**DHCP Server** - thường nằm trong cục Router Wifi) tự động hét lên:
> *"Chào máy mới, IP của anh là `192.168.1.50`, cầm lấy mà dùng!"*.

### Thực tế
*   Lúc nãy bạn set **IP tĩnh (Static IP)**: Là bạn đang "cãi lời" DHCP (Tự mình chọn số phòng).
*   Còn bình thường bạn chọn **"Obtain IP automatically"**: Là bạn phó mặc cho anh DHCP, anh bảo sao nghe vậy.

---

## 2. DNS (Domain Name System) - "Danh bạ điện thoại"

### Vấn đề
Con người không thể nhớ nổi IP của Facebook là `157.240.220.35` hay của Google là `142.250...`.

### Giải pháp
Bạn chỉ cần nhớ `facebook.com`.
Máy bạn sẽ hỏi một ông thư ký tên là **DNS Server**:
1.  **Hỏi**: *"Alo, facebook.com ở địa chỉ số mấy?"*.
2.  **Trả lời**: *"Nó là 157.240.220.35"*.
3.  **Kết nối**: Thế là máy bạn tự động đi đến đúng địa chỉ đó.

---

## TỔNG KẾT MÔ HÌNH OSI (GÓC NHÌN NGƯỜI DÙNG)

| Layer | Tên gọi | Vai trò đời thực | Nếu hỏng thì sao? |
| :--- | :--- | :--- | :--- |
| **L7** | **Application** | Lễ tân & Danh bạ | Không vào được web bằng tên (chỉ vào được bằng IP). |
| **L4** | **Transport** | Shipper (Cẩn thận/Nhanh) | Web load thiếu ảnh, Video bị giật. |
| **L3** | **Network** | Bưu điện & Số nhà | Không ra được Internet (chỉ chơi LAN). |
| **L2** | **Data Link** | Số phòng nội bộ | Không nhìn thấy máy in/máy tính bên cạnh. |
| **L1** | **Physical** | Đường nhựa | Mất mạng hoàn toàn (đèn tắt). |
