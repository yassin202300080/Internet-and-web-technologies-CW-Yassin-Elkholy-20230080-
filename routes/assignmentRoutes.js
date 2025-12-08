const express = require('express');
const { createAssignment, listAssignments, updateAssignment, getAssignmentById } = require('../controllers/assignmentController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken); 

router.post('/', createAssignment);


router.put('/:id', updateAssignment);


router.get('/class/:classroomId', listAssignments);

router.get('/:id', getAssignmentById);

module.exports = router;