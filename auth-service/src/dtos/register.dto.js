const Joi = require('joi');

// Validation du payload d'inscription
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)')
    .required(),
  profileType: Joi.string().valid('Student', 'Teacher', 'Independent').required(),
});

module.exports = {
  validateRegister: (payload) => registerSchema.validateAsync(payload, { abortEarly: false }),
};
