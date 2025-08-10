const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', profileController.getProfile);

router.put('/', profileController.updateProfile);

router.post('/', profileController.createProfile);

router.delete('/', profileController.deleteProfile);

router.get('/list', profileController.listProfiles);

module.exports = router;
