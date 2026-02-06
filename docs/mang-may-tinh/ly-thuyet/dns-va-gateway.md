# DNS & DEFAULT GATEWAY (CỔNG RA THẾ GIỚI)

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

### 6️⃣ Case đi làm cực phổ biến
**Case 1**:
- Có IP.
- Có Gateway.
- Nhưng không ra Internet.

👉 **Thường là**:
- Gateway đúng IP.
- Nhưng Gateway không biết đường đi tiếp (Route ra ngoài).
- Hoặc NAT trên Gateway bị tắt.
📌 *Hay gặp trong: VM, Docker, VPN.*

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

## 3. BẢNG TỔNG HỢP CHUẨN DEBUG

| Hiện tượng | Thủ phạm chủ yếu |
| :--- | :--- |
| Không có IP | **DHCP** |
| Có IP, không có Gateway | **DHCP** |
| Ping Gateway fail | **ARP / LAN** |
| Ping IP ngoài (8.8.8.8) fail | **Gateway / NAT** |
| Ping IP OK, domain fail | **DNS** |
| Curl IP OK, domain fail | **DNS** |
| Browser fail, curl OK | **DNS Cache / CORS** |

---

## 4. BÀI LAB ÁP SÁT MÁY ẢO CỦA BẠN (SELF-CHECK)

Làm lần lượt các lệnh sau và tự trả lời:

```bash
ip addr
ip route
ip neigh
cat /etc/resolv.conf
ping -c 1 8.8.8.8
ping -c 1 google.com
nslookup google.com
```

👉 **Câu hỏi kiểm tra**:
1.  Gateway của bạn là IP nào?
2.  DNS server bạn đang dùng là IP nào?
3.  Nếu xoá Gateway thì lỗi gì xảy ra?
4.  Nếu đổi DNS sang IP sai thì lỗi gì xảy ra?

> **CÂU CHỐT (RẤT QUAN TRỌNG)**:
> - **Default Gateway**: Quyết định *"Đi được hay không"*.
> - **DNS**: Quyết định *"Biết đi đâu"*.
