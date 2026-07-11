# JPD123 - Sơ đồ tư duy Học từ vựng Tiếng Nhật 2 (FPT University) 🧠🇯🇵

Ứng dụng web Single Page Application (SPA) trực quan hóa từ vựng Tiếng Nhật 2 (môn **JPD123** tại Đại học FPT) dưới dạng sơ đồ tư duy tương tác. Giúp sinh viên và người học dễ dàng ghi nhớ, luyện phát âm, học qua thẻ ghi nhớ (flashcard) và tự kiểm tra bằng trắc nghiệm một cách khoa học, hiệu quả.

👉 **Giao diện tối ưu**: Thiết kế theo phong cách Glassmorphism hiện đại, hỗ trợ chuyển đổi giao diện Sáng/Tối linh hoạt.

---

## 🌟 Tính năng nổi bật

### 1. 🗺️ Sơ đồ tư duy tương tác (Interactive Mind Map SVG)
* **Phân tách đối xứng (Horizontal Layout)**: Gốc bài học ở giữa, các chủ đề nhánh được phân chia đều sang hai bên giúp cân đối không gian hiển thị trên màn hình máy tính.
* **Mở rộng / Thu gọn nhánh (Expand/Collapse)**: Click vào các nút `+` / `-` ở từng chủ đề lớn để đóng/mở nhánh từ vựng chi tiết, tránh gây rối mắt khi sơ đồ quá rộng.
* **Thu phóng & Kéo thả (Zoom & Pan)**: Click chuột trái kéo thả để di chuyển bản đồ; cuộn chuột để phóng to/thu nhỏ mượt mà.
* **Nghe phát âm bản xứ**: Nhấp vào từ vựng bất kỳ trên sơ đồ để nghe phát âm tiếng Nhật chuẩn giọng bản xứ (TTS).
* **Bảng chi tiết nổi (Detail Panel)**: Hiển thị đầy đủ chữ Kanji, cách đọc Kana, nghĩa tiếng Việt cùng tính năng chuyển trạng thái học tập nhanh chóng.

### 2. 💾 Lưu trữ tiến độ tự động (localStorage Persistence)
* Toàn bộ tiến trình học tập của bạn đều được tự động lưu lại trên trình duyệt của máy tính thông qua `localStorage`.
* Khi quay trở lại học vào ngày hôm sau, sơ đồ tư duy sẽ tự động tô màu theo đúng tiến độ cũ của bạn:
  * ⚪ **Chưa học** (Sơ đồ viền xám)
  * 🟡 **Đang học** (Sơ đồ viền vàng cam)
  * 🟢 **Đã thuộc** (Sơ đồ viền xanh lá)
* Bảng thống kê tiến độ học tập (dưới dạng phần trăm hoàn thành và vòng tròn tiến trình) sẽ tự cập nhật đồng bộ thời gian thực.

### 3. 🃏 Thẻ ghi nhớ 3D (3D Flashcard Mode)
* Lọc từ vựng cần học theo từng chủ đề hoặc học toàn bộ bài học.
* Hiệu ứng lật thẻ 3D xoay chiều mượt mà khi nhấp vào thẻ.
* Tích hợp nút loa phát âm trực tiếp trên thẻ và các nút cập nhật trạng thái học tập tiện lợi.
* Hỗ trợ tráo thẻ ngẫu nhiên (Shuffle) giúp kiểm tra khả năng nhớ từ tốt hơn.

### 4. 📝 Luyện trắc nghiệm thông minh (Quiz Mode)
* Tự động sinh ngẫu nhiên bộ đề trắc nghiệm gồm 10, 20, 30 câu hoặc toàn bộ từ vựng thuộc Unit đang học (hoặc trộn lẫn tất cả các Unit).
* Ba chế độ kiểm tra: Nhật -> Việt, Việt -> Nhật hoặc Trộn lẫn cả hai.
* **Âm thanh tổng hợp Web Audio API**: Tự động phát tiếng beep báo hiệu Đúng/Sai trực tiếp từ trình duyệt (hoàn toàn hoạt động offline mà không cần tải file âm thanh ngoài).
* Thống kê kết quả thi cụ thể và hỗ trợ lọc riêng các từ đã trả lời sai để ôn luyện lại.

