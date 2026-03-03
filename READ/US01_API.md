# Tài liệu API & Postman Test Cases - Hệ thống Quản lý Cho thuê Xe

Tài liệu này trình bày các endpoint API có sẵn để quản lý xe và đặt xe, đi kèm với các ví dụ (Request / Response) chi tiết để bạn có thể test trực tiếp trên Postman.

## Base URL
`http://localhost:3000`

---

## API Đặt Xe (Bookings)

### 1. Lấy tất cả các lượt đặt xe
- **URL:** `/bookings`
- **Method:** `GET`
- **Mô tả:** Lấy danh sách tất cả các lượt đặt xe hiện có.
- **Postman Response Ví dụ (200 OK):**
  ```json
  [
    {
      "_id": "673b22b5e0c6a81d4e7b8c9d",
      "customerName": "Nguyen Van A",
      "carNumber": "51A-12345",
      "startDate": "2023-10-01T00:00:00.000Z",
      "endDate": "2023-10-03T00:00:00.000Z",
      "totalAmount": 3000000,
      "__v": 0
    }
  ]
  ```

### 2. Tạo một lượt đặt xe mới
- **URL:** `/bookings`
- **Method:** `POST`
- **Mô tả:** Tạo một booking mới. Tự động kiểm tra trùng lặp thời gian, trạng thái xe và tính ra `totalAmount`.
- **Postman Request (Body -> raw -> JSON):**
  ```json
  {
    "customerName": "Nguyen Van A",
    "carNumber": "51A-12345",
    "startDate": "2023-10-01",
    "endDate": "2023-10-03"
  }
  ```
- **Postman Response Thành công (201 Created):**
  ```json
  {
    "customerName": "Nguyen Van A",
    "carNumber": "51A-12345",
    "startDate": "2023-10-01T00:00:00.000Z",
    "endDate": "2023-10-03T00:00:00.000Z",
    "totalAmount": 3000000,
    "_id": "673b22b5e0c6a81d4e7b8c9d",
    "__v": 0
  }
  ```
- **Postman Response Thất bại - Trùng lịch (400 Bad Request):**
  ```json
  {
    "message": "Car is already booked for these dates."
  }
  ```

### 3. Cập nhật một lượt đặt xe
- **URL:** `/bookings/:bookingId` (Thay `:bookingId` bằng một `_id` hợp lệ).
- **Method:** `PUT`
- **Mô tả:** Cập nhật thông tin đặt xe, thay đổi người đặt, xe, số ngày. Hệ thống sẽ tự động tính lại `totalAmount`.
- **Postman Request (Body -> raw -> JSON):**
  ```json
  {
    "endDate": "2023-10-05"
  }
  ```
- **Postman Response (200 OK):**
  ```json
  {
    "_id": "673b22b5e0c6a81d4e7b8c9d",
    "customerName": "Nguyen Van A",
    "carNumber": "51A-12345",
    "startDate": "2023-10-01T00:00:00.000Z",
    "endDate": "2023-10-05T00:00:00.000Z",
    "totalAmount": 6000000,
    "__v": 0
  }
  ```

### 4. Xóa một lượt đặt xe
- **URL:** `/bookings/:bookingId`
- **Method:** `DELETE`
- **Mô tả:** Xóa một lượt đặt xe khỏi hệ thống.
- **Postman Response (200 OK):**
  ```json
  {
    "message": "Booking deleted successfully."
  }
  ```

---

## API Xe (Cars)

### 1. Lấy danh sách tất cả các xe
- **URL:** `/cars`
- **Method:** `GET`
- **Mô tả:** Liệt kê tất cả các xe có sẵn trong hệ thống (Được render dưới dạng HTML Views nếu Request trên trình duyệt hoặc trả về JSON Array nếu Request ở Postman).
- **Postman Response Ví dụ Header `Accept: application/json` (200 OK):**
  ```json
  [
    {
      "_id": "651c62f2a4b891e4dbcf20ab",
      "carNumber": "51A-12345",
      "model": "Luxury SUV",
      "capacity": 7,
      "status": "available",
      "pricePerDay": 1500000,
      "features": ["automatic", "air-conditioner", "GPS"],
      "image": "luxury_suv.png",
      "__v": 0
    }
  ]
  ```

### 2. Thêm một xe mới
- **URL:** `/cars`
- **Method:** `POST`
- **Mô tả:** Thêm một xe mới vào database.
- **Postman Request (Body -> raw -> JSON):**
  ```json
  {
    "carNumber": "30F-99999",
    "model": "Honda Civic",
    "capacity": 5,
    "status": "available",
    "pricePerDay": 700000,
    "features": ["automatic", "bluetooth"]
  }
  ```
- **Postman Response (201 Created):**
  ```json
  {
    "carNumber": "30F-99999",
    "model": "Honda Civic",
    "capacity": 5,
    "status": "available",
    "pricePerDay": 700000,
    "features": ["automatic", "bluetooth"],
    "image": "default_car.png",
    "_id": "673b255ce0c6a81d4e7b8c9f",
    "__v": 0
  }
  ```
