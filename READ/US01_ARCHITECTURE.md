# Kiến trúc Hệ thống - Hệ thống Quản lý Cho thuê Xe

Tài liệu này mô tả cấu trúc kiến trúc và ngăn xếp công nghệ được sử dụng trong Hệ thống Quản lý Cho thuê Xe.

## Mẫu Kiến trúc: MVCR (Model-View-Controller-Routes)
Dự án tuân theo cấu trúc mô-đun để đảm bảo sự phân tách các mối quan tâm:

- **Models (M):** Định nghĩa schema dữ liệu và logic tương tác với MongoDB bằng Mongoose.
- **Views (V):** Lớp trình bày sử dụng template EJS (Embedded JavaScript) cho giao diện web.
- **Controllers (C):** Xử lý logic nghiệp vụ, xử lý request và điều phối dữ liệu.
- **Routes (R):** Định nghĩa các endpoint API và ánh xạ chúng với các hàm controller cụ thể.

## Ngăn xếp Công nghệ
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (thông qua Mongoose ODM)
- **Frontend/Templating:** EJS, Vanilla CSS
- **Middleware:** Body-parser để xử lý dữ liệu JSON và URL-encoded.

## Luồng Dữ liệu
1. Client gửi request tới một **Route** đã định nghĩa.
2. Route chuyển tiếp request tới hàm **Controller** tương ứng.
3. Controller tương tác với **Model** để truy vấn hoặc thay đổi database.
4. Controller xử lý dữ liệu (ví dụ: tính giá thuê, kiểm tra trùng lịch đặt xe).
5. Controller có thể trả về phản hồi JSON (cho API endpoint) hoặc render một **View EJS**.
