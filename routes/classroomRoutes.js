const express = require('express');
const {
    createClassroom, 
    listClassrooms, 
    joinClassroom, 
    getClassroomById
} = require('../controllers/classroomController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/',createClassroom);
router.get('/', listClassrooms);         
router.post('/join', joinClassroom);     
router.get('/:id', getClassroomById);

module.exports = router;