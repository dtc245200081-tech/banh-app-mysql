require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

// Nếu có MYSQL_PUBLIC_URL (production)
if (process.env.MYSQL_PUBLIC_URL) {
  sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL, {
    dialect: 'mysql',
    logging: false
  });
}
// Nếu không có thì dùng biến riêng (development)
else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false
    }
  );
}

module.exports = sequelize;
