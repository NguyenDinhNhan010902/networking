# QUY TRÌNH KẾT NỐI SSH TỪ POWERSHELL VÀO UBUNTU VIRTUALBOX

## MỤC TIÊU
- Mở được nhiều cửa sổ Terminal trên Windows để điều khiển một máy ảo Linux.
- Cho phép **Copy/Paste** dòng lệnh từ Windows vào Linux (điều mà màn hình VirtualBox mặc định không làm được).
- Hiểu rõ cơ chế mạng và cách xử lý sự cố kết nối.

---

## PHẦN 1: CHUẨN BỊ TRÊN MÁY ẢO (LINUX GUEST)
Trước khi kết nối từ bên ngoài, "nội thất" bên trong máy ảo phải sẵn sàng đón nhận kết nối.

### 1. Kiểm tra dịch vụ SSH
Dịch vụ SSH (Secure Shell) đóng vai trò như "người gác cổng", lắng nghe yêu cầu kết nối tại cổng số **22**.

- **Lệnh kiểm tra trạng thái**:
  ```bash
  sudo systemctl status ssh
  ```
  - **Kết quả đạt**: Có chấm xanh lá cây và chữ `active (running)`.
  - **Kết quả lỗi**: `inactive (dead)` hoặc `Unit ssh.service could not be found`.

- **Lệnh cài đặt và khởi động** (Nếu chưa có):
  ```bash
  sudo apt update
  sudo apt install openssh-server -y  # Cài đặt dịch vụ
  sudo systemctl enable --now ssh     # Bật dịch vụ ngay lập tức và tự bật khi khởi động lại
  ```

### 2. Cấu hình Tường lửa (UFW)
Ubuntu Server mặc định bật tường lửa. Nếu không mở cửa, mọi kết nối sẽ bị chặn (gây ra lỗi `Connection refused`).

- **Lệnh mở cổng**:
  ```bash
  sudo ufw allow ssh
  ```
  *Giải thích: Lệnh này cho phép các kết nối đi vào cổng 22 (cổng mặc định của SSH).*

- **Lệnh kiểm tra lại**:
  ```bash
  sudo ufw status
  ```
  *Kết quả đạt: Thấy dòng `22/tcp ALLOW ...` hoặc `OpenSSH ALLOW ...`.*

---

## PHẦN 2: CẤU HÌNH "CÂY CẦU" (VIRTUALBOX SETTINGS)
Do máy ảo đang chạy chế độ mạng NAT (ẩn sau máy thật), Windows không thể nhìn thấy IP `10.0.2.15` của nó. Ta phải dùng kỹ thuật **Port Forwarding** (Chuyển tiếp cổng).

**Nguyên lý**: Khi Windows gửi tín hiệu vào cổng **2222** của chính nó -> VirtualBox sẽ bắt lấy và chuyển tín hiệu đó vào cổng **22** của máy ảo.

### Quy trình thiết lập:
1.  **Vị trí**: VirtualBox -> Settings -> Network -> Adaper 1 (NAT) -> Advanced -> **Port Forwarding**.
2.  **Thông số kỹ thuật** (Bắt buộc chính xác):

| Tham số | Giá trị | Giải thích chi tiết |
| :--- | :--- | :--- |
| **Name** | `SSH` | Tên gợi nhớ (đặt tùy ý). |
| **Protocol** | `TCP` | Giao thức truyền tải tin cậy. |
| **Host IP** | *(Để trống)* | **Quan trọng**: Để trống nghĩa là chấp nhận kết nối từ mọi giao diện mạng của Windows. |
| **Host Port** | `2222` | Cổng trên Windows. Có thể chọn số khác (vd: 2223, 8080) miễn là không trùng phần mềm khác. |
| **Guest IP** | *(Để trống)* | **Quan trọng**: Để trống để VirtualBox tự động định tuyến vào máy ảo hiện tại. |
| **Guest Port** | `22` | Cổng mặc định của dịch vụ SSH trên Linux. **Không được đổi** nếu không cấu hình lại Linux. |

---

## PHẦN 3: KẾT NỐI TỪ WINDOWS (CLIENT)
Sử dụng **Windows PowerShell** hoặc **Command Prompt (CMD)**.

**Câu lệnh kết nối chuẩn**:
```powershell
ssh -p 2222 adminnhan@localhost
```

**Giải thích chi tiết từng thành phần lệnh**:
- `ssh`: Gọi chương trình SSH Client có sẵn trên Windows.
- `-p 2222`: (Port) Chỉ định cổng kết nối là 2222 (khớp với **Host Port** đã cài ở Phần 2). Nếu không có tham số này, nó sẽ tự vào cổng 22 và thất bại.
- `adminnhan`: Tên người dùng (Username) trên máy Linux.
- `@`: Ký tự ngăn cách.
- `localhost`: Địa chỉ máy đích. Do ta đã forward port về chính máy mình (Host), nên đích đến là "chính tôi" (`localhost` hoặc `127.0.0.1`).

---

## PHẦN 4: CÁC LỖI THƯỜNG GẶP & CÁCH KHẮC PHỤC (TROUBLESHOOTING)

### Lỗi 1: "Connection refused"
```plaintext
ssh: connect to host localhost port 2222: Connection refused
```
- **Hiện tượng**: Bị từ chối ngay lập tức.
- **Nguyên nhân A**: Dịch vụ SSH trên Linux chưa chạy. -> **Fix**: Xem Phần 1 (Lệnh `systemctl`).
- **Nguyên nhân B**: Tường lửa chặn. -> **Fix**: Xem Phần 1 (Lệnh `ufw allow`).
- **Nguyên nhân C**: Sai cổng Port Forwarding. -> **Fix**: Kiểm tra lại Phần 2 xem Guest Port có đúng là 22 không.

### Lỗi 2: Cảnh báo "The authenticity of host... can't be established"
```plaintext
The authenticity of host '[localhost]:2222' can't be established.
ED25519 key fingerprint is ...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```
- **Hiện tượng**: Hệ thống dừng lại và hỏi.
- **Bản chất**: Đây **KHÔNG PHẢI LỖI**. Đây là cơ chế bảo mật (Fingerprint Check). Lần đầu tiên kết nối, Windows chưa biết máy chủ này là ai nên hỏi xác nhận.
- **Cách xử lý**: Gõ chữ `yes` rồi nhấn **Enter**. *(Lưu ý: Phải gõ đủ chữ `yes`, gõ `y` đôi khi không nhận)*.

### Lỗi 3: Nhập Password không hiện gì
- **Hiện tượng**: Sau khi nhập `yes`, màn hình hiện `adminnhan@localhost's password:`, bạn gõ phím nhưng màn hình đứng yên.
- **Bản chất**: Cơ chế bảo mật của Linux **không hiển thị ký tự mật khẩu** (để chống nhìn trộm).
- **Cách xử lý**: Cứ gõ đúng mật khẩu bình thường, sau đó nhấn **Enter**.

### Lỗi 4: "Port Forwarding rules are not valid"
- **Hiện tượng**: VirtualBox báo lỗi khi lưu cấu hình mạng.
- **Nguyên nhân**: Do nhập sai định dạng IP (ví dụ nhập chữ vào ô IP) hoặc Host Port bị trùng.
- **Cách xử lý**: Xóa trắng 2 ô **Host IP** và **Guest IP**.
