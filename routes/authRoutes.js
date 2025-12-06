const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');

const router = express.Router();

//define the endpoints
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

module.exports = router;