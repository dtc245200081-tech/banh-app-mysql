const bcrypt = require('bcryptjs');
const { User, Product, Order, OrderItem, Setting } = require('../models');
const { Op } = require('sequelize');

exports.requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/auth/login');
  }
  next();
};

// ========== QUẢN LÝ SẢN PHẨM ==========
exports.listProducts = async (req, res) => {
  const products = await Product.findAll();
  // Lấy thông báo lỗi từ query string (nếu có)
  const error = req.query.error;
  res.render('admin-products', { products, error });
};

exports.addProduct = async (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  // --- KIỂM TRA GIÁ HỢP LỆ ---
  const numericPrice = parseInt(price);
  if (isNaN(numericPrice) || numericPrice < 0) {
    return res.redirect('/admin/products?error=Giá sản phẩm phải là số dương hoặc bằng 0');
  }

  await Product.create({
    name,
    price: numericPrice,
    description,
    imageUrl: imageUrl || 'https://picsum.photos/150/150?random=1'
  });
  res.redirect('/admin/products');
};

exports.editProduct = async (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  // --- KIỂM TRA GIÁ HỢP LỆ ---
  const numericPrice = parseInt(price);
  if (isNaN(numericPrice) || numericPrice < 0) {
    return res.redirect('/admin/products?error=Giá sản phẩm phải là số dương hoặc bằng 0');
  }

  await Product.update(
    { name, price: numericPrice, description, imageUrl },
    { where: { id: req.params.id } }
  );
  res.redirect('/admin/products');
};

exports.deleteProduct = async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/products');
};

// ========== QUẢN LÝ TÀI KHOẢN ==========
exports.listUsers = async (req, res) => {
  const users = await User.findAll();
  const error = req.query.error;
  res.render('admin-users', { users, error });
};

exports.addUser = async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.redirect('/admin/users?error=Email đã tồn tại');
  const hashed = bcrypt.hashSync(password, 10);
  await User.create({ name, email, password: hashed, role, phone });
  res.redirect('/admin/users');
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user && user.role !== 'admin') {
    await user.destroy();
  }
  res.redirect('/admin/users');
};

// ========== QUẢN LÝ CÔNG NỢ ==========
exports.listDebts = async (req, res) => {
  const unpaidOrders = await Order.findAll({
    where: { status: 'Đã giao', isPaid: false }
  });
  for (let order of unpaidOrders) {
    order.items = await OrderItem.findAll({ where: { orderId: order.id } });
  }
  const debts = {};
  unpaidOrders.forEach(order => {
    if (!debts[order.customerName]) debts[order.customerName] = 0;
    debts[order.customerName] += order.totalAmount;
  });
  res.render('admin-debts', { unpaidOrders, debts });
};

exports.payDebt = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findByPk(orderId);
  if (order && order.status === 'Đã giao' && !order.isPaid) {
    order.isPaid = true;
    await order.save();
  }
  res.redirect('/admin/debts');
};

// ========== BÁO CÁO DOANH THU ==========
exports.reports = async (req, res) => {
  const paidOrders = await Order.findAll({
    where: { status: 'Đã giao', isPaid: true }
  });
  let totalRevenue = 0;
  const productRevenue = {};
  for (let order of paidOrders) {
    totalRevenue += order.totalAmount;
    const items = await OrderItem.findAll({ where: { orderId: order.id } });
    items.forEach(item => {
      if (!productRevenue[item.productName]) productRevenue[item.productName] = 0;
      productRevenue[item.productName] += item.price * item.quantity;
    });
  }
  res.render('admin-reports', { totalRevenue, productRevenue });
};

// ========== CÀI ĐẶT CÔNG SUẤT ==========
exports.getSettings = async (req, res) => {
  let setting = await Setting.findOne({ where: { id: 1 } });
  if (!setting) {
    setting = await Setting.create({ id: 1, dailyCapacity: 50 });
  }
  res.render('admin-settings', { capacity: setting.dailyCapacity });
};

exports.updateSettings = async (req, res) => {
  const { capacity } = req.body;
  await Setting.upsert({ id: 1, dailyCapacity: parseInt(capacity) });
  res.redirect('/admin/settings');
};
