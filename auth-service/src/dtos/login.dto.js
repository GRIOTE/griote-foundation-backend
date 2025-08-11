const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  validateLogin: (payload) => loginSchema.validateAsync(payload, { abortEarly: false }),
};
