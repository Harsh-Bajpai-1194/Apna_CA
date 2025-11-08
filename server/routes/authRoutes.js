const express = require('express');
const router = express.Router();
const { googleLogin } = require('../controllers/authController');

router.post('/google', googleLogin);

module.exports = router;