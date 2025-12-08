const db_access = require('../models/db.js');
const db = db_access.db;

//students submit assignment 
const submitAssignment = (req, res) => {
    if (req.user.role !== 'student')
        return res.status(403).json({ error: "Only students can submit work." });

    const { assignmentId } = req.params;
    const { submissionText } = req.body;
//empty submissions
if (!submissionText)
        return res.status(400).json({ error: "Submission text is required" });
    const query = `INSERT INTO submissions (assignment_id, student_id, submission_text) VALUES (?, ?, ?)`;
    const params = [assignmentId, req.user.id, submissionText];
//Save submission in the database
db.run(query, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
            message: "Assignment submitted successfully",
            submissionId: this.lastID
        });
    });
};

