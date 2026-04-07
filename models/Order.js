const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  customerName: { type: DataTypes.STRING, allowNull: false },
  totalAmount: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('Chờ xác nhận', 'Đang làm', 'Hoàn thành', 'Đã giao', 'Đã hủy'), defaultValue: 'Chờ xác nhận' },
  orderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  deliveryDate: { type: DataTypes.DATEONLY, allowNull: false },
  isPaid: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'orders',
  timestamps: false
});

module.exports = Order;
