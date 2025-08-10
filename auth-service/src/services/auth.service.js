const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { signAccess, signRefresh, signEmail, verify } = require('../utils/token.util');
const rabbit = require('../events/rabbitmq.publisher');
const logger = require('../config/logger');

async function registerUser(payload) {
  const hashed = await hashPassword(payload.password);
  const user = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: hashed,
    profileType: payload.profileType,
    isVerified: false,
  });
  logger.info('User created', { userId: user.id, email: user.email });

  // publish UserCreated event (minimal data)
  rabbit.publishUserCreated({
    event: 'UserCreated',
    data: { id: user.id, email: user.email, profileType: user.profileType }
  });

  return user;
}

async function generateEmailToken(user) {
  return signEmail({ id: user.id, email: user.email });
}

async function verifyEmailToken(token) {
  const payload = verify(token);
  const user = await User.findByPk(payload.id);
  if (!user) throw new Error('User not found');
  user.isVerified = true;
  await user.save();
  return user;
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  if (!user.isVerified) throw new Error('Account not verified');
  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  const payload = { id: user.id, profileType: user.profileType };
  const accessToken = signAccess(payload);
  const refreshTokenStr = signRefresh(payload);

  const expires = new Date(Date.now() + (7*24*60*60*1000)); // 7d
  await RefreshToken.create({ token: refreshTokenStr, userId: user.id, expiresAt: expires });

  return { accessToken, refreshToken: refreshTokenStr, user };
}

async function generatePasswordResetToken(user) {
  return tokenUtils.signEmail({ userId: user.id, type: 'PASSWORD_RESET' });
}

async function resetPassword(token, newPassword) {
  let payload;
  try {
    payload = tokenUtils.verify(token);
  } catch {
    throw new Error('Invalid or expired token');
  }
  if (payload.type !== 'PASSWORD_RESET') throw new Error('Invalid token type');

  const user = await User.findByPk(payload.userId);
  if (!user) throw new Error('User not found');

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  return true;
}


async function refreshTokens(oldRefresh) {
  const dbToken = await RefreshToken.findOne({ where: { token: oldRefresh } });
  if (!dbToken) throw new Error('Invalid refresh token');

  let payload;
  try { payload = verify(oldRefresh); }
  catch (e) { await dbToken.destroy(); throw new Error('Invalid or expired refresh token'); }

  const newAccess = signAccess({ id: payload.id, profileType: payload.profileType });
  const newRefresh = signRefresh({ id: payload.id, profileType: payload.profileType });

  await dbToken.update({ token: newRefresh, expiresAt: new Date(Date.now() + (7*24*60*60*1000)) });

  return { accessToken: newAccess, refreshToken: newRefresh };
}

async function revokeRefresh(token) {
  await RefreshToken.destroy({ where: { token } });
}

module.exports = { registerUser, generateEmailToken, verifyEmailToken, login, generatePasswordResetToken, resetPassword, refreshTokens, revokeRefresh };
