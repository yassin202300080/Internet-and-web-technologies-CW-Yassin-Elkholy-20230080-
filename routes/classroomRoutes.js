const express = require('express');
const {
    createClassroom, 
    listClassrooms, 
    joinClassroom, 
    getClassroomById,
    updateClassroom,
    deleteClassroom
} = require('../controllers/classroomController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/',createClassroom);
router.get('/', listClassrooms);         
router.post('/join', joinClassroom);     
router.get('/:id', getClassroomById);

router.put('/:id', updateClassroom);
router.delete('/:id', deleteClassroom);

module.exports = router;