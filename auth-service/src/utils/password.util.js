const bcrypt = require('bcrypt');

async function hashPassword(plain) {
  const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
  return bcrypt.hash(plain, saltRounds);
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { hashPassword, comparePassword };