### 5. 🔍 Tra cứu & Lọc trạng thái (Word List & Search)
* Thanh tìm kiếm toàn cầu cho phép tìm kiếm từ vựng theo Kanji, Kana, hoặc nghĩa tiếng Việt tức thời.
* Bảng thống kê từ vựng hỗ trợ lọc danh sách từ theo trạng thái học tập.

### 6. 🌓 Giao diện Sáng / Tối (Light & Dark Theme Toggle)
* Tích hợp nút bấm Mặt trăng/Mặt trời để chuyển đổi nhanh giữa hai phong cách giao diện:
  * **Dark Theme (Mặc định)**: Nền tối Obsidian huyền bí, chữ trắng sáng dịu mắt phù hợp học đêm.
  * **Light Theme**: Nền Slate sáng thanh lịch, chữ đen đậm sắc nét dễ quan sát ban ngày.
* Tự động lưu cấu hình giao diện ưa thích của người dùng vào `localStorage`.

---

## 🛠️ Công nghệ sử dụng
* **Front-end**: HTML5 (Semantic elements, SVG workspace, foreignObject), CSS3 (CSS Variables, Flexbox, 3D CSS Transforms, Glassmorphism, Keyframe animations).
* **JavaScript**: Vanilla ES6+ (không dùng thư viện ngoài giúp tải trang siêu tốc).
* **Web Speech Synthesis API**: Cung cấp tính năng phát âm giọng Nhật bản xứ trực tiếp.
* **Web Audio API**: Tạo âm thanh tổng hợp cho chế độ trắc nghiệm offline.
* **Database**: JSON file.

---

## 📂 Cấu trúc thư mục dự án
```text
Tuvung_NguPhap/
├── index.html         # Giao diện chính của ứng dụng
├── styles.css         # Thiết kế CSS & Biến giao diện (Sáng/Tối)
├── app.js             # Logic xử lý (Vẽ sơ đồ, Flashcard, Quiz, Trạng thái)
├── vocab_data.json    # Cơ sở dữ liệu từ vựng (Unit 4 - Unit 7)
├── local-server.js    # Máy chủ Node.js tĩnh siêu nhẹ để chạy cục bộ
├── powershell.cmd     # Script proxy bổ trợ đường dẫn trên Windows
└── README.md          # Hướng dẫn sử dụng dự án
```

---

## 🚀 Hướng dẫn cài đặt và chạy trên máy cục bộ

Ứng dụng hoàn toàn chạy bằng client-side nên không yêu cầu cài đặt cơ sở dữ liệu phức tạp. Để chạy ứng dụng mượt mà không gặp lỗi bảo mật CORS khi nạp file dữ liệu JSON, bạn hãy chạy qua một server tĩnh đơn giản:

### Cách 1: Sử dụng tệp `local-server.js` chạy bằng Node.js (Khuyên dùng)
1. Đảm bảo máy tính của bạn đã được cài đặt **Node.js**.
2. Mở Terminal (PowerShell hoặc Command Prompt) tại thư mục dự án:
   ```bash
   node local-server.js
   ```
3. Mở trình duyệt và truy cập:
   👉 **http://localhost:3000**

### Cách 2: Sử dụng các công cụ server tĩnh khác
Nếu bạn đã cài sẵn `npx` hoặc các công cụ khác, có thể chạy nhanh:
```bash
npx http-server -p 3000
```
Hoặc dùng extension **Live Server** trên VS Code.

---

## 📝 Bản quyền tài liệu từ vựng
Tài liệu từ vựng và chủ đề thuộc chương trình học Tiếng Nhật 2 (**JPD123**) của Đại học FPT Hà Nội. Đã được biên tập, trích xuất cấu trúc và tối ưu hóa phục vụ ôn tập học thuật.
