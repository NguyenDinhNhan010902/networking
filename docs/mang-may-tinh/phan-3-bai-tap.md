# PHẦN 3: ỨNG DỤNG (BÀI TẬP THỰC CHIẾN)

Bài tập này sẽ giúp bạn nhìn thấy "bộ mặt thật" của các trang web. Chúng không phải là những cái tên đẹp đẽ như `google.com`, mà là những con số khô khan.

---

## BÀI TẬP 1: VẠCH TRẦN DNS (NSLOOKUP)

Chúng ta sẽ dùng lệnh `nslookup` (Name Server Lookup) để tra cứu sổ địa chỉ của Internet.

### Hành động
Mở CMD và gõ lệnh:
```cmd
nslookup google.com
```

### Giải mã kết quả (Quan trọng)
Hãy xem kỹ những dòng chữ khô khan hiện ra, đây là kiến thức quý giá để xử lý sự cố.

```text
Server:  UnKnown
Address:  2402:800:20ff:109c::1

Non-authoritative answer:
Name:    google.com
Addresses:  2404:6800:4005:827::200e
          142.250.198.206
```

1.  **Server: UnKnown**: Đừng lo, không phải lỗi.
    *   Nghĩa là cái máy chủ trả lời bạn (thường là Router nhà mạng) nó "lười", không có tên định danh.
    *   Địa chỉ `2402:800...`: Đây là IPv6 của nhà mạng (VNPT thường dùng đầu số này). Chứng tỏ mạng nhà bạn rất xịn, chạy song song IPv4 và IPv6.

2.  **Non-authoritative answer** (Câu trả lời không chính chủ):
    *   Ví dụ: Bạn hỏi bác bảo vệ: *"Sếp đang ở đâu?"*. Bác bảo vệ nhớ mang máng: *"Hình như ở phòng 206"*. Bác bảo vệ không phải là Sếp, nên câu trả lời đó gọi là **Non-authoritative**.
    *   **Kỹ thuật**: DNS Server của nhà mạng không quản lý tên miền `google.com`. Nó chỉ nhớ (cache) lại từ lần trước ai đó hỏi.

3.  **Addresses**: `142.250.198.206`: Đây chính là đích đến. Trình duyệt sẽ âm thầm kết nối đến con số này.

---

## BÀI TẬP 2: KỸ NĂNG "SINH TỒN" (KHI DNS CHẾT)

Đây là tình huống thực tế bạn sẽ gặp 1000 lần trong đời làm IT:
> Khách hàng kêu: *"Em không vào được Facebook/Web, nhưng Zalo vẫn nhắn tin được!"*

### Chẩn đoán
*   Zalo chạy App, dùng IP cứng.
*   Web cần tên miền.
*   -> **Kết luận**: DNS Server của nhà mạng bị lỗi, hoặc bị chặn.

### Cách kiểm tra (Troubleshoot)
Chúng ta sẽ ép máy tính hỏi một người uy tín hơn (Google DNS `8.8.8.8`), thay vì hỏi Router "lười biếng" của nhà mạng.

**Hành động**:
Gõ lệnh sau vào CMD:
```cmd
nslookup google.com 8.8.8.8
```
*(Lưu ý số 8.8.8.8 ở cuối)*.

**Ý nghĩa**: "Này máy tính, đừng hỏi Router nữa, hãy chạy sang Mỹ hỏi thẳng máy chủ DNS của Google xem `google.com` nằm ở đâu".

**Kết quả**:
Bạn sẽ thấy dòng `Server: dns.google` (Rất uy tín). Và địa chỉ IP trả về có thể sẽ khác hoặc giống, nhưng chắc chắn là câu trả lời đáng tin cậy.
