# BÀI 1: KIẾN TRÚC TCP/IP & NGHỆ THUẬT ĐÓNG GÓI (ENCAPSULATION)

## 1. BỐN TẦNG CỦA TCP/IP (THE 4 LAYERS)

Khác với OSI (7 tầng rườm rà), TCP/IP gom gọn lại chỉ còn 4 tầng thực dụng. Hãy nhớ kỹ 4 tầng này, vì mọi lỗi mạng đều nằm ở 1 trong 4 tầng này.

| Tầng TCP/IP | Tên tiếng Anh | Tương đương OSI | Nhiệm vụ cốt lõi | Dữ liệu được gọi là gì? |
| :--- | :--- | :--- | :--- | :--- |
| **4. Ứng dụng** | Application | App, Presentation, Session | Nơi bạn giao tiếp (Chrome, Python). Tạo ra dữ liệu. | **Data** (Dữ liệu) |
| **3. Giao vận** | Transport | Transport | Đảm bảo chuyển hàng (TCP/UDP). Chia nhỏ dữ liệu. | **Segment** (Phân đoạn) |
| **2. Internet** | Internet | Network | Định vị và tìm đường (IP, Router). | **Packet** (Gói tin) |
| **1. Truy nhập** | Network Access | Data Link, Physical | Chuyển tín hiệu vật lý (MAC, Dây, Sóng). | **Frame** (Khung) |

---

## 2. QUY TRÌNH ĐÓNG GÓI (ENCAPSULATION) - "BÚP BÊ NGA"

Đây là kiến thức quan trọng nhất của bài hôm nay.
Khi bạn gửi dòng chữ **"Hello"** từ máy A sang máy B, nó không bay đi ngay. Nó phải trải qua quy trình **Đóng gói (Encapsulation)** - giống như trò chơi Búp bê Nga (cái nhỏ lồng trong cái lớn).

Hãy tưởng tượng bạn là CEO (Tầng 4) muốn gửi thư mật:

### Bước 1: Tầng Application (Tạo Data)
- **Hành động**: Bạn viết thư: "Nội dung: Chào em".
- **Kết quả**: Ta có **DATA**.

### Bước 2: Tầng Transport (Đóng gói thành Segment)
- **Hành động**: Thư ký (TCP) nhận thư. Cô ấy bỏ vào phong bì số 1, ghi bên ngoài: *"Gửi đến Cửa số 80 (Port Web), Dịch vụ đảm bảo (TCP)"*.
- **Kỹ thuật**: Nó gắn thêm cái đầu **TCP Header** vào Data.
- **Kết quả**: Ta có **SEGMENT** (Phân đoạn).

### Bước 3: Tầng Internet (Đóng gói thành Packet)
- **Hành động**: Bộ phận văn thư (IP) nhận phong bì số 1. Họ bỏ tiếp vào phong bì khổ lớn (số 2), ghi: *"Gửi đến nhà số 14.1.2.3 (IP Đích), Từ nhà 192.168.1.10 (IP Nguồn)"*.
- **Kỹ thuật**: Nó gắn thêm **IP Header** vào Segment.
- **Kết quả**: Ta có **PACKET** (Gói tin).
- **Lưu ý**: Router chỉ quan tâm đến cái phong bì này (Packet).

### Bước 4: Tầng Network Access (Đóng gói thành Frame)
- **Hành động**: Shipper (Ethernet) nhận phong bì số 2. Anh ta bỏ vào cái thùng carton cứng (số 3) để chở đi, dán tem: *"Gửi đến xe tải biển số AA-BB-CC (MAC Address)"*.
- **Kỹ thuật**: Nó gắn thêm **Ethernet Header** (đầu) và **Trailer** (đuôi) vào Packet.
- **Kết quả**: Ta có **FRAME** (Khung).

👉 **Tóm lại**: `Frame` chứa `Packet` chứa `Segment` chứa `Data`.

---

## 3. KHI SANG ĐẾN MÁY NHẬN (DE-ENCAPSULATION)

