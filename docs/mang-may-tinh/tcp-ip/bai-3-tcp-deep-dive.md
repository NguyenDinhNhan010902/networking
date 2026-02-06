# BÀI 3: TCP DEEP DIVE - MỔ XẺ CỜ (FLAGS), CỬA SỔ TRƯỢT & TẮC NGHẼN

## PHẦN 1: TCP FLAGS - BỘ TÍN HIỆU ĐIỀU KHIỂN
*(Nằm ở bit thứ 100-106 trong TCP Header)*

Các cờ này không chỉ để "làm cảnh". Nó là mệnh lệnh sống còn.

### 1. Chi tiết 6 Cờ quan trọng nhất

| Cờ | Tên đầy đủ | Bản chất kỹ thuật | Hành vi cụ thể |
| :--- | :--- | :--- | :--- |
| **SYN** | Synchronize | Bit khởi tạo | Máy gửi chọn một số thứ tự ngẫu nhiên (ISN) và bật cờ này để báo: *"Bắt đầu đếm từ số này nhé"*. Chỉ xuất hiện ở 2 gói tin đầu tiên của kết nối. |
| **ACK** | Acknowledgment | Bit xác nhận | Báo cho bên kia biết: *"Đã nhận được X byte, giờ hãy gửi tiếp từ byte X+1"*. Sau bước bắt tay, **MỌI** gói tin đều phải bật cờ này. |
| **PSH** | Push | Bit ép buộc | Bỏ qua bộ đệm (Buffer). Bình thường TCP sẽ chờ gom đủ dữ liệu cho đầy xe tải rồi mới chạy. PSH bắt TCP: *"Có bao nhiêu chuyển ngay bấy nhiêu, đừng chờ đầy xe"*. |
| **URG** | Urgent | Bit ưu tiên | Báo rằng trong gói này có dữ liệu khẩn cấp cần xử lý trước (nhảy cóc qua hàng đợi). **Thực tế**: Ngày nay rất hiếm dùng. |
| **FIN** | Finish | Bit kết thúc mềm | Máy gửi báo hết dữ liệu. Tuy nhiên, nó vẫn giữ kết nối mở để chờ Máy nhận xác nhận và đóng từ từ. *(Đóng cửa nhẹ nhàng)*. |
| **RST** | Reset | Bit hủy diệt | Ngắt kết nối ngay lập tức mà không cần báo trước hay chờ xác nhận. Giải phóng RAM ngay lập tức. *(Đập bàn bỏ đi)*. |

### 2. Áp dụng vào thực tiễn công việc (Troubleshooting)

#### Tình huống 1: Phát hiện tấn công DDoS (SYN Flood)
- **Hiện tượng**: Server bị treo, CPU thấp nhưng RAM đầy. Khách hàng không vào được web.
- **Phân tích**: Bạn mở Wireshark hoặc xem log Firewall. Bạn thấy hàng triệu gói tin **chỉ bật cờ SYN** gửi đến Server, nhưng không bao giờ thấy gói ACK quay lại.
- **Kết luận**: Hacker đang gửi yêu cầu giả. Server ngây thơ mở cửa chờ (cấp RAM) cho các kết nối ma này dẫn đến cạn kiệt tài nguyên.

#### Tình huống 2: Chẩn đoán lỗi ứng dụng hay lỗi mạng (RST vs FIN)
- **Hiện tượng**: Một ứng dụng kết nối database bị ngắt giữa chừng.
- **Phân tích**:
    - Nếu thấy cờ **FIN**: Ứng dụng đã chạy xong và đóng kết nối đúng quy trình -> **Không phải lỗi**.
    - Nếu thấy cờ **RST**:
        - Có thể Firewall ở giữa đã chặn (Block).
        - Có thể Service Database bị crash (sập) đột ngột.
        - Có thể trùng IP.
    - -> **Kết luận**: RST là dấu hiệu của sự cố bất thường. Cần kiểm tra Firewall hoặc Server Log.

#### Tình huống 3: Tại sao SSH/Telnet lại mượt? (Cờ PSH)
- Khi bạn gõ lệnh qua SSH, từng ký tự bạn gõ cần hiện lên màn hình ngay lập tức.
- SSH sẽ bật cờ **PSH** cho từng gói tin chứa ký tự đó để TCP truyền đi ngay, tạo cảm giác mượt mà (Real-time).

