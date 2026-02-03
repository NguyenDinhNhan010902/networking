# CỦNG CỐ KIẾN THỨC GIAI ĐOẠN 1

Đây là những kiến thức chuyên sâu giúp bạn hiểu những con số "bí ẩn" khi dùng lệnh Ping và Netstat.

---

## CHỦ ĐỀ 1: GIẢI MÃ CON SỐ BÍ ẨN "TTL" (LAYER 3)

Khi bạn Ping, bạn luôn thấy dòng `TTL=...`. Bạn có bao giờ thắc mắc nó là gì không?

*   **TTL (Time To Live)**: Dịch thô là "Thời gian sống".
*   **Ý nghĩa**: Để tránh một gói tin đi lạc vĩnh viễn trong mạng Internet (như con ma không siêu thoát), người ta quy định mỗi khi đi qua một trạm trung chuyển (Router), gói tin bị **"trừ 1 tuổi"**. Khi tuổi về 0, gói tin sẽ bị hủy.
*   **Bí mật nghề nghiệp**: Nhìn số TTL, bạn có thể đoán được **Hệ điều hành** của máy bên kia và **Khoảng cách** đến đó.

### THỰC HÀNH 1: ĐO KHOẢNG CÁCH VÀ ĐOÁN HỆ ĐIỀU HÀNH

#### Bước 1: Ping nội bộ (Laptop A sang Laptop B)
Từ Laptop A, ping Laptop B: `ping 192.168.1.xx`
*   **Kết quả**: Bạn sẽ thấy `TTL=128` (hoặc xấp xỉ).
*   **Giải mã**: Windows mặc định TTL khởi điểm là 128. Vì 2 máy nối trực tiếp (hoặc qua Switch/Wifi) không đi qua Router định tuyến nào, nên tuổi thọ còn nguyên 128.
*   **Kết luận**: Máy bên kia là **Windows**, và đang ở **ngay bên cạnh** (cùng mạng LAN).

#### Bước 2: Ping Google (Ra thế giới)
Từ Laptop A, ping Google: `ping 8.8.8.8`
*   **Giả sử**: Bạn thấy `TTL=115` (Con số này sẽ thay đổi tùy nhà mạng).
*   **Giải mã**: Google server thường chạy **Linux**, TTL khởi điểm của Linux thường là 64 hoặc một số server đặc biệt là 255.
    *   *Trường hợp 1* (Nếu gốc là 255): `255 - 115 = 140`. Nghĩa là gói tin đã đi qua 140 con Router? (Hơi nhiều).
    *   *Trường hợp 2* (Thường gặp): Google set tiêu chuẩn riêng.

Hãy thử ping một trang VN: `ping vnexpress.net`. Giả sử `TTL=56`.
*   Gốc Linux là 64.
*   `64 - 56 = 8`.
*   => **Kết luận**: Gói tin đi qua **8 con Router** (8 trạm) để đến Server VnExpress.

> **NHIỆM VỤ CỦA BẠN**: Hãy `ping google.com` và `ping 192.168.1.1` (Router nhà bạn). So sánh số TTL và cho tôi biết:
> 1. TTL của Router nhà bạn là bao nhiêu? (Thường Router chạy Linux nên TTL là 64).
> 2. TTL của Google thấp hơn hay cao hơn?

---

## CHỦ ĐỀ 2: "CỬA ĐÓNG THEN CÀI" - TRẠNG THÁI PORT (LAYER 4)

Lần trước bạn dùng netstat và thấy `ESTABLISHED` (Đã kết nối) và `LISTENING` (Đang lắng nghe). Bây giờ chúng ta sẽ soi kỹ hơn về quy trình kết nối.

Để hiểu Layer 4, bạn phải hiểu: Một kết nối không tự nhiên sinh ra, nó trải qua 3 giai đoạn.
1.  **LISTENING**: Tôi mở cửa, ngồi đợi khách (Server).
2.  **SYN_SENT**: Tôi vừa gõ cửa nhà người ta (Client đang gọi).
3.  **ESTABLISHED**: Hai bên đã bắt tay xong, đang nói chuyện.

### THỰC HÀNH 2: BẮT QUẢ TANG KẾT NỐI

Chúng ta sẽ dùng Python server để làm thí nghiệm này.

#### Bước 1: Trên Laptop A (Làm Server)
Mở CMD, chạy lệnh Python tạo web server:
```bash
python -m http.server 9999
```
*(Lần này dùng cổng 9999 cho lạ)*.

#### Bước 2: Soi trạng thái "LISTENING"
Mở thêm một cửa sổ CMD thứ 2 trên Laptop A. Gõ lệnh:
```bash
netstat -an | find "9999"
```
*   **Kết quả**: `LISTENING`.
*   **Ý nghĩa**: Cổng 9999 đã mở, nhưng chưa có ai vào.

#### Bước 3: Tạo kết nối từ Laptop B
Trên Laptop B, mở trình duyệt vào `IP_May_A:9999`. (Để trang web đó loading, đừng tắt tab).