Khi gói tin đến máy B, quy trình diễn ra ngược lại (Bóc tách):

1.  **Tầng 1 (Access)**: Nhìn thấy đúng MAC của mình $\rightarrow$ Xé bỏ vỏ thùng (Frame) $\rightarrow$ Lấy Packet đưa lên trên.
2.  **Tầng 2 (Internet)**: Nhìn thấy đúng IP nhà mình $\rightarrow$ Xé bỏ phong bì lớn (Packet) $\rightarrow$ Lấy Segment đưa lên trên.
3.  **Tầng 3 (Transport)**: Kiểm tra toàn vẹn, sắp xếp lại thứ tự $\rightarrow$ Xé bỏ phong bì nhỏ (Segment) $\rightarrow$ Lấy Data đưa cho đúng cổng (Port).
4.  **Tầng 4 (App)**: Chrome nhận được chữ "Hello" và hiển thị lên màn hình.

---

## 4. BÀI TẬP VẬN DỤNG (CÓ ĐÁP ÁN)

**Câu hỏi 1:** Router (như cục Modem Viettel nhà bạn) nằm chủ yếu ở Tầng mấy trong mô hình TCP/IP? Khi Router xử lý gói tin, nó có xé cái phong bì đến tận cùng để đọc nội dung bức thư ("Hello") không?

<details>
<summary>👉 <b>Xem đáp án & Giải thích</b></summary>
<br>

**1. Router nằm ở đâu?**
- Router hoạt động chủ yếu ở **Tầng Internet (Tầng 2)** (tương ứng với Layer 3 - Network trong OSI).
- Lý do: Router cần đọc địa chỉ IP (nằm trong IP Header) để định tuyến gói tin.

**2. Router có đọc nội dung thư không?**
- **KHÔNG**. Router chỉ quan tâm đến địa chỉ trên phong bì (Packet Header).
- Nó sẽ "xé" bỏ lớp vỏ thùng xe tải (Frame - Tầng 1) để lấy cái phong bì (Packet - Tầng 2) ra xem địa chỉ, sau đó lại đóng vào một cái thùng mới (Frame mới) để chuyển đi tiếp.
- Nó **không** mở phong bì để xem thư (Segment/Data) bên trong (trừ khi nó là các thiết bị bảo mật chuyên sâu như Deep Packet Inspection Firewall).

</details>

<br>

**Câu hỏi 2:** Tại sao chúng ta phải chia làm nhiều tầng và đóng nhiều lớp phong bì như vậy? Tại sao không ghi luôn IP, Port, MAC lên cùng 1 cái phong bì cho nhanh?

<details>
<summary>👉 <b>Xem đáp án & Giải thích</b></summary>
<br>

**Mục đích tối thượng: Sự ĐỘC LẬP (Modularity).**

1.  **Dễ dàng thay thế & Nâng cấp**:
    - Nhờ chia tầng, các tầng hoạt động độc lập với nhau.
    - Ví dụ: Nếu bạn đổi từ dùng **Wifi** sang dùng **Dây cáp quang** (Thay đổi Tầng 1 - Network Access), thì trình duyệt **Chrome** (Tầng 4 - Application) **không cần viết lại code**.
    - Tầng trên không cần quan tâm tầng dưới "vận chuyển" bằng xe máy, xe tải hay máy bay. Nó chỉ cần biết hàng sẽ đến nơi.

2.  **Chuyên môn hóa**:
    - Mỗi tầng chỉ tập trung làm tốt một việc. Tầng 1 lo vật lý, Tầng 2 lo đường đi, Tầng 3 lo kiểm soát lỗi, Tầng 4 lo hiển thị.
    - Nếu gộp chung, "cái phong bì" sẽ trở nên cực kỳ phức tạp và nếu muốn sửa đổi một phần nhỏ (ví dụ đổi IP v4 sang IPv6) sẽ phải sửa lại toàn bộ hệ thống từ phần cứng đến phần mềm.

</details>
