const Joi = require('joi');

const domainIdsSchema = Joi.array().items(Joi.number().integer()).unique();

const profileSchema = Joi.object({
  phoneNumber: Joi.string().pattern(/^[0-9+\-\s]{7,15}$/).allow(null, ''),
  country: Joi.string().max(100).allow(null, ''),
  city: Joi.string().max(100).allow(null, ''),
  birthDate: Joi.date().iso().allow(null, ''),
  avatarUrl: Joi.string().uri().allow(null, ''),
  bio: Joi.string().max(1000).allow(null, ''),
  linkedinUrl: Joi.string().uri().allow(null, ''),
  youtubeUrl: Joi.string().uri().allow(null, ''),
  personalWebsite: Joi.string().uri().allow(null, ''),
  domainIds: domainIdsSchema.optional(),
  student: Joi.object({
    studyLevel: Joi.string().max(100).required(),
    universityName: Joi.string().max(255).required(),
    domainIds: domainIdsSchema.optional(),
  }).optional(),
  teacher: Joi.object({
    expertiseFields: Joi.array().items(Joi.string().max(255)).required(),
    institution: Joi.string().max(255).required(),
    domainIds: domainIdsSchema.optional(),
  }).optional(),
  independent: Joi.object({
    yearsExperience: Joi.number().integer().min(0).optional(),
    domainIds: domainIdsSchema.optional(),
  }).optional(),
});

function validateProfile(data) {
  const { error, value } = profileSchema.validate(data, { abortEarly: false, allowUnknown: true });
  if (error) {
    throw new Error('Validation failed: ' + error.details.map(d => d.message).join(', '));
  }
  return value;
}

module.exports = {
  validateProfile,
};
