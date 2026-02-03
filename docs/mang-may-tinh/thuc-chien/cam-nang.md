# CẨM NANG THỰC CHIẾN (DÙNG CHO CÔNG VIỆC)

Đây là "hộp đồ nghề" của bạn. Mở ra khi mạng gặp sự cố.

---

## 1. QUY TRÌNH "KÊ ĐƠN BỐC THUỐC" (TROUBLESHOOTING)

Khi người dùng kêu: *"Mạng bị sao ấy em ơi!"*. Hãy làm theo 3 bước:

### Bước 1: Kiểm tra phần cứng (Lớp 1)
*   Đèn Modem/Router có sáng không?
*   Dây mạng có bị chuột cắn, lỏng giắc không?
*   Biểu tượng Wifi/LAN trên máy tính có dấu X đỏ hay dấu Chấm than vàng?
    *   **X đỏ**: Đứt dây/Chưa cắm.
    *   **Chấm than**: Đã cắm, nhưng không có Internet (Lỗi IP/Gateway/ISP).

### Bước 2: Dùng lệnh PING (Lớp 3)
Gõ: `ping 8.8.8.8`
*   Nếu `Reply`: Mạng Internet thông. Chuyển sang Bước 3.
*   Nếu `Request timed out`: Mạng bị chặn hoặc chập chờn.
*   Nếu `General failure`: Lỗi Card mạng hoặc sai IP máy mình (chưa tới được Gateway).

### Bước 3: Kiểm tra DNS (Lớp 7)
Gõ: `ping google.com`
*   Nếu `Ping 8.8.8.8` được mà `Ping google.com` không được -> **Lỗi DNS**.
*   **Giải pháp**: Đổi DNS sang 8.8.8.8.

---

## 2. CÔNG CỤ SINH TỒN (COMMAND LINE)

| Lệnh | Tác dụng | Khi nào dùng? |
| :--- | :--- | :--- |
| `ipconfig /all` | Xem IP, MAC, Gateway, DNS của máy mình. | Khi mới ngồi vào máy lạ. |
| `ping <địa chỉ>` | Kiểm tra có thông mạng tới đích không. | Dùng đầu tiên khi sửa mạng. |
| `tracert <địa chỉ>` | Dò đường đi, xem tắc ở trạm nào. | Khi mạng chậm, lag, hoặc không vào được web nhất định. |
| `nslookup <tên>` | Kiểm tra phân giải tên miền. | Khi vào web bằng IP được mà bằng tên không được. |
| `netstat -an` | Soi các cổng đang mở. | Khi nghi ngờ virus hoặc kiểm tra phần mềm lạ. |
| `arp -a` | Xem các máy đang kết nối trong LAN. | Kiểm tra xem có nhận diện được máy in/máy chấm công không. |

---

## 3. CÁC TÌNH HUỐNG THƯỜNG GẶP (CASE STUDY)

### Máy in không in được
*   **Triệu chứng**: Gửi lệnh in nhưng máy in im re.
*   **Xử lý**:
    1.  `Ping <IP_Máy_In>`.
    2.  Nếu không thấy -> Kiểm tra dây máy in, hoặc xem máy in có bị đổi IP không.
    3.  Nếu thấy -> Vào `Control Panel` xóa lệnh in cũ (kẹt lệnh).

### Wifi có sóng nhưng không vào mạng (Chấm than vàng)
*   **Nguyên nhân 1**: Router bị treo (Nóng quá). -> Rút điện cắm lại.
*   **Nguyên nhân 2**: DHCP bị lỗi (Không cấp được IP). -> Set IP tĩnh để test.
*   **Nguyên nhân 3**: Quên đóng tiền mạng. -> Gọi tổng đài.
