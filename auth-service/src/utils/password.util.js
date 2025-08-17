const bcrypt = require('bcrypt');
const logger = require('../config/logger');

async function hashPassword(plain) {
  try {
    if (!plain || typeof plain !== 'string') {
      throw new Error('Le mot de passe doit être une chaîne de caractères valide');
    }
    
    const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
    if (isNaN(saltRounds) || saltRounds < 10 || saltRounds > 12) {
      logger.warn('Valeur BCRYPT_SALT invalide, utilisation de la valeur par défaut: 10');
      const saltRounds = 10;
    }
    
    const hashedPassword = await bcrypt.hash(plain, saltRounds);
    logger.debug('Mot de passe hashé avec succès');
    return hashedPassword;
  } catch (error) {
    logger.error('Erreur lors du hashage du mot de passe:', error);
    throw new Error('Erreur lors de la création du compte. Veuillez réessayer.');
  }
}

async function comparePassword(plain, hash) {
  try {
    if (!plain || !hash || typeof plain !== 'string' || typeof hash !== 'string') {
      logger.warn('Paramètres invalides pour la comparaison de mot de passe');
      return false;
    }
    
    const isMatch = await bcrypt.compare(plain, hash);
    logger.debug('Comparaison de mot de passe terminée');
    return isMatch;
  } catch (error) {
    logger.error('Erreur lors de la comparaison des mots de passe:', error);
    return false;
  }
}

module.exports = { hashPassword, comparePassword };
