# CÁC TÌNH HUỐNG THỰC TẾ (CASE STUDY)

Đây là nơi tập hợp các bài toán thực tế hóc búa, được biên soạn theo tư duy phân tích sâu sắc của "người trong nghề". Hãy thấm nhuần từng dòng phân tích dưới đây.

---

## BÀI 1: MẤT MẠNG NHƯNG BIỂU TƯỢNG WIFI VẪN ĐẦY

### 1. Tình huống
*   Laptop kết nối được Wi-Fi.
*   Hiện biểu tượng sóng đầy.
*   Ping Internet (`8.8.8.8`) **không được**.
*   Ping Router (`192.168.1.1`) **được**.

### 2. Phân tích chi tiết

#### Câu 1: Lỗi nằm ở tầng OSI nào?
**Đáp án: Tầng 3 (Network Layer).**
*   **Lý do**: Tầng 1 (Vật lý) và Tầng 2 (Liên kết dữ liệu) đã ổn vì Wi-Fi vẫn kết nối và có sóng. Tầng 3 chịu trách nhiệm định tuyến (Routing) và địa chỉ IP. Việc gói tin dừng lại ở Router mà không đi tiếp được là vấn đề về cấu hình IP hoặc định tuyến tại tầng này.

#### Câu 2: Vì sao ping Router được nhưng không ra Internet?
Có 3 nguyên nhân chính thường gặp trong thực tế:
1.  **Sai Default Gateway**: Máy tính biết đường đến Router, nhưng Router không biết phải đẩy dữ liệu đi đâu tiếp theo hoặc máy tính đang trỏ Gateway về một địa chỉ không tồn tại.
2.  **Lỗi DNS**: Tuy nhiên, trong đề bài bạn ping `8.8.8.8` không được (đây là IP trực tiếp), nên chúng ta **loại trừ** nguyên nhân do DNS.
3.  **Router mất kết nối WAN**: Router vẫn hoạt động bình thường trong mạng nội bộ (LAN), nhưng đường truyền từ Modem/Router ra nhà mạng (ISP) bị đứt hoặc chưa cấu hình đúng.

#### Câu 3: Kiểm tra bước nào đầu tiên?
Nếu là tôi, bước đầu tiên tôi sẽ kiểm tra **Default Gateway** và **Trạng thái kết nối WAN** trên Router.

---

### 3. Phân tích sai lầm: "Lỗi do set sai IP"

Câu trả lời "Sai địa chỉ IP" chỉ đúng nếu rơi vào trường hợp:
*   **Bạn set sai Default Gateway**: Ví dụ Router là `192.168.1.1` nhưng bạn lại đặt Gateway trên máy là `192.168.1.254`. Lúc này bạn vẫn ping được Router nhưng máy tính "không biết đường ra" Internet.
*   **Trùng IP**: Một thiết bị khác trong mạng đang dùng cùng IP với bạn, gây xung đột khiến kết nối chập chờn hoặc mất hướng.

**Chốt lại**: Nếu bạn set sai hoàn toàn địa chỉ IP (ví dụ máy là `172.16.x.x` trong khi Router là `192.168.1.x`), bạn sẽ **không bao giờ** ping được `192.168.1.1`. Vì bạn đã ping được Router, nên cấu hình IP của bạn về cơ bản là "thông", chỉ là "chưa đủ" để đi xa hơn thôi.

---

## BÀI 2: ROUTER PING ĐƯỢC 8.8.8.8 NHƯNG MÁY KHÔNG RA ĐƯỢC

### 1. Tình huống
*   Router ping được 8.8.8.8.
*   Máy tính không ping được 8.8.8.8.

### 2. Nguyên nhân (Thường gặp khi đi làm)

#### 🔴 Layer 3 – Network (máy client)
*   **Máy không có default gateway**.
*   **Gateway sai**:
    ```text
    Ví dụ thực tế:
    IP: 192.168.1.10
    Gateway: (trống)
    ```
*   **IP bị trùng**.
*   **Subnet mask sai**.

#### 🔴 Layer 4 – Firewall trên máy
*   Windows Firewall chặn Outbound.
*   Antivirus chặn ICMP.
*   VPN cấu hình sai.

### 3. 🛠 Cách kiểm tra chuẩn dân IT

**1️⃣ Kiểm tra IP máy**
```bash
ipconfig
```
*   Có gateway chưa?
*   Gateway có đúng IP router không?

**2️⃣ Ping router**
```bash
ping 192.168.1.1
```

**3️⃣ Tracert**
```bash
tracert 8.8.8.8
```
*   Dừng ở hop nào?

### 🧠 Tóm lại (rất quan trọng)

| Tình huống | Layer nghi ngờ |
| :--- | :--- |
| Không kết nối Wi-Fi | Layer 1–2 |
| Ping router không được | Layer 2 |
| Ping router được, không ra internet | Layer 3 (client) |
| Ping IP được, không vào web | Layer 7 |

