# Phòng Livestream 3D (HIEU / RGB Stream Room)

Trải nghiệm phòng livestream 3D tương tác trên nền tảng WebGL / Three.js.

🌐 **Demo trực tiếp:** [https://hieu-nguyen-lhu.github.io/3d-room/](https://hieu-nguyen-lhu.github.io/3d-room/)

---

## ✨ Tính năng nổi bật

- **Không gian 3D tương tác:** Dựng chi tiết phòng livestream, bàn gaming, 3 màn hình giả lập, PC RGB, ghế gaming, tủ kính và sofa.
- **Hệ thống ánh sáng & RGB động:** Dải LED RGB 7 màu đổi màu theo thời gian, hiệu ứng Bloom và Ambient Occlusion (SSAO).
- **Chế độ Ngày / Đêm:** Chuyển đổi giữa ánh sáng tự nhiên và chế độ phòng tối làm nổi bật dải LED RGB.
- **Mèo Munchkin đi dạo:** Mèo tự động di chuyển quanh phòng, né vật cản theo thuật toán A* và có nhịp chân chân thực.
- **Tủ trưng bày One Piece:** Mô hình Monkey D. Luffy và Trái Ác Quỷ với góc nhìn chi tiết.
- **Đa góc nhìn camera:** Toàn cảnh, góc chơi game, góc livestream, theo mèo, tủ One Piece.
- **Chụp ảnh:** Nút lưu ảnh phòng chất lượng cao trực tiếp từ canvas WebGL.

---

## 🎮 Hướng dẫn điều khiển

- **Chuột trái / 1 ngón tay:** Xoay góc nhìn (Orbit).
- **Cuộn chuột / 2 ngón tay:** Thu phóng (Zoom).
- **Chuột phải:** Di chuyển góc nhìn (Pan).
- **Thanh điều khiển bên dưới:**
  - `Toàn cảnh`, `Góc chơi game`, `Góc livestream`, `Theo mèo`, `Tủ One Piece`: Chuyển góc máy.
  - `Buổi tối` / `Ban ngày`: Đổi chế độ ánh sáng.
  - `RGB: Bật / Tắt`: Bật tắt hiệu ứng đèn LED đổi màu.
  - `Tự xoay`: Bật tắt chế độ camera tự xoay vòng quanh phòng.
  - `Chụp ảnh`: Tải xuống ảnh chụp không gian dạng PNG.

---

## 🛠️ Chạy cục bộ (Local Development)

Dự án có thể chạy trực tiếp bằng máy chủ tĩnh mà không cần cài đặt phức tạp:

```bash
# Cài đặt phụ thuộc (nếu cần chạy local server)
npm install

# Khởi chạy server
npm start
# hoặc nhấp đúp file Mo-phong-3D.cmd trên Windows
```

Mở trình duyệt tại: `http://127.0.0.1:4173`

---

## 📜 Giấy phép & Nguồn Model

Chi tiết bản quyền và tác giả model 3D:
- Monkey D. Luffy bởi weijie1988 (CC BY 4.0)
- Devil Fruit bởi Wendell.doc (CC BY 4.0)
- Munchkin Cat bởi Nyilonelycompany (CC BY-NC-SA 4.0)
- Xem thêm tại: [model-credits.html](./model-credits.html)
