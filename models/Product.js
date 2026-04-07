const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = Product;
