# Hệ thống quản lý cho thuê xe - Giải thích luồng hoạt động & Cấu trúc mã

Tài liệu này giải thích luồng hoạt động của mã nguồn ứng dụng, luồng định tuyến (routing) và mục đích của từng tệp trong **Hệ thống quản lý cho thuê xe** được xây dựng bằng thiết kế MVC (Model-View-Controller) trên nền tảng Node.js, Express và MongoDB.

## 1. Cấu hình dự án (Project Setup)
Dự án được thiết lập chuẩn theo cách tiếp cận Backend (hệ thống phía server):
- **`package.json`**: Chứa thông tin cơ bản, thiết lập khởi tạo ứng dụng, và các thư viện cần thiết (`express`, `mongoose`, `ejs`, v.v.).
- **`app.js`**: Tệp khởi chạy trọng tâm của hệ thống Node.
  - Kết nối với Cơ sở dữ liệu (Database) MongoDB (`carRentalDB`).
  - Thiết lập các phần mềm trung gian (Middlewares) để tiến hành phân tích request, mã hóa request, render các view (giao diện) cấu hình an toàn.
  - Đăng ký các tuyến đường khởi chạy (Application routes) của dữ liệu (`/cars` & `/bookings`).
  - Lắng nghe/Khởi chạy (bind) dự án khởi chạy server trên Cổng `PORT: 3000`.

## 2. Cấu trúc Mô hình (`models` folder)
Nền tảng Database Schema sử dụng hệ thống MongoDB được kiểm soát thông qua Models của thư viện Mongoose.
- **`models/carModel.js`**: Định nghĩa cấu trúc `CarSchema` để bắt buộc định dạng chuẩn các bản ghi lưu trữ về Xe. Gồm:
  - `carNumber`: ID chuỗi định danh độc nhất / biển số xe.
  - `status`: Các trạng thái sẵn sàng để thuê hay không.
  - Theo dõi logic về `pricePerDay` (giá/ngày), `capacity` (số chỗ ngồi), và `features` (tính năng).

- **`models/bookingModel.js`**: Định nghĩa `BookingSchema`. Các thành phần đặc biệt gồm:
  - Tham chiếu đến dữ liệu `customerName` và mã xe `carNumber` cần thuê.
  - Nắm bắt `startDate` và `endDate` (mốc thời gian thuê / kết thúc).
  - Tự động duy trì logic lưu trữ cho việc tính toán tổng chi phí thuê `totalAmount`.

## 3. Logic Bộ điều khiển & Tương tác CSDL (thư mục `controllers`)
Ứng dụng thực hiện các hành động thông qua các Controllers chuyên biệt, điều này giúp tách rời việc định nghĩa luồng dữ liệu thông thường với API.
- **`controllers/carController.js`**: 
  - Xử lý các API Query logic xử lý mọi yêu cầu liên quan đến xe.
  - Cung cấp logic để truy xuất, hiển thị (Chế độ xem HTML hay trả dữ liệu dạng JSON thông qua API), hay thao tác tạo/cập nhật thông tin cho xe mới truyền dữ liệu vào cơ sở dữ liệu ở Mongo. (`getAllCars` / `createCar`).
 
- **`controllers/bookingController.js`**:
  - Quản lý quá trình kiểm tra đăng ký xe logic để xác nhận một việc tạo mới không gặp trục trặc!
  - Đánh giá logic để giải quyết các trường hợp đăng ký xe bị trùng lặp thời gian nhận trả (overlapping reservations - dùng `startDate`, `endDate`) bởi các ràng buộc dữ liệu tại Mongoose.
  - Tự động kiểm soát hoạt động toán học dựa vào số milliseconds quy đổi sang ngày, qua đó tính chuẩn xác Tổng thu phí (`totalAmount` = tổng số ngày * `car.pricePerDay`).
  - Thực thi toàn diện các logic CRUD chung: Thêm, Xóa bỏ, Cập nhật thông tin phiếu xe.

## 4. Định hình đường dẫn với Route (`routes` folder) 
Các URL được đăng ký quản lý luồng dữ liệu yêu cầu thực hiện chức năng thông qua tuyến HTTP vào thẳng Controllers đã ghép đôi:
- **`routes/carRoutes.js`**: Định hướng các route API mapping vào logic hàm của `carController` khi người dùng / hệ thống gọi qua nhánh `/cars/`.
- **`routes/bookingRoutes.js`**: Trực tiếp điều hướng tất cả lệnh `GET`/`POST`/`PUT`/`DELETE` liên quan đến mọi hoạt động qua nhánh `/bookings`.

## Tóm tắt Luồng Code của Ứng dụng: 
1. **Khởi tạo (Init)**: Quá trình thực thi bắt đầu từ `app.js` khởi động kết nối dữ liệu và kích hoạt lắng nghe port của `Express`.
2. **Lắng nghe (Listen)**: Người dùng tương tác với một tuyến đường/endpoint cụ thể như `/bookings/new`.
3. **Chuyển hướng (Route Transfer)**: Lượng truy cập chuyển qua `app.js` đến tệp Mapping cấu hình mục tiêu nằm ở thư mục `routes/`.
4. **Xác nhận (Action Validation)**: Endpoint chuyển hướng hàm logic nằm tại `controllers/`. Đoạn code chạy đánh giá / xác minh ràng toán học dựa trên danh sách trong cơ sở dữ liệu đối sánh trong MongoDB định nghĩa bằng `models/`.
5. **Đầu ra (Output)**: Nếu đúng Hệ thống xử lý thành công sẽ xuất dữ liệu / chuyển hướng và kết xuất qua `template .ejs` của (tìm thấy tại `/views`), HOẶC cung cấp định dạng JSON báo thành công.
