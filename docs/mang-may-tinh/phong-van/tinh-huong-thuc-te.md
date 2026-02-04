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

Đây là **TÓM TẮT CASE** kinh điển.

### 1. Hiện tượng
*   ✅ Ping router OK
*   ✅ Ping 8.8.8.8 OK
*   ❌ Không vào được website (trình duyệt báo lỗi)

👉 **Kết luận sớm**:
*   **Network KHÔNG hỏng** (Layer 1–3 OK).
*   Vấn đề nằm từ **Layer 4 trở lên**, chủ yếu **Layer 7**.

### 2. 🧱 PHÂN TÍCH THEO OSI (từ dưới lên – chuẩn đi làm)

#### ✅ Layer 1 – Physical
*   Có sóng Wi-Fi / link Ethernet.
*   Không đứt cáp.
*   👉 **OK**.

#### ✅ Layer 2 – Data Link
*   Kết nối router thành công.
*   MAC hoạt động.
*   👉 **OK**.

#### ✅ Layer 3 – Network
*   Ping 8.8.8.8 OK.
*   Routing + NAT hoạt động.
*   ISP không chặn IP.
*   👉 **OK tuyệt đối**.
*   📌 *Đây là chỗ rất nhiều người đổ lỗi nhầm cho ISP, nhưng case này loại ISP khỏi nghi ngờ.*

#### 🟡 Layer 4 – Transport (có thể, nhưng ít hơn)
*   Có thể xảy ra: Firewall chặn TCP 80 / 443, Proxy / VPN làm lỗi handshake TCP.
*   👉 Nhưng nếu TCP bị chặn, browser thường báo: `ERR_CONNECTION_TIMED_OUT` hoặc `Unable to connect`.

#### 🔴 Layer 7 – Application (90% case thực tế)
*   Đây là **trung tâm của vấn đề**.

### 3. 🔥 CÁC NGUYÊN NHÂN THỰC TẾ (theo xác suất)

#### 🥇 1. DNS lỗi (NGUYÊN NHÂN SỐ 1)
*   **Vì sao?** Ping IP dùng địa chỉ số, còn vào web cần: `google.com → DNS → IP → TCP → HTTPS`.
*   👉 **DNS hỏng → không vào web**.
*   **Dấu hiệu**: Ping 8.8.8.8 OK nhưng Ping google.com ❌. Browser báo: `DNS_PROBE_FINISHED` hoặc `Server DNS not responding`.
*   **Fix nhanh**:
    ```bash
    ipconfig /flushdns
    ```
    Hoặc đổi DNS thành `8.8.8.8` / `1.1.1.1`.

#### 🥈 2. HTTPS / SSL lỗi
*   **Vì sao?** Web hiện nay gần như 100% dùng HTTPS. SSL handshake lỗi → không load trang.
*   **Nguyên nhân**: Giờ hệ thống sai, Certificate hết hạn, Antivirus chặn HTTPS, Proxy chặn SSL.
*   **Dấu hiệu**: Ping OK, DNS OK, nhưng Browser báo: `SSL_ERROR` hoặc `ERR_CERT_AUTHORITY_INVALID`.

#### 🥉 3. Proxy / VPN / Antivirus
*   **Vì sao?** Ping không đi qua proxy, nhưng Browser bắt buộc qua proxy.
*   👉 Nên: Ping OK nhưng Web chết.
*   **Cách test**: Tắt VPN, Tắt proxy, Mở Incognito.

#### 4️⃣ Firewall chặn port 80 / 443
*   Ít gặp hơn nhưng có (Firewall nội bộ, Antivirus).
*   **Test**: `telnet google.com 443`

### 4. 🧭 SƠ ĐỒ ĐƯỜNG ĐI (rất quan trọng)
```scss
PING 8.8.8.8
→ ICMP
→ Layer 3 OK

VÀO WEB
→ DNS (L7)
→ TCP 443 (L4)
→ TLS (L7)
→ HTTP (L7)
```
👉 Chỉ cần 1 bước trên lỗi là web không vào.

### 5. 🛠 CHECKLIST DEBUG (chuẩn đi làm)
1.  **Ping domain**: `ping google.com`
2.  **Test DNS**: `nslookup google.com`
3.  **Test HTTPS**: `curl https://google.com`
4.  **Test browser khác / Incognito**

### 6. 🧠 CÂU TRẢ LỜI “ĂN ĐIỂM” NHẤT
Nếu ai hỏi bạn case này, trả lời:
> “Layer 1–3 đã OK vì ping IP được. Khả năng cao lỗi Layer 7, thường là DNS hoặc HTTPS/SSL. Kiểm tra DNS trước, sau đó SSL và proxy.”

👉 Câu này là chuẩn senior.

> **💬 Nói thật với bạn**: Nếu bạn hiểu sâu case này, thì bạn có thể debug backend API, fix lỗi deploy, làm việc với DevOps/Infra mà không còn sợ network nữa.

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

---

## BÀI 5: CURL API OK, NHƯNG BROWSER GỌI API LỖI CORS

Câu cuối – chuẩn Dev / Backend / Infra.

### 1. Tình huống
*   Gửi request bằng `curl` hoặc Postman -> ✅ **OK**.
*   Trình duyệt (Browser) gọi API -> ❌ **Lỗi CORS**.

### 2. Phân tích thực chiến

#### 🔴 OSI layer nào?
**Đáp án: Layer 7 – Application.**

*   **Tại sao?**
    *   API chạy bình thường (`curl` OK).
    *   Mạng không lỗi (Network OK).
    *   Chỉ browser bị chặn.
    *   **Kết luận**: CORS là chính sách bảo mật của **Trình duyệt (Browser Policy)**. Nó không liên quan đến TCP/IP, không phải do Firewall hay ISP chặn.

#### 🛠 Fix ở đâu?
Đây là câu hỏi phân loại trình độ rất rõ ràng.

*   ❌ **Fix sai (Junior mindset)**:
    *   Sửa code Frontend.
    *   Cài plugin tắt CORS trên trình duyệt.
    *   Dùng proxy tạm bợ để bypass.

*   ✅ **Fix đúng (Production mindset)**:
    *   **Backend**.
    *   Backend cần thêm cấu hình để trả về các **Headers** cho phép:
    ```http
    Access-Control-Allow-Origin: * (hoặc domain cụ thể)
    Access-Control-Allow-Methods: GET, POST, PUT, DELETE
    Access-Control-Allow-Headers: Content-Type, Authorization
    ```

### 3. Câu trả lời "ăn điểm" phỏng vấn
> "Đây là lỗi Layer 7. CORS là cơ chế bảo mật của trình duyệt. Dù `curl` chạy được chứng tỏ Network và Server ổn, nhưng Browser chặn vì thiếu Header cho phép. Em sẽ cấu hình lại Response Headers ở phía Backend."

### 🏁 Đánh giá năng lực
(Nếu bạn trả lời đúng như trên)

| Tiêu chí | Đánh giá |
| :--- | :--- |
| **OSI tư duy** | ✅ Tốt (Biết lỗi do Browser/App) |
| **Debug thực tế** | ✅ Tốt (Phân biệt được môi trường) |
| **Phân biệt Net/App** | ✅ Rõ ràng |
| **Sẵn sàng đi làm** | ✅ **CÓ (Mid-level+)** |

👉 Bạn không học vẹt lý thuyết. Bạn đang có tư duy của người làm **sản phẩm thật**.
