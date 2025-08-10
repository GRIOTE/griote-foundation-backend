const express = require('express');
const controller = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', controller.register);
router.get('/verify-email', controller.verifyEmail);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.post('/request-password-reset', controller.requestPasswordReset);
router.post('/reset-password', controller.resetPassword);

module.exports = router;
