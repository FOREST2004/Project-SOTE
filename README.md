# Cinema Booking System

Hệ thống đặt vé xem phim online đơn giản, được xây dựng với React, Node.js, PostgreSQL và Docker.

## Công nghệ sử dụng

### Frontend
- React 18
- Vite
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs

### DevOps
- Docker
- Docker Compose
- Nginx

## Tính năng

### Cho khách và thành viên
- Xem danh sách phim đang chiếu
- Tìm kiếm phim theo tên
- Lọc phim theo thể loại
- Xem chi tiết phim, trailer, đánh giá
- Xem lịch chiếu

### Cho thành viên đã đăng ký
- Đăng ký tài khoản
- Đăng nhập/Đăng xuất
- Đặt vé xem phim
- Chọn ghế ngồi (interactive seat map)
- Xem lịch sử đặt vé
- Hủy vé đã đặt
- Đánh giá phim
- Quản lý thông tin cá nhân

### Cho Admin
- Xem báo cáo doanh thu
- Quản lý phim (thêm, xóa)
- Quản lý lịch chiếu
- Quản lý phòng chiếu

## Cấu trúc Database

### User
- Email, Password (hashed)
- Full Name
- Role (GUEST, MEMBER, ADMIN)

### Movie
- Title, Description
- Duration, Genre
- Rating
- Poster URL, Trailer URL
- Release Date

### Room
- Name
- Rows, Seats per Row

### Showtime
- Movie, Room
- Start Time
- Price

### Booking
- User, Showtime
- Seats (JSON array)
- Total Price
- Status (PENDING, CONFIRMED, CANCELLED)

### Review
- User, Movie
- Rating (1-5)
- Comment

## Cài đặt và Chạy

### Yêu cầu
- Docker
- Docker Compose

### Cách chạy với Docker (Recommended)

1. Clone repository:
```bash
git clone <repository-url>
cd Project-SOTE
```

2. Chạy với Docker Compose:
```bash
docker-compose up --build
```

3. Đợi các container khởi động (khoảng 1-2 phút)

4. Truy cập ứng dụng:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### Tài khoản demo

**Admin:**
- Email: admin@cinema.vn
- Password: 1234567890

**Member:**
- Email: nguyen.van.an@email.vn
- Password: 1234567890

### Cách chạy local (Development)

#### Backend

```bash
cd server
npm install
cp .env.example .env
# Chỉnh sửa DATABASE_URL trong .env nếu cần

# Tạo database và chạy migrations
npx prisma migrate dev

# Seed data
npm run prisma:seed

# Chạy server
npm run dev
```

Server sẽ chạy tại http://localhost:5000

#### Frontend

```bash
cd client
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại http://localhost:5173

## API Endpoints

### Authentication
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập
- GET `/api/auth/me` - Lấy thông tin user
- PUT `/api/auth/profile` - Cập nhật profile

### Movies
- GET `/api/movies` - Lấy danh sách phim
- GET `/api/movies/:id` - Lấy chi tiết phim

### Showtimes
- GET `/api/showtimes/:id` - Lấy thông tin lịch chiếu và ghế đã đặt

### Bookings (Requires Authentication)
- POST `/api/bookings` - Tạo booking mới
- GET `/api/bookings` - Lấy danh sách booking của user
- DELETE `/api/bookings/:id` - Hủy booking

### Reviews (Requires Authentication)
- POST `/api/reviews` - Tạo/cập nhật review
- GET `/api/reviews/movie/:movieId` - Lấy reviews của phim

### Admin (Requires Admin Role)
- GET `/api/admin/revenue` - Báo cáo doanh thu
- GET `/api/admin/movies` - Quản lý phim
- POST `/api/admin/movies` - Thêm phim
- PUT `/api/admin/movies/:id` - Cập nhật phim
- DELETE `/api/admin/movies/:id` - Xóa phim
- GET `/api/admin/rooms` - Quản lý phòng
- GET `/api/admin/showtimes` - Quản lý lịch chiếu
- POST `/api/admin/showtimes` - Thêm lịch chiếu
- DELETE `/api/admin/showtimes/:id` - Xóa lịch chiếu

## Kiến trúc

```
Project-SOTE/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth)
│   │   ├── api.js         # Axios instance
│   │   └── App.jsx        # Main app component
│   ├── Dockerfile
│   └── nginx.conf         # Nginx configuration
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── index.js       # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.js        # Seed data
│   ├── Dockerfile
│   └── .env               # Environment variables
│
└── docker-compose.yml     # Docker orchestration
```

## Tính năng nổi bật

1. **Seat Selection**: Interactive seat map với khả năng chọn ghế real-time
2. **Responsive Design**: Giao diện tương thích với mobile và desktop
3. **Role-based Access**: Phân quyền rõ ràng (Guest, Member, Admin)
4. **Docker Ready**: Dễ dàng deploy với Docker
5. **Simple & Clean**: Code đơn giản, dễ hiểu, dễ maintain

## Lưu ý

- Tất cả các rạp phim đều dùng chung 1 sơ đồ ghế (8 hàng x 10 ghế)
- Database được seed tự động khi chạy Docker
- JWT token có thời hạn 7 ngày
- Giá vé được tính bằng VND

## Troubleshooting

### Container không khởi động
```bash
docker-compose down
docker-compose up --build
```

### Database connection error
Đảm bảo PostgreSQL container đã chạy và healthy:
```bash
docker-compose ps
```

### Port already in use
Thay đổi port trong docker-compose.yml nếu port 3000, 5000, hoặc 5432 đã được sử dụng.

## Tác giả

Đồ án Software Testing - Cinema Booking System

## License

MIT