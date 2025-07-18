# TimeToolsWebApp

![TimeToolsWebApp Logo](assets/clock-icon.png)

---

## Giới thiệu

**TimeToolsWebApp** là một ứng dụng web đơn giản nhưng mạnh mẽ, tích hợp nhiều tiện ích liên quan đến thời gian bao gồm:

- Hiển thị đồng hồ thời gian thực (Real-time Clock)
- Mini Calendar (Lịch nhỏ xem nhanh ngày tháng)
- Đồng hồ bấm giờ (Stopwatch)
- Đếm ngược tới sự kiện (Countdown Timer)
- Các phép toán về thời gian (cộng/trừ giờ, so sánh thời điểm)
- (Dự kiến mở rộng thêm: Báo thức, World Clock, Pomodoro Timer...)

Ứng dụng được viết hoàn toàn bằng **JavaScript thuần (vanilla JS)**, HTML và CSS, giúp bạn dễ dàng chạy trên mọi trình duyệt hiện đại mà không cần cài đặt thêm thư viện hay framework.

---

## Mục tiêu dự án

- Cung cấp công cụ quản lý và sử dụng thời gian tiện lợi, trực quan trên nền web.
- Thiết kế giao diện gọn gàng, thân thiện với người dùng.
- Dễ dàng mở rộng thêm các tiện ích mới trong tương lai.
- Học tập và thực hành lập trình JavaScript theo hướng module, tách biệt chức năng rõ ràng.

---

## Cấu trúc thư mục

```
TimeToolsWebApp/
├── index.html # Trang chính ứng dụng
├── css/
│ └── style.css # File CSS định dạng giao diện
├── js/
│ ├── main.js # Entry point, quản lý điều hướng các tiện ích
│ ├── clock.js # Hiển thị đồng hồ thời gian thực
│ ├── calendar.js # Hiển thị Mini Calendar và chuyển tháng
│ ├── stopwatch.js # Logic đồng hồ bấm giờ
│ ├── countdown.js # Logic đếm ngược tới sự kiện
│ ├── timeCalculator.js # Các phép toán thời gian
│ ├── dom.js # Hàm thao tác DOM dùng chung
│ └── time-utils.js # Các hàm tiện ích xử lý thời gian
├── assets/
│ ├── clock-icon.png # Icon đồng hồ
│ ├── alarm.png # Icon báo thức
│ ├── shedule.png # Icon đếm ngược tới sự kiện
│ ├── stopwatch.png # Icon đồng hồ bấm giờ
│ └── beep.mp3 # Âm thanh báo
└── README.md # Tài liệu dự án
```

## Hướng dẫn sử dụng

1. Mở file `index.html` bằng trình duyệt web hiện đại (Chrome, Firefox, Edge,...).
2. Sử dụng các tab trên giao diện để chuyển đổi giữa các tiện ích:
   - **Clock:** Xem giờ thực tế kèm Mini Calendar.
   - **Stopwatch:** Bấm giờ bắt đầu, tạm dừng, reset.
   - **Countdown:** Đặt thời gian đếm ngược tới sự kiện quan trọng.
   - **Time Calculator:** Tính toán các phép cộng/trừ thời gian.
3. Tính năng bổ sung (báo thức, world clock, pomodoro) sẽ được cập nhật trong các phiên bản tiếp theo.

---

## Tiêu đề trang (HTML `<title>`)

`Time Tools Web App – Clock, Calendar & Countdown`

---

## Công nghệ sử dụng

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)** thuần không dùng thư viện/framework
- Thiết kế responsive thân thiện với cả desktop và mobile

---

## Lợi ích dự án

- Học cách tổ chức dự án JavaScript theo module tách biệt, dễ bảo trì.
- Thực hành kỹ thuật cập nhật thời gian thực, xử lý DOM hiệu quả.
- Phát triển kỹ năng UI/UX đơn giản mà trực quan.
- Ứng dụng hữu ích cho người dùng cần công cụ quản lý thời gian nhanh gọn.

---

## License

Dự án này được cấp phép theo [MIT License](LICENSE).

---

## Liên hệ

Nếu bạn có góp ý hoặc muốn hợp tác phát triển, vui lòng liên hệ qua email: `youremail@example.com`

---

> Cảm ơn bạn đã quan tâm và sử dụng **TimeToolsWebApp**!
