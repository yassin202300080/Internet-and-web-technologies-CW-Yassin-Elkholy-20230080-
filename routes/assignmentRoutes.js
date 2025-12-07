const express = require('express');
const { createAssignment, listAssignments, updateAssignment } = require('../controllers/assignmentController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken); 

router.post('/', createAssignment);


router.put('/:id', updateAssignment);


router.get('/class/:classroomId', listAssignments);

module.exports = router;