# Hướng dẫn Bắt đầu Nhanh - Hệ thống Quản lý Cho thuê Xe

Làm theo các bước sau để thiết lập và chạy dự án trong vài phút.

## Điều kiện kiên quyết
- Đã cài đặt **Node.js**.
- Đang chạy **MongoDB** cục bộ tại `mongodb://127.0.0.1:27017`.

## Hướng dẫn Thiết lập

1. **Điều hướng đến thư mục dự án:**
   ```bash
   cd AS_carRental
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

3. **Seed database (Dữ liệu Xe ban đầu):**
   ```bash
   node seed.js
   ```

4. **Khởi động ứng dụng:**
   ```bash
   node app.js
   ```

5. **Tương tác với hệ thống:**
   - **Giao diện Web:** Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn.
   - **API:** Sử dụng Postman hoặc curl để thử nghiệm các endpoint được liệt kê trong `US01_API.md`.
