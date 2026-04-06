const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.showLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.render('login', { error: 'Sai email hoặc mật khẩu' });
    }
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Lỗi hệ thống' });
  }
};

exports.showRegister = (req, res) => {
  res.render('register', { error: null });
};

exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.render('register', { error: 'Email đã tồn tại' });
    }
    const hashed = bcrypt.hashSync(password, 10);
    await User.create({
      name,
      email,
      password: hashed,
      role: 'customer',
      phone
    });
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Đăng ký thất bại' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};