> **💬 Nhận xét chân thành**: Bạn không yếu OSI, bạn chỉ đang áp dụng đúng khái niệm nhưng chưa khớp ngữ cảnh. Và đó là thứ rèn được rất nhanh. 👍

---

## BÀI 3: PING router OK, PING 8.8.8.8 OK, NHƯNG KHÔNG VÀO WEB ĐƯỢC

### 1. Phân tích loại trừ (Senior Mindset)

Bạn nghi OSI layer nào đầu tiên? Nhiều người hay đoán mò là "ISP chặn IP/MAC". Hãy xem xét:

**🔴 Chặn MAC** -> **Layer 2 – Data Link**
*   Thường xảy ra trong: Mạng nội bộ, Captive Portal, Nhà mạng khóa MAC modem.
*   📌 **Nhưng**: MAC KHÔNG ĐI RA INTERNET. ISP ngoài Internet không thể chặn MAC của máy bạn được.

**🔴 Chặn IP** -> **Layer 3 – Network**
*   ISP có thể: Block IP, Chặn route, Chặn ICMP/TCP.

**🧠 QUAN TRỌNG NHẤT: QUAY LẠI TRIỆU CHỨNG**
*   Ping router được.
*   Ping 8.8.8.8 được.
*   ❌ Không vào được website.

👉 **Điều này nói lên**:
*   ✅ Layer 3 OK (IP OK, Routing OK, ISP KHÔNG chặn IP).

### 2. 🎯 Layer nghi ngờ ĐÚNG NHẤT trong tình huống này

**🟢 Layer 7 – Application**
Các nguyên nhân thực tế:
*   ❌ **DNS sai**.
*   ❌ **DNS bị hijack**.
*   ❌ **HTTPS / SSL lỗi** (Sai giờ hệ thống).
*   ❌ **Proxy / VPN**.
*   ❌ **Firewall chặn port 443**.

### 3. 🛠 Senior sẽ kiểm tra gì trước?

**1️⃣ Test DNS**
```bash
nslookup google.com
```

**2️⃣ Thử truy cập bằng IP**
```text
https://142.250.xxx.xxx
```

**3️⃣ Kiểm tra port 443**
```bash
telnet google.com 443
```

### 🧠 Bảng sửa lỗi tư duy
| Suy nghĩ | Chỉnh lại |
| :--- | :--- |
| ISP chặn MAC | ❌ MAC không ra Internet |
| ISP chặn IP | ❌ Nếu ping 8.8.8.8 được thì IP không bị chặn |
| Không vào web = ISP | ❌ 80% là DNS / HTTPS |
| Layer 7 = mạng | ❌ Layer 7 = ứng dụng |

---

## BÀI 4: PING DOMAIN LỖI, PING IP ĐƯỢC

### 1. Kết luận
*   **Kết luận chính xác là**: Kết nối Internet vẫn thông suốt, nhưng **dịch vụ phân giải tên miền (DNS)** đang gặp sự cố.
*   Máy tính của bạn giống như một người có điện thoại nhưng **không có danh bạ**. Bạn có thể gọi trực tiếp bằng số (IP), nhưng không thể gọi bằng tên (Domain).

### 2. Lỗi thuộc tầng OSI nào?
*   **Lỗi này nằm ở Tầng 7 (Application Layer)**.
*   **Giải thích**: DNS là một giao thức dịch vụ nằm ở tầng ứng dụng. Mặc dù nó hỗ trợ cho việc thiết lập kết nối ở tầng dưới, nhưng bản thân tiến trình phân giải tên miền được coi là hoạt động ở tầng cao nhất của mô hình OSI.

### 3. Cách khắc phục (Fix) nhanh nhất là gì?

⚠️ **Chỉnh lại ý hiểu cho bạn**:
*   Lệnh `nslookup` cũng dùng máy chủ DNS để tra cứu. Nếu DNS đang lỗi, `nslookup` thường cũng sẽ thất bại.
*   **Quan trọng hơn**: Bạn **không thể** điền "IP của một trang web" vào ô cấu hình DNS của máy tính được. Ô đó phải là **IP của một Máy chủ DNS** (người giữ danh bạ).

**🛠 Thao tác (Fix nhanh)**
1.  **Bước 1**: Mở cài đặt Card mạng (Network Connections).
2.  **Bước 2**: Chọn IPv4 Properties.
3.  **Bước 3**: Thay đổi mục "Use the following DNS server addresses" thành:
    *   Preferred DNS: `8.8.8.8` (Google)
    *   Alternate DNS: `1.1.1.1` (Cloudflare)
4.  **Bước 4**: (Tùy chọn) Mở CMD gõ lệnh `ipconfig /flushdns` để xóa bộ nhớ đệm cũ.

**Chốt lại**:
*   **Lỗi**: Đúng là do DNS không phân giải được Domain sang IP.
*   **Cách khắc phục**: Điền IP của DNS Server (như 8.8.8.8) để máy tính có "cuốn từ điển" tra cứu.
