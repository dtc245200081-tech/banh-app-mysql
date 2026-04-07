const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // ✅ CORRECT
const Setting = sequelize.define('Setting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
  dailyCapacity: { type: DataTypes.INTEGER, defaultValue: 50 }
}, {
  tableName: 'settings',
  timestamps: false
});

module.exports = Setting;
