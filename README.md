# 🍰 Bánh App - MySQL

Ứng dụng quản lý cửa hàng bánh online được xây dựng với **Node.js**, **Express**, **EJS**, và **MySQL**.

## ✨ Tính năng

- 👨‍💼 **Quản lý Admin**: Quản lý sản phẩm, đơn hàng, nhân viên
- 👤 **Tài khoản Nhân viên**: Xác nhận và xử lý đơn hàng
- 🛍️ **Tài khoản Khách hàng**: Đặt hàng, xem lịch sử
- 🔐 **Xác thực**: Đăng nhập/đăng ký với mã hóa bcryptjs
- 💾 **Database**: MySQL với Sequelize ORM

## 🚀 Cài đặt

### Yêu cầu
- Node.js >= 14.0.0
- MySQL 5.7+
- npm hoặc yarn

### Bước 1: Clone Repository
```bash
git clone https://github.com/dtc245200081-tech/banh-app-mysql.git
cd banh-app-mysql
```

### Bước 2: Cài đặt Dependencies
```bash
npm install
```

### Bước 3: Setup Database
```bash
# Login vào MySQL
mysql -u root -p

# Chạy file init.sql
source init.sql;
```

### Bước 4: Tạo file .env
```bash
cp .env.example .env
```

Edit `.env` với database credentials:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=banh_shop
SESSION_SECRET=your_secret_key
NODE_ENV=development
```

### Bước 5: Chạy ứng dụng
```bash
npm run dev
```

Truy cập: http://localhost:3000

## 📁 Cấu trúc Project

```
banh-app-mysql/
├── config/
│   └── database.js       # Cấu hình Sequelize
├── controllers/          # Business logic
├── models/              # Database models
├── routes/              # API routes
├── views/               # EJS templates
├── public/              # Static files (CSS, JS, images)
├── app.js               # Main server file
├── init.sql             # Database setup script
├── package.json
├── .env.example
└── README.md
```

## 👥 Tài khoản Test

| Vai trò | Email | Mật khẩu |
|--------|-------|----------|
| Admin | admin@banh.com | 123456 |
| Nhân viên | staff@banh.com | 123456 |
| Khách hàng | customer@banh.com | 123456 |

## 🌐 Deploy

### Railway (Khuyến nghị)
1. Vào https://railway.app
2. Sign up với GitHub
3. New Project → Deploy from GitHub repo
4. Select: `dtc245200081-tech/banh-app-mysql`
5. Add MySQL add-on
6. Set Environment Variables
7. Deploy!

### Render
1. Vào https://render.com
2. New Web Service
3. Connect GitHub repository
4. Config:
   - Build Command: `npm install`
   - Start Command: `node app.js`
5. Add MySQL database
6. Deploy!

## 🐛 Troubleshooting

### Lỗi: "Cannot find module './config/database'"
- ✅ Đã sửa trong phiên bản mới

### Lỗi: "connect ECONNREFUSED 127.0.0.1:3306"
- Kiểm tra MySQL service đang chạy
- Kiểm tra DB_HOST, DB_USER, DB_PASSWORD trong .env

### Lỗi: "ER_BAD_DB_ERROR"
- Chạy: `mysql -u root -p < init.sql`

## 📚 Technologies

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, CSS, JavaScript
- **Database**: MySQL, Sequelize ORM
- **Authentication**: bcryptjs, express-session
- **Environment**: dotenv

## 📝 License

MIT

## 👨‍💻 Author

- dtc245200081-tech

---

**Hãy tạo issue nếu gặp vấn đề!** 🚀
