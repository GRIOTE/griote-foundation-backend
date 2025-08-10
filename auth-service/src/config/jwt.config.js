module.exports = {
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_EXPIRES || '15m',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_EXPIRES || '7d',
  EMAIL_TOKEN_EXPIRES_IN: process.env.EMAIL_TOKEN_EXPIRES || '1d',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
};
