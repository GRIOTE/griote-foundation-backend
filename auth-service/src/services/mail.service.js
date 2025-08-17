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
    from: `"${process.env.EMAIL_FROM_NAME || 'Griote Foundation'}" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Vérifiez votre compte Griote Foundation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50; text-align: center;">Bienvenue sur Griote Foundation !</h2>
        
        <p>Bonjour,</p>
        
        <p>Merci de vous être inscrit sur notre plateforme. Pour finaliser votre inscription et accéder à votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" 
             style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
             Vérifier mon compte
          </a>
        </div>
        
       
        <p style="font-size: 14px; color: #7f8c8d;">
          Ce lien expirera dans 24 heures pour des raisons de sécurité.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #95a5a6; text-align: center;">
          Si vous n'avez pas créé de compte sur Griote Foundation, veuillez ignorer cet email.
        </p>
      </div>
    `
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
  const mail = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Griote Foundation'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50; text-align: center;">Réinitialisation de mot de passe</h2>
        
        <p>Bonjour,</p>
        
        <p>Vous avez demandé à réinitialiser votre mot de passe sur Griote Foundation.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
             Réinitialiser mon mot de passe
          </a>
        </div>
        
       
        
        <p style="font-size: 14px; color: #7f8c8d;">
          Ce lien expirera dans 24 heures pour des raisons de sécurité.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #95a5a6; text-align: center;">
          Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
        </p>
      </div>
    `
  };

  try {
    // Si le SMTP n'est pas configuré, on log et on n'échoue pas
    if (!process.env.SMTP_HOST) {
      logger.warn('SMTP not configured. Skipping password reset email send.');
      return { skipped: true };
    }
    const info = await transporter.sendMail(mail);
    logger.info('Password reset email sent', { messageId: info.messageId, to: email });
    return info;
  } catch (err) {
    // Ne pas bloquer le flux pour un souci d'email
    logger.warn('Failed to send password reset email (non-blocking)', { error: err.message, to: email });
    return { error: err.message };
  }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
