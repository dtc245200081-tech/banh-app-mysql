CREATE DATABASE IF NOT EXISTS banh_shop;
USE banh_shop;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','staff','customer') NOT NULL,
  phone VARCHAR(20)
);

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  price INT NOT NULL,
  description TEXT,
  imageUrl VARCHAR(500)
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customerId INT NOT NULL,
  customerName VARCHAR(100) NOT NULL,
  totalAmount INT NOT NULL,
  status ENUM('Chờ xác nhận','Đang làm','Hoàn thành','Đã giao','Đã hủy') DEFAULT 'Chờ xác nhận',
  orderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  deliveryDate DATE NOT NULL,
  isPaid BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (customerId) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  productName VARCHAR(200) NOT NULL,
  quantity INT NOT NULL,
  price INT NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id)
);

CREATE TABLE settings (
  id INT PRIMARY KEY DEFAULT 1,
  dailyCapacity INT DEFAULT 50
);

-- Mật khẩu '123456' đã được hash
INSERT INTO users (name, email, password, role, phone) VALUES
('Admin', 'admin@banh.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/.cZ3FqWpZxqZqZqZqZqZqZqZqZq', 'admin', '0987654321'),
('Staff', 'staff@banh.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/.cZ3FqWpZxqZqZqZqZqZqZqZqZq', 'staff', '0912345678'),
('Customer', 'customer@banh.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/.cZ3FqWpZxqZqZqZqZqZqZqZqZq', 'customer', '0909123456');

INSERT INTO products (name, price, description, imageUrl) VALUES
('Bánh mousse dâu', 150000, 'Bánh mousse vị dâu tươi', 'https://picsum.photos/150/150?random=1'),
('Bánh socola đen', 180000, 'Bánh socola 70%', 'https://picsum.photos/150/150?random=2'),
('Bánh phô mai', 200000, 'Bánh cheesecake New York', 'https://picsum.photos/150/150?random=3');

INSERT INTO settings (id, dailyCapacity) VALUES (1, 50);