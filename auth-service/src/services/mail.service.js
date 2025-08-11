const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Configure un transport SMTP correct:
// - secure=true pour SMTPS (465)
// - secure=false pour STARTTLS (587)
const secure = process.env.SMTP_SECURE === 'true';
const defaultPort = secure ? 465 : 587;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || String(defaultPort), 10),
  secure,
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

async function sendVerificationEmail(to, token) {
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const mail = {
    from: `"${process.env.EMAIL_FROM_NAME || 'App'}" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Verify your email',
    html: `<p>Hello,</p><p>Click to verify: <a href="${link}">${link}</a></p>`
  };

  try {
    // Si le SMTP n'est pas configuré, on log et on n'échoue pas l'inscription
    if (!process.env.SMTP_HOST) {
      logger.warn('SMTP not configured. Skipping verification email send.');
      return { skipped: true };
    }
    const info = await transporter.sendMail(mail);
    logger.info('Verification email sent', { messageId: info.messageId, to });
    return info;
  } catch (err) {
    // Ne pas bloquer le flux d'inscription pour un souci d'email
    logger.warn('Failed to send verification email (non-blocking)', { error: err.message, to });
    return { error: err.message };
  }
}

async function sendPasswordResetEmail(email, token) {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const subject = 'Réinitialisation de votre mot de passe';
  const html = `
    <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
    <p>Cliquez sur ce lien pour choisir un nouveau mot de passe :</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
  `;
  // Envoi via ton système d'email (ex: nodemailer)
  await sendEmail(email, subject, html);
}

module.exports = { sendVerificationEmail };
