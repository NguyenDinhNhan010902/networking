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
            { text: 'Linux Server', link: '/linux-server/' },
            { text: 'Lập Trình', link: '/lap-trinh/' }
        ],

        sidebar: {
            '/mang-may-tinh/': [
                {
                    text: 'Series: TCP/IP Cốt Lõi',
                    collapsed: false,
                    items: [
                        { text: 'Bài 1: Kiến trúc & Đóng gói', link: '/mang-may-tinh/tcp-ip/bai-1-kien-truc-tcp-ip' },
                        { text: 'Bài 2: IPv4 & Subnet Mask', link: '/mang-may-tinh/tcp-ip/bai-2-ipv4-subnet' },
                        { text: 'Bài 3: TCP Deep Dive', link: '/mang-may-tinh/tcp-ip/bai-3-tcp-deep-dive' },
                        { text: 'Bài 4: ARP, DHCP, ICMP', link: '/mang-may-tinh/tcp-ip/bai-4-arp-dhcp-icmp' },
                        { text: 'Bài 5: Wireshark Analysis', link: '/mang-may-tinh/tcp-ip/bai-5-wireshark' }
                    ]
                },
                {
                    text: 'Kiến Thức Lý Thuyết',
                    collapsed: false,
                    items: [
                        { text: 'Tổng quan & Giao thức', link: '/mang-may-tinh/ly-thuyet/cot-loi' },
                        { text: 'Mô hình OSI', link: '/mang-may-tinh/mo-hinh-osi' },
                        { text: 'NAT & Port Forwarding', link: '/mang-may-tinh/nat-port-forwarding' },
                        { text: 'Hạ tầng mạng (L1-L3)', link: '/mang-may-tinh/phan-1-ly-thuyet' },
                        { text: 'Giao vận mạng (L4-L7)', link: '/mang-may-tinh/phan-2-ly-thuyet' },
                        { text: 'Ứng dụng mạng (L7)', link: '/mang-may-tinh/phan-3-ly-thuyet' }
                    ]
                },
                {
                    text: 'Bài Tập Vận Dụng',
                    collapsed: false,
                    items: [
                        { text: 'Bài tập: Ping & Gateway', link: '/mang-may-tinh/phan-1-bai-tap' },
                        { text: 'Bài tập: Netstat & Port', link: '/mang-may-tinh/phan-2-bai-tap' },
                        { text: 'Bài tập: Nslookup & DNS', link: '/mang-may-tinh/phan-3-bai-tap' },
                        { text: 'Thực hành nâng cao (TTL)', link: '/mang-may-tinh/cung-co-giai-doan-1' }
                    ]
                },
                {
                    text: 'Công Việc Thực Chiến',
                    collapsed: false,
                    items: [
                        { text: 'Cẩm nang & Tool', link: '/mang-may-tinh/thuc-chien/cam-nang' },
                        { text: 'Cấu hình Public IP & NAT', link: '/mang-may-tinh/thuc-chien/cau-hinh-public-ip-port-forwarding' },
                        { text: 'Cheatsheet Tra Cứu Lỗi', link: '/mang-may-tinh/tong-ket' }
                    ]
                },
                {
                    text: 'Cẩm Nang Phỏng Vấn',
                    collapsed: false,
                    items: [
                        { text: 'Bộ câu hỏi tư duy', link: '/mang-may-tinh/phong-van/cau-hoi' },
                        { text: 'Case Study Thực Tế', link: '/mang-may-tinh/phong-van/tinh-huong-thuc-te' }
                    ]
                }
            ],
            '/linux-server/': [
                {
                    text: 'Linux & Server',
                    items: [
                        { text: 'Cài đặt Ubuntu Server', link: '/linux-server/' }
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
    },
    vite: {
        server: {
            proxy: {
                '/api/tts': {
                    target: 'https://translate.google.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/tts/, '/translate_tts'),
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                }
            }
        }
    }
})
