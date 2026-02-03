# Hướng Dẫn Sử Dụng Kho Kiến Thức

Chào bạn, kho kiến thức của bạn đã được thiết lập thành công!
Dưới đây là các bước để bạn làm việc hằng ngày.

## 1. Cấu trúc thư mục

```text
/docs/
  ├── index.md           # Trang chủ
  ├── mang-may-tinh/     # Kiến thức Mạng
  ├── lap-trinh/         # Kiến thức Lập trình
  └── .vitepress/        # Cấu hình website
```

## 2. Cách thêm bài viết mới

Ví dụ bạn muốn thêm bài "Giao thức TCP" vào mục **Mạng máy tính**:

1.  Tạo file mới tại: `docs/mang-may-tinh/giao-thuc-tcp.md`.
2.  Viết nội dung bằng Markdown:
    ```markdown
    # Giao thức TCP
    
    TCP là giao thức hướng kết nối...
    ```
3.  Để hiển thị bài viết này lên **Menu bên trái (Sidebar)**, bạn cần sửa file cấu hình:
    - Mở file: `docs/.vitepress/config.mts`
    - Tìm mục `sidebar` -> `/mang-may-tinh/`
    - Thêm dòng mới vào `items`:
      ```js
      items: [
        { text: 'Giới thiệu', link: '/mang-may-tinh/' },
        { text: 'Mô hình OSI', link: '/mang-may-tinh/mo-hinh-osi' },
        { text: 'Giao thức TCP', link: '/mang-may-tinh/giao-thuc-tcp' } // Thêm dòng này
      ]
      ```

## 3. Cách xem trang web

Để xem trang web trên máy tính của bạn:

1.  Mở Terminal (VS Code hoặc Command Prompt).
2.  Gõ lệnh:
    ```sh
    npm run docs:dev
    ```
3.  Truy cập vào địa chỉ hiện ra (thường là `http://localhost:5173`).

## 4. Tìm kiếm
Bạn có thể ấn `Ctrl + K` (hoặc icon Search) trên website để tìm kiếm bất kỳ từ khóa nào trong kho tài liệu.
