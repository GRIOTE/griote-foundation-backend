const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'change_this_secret';

function verify(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { verify };
