# DNS & DEFAULT GATEWAY: NÂNG CAO (LEVEL SENIOR)

Phần này đi sâu vào các cơ chế hoạt động chi tiết, các trường hợp nâng cao và bài Lab thực chiến.

---

## 1. DNS NÂNG CAO (KHÔNG CÒN LÀ SỔ DANH BẠ)

### 1️⃣ DNS KHÔNG CHỈ LÀ “HỎI → TRẢ LỜI”
#### Chuỗi DNS thật sự ngoài đời
Khi bạn hỏi `google.com`, DNS không trả lời ngay.

**Chuỗi thực tế:**
1.  **Stub Resolver** (Máy bạn).
2.  → **Recursive Resolver** (DNS ISP / 8.8.8.8): *"Để tao đi hỏi hộ"*.
3.  → **Root Server** (.): *"Tao không biết, hỏi thằng .com đi"*.
4.  → **TLD Server** (.com): *"Tao không biết, hỏi thằng Google đi"*.
5.  → **Authoritative Server** (google.com): *"Đây, IP của nó đây!"*.
6.  → Trả lời ngược về cho bạn.

👉 **Chốt**: Máy bạn **KHÔNG BAO GIỜ** hỏi Root DNS trực tiếp.

#### Recursive vs Authoritative (cực quan trọng)
| Loại | Làm gì |
| :--- | :--- |
| **Recursive DNS** | Đi hỏi hộ bạn (Ví dụ: 8.8.8.8, 1.1.1.1) |
| **Authoritative DNS** | Giữ đáp án thật, nơi chứa bản ghi gốc |

📌 **Google DNS (8.8.8.8) = Recursive**.
📌 **DNS của domain bạn quản lý (AWS Route53, Cloudflare...) = Authoritative**.

#### LAB: Nhìn tận mắt DNS chain
```bash
dig google.com
dig +trace google.com
```
👉 `+trace` sẽ cho bạn thấy hành trình từ **Root** $\rightarrow$ **.com** $\rightarrow$ **NS Google**.
📌 Đây là lệnh senior dùng để debug lỗi phân giải tên miền.

---

### 2️⃣ TTL – LÝ DO “SỬA DNS MÀ KHÔNG ĂN”
**TTL (Time To Live)** = Thời gian được phép cache.

Ví dụ bản ghi:
`google.com. 300 IN A 142.250.xxx.xxx`
→ Cache trong **300 giây (5 phút)**.

**Case đi làm cực đau:**
- Bạn đổi IP server sang server mới.
- User cũ vẫn truy cập vào server cũ.
👉 **Lý do**:
- TTL quá cao (Ví dụ 24h).
- ISP Cache.
- Router Cache.

**LAB Check TTL:**
```bash
dig google.com
```
Nhìn phần `;; ANSWER SECTION`. Số giây sẽ giảm dần mỗi lần bạn query lại.

---

### 3️⃣ DNS RECORDS (KHÔNG BIẾT LÀ CHẾT)

| Record | Dùng khi |
| :--- | :--- |
| **A** | Domain → IPv4 |
| **AAAA** | Domain → IPv6 |
| **CNAME** | Alias (Tên bí danh) |
| **MX** | Mail Server |
| **TXT** | Xác thực (SPF / DKIM / Verify site) |
| **NS** | Name Server (Chỉ định ai quản lý DNS) |

**Case thực tế:**
```powershell
curl IP      # OK
curl domain  # FAIL
```
👉 **90% Lỗi do:**
- CNAME trỏ sai.
- A record vẫn trỏ server cũ.

---

### 4️⃣ DNS FAILOVER & LOAD BALANCING
DNS có thể trả về nhiều IP cho 1 domain:
```text
api.myapp.com → 10.0.0.1
api.myapp.com → 10.0.0.2
```
👉 Client sẽ tự chọn 1 trong 2 IP (Round Robin).

📌 **Lưu ý quan trọng**:
- DNS **KHÔNG** biết server sống hay chết.
- DNS **KHÔNG** real-time (do dính Cache/TTL).
👉 Vì vậy **DNS không thể thay thế Load Balancer** chuyên dụng.

---

### 5️⃣ DNS & DOCKER / K8S (CỰC THỰC TẾ)
Trong Docker:
```bash
docker run --name db postgres
```
👉 App chỉ cần gọi: `db:5432`
👉 Docker DNS tự động resolve: `db` $\rightarrow$ `IP container`.

❌ **Kết luận**: DNS nội bộ sai = App chết ngay lập tức (Lỗi "Connection Refused" hoặc "Unknown Host").

---

### 6️⃣ DNS BẢO MẬT (DNS POISONING)
Hacker có thể tấn công ARP Spoofing $\rightarrow$ Fake DNS response $\rightarrow$ User vào web giả mạo.

📌 **Giải pháp**:
- **DNS over HTTPS (DoH)**: Mã hóa gói tin DNS.
- **DNSSEC**: Ký số xác thực bản ghi DNS.

