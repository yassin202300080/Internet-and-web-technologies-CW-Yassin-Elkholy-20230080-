const express = require('express');
const { getMe, updateMe } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();
router.use(verifyToken);

router.get('/me', getMe);
router.put('/me', updateMe);

module.exports = router;