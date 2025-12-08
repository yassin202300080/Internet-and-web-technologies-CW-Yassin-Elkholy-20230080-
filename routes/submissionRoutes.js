const express = require('express');
const { submitAssignment, getSubmissions, gradeSubmission } = require('../controllers/submissionController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

//Submit work for an assignment
router.post('/:assignmentId', submitAssignment);

// Staff view all submissions for an assignment
router.get('/assignment/:assignmentId', getSubmissions);

// Staff Grade a submission
router.put('/:submissionId/grade', gradeSubmission);

module.exports = router;