# BÀI 4.1: LÝ THUYẾT HẠ TẦNG (ARP, DHCP, ICMP)

Nếu TCP/IP là một tòa nhà, thì:
- **TCP/HTTP**: Là những người sống trong nhà (User).
- **ARP, DHCP, ICMP**: Là hệ thống điện, nước, móng nhà. Bạn không nhìn thấy chúng hàng ngày, nhưng thiếu chúng thì tòa nhà vô dụng.

Chúng ta sẽ thực hành bắt gói tin của 3 giao thức này trên máy Linux của bạn.

---

## 1. ICMP - "BÁC SĨ KHÁM BỆNH" (PING)

Bạn hay dùng lệnh `ping` để kiểm tra mạng. Thực chất ping sử dụng giao thức **ICMP (Internet Control Message Protocol)**.
Nó không dùng cổng (Port), không dùng TCP hay UDP. Nó nằm ngay trên lớp IP.

### THỰC HÀNH NGAY:

**Bước 1: Tại Terminal 1 (Monitor - Tcpdump)**
Chúng ta đổi lệnh bắt gói tin một chút (Bỏ cổng, chỉ bắt giao thức ICMP).
```bash
sudo tcpdump -i lo -nn icmp
```

**Bước 2: Tại Terminal 2 (User)**
Gõ lệnh ping chính mình:
```bash
ping -c 2 127.0.0.1
```
*`-c 2`: Chỉ ping 2 lần rồi dừng.*

**Bước 3: Phân tích kết quả (Tại T1)**
Bạn sẽ thấy 4 dòng (2 cặp):
- `IP 127.0.0.1 > 127.0.0.1: ICMP echo request, id ..., seq 1, length 64`
    - **Echo request**: Lời hỏi thăm *"Bạn sống không?"*.
- `IP 127.0.0.1 > 127.0.0.1: ICMP echo reply, id ..., seq 1, length 64`
    - **Echo reply**: Lời trả lời *"Tôi vẫn sống"*.

👉 **Bài học**: Nếu bạn ping mà thấy **Request** đi nhưng không thấy **Reply** về $\rightarrow$ Máy kia chết hoặc Firewall chặn ICMP.

---

## 2. ARP - "NGƯỜI HỎI ĐƯỜNG" (IP TO MAC)

Đây là giao thức quan trọng nhất trong mạng LAN.

**Vấn đề**: Máy tính chỉ nói chuyện bằng **MAC Address** (Tầng 2). Nhưng bạn lại ra lệnh bằng **IP** (Tầng 3).

**Nhiệm vụ ARP**: Hỏi *"Ai có IP 192.168.1.1? Xin hãy cho tôi biết số MAC của bạn!"*.

> ⚠️ **Lưu ý**: ARP không chạy trên localhost (127.0.0.1) vì máy tự biết MAC của mình. Để bắt được ARP, ta phải bắt trên card mạng thật (kết nối ra ngoài Internet/Router).

### THỰC HÀNH:

**Bước 1: Tìm tên card mạng thật**
Gõ lệnh:
```bash
ip addr
```
Tìm cái tên không phải là `lo`. Thường là `eth0`, `ens33`, `wlan0`... (Ví dụ của tôi là `ens33`).

**Bước 2: Bắt gói tin ARP (Tại T1)**
Thay `ens33` bằng tên card mạng của bạn.
```bash
sudo tcpdump -i ens33 -nn arp
```
*(Lúc này màn hình sẽ im lìm chưa có gì)*.

**Bước 3: Tạo tín hiệu ARP (Tại T2)**
Chúng ta sẽ xóa bộ nhớ đệm ARP cũ đi để bắt máy tính phải hỏi lại từ đầu, sau đó ping đến Gateway (Router).
```bash
sudo ip neigh flush all
ping -c 1 8.8.8.8
```
*(Ping 8.8.8.8 để máy buộc phải hỏi đường ra Gateway).*

**Bước 4: Quan sát T1**
Bạn sẽ thấy dòng chữ rất đời thường:
- `Request who-has 192.168.x.1 tell 192.168.x.me`
    - **Dịch**: *"Ai đang giữ IP Router (192.168.x.1)? Làm ơn báo lại cho tôi (IP của tôi) biết"*.
- Ngay sau đó Router sẽ trả lời: `Reply 192.168.x.1 is-at aa:bb:cc:dd:ee:ff`.

👉 **Bài học**: Nếu không có ARP, máy tính bị "mù", không biết gửi gói tin cho ai trong mạng LAN.

---

## 3. DHCP - "NGƯỜI CẤP SỔ HỘ KHẨU" (IP AUTOMATION)

Khi bạn vừa mở máy lên, làm sao máy có IP? Đó là nhờ **DHCP (Dynamic Host Configuration Protocol)**.

### Quy trình "Xin IP" gồm 4 bước (DORA):
1.  **Discover**: *"Có ai là DHCP Server ở đây không? Cho xin cái IP với!"* (Hét lên toàn mạng).
2.  **Offer**: Server trả lời *"Tao có IP 192.168.1.5 trống nè, lấy không?"*.
3.  **Request**: *"Ok, cho tôi xin cái số .5 đó nhé"*.
4.  **Acknowledge**: *"Rồi, chốt số .5 cho mày. Thuê trong 24h nhé"*.

### THỰC HÀNH:
Trên máy ảo Linux, việc bắt DHCP hơi khó vì nó chỉ xin IP 1 lần lúc khởi động. Nhưng chúng ta có thể ép nó xin lại.

**Bước 1: Bắt gói tin DHCP (Tại T1)**
DHCP dùng cổng UDP 67 và 68.
```bash
sudo tcpdump -i ens33 -nn -v port 67 or port 68
```

**Bước 2: Ép xin lại IP (Tại T2)**
*(Cảnh báo: Lệnh này sẽ ngắt mạng máy ảo trong 1-2 giây)*.
```bash
sudo dhclient -r && sudo dhclient -v
```
- `-r`: Trả lại IP (Release).
- `-v`: Xin lại IP mới (Renew) và hiện chi tiết.

**Bước 3: Quan sát T1**
Bạn sẽ thấy các dòng: `DHCP-DISCOVER`, `DHCP-OFFER`, `DHCP-REQUEST`, `DHCP-ACK` chạy qua.
