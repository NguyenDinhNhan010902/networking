# CẨM NANG PHỎNG VẤN NETWORK

Phần này giúp bạn trả lời các câu hỏi "hóc búa" của nhà tuyển dụng hoặc giải thích cho Sếp.

---

## 1. CÂU HỎI TƯ DUY (WHY?)

### Q: "Tại sao tôi gõ google.com thì máy tính lại vào được Google?"
**A:** Đây là câu hỏi kinh điển về luồng dữ liệu (Flow).
1.  **DNS (L7)**: Máy tính hỏi DNS Server "google.com IP là gì?". Nhận về IP `142.x.x.x`.
2.  **Routing (L3)**: Máy tính đóng gói tin gửi cho Gateway (Router). Router dẫn đường qua các trạm trên Internet để đến Server Google.
3.  **TCP Handshake (L4)**: Máy tính và Server Google bắt tay nhau (SYN - SYN/ACK - ACK).
4.  **HTTP/HTTPS**: Sau khi bắt tay, trình duyệt gửi yêu cầu "Cho tôi xem trang chủ".
5.  **Hết**.

### Q: "Tại sao Youtube dùng UDP mà Web lại dùng TCP?"
**A:**
*   **Web dùng TCP**: Vì cần **chính xác**. Mất một chữ trong bài báo là sai nghĩa. Tải file thiếu 1 bit là file lỗi. Nên cần TCP để đảm bảo truyền lại nếu mất.
*   **Youtube dùng UDP (QUIC)**: Vì cần **tốc độ** và **real-time**. Khi xem video, nếu mất 1 khung hình cũng không sao (chỉ nháy mắt cái là qua), người dùng ưu tiên video chạy mượt, load nhanh, không bị xoay vòng tròn. TCP bắt tay quá lâu và truyền lại quá kỹ làm chậm video.

### Q: "TTL là gì? Tại sao ping lại thấy số này?"
**A:** Time To Live. Là "tuổi thọ" gói tin. Mỗi khi qua 1 Router thì trừ 1. Giúp chống loop vô tận. Nhìn TTL đoán được HDH (Windows ~128, Linux ~64) và đoán được sơ sơ khoảng cách.

---

## 2. SO SÁNH (COMPARE)

| Tiêu chí | HUB | SWITCH | ROUTER |
| :--- | :--- | :--- | :--- |
| **Lớp (Layer)** | Layer 1 (Vật lý) | Layer 2 (Data Link) | Layer 3 (Network) |
| **Độ thông minh** | Ngu ngơ. Nhận 1, hét lên cho tất cả. | Khá. Biết gửi đích danh cho MAC. | Giỏi. Biết tìm đường đi ngắn nhất cho IP. |
| **Phạm vi** | Nội bộ (LAN) | Nội bộ (LAN) | Kết nối các mạng (Internet) |

---

## 3. BÀI TẬP TÌNH HUỐNG (Vận dụng cao)

### Tình huống: "Case Study Nhà Bác Gái"
*   **Đề bài**: Vào báo được, nhưng không vào được web công ty (`congtybac.vn`).
*   **Phân tích**:
    *   Mạng không hỏng (vì vào báo được).
    *   -> Lỗi DNS (Dịch sai tên).
    *   -> Hoặc Lỗi Firewall/Routing (Bị công ty chặn IP).
*   **Xử lý**:
    1.  `nslookup` kiểm tra xem ra IP nào.
    2.  `tracert` xem chết ở đoạn nào.

*(Chi tiết xem lại bài Tổng kết Giai đoạn 1)*.
