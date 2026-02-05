# TÀI LIỆU PHÂN TÍCH: TRẠNG THÁI HOẠT ĐỘNG UBUNTU SERVER 24.04

## 1. Màn hình thông tin hệ thống (System Information)
*Tham chiếu hình ảnh: Màn hình Welcome khi đăng nhập thành công.*

Đây là bảng điều khiển (Dashboard) đầu tiên xuất hiện khi đăng nhập SSH hoặc Console thành công. Các thông số này xác nhận hệ điều hành đã tương tác tốt với phần cứng ảo hóa.

### Các chỉ số quan trọng:

- **System load (0.52)**:
    - *Định nghĩa*: Chỉ số tải trung bình của CPU trong 1 phút, 5 phút và 15 phút vừa qua.
    - *Ý nghĩa*: Con số **0.52** cho thấy hệ thống đang xử lý tác vụ nhẹ nhàng. Nếu con số này vượt quá số lượng lõi CPU (ví dụ > 2.0 trên máy 2 core) thì máy đang bị quá tải.

- **Usage of / (39.9% of 11.21GB)**:
    - *Định nghĩa*: Dung lượng lưu trữ của phân vùng gốc (Root partition - `/`).
    - *Ý nghĩa*: Xác nhận việc phân vùng ổ cứng khi cài đặt đã thành công. Hệ điều hành đã nhận diện được ổ cứng ảo 20GB (hoặc kích thước bạn đã set) và đang sử dụng khoảng 4GB cho file hệ thống.

- **Memory usage (9%)**:
    - *Định nghĩa*: Mức tiêu thụ RAM hiện tại.
    - *Ý nghĩa*: Hệ thống đang hoạt động rất tối ưu, chỉ chiếm **9% RAM**. Điều này chứng tỏ không có tiến trình nào bị rò rỉ bộ nhớ (memory leak).

- **IP Address (IPv4)**:
    - Thông thường sẽ hiển thị ngay tại đây. Nếu ban đầu chưa nhận mạng, dòng này có thể bị trống cho đến khi ta gõ lệnh `ip addr show`.

---

## 2. Trạng thái Giao diện Mạng (Network Interfaces)
*Tham chiếu lệnh:* `ip addr show`

Đây là phần quan trọng nhất để nghiệm thu kết nối mạng. Kết quả lệnh được chia làm 2 phần chính:

### Thành phần 1: Giao diện Loopback (`lo`)
```bash
1: lo: <LOOPBACK,UP,LOWER_UP> ...
    inet 127.0.0.1/8 ...
```
- **Giải thích**: Đây là giao diện mạng ảo nội bộ, **luôn luôn tồn tại** trên mọi hệ thống Linux.
- **Tác dụng**: Dùng để các ứng dụng trong máy tự giao tiếp với nhau (ví dụ: Database nói chuyện với Web Server trên cùng 1 máy).
- **Lưu ý**: Giao diện này **không dùng** để kết nối ra Internet.

### Thành phần 2: Giao diện Ethernet (`enp0s3`)
```bash
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> ...
    link/ether 08:00:27:7a:55:6c ...
    inet 10.0.2.15/24 ...
```
- **Quy tắc đặt tên**:
    - `en` = Ethernet (Mạng dây).
    - `p0` = Bus 0 (Vị trí gắn trên mainboard ảo).
    - `s3` = Slot 3 (Khe cắm ảo).

- **Trạng thái vật lý**: `<BROADCAST,MULTICAST,UP,LOWER_UP>`
    - `UP`: **Quan trọng nhất**. Báo hiệu card mạng đã được bật nguồn và driver hoạt động tốt.
    - `LOWER_UP`: Báo hiệu đã nhận tín hiệu vật lý (tương đương đèn cổng mạng sáng, dây cáp đã cắm).

- **Địa chỉ MAC**: `link/ether 08:00:27:7a:55:6c`
    - Đây là địa chỉ vật lý của card mạng ảo do VirtualBox cấp.

- **Địa chỉ IPv4 (Quan trọng nhất)**: `inet 10.0.2.15/24`
    - `10.0.2.15`: Địa chỉ IP mà máy ảo nhận được. Đây là dải IP mặc định của chế độ NAT trong VirtualBox.
    - `/24`: Subnet mask (255.255.255.0).
    - **Kết luận**: Máy đã nhận IP thành công từ DHCP Server của VirtualBox.

- **Địa chỉ IPv6**: `inet6 fe80::...`
    - Địa chỉ IP thế hệ mới, tự động sinh ra (Link-local). Hiện tại chưa cần quan tâm nếu chỉ dùng IPv4.

---

## 3. Cấu hình Netplan & Cảnh báo Bảo mật
*Tham chiếu lệnh:* `sudo netplan apply`

Phần này giải thích cơ chế quản lý mạng trên Ubuntu Server hiện đại (từ bản 18.04 trở đi dùng **Netplan** thay vì `/etc/network/interfaces`).

- **Lệnh thực thi**: `sudo netplan apply`
    - Dùng để biên dịch file cấu hình `.yaml` thành cấu hình mạng thực tế cho `systemd-networkd`.

- **Cảnh báo (Warning)**:
    > `Permissions for /etc/netplan/01-netcfg.yaml are too open`

    - **Nguyên nhân**: File cấu hình mạng chứa thông tin nhạy cảm nhưng đang được cấp quyền `644` (hoặc cao hơn), nghĩa là user thường cũng đọc được.
    - **Tiêu chuẩn bảo mật**: Linux yêu cầu các file cấu hình hệ thống quan trọng nên có quyền `600` (Chỉ chủ sở hữu - `root` - mới được đọc/ghi).
    - **Đánh giá**: Đây là cảnh báo nhắc nhở (Warning), **không phải lỗi** (Error). Cấu hình vẫn được áp dụng thành công.
    - **Khắc phục**: Chạy lệnh `sudo chmod 600 <file>` để tuân thủ quy tắc an toàn thông tin.

---

## 4. Cấu hình Hạ tầng Ảo hóa (Infrastructure)
*Tham chiếu: VirtualBox Settings.*

Để hệ điều hành bên trong (Guest OS) hoạt động được như trên, phần cứng ảo phải được thiết lập đúng:

1.  **Adapter Type (Intel PRO/1000 MT Desktop)**:
    - Ubuntu tự động nhận diện driver cho loại card mạng phổ biến này mà không cần cài thêm driver ngoài.

2.  **Attachment Mode (NAT)**:
    - **NAT** = Network Address Translation.
    - Máy ảo ẩn sau máy thật. Máy thật đóng vai trò như một Router phát wifi cho máy ảo.
    - Đây là lý do máy ảo có IP `10.0.2.15` (mạng con) nhưng vẫn ra được Google.

3.  **Cable Connected**:
    - Mô phỏng trạng thái vật lý của dây mạng.
    - Nếu bỏ tích mục này, trạng thái trong Linux sẽ chuyển từ `UP` sang `DOWN`.

---

## KẾT LUẬN NGHIỆM THU
Hệ thống Ubuntu Server đã được cài đặt thành công. Mọi thông số từ **Kernel** (nhân hệ điều hành), **Disk** (ổ cứng), **Memory** (RAM) đến **Network** (Mạng) đều đang hoạt động đúng thiết kế.
