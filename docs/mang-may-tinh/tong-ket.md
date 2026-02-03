# TỔNG KẾT LỘ TRÌNH CẤP TỐC (GIAI ĐOẠN 1)

Chúc mừng bạn! Chúng ta vừa đi qua một hành trình siêu tốc từ con số 0 đến việc nắm bắt được luồng đi của dữ liệu.

---

## 1. BẢNG TRA CỨU TROUBLESHOOTING (ĐỒ NGHỀ)

Dán bảng này lên tường để dùng bất cứ khi nào mạng gặp sự cố.

| Tầng (Layer) | Tên gọi | Bệnh thường gặp | Công cụ kiểm tra ("Đồ nghề") |
| :--- | :--- | :--- | :--- |
| **L7** | **App/DNS** | DNS chết, Web lỗi, vào Zalo được nhưng không vào Web được | `nslookup` |
| **L4** | **Transport** | Firewall chặn cổng, Web quay vòng tròn | `netstat -an` |
| **L3** | **Network** | Sai IP, Sai Gateway, "General Failure" | `ipconfig`, `ping` (ra ngoài), `tracert` |
| **L2** | **Data Link** | Chặn MAC, Wifi cô lập, "Destination Unreachable" | `ping` (nội bộ), `arp -a` |
| **L1** | **Physical** | Dây lỏng, Modem mất điện, Chuột cắn dây | Mắt thường (Nhìn đèn Router) |

---

## 2. BÀI TẬP TỐT NGHIỆP: "CASE STUDY NHÀ BÁC GÁI"

Một tình huống giả định thực tế để kiểm tra phản xạ của bạn.

**Tình huống**:
Laptop của bác gái vào đọc báo (Dantri, VnExpress) thì được, nhưng **không tài nào vào được trang web công ty** (`congtybac.vn`). Trong khi máy khác vẫn vào bình thường.

### Phân tích nhanh (Trong đầu)
1.  **Vào báo được**: -> Internet KHÔNG HỎNG. (Loại trừ Lớp 1, 2, Gateway).
2.  **Máy khác vào được**: -> Server công ty KHÔNG HỎNG.
3.  **Kết luận**: Lỗi nằm ở cấu hình Laptop của bác (DNS sai hoặc Firewall chặn).

### 3 Bước Xử Lý "Thần Thánh"

#### Bước 1: PING (Khám sơ bộ)
Gõ: `ping congtybac.vn`
*   **Trường hợp A**: Báo `Ping request could not find host`.
    *   -> **Bắt bệnh**: Lỗi DNS (Lớp 7). Máy tính không biết `congtybac.vn` là ai.
*   **Trường hợp B**: Hiện ra IP nhưng báo `Request timed out`.
    *   -> **Bắt bệnh**: Đã biết tên, nhưng đường đi bị chặn (Firewall) hoặc đứt gánh giữa đường.

#### Bước 2: NSLOOKUP (Tra khảo)
Nếu Bước 1 bị lỗi (đặc biệt là Trường hợp A), dùng lệnh này để kiểm tra chéo.
Gõ: `nslookup congtybac.vn`
*   So sánh kết quả với điện thoại (dùng 4G). Nếu IP Laptop khác IP điện thoại -> **Lỗi DNS** (Máy bác đang dùng DNS "dởm" hoặc bị virus chỉnh file hosts).

#### Bước 3: TRACERT (Dò đường)
Nếu Bước 1 ra IP đúng mà vẫn không vào được.
Gõ: `tracert congtybac.vn`
*   Nó sẽ hiện ra các trạm đi qua. Nếu đi qua nhà mạng ngon lành rồi "chết đứng" ở trạm cuối cùng. -> **Kết luận**: IP nhà bác đã bị Tường lửa công ty hành động chặn (Blacklist).

---
**TỔNG KẾT**: Bạn đã sẵn sàng để phỏng vấn và xử lý các sự cố mạng văn phòng cơ bản!
