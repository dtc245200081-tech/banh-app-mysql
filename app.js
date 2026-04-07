require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./config/database');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const staffRoutes = require('./routes/staff');
const adminRoutes = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Express built-in JSON parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/customer', customerRoutes);
app.use('/staff', staffRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Database connection
sequelize.authenticate()
  .then(() => console.log('✅ Kết nối MySQL thành công'))
  .catch(err => {
    console.error('❌ Lỗi kết nối MySQL:', err);
    process.exit(1);
  });

sequelize.sync({ alter: false })
  .then(() => console.log('✅ Đồng bộ model thành công'))
  .catch(err => console.error('❌ Lỗi sync model:', err));

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${NODE_ENV})`);
});
