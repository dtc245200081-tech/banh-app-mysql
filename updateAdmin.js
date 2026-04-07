const bcrypt = require('bcryptjs');
const { User } = require('./models');

(async () => {
  const hash = bcrypt.hashSync('123456', 10);

  await User.update(
    { password: hash, role: 'admin' },
    { where: { email: 'admin1@banh.com' } }
  );

  console.log("OK");
})();
