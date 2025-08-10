const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  mot_de_passe: Joi.string().required(),
});

module.exports = {
  validateLogin: (payload) => loginSchema.validateAsync(payload),
};
