# Phòng livestream 3D của Hieu

Nhấp đúp `Mo-phong-3D.cmd`, giữ cửa sổ máy chủ mở khi xem phòng.
Địa chỉ: http://127.0.0.1:4173

- Kéo chuột trái: xoay góc nhìn. Cuộn chuột: thu phóng. Chuột phải: di chuyển.
- Các nút bên dưới đổi góc nhìn, bật/tắt LED RGB, tự xoay và lưu ảnh PNG.
- Nút “Buổi tối” chuyển sang ánh sáng tối để thấy LED rõ hơn; “Ban ngày” trở về ánh sáng ban đầu.
- Chế độ tối dùng nền đen, tắt ánh sáng trời, môi trường, cửa sổ và đèn đứng; chỉ LED RGB đổi màu và màn hình chiếu sáng phòng.
- Góc livestream cắt lớp tường sau và màn hình chắn camera để thấy rõ mặt, tay trái đặt trên bàn phím và tay phải ôm chuột. Chọn góc khác để khôi phục toàn bộ màn hình và tường.
- Trên điện thoại: dùng một ngón để xoay, hai ngón để thu phóng.
- Mèo tự đi quanh phòng, thỉnh thoảng ngồi nghỉ, và tránh chân bàn, ghế, sofa, chậu cây, tủ. Nút “Theo mèo” mở camera bám theo; chọn góc khác để thoát.
- Nút “Tủ One Piece” xem cận hai model Sketchfab thật: Monkey D. Luffy của weijie1988 và Devil Fruit from ONEPIECE của Wendell.doc. Tủ có hai khoang lớn. Chọn “Model: Sketchfab · Nguồn & tác giả” để xem tác giả và giấy phép CC BY 4.0.

Model gốc trong `Hieu/` được giữ nguyên. Cảnh dùng `base_basic_pbr.glb` và hoạt ảnh `HumanSitting`, điều chỉnh tay về bàn phím/chuột khi chạy. Ba màn hình hiển thị nội dung mô phỏng game, bảng điều khiển livestream và chat; không phát trực tiếp thật.

Thư viện đã được cài cục bộ nên không cần CDN khi mở. Cần Node.js và trình duyệt hỗ trợ WebGL. Nếu chuyển sang máy khác, chạy `npm install` trước khi mở.

Các file chính: `room.js` dựng cảnh và nhân vật, `studio-details.js` nội thất và vật liệu, `index.html` và `studio.css` giao diện, `server.cjs` máy chủ cục bộ. Chạy `npm start` để mở máy chủ thủ công. Chạy `npm run check` để kiểm tra bằng Chrome tại đường dẫn được cấu hình trong `verify-studio.cjs`.

Mèo: `roaming-cat.js` tải `munchkin_cat.glb`, phát animation đi kèm, thêm nhịp chân procedural vì mesh không có rig chân, và điều khiển đường đi; `cat-navigation.js` tìm tuyến A* trên sàn. Nguồn và giấy phép: `assets/cat/credits.json` — Munchkin Cat của Nyilonelycompany / Sketchfab, CC BY-NC-SA 4.0 (ghi công, phi thương mại, chia sẻ cùng giấy phép).
