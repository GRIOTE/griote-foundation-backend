const logger = require('../config/logger');
const profileService = require('../services/profile.service');
const { validateProfile } = require('../dtos/profile.dto');

class ProfileController {
  async getProfile(req, res) {
    try {
      logger.info(`Get profile request for user ${req.user.id}`);
      const profile = await profileService.getProfileByUserId(req.user.id);
      if (!profile) {
        logger.warn(`Profile not found for user ${req.user.id}`);
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(profile);
    } catch (err) {
      logger.error(`Error in getProfile: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  }

  async createProfile(req, res) {
    try {
      logger.info(`Create profile request for user ${req.user.id}`);
      const validatedData = validateProfile(req.body);
      const newProfile = await profileService.createProfile(req.user.id, validatedData);
      res.status(201).json(newProfile);
    } catch (err) {
      logger.error(`Error in createProfile: ${err.message}`);
      res.status(400).json({ message: err.message });
    }
  }

  async updateProfile(req, res) {
    try {
      logger.info(`Update profile request for user ${req.user.id}`);
      const validatedData = validateProfile(req.body);
      const updatedProfile = await profileService.updateProfile(req.user.id, validatedData);
      res.json(updatedProfile);
    } catch (err) {
      logger.error(`Error in updateProfile: ${err.message}`);
      res.status(400).json({ message: err.message });
    }
  }

  async deleteProfile(req, res) {
    try {
      logger.info(`Delete profile request for user ${req.user.id}`);
      await profileService.deleteProfile(req.user.id);
      res.status(204).send();
    } catch (err) {
      logger.error(`Error in deleteProfile: ${err.message}`);
      res.status(400).json({ message: err.message });
    }
  }

  async listProfiles(req, res) {
    try {
      logger.info('List profiles request');
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 10;
      const profiles = await profileService.listProfiles(offset, limit);
      res.json(profiles);
    } catch (err) {
      logger.error(`Error in listProfiles: ${err.message}`);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new ProfileController();