---

## 2. DEFAULT GATEWAY NÂNG CAO (KHÔNG CHỈ 1 CỬA)

### 1️⃣ Gateway KHÔNG PHẢI LÚC NÀO CŨNG 1 CÁI
Kiểm tra Routing Table chi tiết:
```bash
ip route
```
Ví dụ:
```nginx
default via 192.168.1.1
10.0.0.0/8 via 10.1.1.1
```
👉 Máy sẽ chọn route **cụ thể nhất** (Longest Prefix Match).
- Đi Internet → `192.168.1.1`
- Đi mạng 10.x.x.x → `10.1.1.1`

### 2️⃣ POLICY ROUTING (LEVEL CAO)
👉 Một máy có thể có nhiều Gateway.

**Ví dụ**:
- Traffic VPN → Đi Gateway A.
- Traffic Internet thường → Đi Gateway B.

Lệnh check nâng cao:
```bash
ip rule
ip route show table all
```
📌 **Dùng trong**: VPN Server, Load Balancing, Cloud Server nhiều NIC.

### 3️⃣ NAT – LÝ DO MÁY BẠN RA INTERNET ĐƯỢC
IP của bạn thường là **Private IP** (`192.168.x.x`).
👉 Internet **KHÔNG** định tuyến (route) Private IP.

Router phải làm **SNAT (Source NAT)**:
`192.168.1.10` (Private) $\rightarrow$ `14.232.x.x` (Public)

❌ **Kết luận**: NAT chết = Ping Gateway OK nhưng **KHÔNG** ra được Internet.

---

### 4️⃣ LAB: TỰ NHÌN NAT
Trên Linux Server (hoặc Router):
```bash
sudo iptables -t nat -L -n
```
*(Trên các máy ảo VM có thể bị ẩn do lớp Hypervisor quản lý).*

---

### 5️⃣ MULTI-HOMED SERVER (SERVER NHIỀU CARD MẠNG)
Case kinh điển backend mới đi làm hay gặp:
- **NIC 1**: Public Network.
- **NIC 2**: Private Network (Database).

❌ **Lỗi**: Cấu hình Default Gateway sai card $\rightarrow$ Server bị "mất mạng một chiều" (Gửi được nhưng không nhận được về, hoặc ngược lại).

### 6️⃣ GATEWAY & CLOUD (AWS / GCP / AZURE)
Trên Cloud, các khái niệm được đổi tên nhưng bản chất y hệt:

| Thành phần Cloud | Bản chất |
| :--- | :--- |
| **Internet Gateway** | Router |
| **NAT Gateway** | Server chạy NAT |
| **Route Table** | Bảng `ip route` |

👉 **Tư duy**: Cloud chỉ là một mạng Linux phóng to.

---

## 3. CHECKLIST DEBUG & LAB BẮT BUỘC

### 1️⃣ CHECKLIST DEBUG CHUẨN ĐI LÀM
Khi sếp báo *"MẠNG LỖI EM ƠI"*, hãy làm theo thứ tự:

| Bước | Lệnh | Mục đích |
| :--- | :--- | :--- |
| 1 | `ip addr` | Tôi có IP chưa? Interface có UP không? |
| 2 | `ip route` | Tôi có biết đường ra không? Gateway là ai? |
| 3 | `ip neigh` | Tôi có thấy Gateway (MAC) không? (Check ARP) |
| 4 | `ping gateway` | Đường dây ra cửa có thông không? |
| 5 | `ping 8.8.8.8` | Internet có thông không? (Check NAT/Routing) |
| 6 | `cat /etc/resolv.conf` | Tôi đang hỏi ai để dịch tên miền? |
| 7 | `dig google.com` | Sổ danh bạ có hoạt động không? |
| 8 | `tcpdump` | Vũ khí cuối cùng: Bắt tận tay gói tin. |

### 2️⃣ LAB SENIOR
Làm trên VM Linux của bạn:

```bash
# 1. Check DNS path
dig google.com
dig +trace google.com

# 2. Check Routing logic
ip route
ip rule

# 3. Connectivity check
ping -c 1 8.8.8.8
ping -c 1 google.com
```

👉 **Trả lời các câu hỏi sau:**
1.  DNS Recursive Server (Nameserver) bạn đang dùng là IP nào?
2.  TTL hiện tại của `google.com` là bao nhiêu giây?
3.  Gateway chính (Default) của bạn là IP nào?
4.  Máy bạn đang có bao nhiêu dòng routing (bao nhiêu đường đi)?
5.  Nếu `dig` (DNS) lỗi nhưng `ping 8.8.8.8` OK, lỗi nằm ở đâu?

> **CÂU CHỐT CUỐI (RẤT QUAN TRỌNG)**
> - **DNS**: Quyết định *"Biết đi đâu"*.
> - **Gateway**: Quyết định *"Đi bằng đường nào"*.
> - **NAT**: Quyết định *"Ra được khỏi nhà hay không"*.
