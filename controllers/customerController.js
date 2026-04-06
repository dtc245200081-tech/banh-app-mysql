const { Product, Order, OrderItem, Setting } = require('../models');
const { Op } = require('sequelize');

// Middleware kiểm tra role customer
exports.requireCustomer = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'customer') {
    return res.redirect('/auth/login');
  }
  next();
};

// Hiển thị danh sách sản phẩm
exports.showProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('products', { products });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// Thêm vào giỏ hàng (dùng session)
exports.addToCart = (req, res) => {
  const { productId, quantity, deliveryDate } = req.body;
  if (!req.session.cart) req.session.cart = [];
  // Lưu tạm thông tin sản phẩm (có thể lấy từ database)
  // Ở đây giả sử ta đã có product trong session hoặc truy vấn lại
  // Để đơn giản, ta lưu productId và sẽ truy vấn khi đặt hàng
  req.session.cart.push({
    productId: parseInt(productId),
    quantity: parseInt(quantity),
    deliveryDate
  });
  res.redirect('/customer/cart');
};

// Hiển thị giỏ hàng
exports.showCart = async (req, res) => {
  const cart = req.session.cart || [];
  // Lấy thông tin chi tiết sản phẩm từ database
  const productIds = cart.map(item => item.productId);
  const products = await Product.findAll({ where: { id: productIds } });
  const cartItems = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      name: prod.name,
      price: prod.price,
      quantity: item.quantity,
      deliveryDate: item.deliveryDate
    };
  });
  res.render('cart', { cart: cartItems });
};

// Cập nhật số lượng trong giỏ
exports.updateCart = (req, res) => {
  const index = parseInt(req.params.index);
  const { quantity } = req.body;
  if (req.session.cart && req.session.cart[index]) {
    req.session.cart[index].quantity = parseInt(quantity);
  }
  res.redirect('/customer/cart');
};

// Xóa sản phẩm khỏi giỏ
exports.removeFromCart = (req, res) => {
  const index = parseInt(req.params.index);
  if (req.session.cart && req.session.cart[index]) {
    req.session.cart.splice(index, 1);
  }
  res.redirect('/customer/cart');
};

// Đặt hàng
exports.placeOrder = async (req, res) => {
  const cart = req.session.cart;
  if (!cart || cart.length === 0) return res.redirect('/customer/products');

  const { deliveryDate } = req.body; // ngày giao từ form
  // Kiểm tra công suất
  const settings = await Setting.findOne({ where: { id: 1 } });
  const capacity = settings ? settings.dailyCapacity : 50;
  const targetDate = deliveryDate;
  const ordersSameDay = await Order.findAll({
    where: {
      deliveryDate: targetDate,
      status: { [Op.in]: ['Đang làm', 'Hoàn thành'] }
    }
  });
  let totalCakes = 0;
  for (let order of ordersSameDay) {
    const items = await OrderItem.findAll({ where: { orderId: order.id } });
    totalCakes += items.reduce((sum, i) => sum + i.quantity, 0);
  }
  const currentCakes = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalCakes + currentCakes > capacity) {
    return res.send('<script>alert("Vượt quá công suất sản xuất ngày này!"); window.location.href="/customer/cart";</script>');
  }

  // Lấy thông tin chi tiết sản phẩm
  const productIds = cart.map(item => item.productId);
  const products = await Product.findAll({ where: { id: productIds } });
  let totalAmount = 0;
  const orderItems = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const subtotal = prod.price * item.quantity;
    totalAmount += subtotal;
    return {
      productId: item.productId,
      productName: prod.name,
      quantity: item.quantity,
      price: prod.price
    };
  });

  // Tạo đơn hàng
  const newOrder = await Order.create({
    customerId: req.session.user.id,
    customerName: req.session.user.name,
    totalAmount,
    status: 'Chờ xác nhận',
    orderDate: new Date(),
    deliveryDate,
    isPaid: false
  });

  // Tạo các order items
  for (let item of orderItems) {
    await OrderItem.create({
      orderId: newOrder.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price
    });
  }

  // Xóa giỏ hàng
  req.session.cart = [];
  res.redirect('/customer/my-orders');
};

// Xem đơn hàng của tôi
exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customerId: req.session.user.id },
      order: [['orderDate', 'DESC']]
    });
    // Lấy order items cho mỗi order
    for (let order of orders) {
      order.items = await OrderItem.findAll({ where: { orderId: order.id } });
    }
    res.render('my-orders', { orders });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// Hủy đơn hàng (nếu chưa xử lý)
exports.cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findOne({ where: { id: orderId, customerId: req.session.user.id } });
    if (order && order.status === 'Chờ xác nhận') {
      order.status = 'Đã hủy';
      await order.save();
    }
    res.redirect('/customer/my-orders');
  } catch (err) {
    console.error(err);
    res.redirect('/customer/my-orders');
  }
};