---

---

## PHẦN 2: SEQUENCE & ACK (SỐ THỨ TỰ & XÁC NHẬN)

Hãy tưởng tượng bạn gửi một cuốn sách dày 1000 trang (1 file nặng) qua đường bưu điện, nhưng hòm thư chỉ nhét vừa từng trang một.

**Cách làm của TCP:**
1.  Nó xé cuốn sách ra thành từng tờ.
2.  Nó đánh số thứ tự (**Sequence Number**) lên từng tờ: Trang 1, Trang 2, Trang 3...
3.  Gửi đi.

**Tại máy nhận:**
1.  Nó nhận được: Trang 1, Trang 2, Trang 4 (**Mất trang 3** do mạng lag).
2.  Nó sẽ gửi lại một gói tin **ACK (Acknowledge)** báo rằng: *"Tao nhận được đến trang 2 rồi. Gửi tiếp cho tao từ trang 3 đi (ACK 3)."*
3.  Máy gửi nghe thấy vậy sẽ gửi lại Trang 3.

👉 **Bài học**: TCP không bao giờ bỏ cuộc cho đến khi bên kia xác nhận đã nhận đủ.

---

## PHẦN 3: SLIDING WINDOW (FLOW CONTROL) - CƠ CHẾ CỬA SỔ TRƯỢT
*(Nằm ở trường Window Size - 16 bits trong Header)*

**Bản chất**: Đây là cơ chế bảo vệ **MÁY NHẬN** (Receiver). Máy nhận là "ông chủ", Máy gửi là "nhân viên". Ông chủ bảo làm bao nhiêu thì nhân viên làm bấy nhiêu.

### 1. Phân tích sâu cơ chế "Window Size"
**Window Size (RWND)**: Là con số dung lượng bộ nhớ đệm (Buffer) còn trống mà Máy Nhận quảng bá cho Máy Gửi.

**Quy trình Trượt:**
1.  Máy Nhận (Server) có RAM đệm 10MB. Nó báo **Win=10MB**.
2.  Máy Gửi (Client) gửi 1 file 2MB.
3.  Trên đường truyền, Win vẫn là 10MB. Nhưng khi dữ liệu đến nơi, lấp vào RAM, Win thực tế giảm còn **8MB**.
4.  Ứng dụng trên Server (ví dụ Web Server) lấy dữ liệu từ RAM ra xử lý.
    - **Nếu xử lý nhanh**: RAM trống lại -> Server báo ACK, **Win=10MB** (Cửa sổ trượt sang phải, trả lại chỗ trống).
    - **Nếu xử lý chậm (CPU quá tải)**: Dữ liệu ứ đọng trong RAM -> Server báo ACK, **Win=5MB** (Cửa sổ co lại).

### 2. Hiện tượng "ZERO WINDOW" (Cửa sổ đóng băng)
Đây là cơn ác mộng.
- Khi ứng dụng Server bị treo hoặc quá tải, nó không lấy dữ liệu từ RAM ra kịp. RAM đầy 100%.
- Server gửi gói tin: **Win=0**.
- **Hậu quả**: Máy Gửi **DỪNG TOÀN BỘ** việc truyền dữ liệu. Tốc độ tải về = 0 KB/s. Máy Gửi chuyển sang chế độ gửi gói thăm dò (Keep-alive Probe) định kỳ để hỏi: *"Anh có chỗ trống chưa?"*.

### 3. Áp dụng vào thực tiễn công việc
**Tình huống**: Khách hàng kêu "Mạng chậm quá, lag quá!"
Bạn là Network Admin. Bạn cần biết lỗi do Mạng Viettel hay do Server của Ứng dụng.

**Cách làm**: Dùng Wireshark bắt gói tin tại máy khách hàng.
**Phân tích**:
- **Nếu thấy nhiều gói tin báo TCP Zero Window**:
    - -> **LỖI DO SERVER/ỨNG DỤNG**. Mạng vẫn thông, chạy vù vù, nhưng Server bên kia quá yếu, xử lý không kịp nên bảo máy khách ngừng gửi.
    - **Giải pháp**: Nâng cấp RAM/CPU cho Server, tối ưu code. Đừng đổ lỗi cho đường truyền cáp quang.
