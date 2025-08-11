const Joi = require('joi');

// Validation du payload d'inscription
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  profileType: Joi.string().valid('Student', 'Teacher', 'Independent').required(),
});

module.exports = {
  validateRegister: (payload) => registerSchema.validateAsync(payload, { abortEarly: false }),
};
