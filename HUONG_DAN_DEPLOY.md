# HƯỚNG DẪN ĐƯA KHO KIẾN THỨC LÊN GITHUB

Bạn đã có Repository: `https://github.com/NguyenDinhNhan010902/networking.git`

⚠️ **Quan trọng**: Máy tính của bạn hiện **chưa cài Git**.
Đừng lo, chúng ta sẽ dùng cách **Upload thủ công** (Dễ như copy file vào USB).

## CÁCH 2: UPLOAD THỦ CÔNG (KHÔNG CẦN CÀI GIT)

### Bước 1: Chuẩn bị file
1.  Vào thư mục `d:\TaiLieuKienThucNetwork`.
2.  *(Lưu ý)*: GitHub chỉ cho upload từng file hoặc kéo thả.

### Bước 2: Upload lên GitHub
1.  Truy cập: [https://github.com/NguyenDinhNhan010902/networking](https://github.com/NguyenDinhNhan010902/networking)
2.  Nhấn vào dòng chữ **"uploading an existing file"** (hoặc nút **Add file > Upload files**).
3.  **Kéo thả toàn bộ** các file và thư mục trong `d:\TaiLieuKienThucNetwork` vào khung upload.
    *   *Mẹo*: Kéo thả cả thư mục `docs`, `package.json`, `.github` vào luôn.
4.  Chờ nó upload xong (thanh màu xanh chạy hết).
5.  Cuộn xuống dưới, mục **Commit changes**, nhấn nút xanh **Commit changes**.

### Bước 3: Kích hoạt Web (QUAN TRỌNG NHẤT)
⚠️ **Nếu không làm bước này, web sẽ không chạy!**

1.  Vào tab **Settings** của Repository đó (trên web GitHub).
2.  Menu bên trái, tìm mục **Pages** (gần cuối).
3.  Tại phần **Build and deployment** > **Source**:
    *   Bấm vào menu thả xuống (đang là *Deploy from a branch*).
    *   Chọn **GitHub Actions**.
4.  Ngay sau khi chọn xong, quay lại tab **Actions**, bạn sẽ thấy nó tự động chạy lại. Chờ 2 phút là xong.

---

## CÁCH 1: DÙNG GIT (NẾU BẠN MUỐN CÀI)
Nếu bạn muốn cài Git để sau này gõ lệnh cho "ngầu":
1.  Tải Git tại: [git-scm.com](https://git-scm.com/downloads) -> Cài đặt (Next liên tục).
2.  Tắt bật lại Terminal.
3.  Gõ các lệnh sau:
    ```bash
    git init
    git add .
    git commit -m "Upload"
    git branch -M main
    git remote add origin https://github.com/NguyenDinhNhan010902/networking.git
    git push -u origin main
    ```
