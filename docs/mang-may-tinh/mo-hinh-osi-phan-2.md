# MÔ HÌNH OSI - Phần 2: Lớp Giao Vận (Transport Layer)

> Nếu Lớp 3 (Network Layer - IP) trả lời câu hỏi "Nhà ở đâu?", thì Lớp 4 (Transport Layer) trả lời câu hỏi "Gửi hàng kiểu gì? Nhanh hay Cẩn thận?".

---

## 1. Hai phong cách giao hàng: TCP và UDP

Trong thế giới mạng, có 2 giao thức chính đóng vai trò vận chuyển dữ liệu:

### TCP (Transmission Control Protocol) - "Anh Cẩn Thận"
*   **Phong cách**: Chậm mà chắc.
*   **Cách làm việc**:
    1.  *"Alo, anh có nhà không?"* (Bắt tay SYN).
    2.  *"Có, tôi đây"* (SYN/ACK).
    3.  *"Ok, tôi gửi hàng nhé"* (ACK).
    4.  Gửi gói 1 -> Bên kia báo *"Đã nhận gói 1"*.
    5.  Nếu mất gói? -> **Gửi lại bằng được**.
*   **Ứng dụng**: Lướt web, gửi Email, tải File (Bạn không muốn tải file 1GB mà bị lỗi 1 byte đúng không?).

### UDP (User Datagram Protocol) - "Anh Nhanh Nhảu"
*   **Phong cách**: Tốc độ là trên hết. Mất mát không quan trọng.
*   **Cách làm việc**: Hét lên và ném hàng vèo vèo sang nhà hàng xóm. Nhận được hay không kệ bạn. Không chào hỏi, không báo cáo.
*   **Ứng dụng**: Gọi Video (Zoom/Google Meet), Livestream, Game Online.
*   **Tại sao?**: Khi gọi video, nếu mạng lag mất 1 giây hình ảnh, UDP sẽ bỏ qua luôn để hiển thị hình ảnh hiện tại (Real-time). Nếu dùng TCP, nó dừng lại để "gửi bù" hình cũ thì cuộc gọi sẽ bị trễ (delay) cả phút, rất khó chịu.

---

## 2. PORT (Cổng) là gì?

Máy tính giống như một tòa chung cư, có chung 1 địa chỉ (IP). Nhưng bên trong có rất nhiều căn hộ (Ứng dụng) cần nhận thư.
Làm sao người đưa thư biết lá thư này cho ông Facebook (trình duyệt) hay cho ông Game? -> **Nhờ số phòng (Port)**.

*   **Web (HTTP)**: Phòng số 80.
*   **Web bảo mật (HTTPS)**: Phòng số 443.
*   **Gửi mail (SMTP)**: Phòng số 25.

> **Tóm lại**: Một gói tin đầy đủ cần cặp đôi: `IP:Port` (Ví dụ `192.168.1.10:443`).

---

## 3. Thực hành: Soi Cổng (Netstat)

Để xem máy tính của bạn đang mở những cổng nào và nói chuyện với ai, hãy dùng lệnh `netstat`.

### Hướng dẫn
1.  Mở trình duyệt, vào một trang web bất kỳ (ví dụ Youtube) để tạo lưu lượng.
2.  Mở CMD, gõ:
    ```cmd
    netstat -an
    ```

### Phân tích kết quả thực chiến

#### 1. Phe TCP (Anh Cẩn Thận) - Những dòng ESTABLISHED
```text
TCP    192.168.1.210:57058    34.54.84.110:443    ESTABLISHED
```
*   `192.168.1.210`: IP máy bạn.
*   `57058`: Cổng máy bạn mở ra để gửi hàng.
*   `34.54.84.110`: IP Server (Youtube/Google).
*   `443`: Cổng Web Bảo Mật (HTTPS).
*   `ESTABLISHED`: **Đã kết nối**. Hai bên đã bắt tay xong và đang gửi dữ liệu quan trọng (tên video, comment...).

#### 2. Phe UDP (Anh Nhanh Nhảu) - Sự thật về Youtube (QUIC/HTTP3)
Nếu bạn thấy hàng loạt dòng UDP kết nối tới Port 443 của Google:
```text
UDP    [::]:55109             [2404:6800...]:443
```
*   **Hỏi**: Tại sao Web (Port 443) lại chạy trên UDP? Chẳng phải sách dạy Web là TCP sao?
*   **Đáp**: Đây là công nghệ mới **QUIC (HTTP/3)**. Google/Youtube dùng UDP để bắn video cực nhanh, giảm độ trễ (buffering). Nếu rớt vài gói tin, video vẫn chạy mượt thay vì khựng lại chờ như TCP.

> **Kết luận**:
> *   **TCP**: Web tĩnh, Email, File (Cần chính xác).
> *   **UDP**: Video, Voice, Game (Cần tốc độ).