- **Nếu Window Size vẫn lớn mà tốc độ chậm**:
    - -> Mới nghi ngờ do đường truyền (Mất gói, độ trễ cao).

---

## PHẦN 4: CONGESTION CONTROL - KIỂM SOÁT TẮC NGHẼN
*(Không có trường cụ thể trên Header, đây là thuật toán ngầm bên trong OS của Máy Gửi)*

**Bản chất**: Đây là cơ chế bảo vệ **HẠ TẦNG MẠNG** (Internet). Máy Gửi tự phán đoán sức khỏe của đường truyền để điều chỉnh tốc độ.

### 1. Bốn giai đoạn của thuật toán (Ví dụ: TCP Reno/CUBIC)
**Biến số quan trọng**: `CWND` (Congestion Window - Cửa sổ tắc nghẽn do máy gửi tự tính).

**Giai đoạn A: Slow Start (Khởi động mềm - Tăng tốc tên lửa)**
- **Bắt đầu**: Gửi 1 gói (MSS).
- **Nhận ACK OK** -> Tăng gấp đôi: 2 gói -> 4 gói -> 8 gói...
- **Mục đích**: Dò tìm băng thông tối đa nhanh nhất có thể.

**Giai đoạn B: Congestion Avoidance (Dò đường - Tăng từ từ)**
- Khi đạt đến ngưỡng an toàn (**SSTHRESH**), nó dừng tăng gấp đôi.
- Chuyển sang tăng **Tuyến tính**: Cứ mỗi vòng (RTT) chỉ tăng thêm 1 gói (MSS).
- **Mục đích**: Giữ tốc độ ổn định, khai thác tối đa băng thông nhưng không gây sập mạng.

**Giai đoạn C: Phát hiện Tắc nghẽn (Tai nạn xảy ra)**
Có 2 kiểu tai nạn:
1.  **Nhẹ (3 Duplicate ACKs)**: Máy nhận báo: *"Tôi nhận được gói 1, 2, 4, 5. Thiếu gói 3!"*.
    - Máy Gửi hiểu: Mạng vẫn thông, chỉ rớt 1 gói -> Kích hoạt **Fast Retransmit**.
    - **Xử lý**: Gửi lại gói 3 ngay. Giảm tốc độ đi một nửa (Giảm ga), rồi tăng lại từ từ.
2.  **Nặng (Timeout)**: Gửi đi mà im bặt, không thấy hồi âm.
    - Máy Gửi hiểu: Mạng đứt hoặc tắc nghẽn nghiêm trọng.
    - **Xử lý**: Giảm tốc độ về 1 (Về số mo). Bắt đầu lại **Slow Start**.

### 2. Áp dụng vào thực tiễn công việc

#### Tình huống 1: Tại sao Download file lúc đầu chậm, sau đó nhanh dần?
- Đó chính là **Slow Start**. Bạn thấy tốc độ từ 50KB/s -> 200KB/s -> 1MB/s -> 5MB/s. Máy tính đang dò xem đường mạng chịu được bao nhiêu.

#### Tình huống 2: Tại sao đang tải nhanh (10MB/s) tự nhiên tụt thê thảm xuống 0 rồi lại nhích lên?
- Đó là hiện tượng **Timeout**. Có thể Router nhà bạn bị quá tải xử lý (bufferbloat) hoặc đường truyền bị nhiễu nặng làm mất trọn vẹn một chuỗi gói tin. TCP bị "sốc" nên reset tốc độ về thấp nhất để bảo vệ mạng.

#### Tình huống 3: Tối ưu Server (Tuning TCP)
- Các kỹ sư Server thường chỉnh tham số `Initial Congestion Window` (initcwnd) của Linux từ 10 (mặc định cũ) lên số lớn hơn.
- **Mục đích**: Bỏ qua giai đoạn Slow Start ì ạch ban đầu để website tải nhanh hơn ngay từ giây đầu tiên (đặc biệt quan trọng với web load ảnh/video).
