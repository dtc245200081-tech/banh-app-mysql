const { Order, OrderItem, Product, Setting } = require('../models');
const { Op } = require('sequelize');

exports.requireStaff = (req, res, next) => {
  if (!req.session.user || (req.session.user.role !== 'staff' && req.session.user.role !== 'admin')) {
    return res.redirect('/auth/login');
  }
  next();
};

// Danh sách đơn hàng (tất cả, sắp xếp theo trạng thái)
exports.listOrders = async (req, res) => {
  try {
    let orders = await Order.findAll({ order: [['orderDate', 'DESC']] });
    for (let order of orders) {
      order.items = await OrderItem.findAll({ where: { orderId: order.id } });
    }
    // Sắp xếp ưu tiên: Chờ xác nhận > Đang làm > Hoàn thành > Đã giao > Đã hủy
    const statusOrder = { 'Chờ xác nhận': 1, 'Đang làm': 2, 'Hoàn thành': 3, 'Đã giao': 4, 'Đã hủy': 5 };
    orders.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    res.render('staff-orders', { orders });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateStatus = async (req, res) => {
  const orderId = req.params.id;
  const { newStatus } = req.body;
  try {
    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) return res.redirect('/staff/orders');

    const statusFlow = ['Chờ xác nhận', 'Đang làm', 'Hoàn thành', 'Đã giao'];
    const currentIdx = statusFlow.indexOf(order.status);
    const newIdx = statusFlow.indexOf(newStatus);
    // Cho phép chuyển tiếp 1 bước hoặc hủy nếu đang chờ
    if ((newIdx === currentIdx + 1) || (newStatus === 'Đã hủy' && order.status === 'Chờ xác nhận')) {
      // Kiểm tra công suất nếu chuyển từ Chờ xác nhận -> Đang làm
      if (newStatus === 'Đang làm' && order.status === 'Chờ xác nhận') {
        const settings = await Setting.findOne({ where: { id: 1 } });
        const capacity = settings ? settings.dailyCapacity : 50;
        const targetDate = order.deliveryDate;
        // Lấy tất cả đơn đã ở trạng thái Đang làm hoặc Hoàn thành trong cùng ngày
        const ordersSameDay = await Order.findAll({
          where: {
            deliveryDate: targetDate,
            status: { [Op.in]: ['Đang làm', 'Hoàn thành'] }
          }
        });
        let totalCakes = 0;
        for (let o of ordersSameDay) {
          const items = await OrderItem.findAll({ where: { orderId: o.id } });
          totalCakes += items.reduce((sum, i) => sum + i.quantity, 0);
        }
        const currentCakes = await OrderItem.sum('quantity', { where: { orderId: order.id } });
        if (totalCakes + currentCakes > capacity) {
          return res.send('<script>alert("Vượt quá công suất sản xuất ngày này!"); window.location.href="/staff/orders";</script>');
        }
      }
      order.status = newStatus;
      await order.save();
    }
    res.redirect('/staff/orders');
  } catch (err) {
    console.error(err);
    res.redirect('/staff/orders');
  }
};

// Kế hoạch sản xuất: các đơn đã xác nhận (Đang làm, Hoàn thành)
exports.productionPlan = async (req, res) => {
  try {
    const confirmedOrders = await Order.findAll({
      where: { status: { [Op.in]: ['Đang làm', 'Hoàn thành'] } }
    });
    for (let order of confirmedOrders) {
      order.items = await OrderItem.findAll({ where: { orderId: order.id } });
    }
    // Gom nhóm theo ngày giao
    const plan = {};
    confirmedOrders.forEach(order => {
      const date = order.deliveryDate;
      if (!plan[date]) plan[date] = [];
      plan[date].push(order);
    });
    res.render('production-plan', { plan });
  } catch (err) {
    console.error(err);
    res.redirect('/staff/orders');
  }
};