import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: '/networking/',
    title: "Kho Kiến Thức",
    description: "Nơi lưu trữ và tra cứu kiến thức cá nhân",
    lang: 'vi-VN',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Trang chủ', link: '/' },
            { text: 'Mạng Máy Tính', link: '/mang-may-tinh/' },
            { text: 'Lập Trình', link: '/lap-trinh/' }
        ],

        sidebar: {
            '/mang-may-tinh/': [
                {
                    text: 'Mạng Máy Tính (Mới)',
                    items: [
                        { text: 'Giới thiệu', link: '/mang-may-tinh/' },
                        {
                            text: '1. Lý thuyết Cốt lõi',
                            collapsed: false,
                            items: [
                                { text: 'Tổng quan & Giao thức', link: '/mang-may-tinh/ly-thuyet/cot-loi' }
                            ]
                        },
                        {
                            text: '2. Thực chiến Công việc',
                            collapsed: false,
                            items: [
                                { text: 'Cẩm nang & Tool', link: '/mang-may-tinh/thuc-chien/cam-nang' }
                            ]
                        },
                        {
                            text: '3. Cẩm nang Phỏng vấn',
                            collapsed: false,
                            items: [
                                { text: 'Câu hỏi & Tư duy', link: '/mang-may-tinh/phong-van/cau-hoi' },
                                { text: 'Xử lý Tình huống (Case Study)', link: '/mang-may-tinh/phong-van/tinh-huong-thuc-te' }
                            ]
                        }
                    ]
                },
                {
                    text: 'Kho Lưu Trữ (Giai đoạn 1)',
                    collapsed: true,
                    items: [
                        {
                            text: 'Phần 1: Hạ Tầng (L1-L3)',
                            items: [
                                { text: 'Lý thuyết (OSI, IP, MAC)', link: '/mang-may-tinh/phan-1-ly-thuyet' },
                                { text: 'Bài tập (Ping, Gateway)', link: '/mang-may-tinh/phan-1-bai-tap' }
                            ]
                        },
                        {
                            text: 'Phần 2: Giao Vận (L4-L7)',
                            items: [
                                { text: 'Lý thuyết (TCP/UDP, DNS)', link: '/mang-may-tinh/phan-2-ly-thuyet' },
                                { text: 'Bài tập (Netstat, Port)', link: '/mang-may-tinh/phan-2-bai-tap' }
                            ]
                        },
                        {
                            text: 'Phần 3: Ứng Dụng (L7)',
                            items: [
                                { text: 'Lý thuyết (DHCP, DNS)', link: '/mang-may-tinh/phan-3-ly-thuyet' },
                                { text: 'Bài tập (Nslookup)', link: '/mang-may-tinh/phan-3-bai-tap' }
                            ]
                        },
                        {
                            text: 'TỔNG KẾT & CỦNG CỐ',
                            items: [
                                { text: 'Bảng tra cứu lỗi (Cheatsheet)', link: '/mang-may-tinh/tong-ket' },
                                { text: 'Củng cố & Nâng cao (TTL, Port)', link: '/mang-may-tinh/cung-co-giai-doan-1' }
                            ]
                        }
                    ]
                }
            ],
            '/lap-trinh/': [
                {
                    text: 'Lập Trình',
                    items: [
                        { text: 'Giới thiệu', link: '/lap-trinh/' }
                    ]
                }
            ]
        },

        socialLinks: [
            // { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ],

        search: {
            provider: 'local'
        },

        footer: {
            message: 'Học tập không ngừng nghỉ.',
            copyright: 'Copyright © 2024'
        }
    }
})
