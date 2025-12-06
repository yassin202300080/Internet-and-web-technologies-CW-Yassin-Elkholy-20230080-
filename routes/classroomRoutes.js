const express = require('express');
const { createClassroom } = require('../controllers/classroomController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createClassroom);

module.exports = router;