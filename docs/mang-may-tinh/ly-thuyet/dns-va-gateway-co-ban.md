# DNS & DEFAULT GATEWAY: KIẾN THỨC CƠ BẢN

Nội dung này tách biệt khỏi phần hạ tầng vì độ phức tạp và tầm quan trọng đặc biệt của nó trong thực tế đi làm.

---

## 1. DEFAULT GATEWAY (CỔNG THOÁT RA KHỎI LAN)

### 1️⃣ Default Gateway là gì? (nói thẳng, không sách vở)
👉 **Default Gateway = Cửa thoát duy nhất của máy bạn ra khỏi LAN.**

Máy bạn chỉ nói chuyện trực tiếp được với IP cùng mạng.

**Ví dụ:**
- IP máy: `192.168.1.10/24`
- LAN: `192.168.1.0` – `192.168.1.255`

👉 **Quy tắc đi lại:**
- Đến `192.168.1.20` → Đi thẳng (Direct).
- Đến `8.8.8.8` (Internet) → **PHẢI QUA GATEWAY**.

### 2️⃣ Nếu KHÔNG có Default Gateway thì sao?
Triệu chứng cực quen:
```bash
ping 192.168.1.1   # OK
ping 8.8.8.8       # FAIL
```
👉 **Lý do**: Máy không biết gửi gói tin ra ngoài LAN cho ai.
**Kết luận**: Đây là lỗi 100% thuộc tầng Network.

### 3️⃣ Default Gateway hoạt động thế nào trong máy?
Xem bằng lệnh:
```bash
ip route
```
Ví dụ kết quả:
```nginx
default via 192.168.1.1 dev ens33
```
**Dịch đúng nghĩa**: *"Mọi gói tin không biết gửi cho ai → đưa cho 192.168.1.1"*.

📌 **Ghi nhớ**:
- Default Gateway không cần thông minh.
- Nó chỉ là "người nhận gói đầu tiên" khi muốn ra ngoài.

### 4️⃣ Điều QUAN TRỌNG mà nhiều người không biết
👉 Gateway **LUÔN LÀ IP TRONG CÙNG LAN** với bạn.

❌ **Không bao giờ là**:
- `8.8.8.8`
- IP ngoài Internet

Nếu thấy Gateway kiểu đó → Cấu hình **SAI**.

### 5️⃣ Mối quan hệ ARP ↔ Gateway (Rất thực tế)
Muốn gửi gói ra ngoài:
1.  IP đích không cùng LAN.
2.  Quyết định gửi cho Gateway.
3.  ❗ Nhưng Gateway chỉ nhận MAC.
4.  → Máy phải **ARP hỏi MAC Gateway**.
5.  → Có MAC → mới gửi được.

👉 **Hệ quả**: Gateway tồn tại nhưng **ARP chết** = Vẫn không đi đâu được.

---

## 2. DNS (NGƯỜI PHIÊN DỊCH TÊN → IP)

### 1️⃣ DNS là gì? (nói đúng bản chất)
👉 DNS không phải Internet.
👉 **DNS chỉ là sổ danh bạ**.

Ví dụ: `google.com` → `142.250.xxx.xxx`

📌 Nếu bạn: `ping 8.8.8.8` → **KHÔNG CẦN DNS**.

### 2️⃣ DNS nằm ở đâu trong mô hình?
- **OSI**: Application.
- **TCP/IP**: Application.
👉 DNS KHÔNG phải Transport.
👉 DNS KHÔNG phải Network.

### 3️⃣ DNS hoạt động thế nào trong máy Linux?
File quan trọng: `/etc/resolv.conf`.

Ví dụ:
```nginx
nameserver 8.8.8.8
nameserver 1.1.1.1
```
👉 **Lưu ý**: Thứ tự rất quan trọng. Dòng trên fail → mới hỏi dòng dưới.

### 4️⃣ DNS lookup thực tế (đời thật)
Khi bạn gõ: `curl https://google.com`

**Flow thật:**
1.  Gọi DNS → hỏi IP.
2.  Có IP → mới TCP Handshake.
3.  TCP OK → mới HTTPS Handshake.
4.  HTTPS OK → mới gửi HTTP Request.

👉 **Kết luận**: DNS fail = Dừng ngay từ bước 1.

