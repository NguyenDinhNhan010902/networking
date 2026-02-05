# QUY TRÌNH: CÀI ĐẶT UBUNTU SERVER & XỬ LÝ SỰ CỐ

## PHẦN 1: TẠO MÁY ẢO TRÊN VIRTUALBOX
**Mục tiêu:** Thiết lập phần cứng ảo đúng chuẩn để tránh lỗi về sau.

### 1. Tạo máy mới
- Mở **VirtualBox** -> Chọn **New**.
- **Name**: Đặt tên (ví dụ: `Ubuntu-Server-Lab`).
- **ISO Image**: Chọn file `.iso` Ubuntu Server bạn đã tải về.
- **Hardware**: RAM (tối thiểu **2GB**), CPU (tối thiểu **1-2 CPUs**).
- **Hard Disk**: Tạo ổ cứng ảo mới (tối thiểu **20GB**).

### 2. Cấu hình Mạng (QUAN TRỌNG NHẤT)
> ⚠️ **Lưu ý:** Tuyệt đối không nhấn Start ngay sau khi tạo máy.

1.  Chọn máy ảo vừa tạo -> Nhấn **Settings** -> **Network**.
2.  **Thẻ Adapter 1**:
    - [x] Tích chọn **Enable Network Adapter**.
    - **Attached to**: Chọn **NAT** (Khuyên dùng).
    - Mở rộng mục **Advanced** -> [x] Tích chọn **Cable Connected**.
3.  Nhấn **OK**.

---

## PHẦN 2: QUÁ TRÌNH CÀI ĐẶT (INSTALLATION)
**Mục tiêu:** Cài hệ điều hành lên ổ cứng ảo.

1.  **Khởi động**: Nhấn **Start**. Chọn `Try or Install Ubuntu Server`.
2.  **Ngôn ngữ & Bàn phím**: Chọn **English** -> **Done**.
3.  **Network Connections (Bước quyết định)**:
    - Nếu thấy dòng `eth0` (hoặc `enp0s3`) có IP `10.0.2.xx`: Mạng tốt -> Nhấn **Done**.
    - Nếu xoay vòng tròn hoặc không có IP: **Đừng lo**. Chọn **Continue without network** (Chúng ta sẽ sửa ở Phần 4).
4.  **Storage**: Giữ nguyên mặc định (**Use an entire disk**) -> **Done** -> **Continue**.
5.  **Profile Setup**: Nhập Tên, Server name, Username, Password.
6.  **SSH Setup**:
    - [x] Tích chọn **Install OpenSSH server** (Để sau này remote vào).
7.  **Featured Server Snaps**: Bỏ qua, không chọn gì -> **Done**.
8.  **Chờ cài đặt**: Khi thấy dòng **Reboot Now**, nhấn vào đó.
    *   *Lưu ý: Nếu màn hình hiện dòng "Please remove installation medium...", hãy nhấn **Enter**.*

---

## PHẦN 3: KIỂM TRA SAU KHI CÀI ĐẶT
**Mục tiêu:** Xác định xem máy có dùng được ngay hay cần sửa lỗi.

1.  Đăng nhập với Username/Password vừa tạo.
2.  Gõ lệnh kiểm tra IP:
    ```bash
    ip addr show
    ```

**Đánh giá kết quả:**
- **Trường hợp A (Thành công)**: Thấy card mạng (ví dụ `enp0s3`) có dòng `inet 10.0.2.xx`. -> **XONG** (Kết thúc quy trình).
- **Trường hợp B (Lỗi)**: Card mạng không có dòng `inet`, hoặc trạng thái là `DOWN`. -> **Làm tiếp Phần 4**.

---

## PHẦN 4: QUY TRÌNH KHẮC PHỤC LỖI MẠNG (FIXING)
*Chỉ thực hiện phần này nếu Phần 3 bị lỗi (không có IP).*

### Bước 1: Kiểm tra phần cứng
1.  Tắt máy ảo (`sudo poweroff`).
2.  Vào lại **Settings > Network** của VirtualBox kiểm tra xem đã tích "**Enable Network Adapter**" chưa. Nếu chưa thì tích vào và bật lại máy.

### Bước 2: Bật Card mạng thủ công
Đăng nhập lại và gõ lệnh:
```bash
sudo ip link set enp0s3 up
```
*(Lưu ý: Thay `enp0s3` bằng tên card mạng thực tế trên máy bạn nếu khác).*

### Bước 3: Tạo file cấu hình Netplan
*(Fix lỗi "Command not found")*
Do cài offline nên Ubuntu thiếu file cấu hình, ta tạo mới như sau:

1.  Mở trình soạn thảo:
    ```bash
    sudo nano /etc/netplan/01-netcfg.yaml
    ```
2.  Nhập nội dung chính xác (**Lưu ý**: Dùng phím **CÁCH** để thụt lề, KHÔNG dùng phím TAB):
    ```yaml
    network:
      version: 2
      ethernets:
        enp0s3:
          dhcp4: true
    ```
3.  **Lưu file**: Nhấn tổ hợp `Ctrl + O` -> `Enter`.
4.  **Thoát**: Nhấn tổ hợp `Ctrl + X`.

### Bước 4: Phân quyền file
*(Fix lỗi "Permissions too open")*
Để bảo mật file cấu hình và tránh cảnh báo vàng:
```bash
sudo chmod 600 /etc/netplan/01-netcfg.yaml
```

### Bước 5: Áp dụng và Kiểm tra
1.  Áp dụng cấu hình:
    ```bash
    sudo netplan apply
    ```
2.  Kiểm tra lại IP (bắt buộc phải có dòng `inet 10.0.2...`):
    ```bash
    ip addr show
    ```
3.  Kiểm tra Internet:
    ```bash
    ping -c 4 google.com
    ```

---

## PHẦN 5: HOÀN TẤT
Sau khi mạng đã thông, lệnh đầu tiên cần làm để hệ thống ổn định:
```bash
sudo apt update
```
