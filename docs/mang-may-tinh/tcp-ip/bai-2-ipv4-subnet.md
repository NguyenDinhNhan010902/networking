# BÀI 2: GIẢI MÃ IPv4 & CÂY KÉO VÀNG (SUBNET MASK)

Bạn đã nhìn thấy IP `192.168.1.1` cả trăm lần. Nhưng bạn có thực sự hiểu ý nghĩa của từng con số đó không?

## 1. CẤU TRÚC IPv4 (BẢN CHẤT LÀ NHỊ PHÂN)

Máy tính không hiểu số **192**. Nó chỉ hiểu **1** và **0**.

Địa chỉ IPv4 thực chất là một dãy **32 bit** (32 số 0 và 1), được chia làm 4 nhóm (mỗi nhóm 8 bit).

**Ví dụ:** `192.168.1.1`
- Dưới mắt máy tính: `11000000.10101000.00000001.00000001`

Nhưng điều quan trọng nhất không phải là đổi số nhị phân, mà là hiểu **ý nghĩa logic** của nó. Một địa chỉ IP luôn gồm 2 phần:

1.  **Network ID (Tên phố)**: Định danh cho cả mạng (Ví dụ: Phố 192.168.1).
2.  **Host ID (Số nhà)**: Định danh cho từng máy trong phố đó (Ví dụ: Nhà số .1, nhà số .2).

---

## 2. SUBNET MASK - "CÂY KÉO" CẮT MẠNG

Làm sao máy tính biết đâu là "Phố", đâu là "Số nhà" trong dãy số `192.168.1.1`?
Nó cần một người chỉ điểm, đó là **SUBNET MASK**.

Subnet Mask cũng có 4 nhóm số, đi kèm IP như hình với bóng. Quy tắc cực kỳ đơn giản:
- Gặp số **255**: Là **PHỐ** (Giữ nguyên, không được đổi).
- Gặp số **0**: Là **NHÀ** (Được phép đặt tùy ý cho các thiết bị).

### Ví dụ kinh điển (Mạng gia đình):
- **IP**: `192.168.1.10`
- **Subnet Mask**: `255.255.255.0`

👉 **Phân tích**:
1.  **3 số 255 đầu tiên** -> Khóa chặt 3 nhóm đầu của IP (`192.168.1`). Đây là **tên Phố**. Tất cả máy trong nhà bạn **BẮT BUỘC** phải bắt đầu bằng `192.168.1`.
2.  **Số 0 cuối cùng** -> Tương ứng với số `.10`. Đây là **số nhà**. Bạn có thể đổi thành `.20`, `.99`, `.200`.

---

## 3. TẠI SAO CẦN CHIA MẠNG? (VẤN ĐỀ CỦA DOANH NGHIỆP)

Ở nhà bạn dùng Mask `255.255.255.0` (gọi tắt là **/24**).
Nghĩa là bạn có 1 số 0 ở cuối (8 bit) để đặt số nhà.

**Công thức tính số máy tối đa:**
$$2^8 - 2 = 254 \text{ máy}$$

*Tại sao trừ 2? Vì trừ đi số đầu tiên (Địa chỉ mạng) và số cuối cùng (Broadcast).*

### Tình huống:
Công ty bạn có **1000 nhân viên**.
Nếu dùng Mask **/24** (chỉ chứa được 254 máy) -> **KHÔNG ĐỦ CHỖ**.

👉 **Giải pháp**: Phải đổi Subnet Mask khác để mở rộng "Số nhà", thu hẹp "Tên phố".

**Ví dụ đổi sang Mask `255.255.0.0` (gọi tắt là /16).**
- Lúc này **2 số 0** ở cuối là dành cho Số nhà.
- Số máy tối đa: $2^{16} - 2 = 65.534$ máy. (Tha hồ dùng).

---

## 4. BÀI TẬP THỰC CHIẾN (KIỂM TRA IQ MẠNG)

Bạn hãy làm bài tập này để xem mình đã hiểu cách Subnet Mask hoạt động chưa.

**Tình huống**: Máy A và Máy B được cắm vào cùng một Switch (Switch Layer 2 - cùng tầng vật lý).
- **Máy A**: IP `192.168.1.10` / Subnet Mask `255.255.255.0`
- **Máy B**: IP `192.168.2.10` / Subnet Mask `255.255.255.0`

**Câu hỏi**: Theo bạn, khi Máy A ping Máy B (`ping 192.168.2.10`), hai máy có nhìn thấy nhau và nói chuyện được không? Tại sao?

<details>
<summary>👉 <b>Xem đáp án & Giải thích</b></summary>
<br>

**1. Kết quả:**
- **KHÔNG THÔNG**. Hai máy hoàn toàn "câm nín" với nhau, dù dây mạng vẫn sáng đèn.

**2. Lý do thực sự nằm ở SUBNET MASK (Cây kéo vàng):**
- **Máy A**: Subnet `255.255.255.0` $\rightarrow$ Nó hiểu là: *"Chỉ những ai có đầu `192.168.1` mới là người nhà của tôi"*.
- **Máy B**: Subnet `255.255.255.0` $\rightarrow$ Nó hiểu là: *"Chỉ những ai có đầu `192.168.2` mới là người nhà của tôi"*.

**👉 Kết luận:** Máy A coi Máy B là **NGƯỜI LẠ** (Khác mạng/Different Network).

- Theo luật của TCP/IP: Muốn nói chuyện với người lạ (khác mạng), bắt buộc phải đi qua **Router** (Default Gateway).
- Nếu 2 máy chỉ cắm vào **Switch** (Tầng 2) mà không có Router, chúng sẽ không thể giao tiếp được.

</details>