#### Bước 4: Soi trạng thái "ESTABLISHED"
Quay lại cửa sổ CMD thứ 2 của Laptop A, gõ lại lệnh cũ:
```bash
netstat -an | find "9999"
```
*   **Kết quả**: Bây giờ sẽ thấy thêm dòng `ESTABLISHED`.
*   **Ý nghĩa**: Có một thằng (IP Laptop B) đang dính chặt vào cổng 9999.

> **CÂU HỎI TƯ DUY**: Nếu tắt trình duyệt bên Laptop B đi. Bạn soi lại netstat bên máy A, trạng thái `ESTABLISHED` có biến mất ngay không? Hay nó chuyển sang `TIME_WAIT`?

---

## CHỦ ĐỀ 3: PHÂN BIỆT LỖI (TỔNG HỢP LAYER 1-2-3-7)

Đây là bảng quan trọng nhất. Hãy đóng vai "Bác sĩ", chỉ mặt đặt tên bệnh.

| MÃ LỖI | BỆNH | KHU VỰC | LÝ DO |
| :--- | :--- | :--- | :--- |
| **Ping request could not find host...** | Không tìm thấy tên | **Layer 7 (DNS)** | Danh bạ không có tên này, hoặc chưa cắm dây mạng. |
| **Destination host unreachable** | Không tìm thấy đường/nhà | **Layer 2 (ARP) / Layer 3 (Routing)** | IP đích không tồn tại trong LAN, Router không biết đường, hoặc bị chặn ARP. |
| **Request timed out** | Gửi đi được nhưng bị bơ | **Layer 3 (Firewall) / Layer 1 (Cáp)** | Tìm thấy nhà, gửi thư, nhưng chủ nhà (Firewall) không mở cửa, hoặc xe thư cháy giữa đường. |

---

## BÀI TẬP TỔNG HỢP VỀ NHÀ (THỬ THÁCH CUỐI CÙNG GĐ1)

Bạn hãy thực hiện các hành động phá hoại sau trên Laptop A và ghi lại thông báo lỗi chính xác khi `ping google.com`:

1.  **Phá Layer 1**: Rút dây mạng/Tắt Wifi. -> Báo lỗi gì?
2.  **Phá Layer 7**: Kết nối mạng lại. Chỉnh DNS thành số tào lao (`1.2.3.4`). -> Báo lỗi gì?
3.  **Phá Layer 3**: Trả lại DNS đúng. Chỉnh Gateway thành số sai (`192.168.1.99`). Ping `8.8.8.8` (Ping thẳng IP). -> Báo lỗi gì?

---

## ĐÁP ÁN VÀ GIẢI THÍCH (SPOILED)

Dưới đây là kết quả bạn sẽ thấy khi thực hiện hành động phá hoại. Hãy so sánh xem có đúng không nhé!

### 1. Phá Layer 1 (Rút dây/Tắt Wifi)
*   **Lệnh**: `ping google.com`
*   **Thông báo lỗi**: `Ping request could not find host google.com. Please check the name and try again.`
*   **Tại sao**: Khi không có kết nối vật lý (Layer 1), máy tính thậm chí không thể gửi yêu cầu hỏi DNS (Layer 7) xem google.com là ai. Nên nó báo lỗi ngay từ bước đầu tiên: "Không tìm thấy tên host".
    *   *(Note: Nếu ping IP `8.8.8.8` lúc này, lỗi sẽ là `PING: transmit failed. General failure.` - Lỗi tổng quát do mất card mạng).*

### 2. Phá Layer 7 (Sai DNS)
*   **Lệnh**: `ping google.com` (Với DNS `1.2.3.4`)
*   **Thông báo lỗi**: `Ping request could not find host google.com. Please check the name and try again.`
*   **Tại sao**: Tương tự như trên. Máy tính hỏi DNS Server 1.2.3.4 (là một server không tồn tại hoặc không trả lời), nên nó chờ mãi không thấy ai dịch tên, và kết luận "Không tìm thấy host này".

### 3. Phá Layer 3 (Sai Gateway)
*   **Lệnh**: `ping 8.8.8.8` (Ping thẳng IP)
*   **Thông báo lỗi**: `Reply from <IP_Của_Bạn>: Destination host unreachable.`
*   **Tại sao**:
    *   `Reply from <IP_Của_Bạn>`: Chính máy bạn đang trả lời bạn.
    *   `Destination host unreachable`: "Đích đến không thể với tới".
    *   Lý do gốc rễ: Máy bạn hét lên trong mạng LAN (dùng ARP) hỏi: *"Ai là Gateway 192.168.1.99? Lên tiếng đi để tôi gửi gói tin đi Mỹ"*.
    *   Nhưng không ai trả lời (vì Gateway thật là .1).
    *   -> Máy bạn bế tắc và báo cáo lại với bạn: "Tôi không tìm thấy đường đi".
