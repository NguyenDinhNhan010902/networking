# PHẦN 2: GIAO VẬN (BÀI TẬP THỰC CHIẾN)

Bài tập này giúp bạn "nhìn thấu" máy tính đang âm thầm kết nối với ai, qua cổng nào.

---

## BÀI TẬP: SOI CỔNG (NETSTAT)

**Mục tiêu**: Sử dụng lệnh `netstat` để phân tích các kết nối TCP/UDP đang chạy.

### Bước 1: Tạo giả lập kết nối
1.  Mở trình duyệt web.
2.  Vào Youtube, bật 1 video bất kỳ (Để tạo ra lưu lượng mạng lớn).
3.  Vào một trang web tin tức (ví dụ `vnexpress.net`) (Để tạo kết nối web truyền thống).

### Bước 2: Chạy lệnh soi
1.  Mở CMD.
2.  Gõ lệnh:
    ```cmd
    netstat -an
    ```
    *(Gợi ý: Nếu quá nhiều dòng, ấn `Ctrl + C` để dừng lại).*

### Bước 3: Phân tích "Bệnh án"

Hãy tìm trong đống chữ hiện ra, bạn sẽ thấy 2 phe rõ rệt:

#### 1. Phe TCP (Anh Cẩn Thận)
Tìm các dòng có chữ **ESTABLISHED** (Đã thiết lập).
```text
TCP    192.168.1.xxx:57058    34.54.84.110:443    ESTABLISHED
```
*   **Ý nghĩa**: Máy bạn đang kết nối bền vững với máy chủ `34.54.84...` qua cổng **443** (Web Secure).
*   Đây thường là kết nối đến các trang web tin tức, đăng nhập, tải dữ liệu tĩnh.

#### 2. Phe UDP (Anh Nhanh Nhảu) - Sự thật về Youtube
Kéo xuống phần UDP. Bạn sẽ thấy rất nhiều dòng kết nối cũng tới cổng **443** của các IP lại (thường là IP Google).
```text
UDP    [::]:55109             [2404:6800...]:443
```
*   **Phát hiện**: Web (443) mà lại chạy trên UDP?
*   **Giải thích**: Đó chính là giao thức **QUIC** của Youtube. Máy tính đang dùng UDP để tải các mảnh video về một cách ổ ạt nhất có thể để bạn xem không bị giật.

### Bài tập nâng cao: Tìm cổng lạ
Hãy tắt hết trình duyệt đi. Đợi 1 lúc rồi chạy lại `netstat -an`.
*   Nếu bạn vẫn thấy những kết nối **ESTABLISHED** lạ tới các IP nước ngoài -> Coi chừng máy tính dính virus hoặc có phần mềm chạy ngầm (Update Windows, Driver...).
*   Đây là cách đơn giản nhất để phát hiện phần mềm gián điệp.
