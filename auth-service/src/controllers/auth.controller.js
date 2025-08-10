const authService = require('../services/auth.service');
const mailService = require('../services/mail.service');
const { validateRegister } = require('../dtos/register.dto');
const { validateLogin } = require('../dtos/login.dto');
const logger = require('../config/logger');

async function register(req, res) {
  try {
    const payload = await validateRegister(req.body);
    const user = await authService.registerUser(payload);
    const emailToken = await authService.generateEmailToken(user);
    // send verification email (do not block user creation on mail error in prod)
    await mailService.sendVerificationEmail(user.email, emailToken);
    return res.status(201).json({ message: 'User created. Please verify your email.' });
  } catch (err) {
    logger.error('Register error', err);
    return res.status(400).json({ error: err.message });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token missing' });
    await authService.verifyEmailToken(token);
    return res.json({ message: 'Email verified. You can now login.' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const payload = await validateLogin(req.body);
    const { accessToken, refreshToken, user } = await authService.login(payload.email, payload.password);
    return res.json({ accessToken, refreshToken, userId: user.id, profileType: user.profileType });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

async function requestPasswordReset(req, res) {
  try {
    const { email } = await validateRequestPasswordReset(req.body);
    const user = await authService.findUserByEmail(email);
    if (user) {
      const token = await authService.generatePasswordResetToken(user);
      await mailService.sendPasswordResetEmail(email, token);
    }
    res.json({ message: 'If your email exists in our system, a password reset link has been sent.' });
  } catch (err) {
    logger.error('Request password reset error:', err);
    res.status(400).json({ error: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = await validateResetPassword(req.body);
    await authService.resetPassword(token, newPassword);
    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    logger.error('Reset password error:', err);
    res.status(400).json({ error: err.message });
  }
}


async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokens(refreshToken);
    return res.json(tokens);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    await authService.revokeRefresh(refreshToken);
    return res.json({ message: 'Logged out' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { register, verifyEmail, login, refresh, logout, requestPasswordReset, resetPassword, };