### 5️⃣ Case kinh điển bạn chắc chắn gặp
**Case 2**:
```bash
ping 8.8.8.8 OK
ping google.com FAIL
```
👉 **Kết luận NGAY**:
- ❌ DNS lỗi.
- ✔️ Internet vẫn sống.

### 6️⃣ DNS dùng UDP hay TCP?
| Trường hợp | Giao thức |
| :--- | :--- |
| Query nhỏ | **UDP 53** |
| Response lớn | **TCP 53** |
| Zone transfer | **TCP** |

👉 **Debug**:
```bash
sudo tcpdump -i ens33 port 53
```

### 7️⃣ DNS Cache – Vừa lợi vừa hại
Cache ở đâu?
- OS
- Browser
- Router
- ISP

👉 **Hệ quả**: Cache sai → DNS ma (vào web cũ hoặc lỗi).

**Fix**:
```bash
sudo systemd-resolve --flush-caches
# Hoặc trên Windows:
ipconfig /flushdns
```

### 8️⃣ DNS trong môi trường đi làm (Rất quan trọng)
Backend hay gặp:
- DNS nội bộ (intranet).
- Service name → IP private.
- Kubernetes / Docker DNS.

Ví dụ: `db.internal.company` → `10.0.0.5`
👉 **Kết luận**: DNS sai = Backend chết hàng loạt.

### 9️⃣ Mối quan hệ DNS ↔ Default Gateway
📌 **DNS server LUÔN nằm ngoài máy bạn**.

Muốn hỏi DNS:
- Gói tin (Query DNS) phải đi qua Gateway.

👉 **Nếu**:
- DNS đúng.
- Nhưng Gateway chết.
- → DNS vẫn **FAIL**.

---

## 3. DẤU HIỆU ĐIỂN HÌNH CỦA LỖI DNS

Thường gặp 1 hoặc nhiều dấu hiệu sau:

❌ Vào web bằng tên miền không được (google.com)

✅ Nhưng ping IP vẫn được (8.8.8.8)

**Trình duyệt báo:**
- `DNS_PROBE_FINISHED_NXDOMAIN`
- `DNS server not responding`
- `ERR_NAME_NOT_RESOLVED`

---

## 4. 🔍 CÁCH KIỂM TRA CHUẨN (THEO THỨ TỰ)

### 1️⃣ Kiểm tra mạng có hoạt động không
Mở CMD / PowerShell:
```powershell
ping 8.8.8.8
```

👉 **Kết quả:**
- ✅ Reply bình thường → **MẠNG OK**
- ❌ Request timed out → Không phải DNS, là **lỗi mạng**

### 2️⃣ Kiểm tra DNS có phân giải tên miền không
```powershell
ping google.com
```

👉 **So sánh kết quả:**

| Kết quả | Kết luận |
| :--- | :--- |
| Ping IP được, ping domain không được | ✅ **LỖI DNS** |
| Cả hai không được | ❌ Lỗi mạng |
| Cả hai được | DNS bình thường |

### 3️⃣ Dùng nslookup (xác định chính xác 100%)
```powershell
nslookup google.com
```

👉 **Nếu là lỗi DNS sẽ thấy:**
- `DNS request timed out`
- `server can't find google.com`
- `No response from server`

→ **Kết luận: DNS có vấn đề**

### 4️⃣ Xem DNS server đang dùng
```powershell
ipconfig /all
```

Tìm dòng: `DNS Servers . . . :`

❌ **DNS nhà mạng hay lỗi** (Thường là IP kiểu `192.168.1.1` hoặc `203.xxx.xxx.xxx`)

### 5️⃣ Test nhanh bằng cách đổi DNS
Đổi sang DNS công cộng:

| DNS | IP |
| :--- | :--- |
| Google DNS | `8.8.8.8` / `8.8.4.4` |
| Cloudflare | `1.1.1.1` / `1.0.0.1` |

Sau đó chạy:
```powershell
ipconfig /flushdns
```

→ Vào lại web

👉 **Nếu vào được → XÁC NHẬN LỖI DNS**

---

## 5. 🧠 CHECKLIST NHANH (NHÌN LÀ BIẾT)

| Hiện tượng | Có phải lỗi DNS? |
| :--- | :--- |
| Chỉ không vào được web, app khác OK | ✅ |
| Ping IP được, ping domain không | ✅ |
| Đổi DNS là hết | ✅ **100%** |
| Mất mạng hoàn toàn | ❌ |

