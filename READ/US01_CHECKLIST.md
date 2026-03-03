# Danh sách Kiểm tra Hoàn thành - Hệ thống Quản lý Cho thuê Xe

Đảm bảo tất cả các yêu cầu được đáp ứng trước khi bàn giao cuối cùng.

## [x] Bước 1: Khởi tạo Dự án
- [x] Tạo thư mục `<tên_của_bạn>_carRental`.
- [x] Khởi tạo dự án Node.js (`package.json`).
- [x] Cài đặt Express và Mongoose.

## [x] Bước 2: Schema & Model cho Xe
- [x] Tạo `carModel.js`.
- [x] Bao gồm các trường: `carNumber`, `capacity`, `status`, `pricePerDay`, `features`.
- [x] Export model.

## [x] Bước 3: Schema & Model cho Đặt xe
- [x] Tạo `bookingModel.js`.
- [x] Bao gồm các trường: `customerName`, `carNumber`, `startDate`, `endDate`, `totalAmount`.
- [x] Export model.

## [x] Bước 4: API & Logic Nghiệp vụ
- [x] GET `/bookings`: Liệt kê tất cả các lượt đặt xe.
- [x] POST `/bookings`: Tạo lượt đặt xe với chức năng kiểm tra trùng lịch.
- [x] PUT `/bookings/:bookingId`: Cập nhật lượt đặt xe.
- [x] DELETE `/bookings/:bookingId`: Xóa lượt đặt xe.
- [x] Tự động tính toán `totalAmount` (endDate - startDate).
- [x] Lấy `pricePerDay` động dựa trên `carNumber`.

## [x] Bước 5: Tổ chức Hệ thống (MVCR)
- [x] Thư mục `models/`.
- [x] Thư mục `controllers/`.
- [x] Thư mục `routes/`.
- [x] Thư mục `views/` với các template EJS.
- [x] File server chính `app.js`.
