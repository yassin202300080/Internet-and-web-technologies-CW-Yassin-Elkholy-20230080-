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

    //check assignment and if deadline passed
    db.get(`SELECT due_date FROM assignments WHERE assignment_id = ?`, [assignmentId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(404).json({ error: "Assignment not found" });

        //Check deadline
        const dueDate = new Date(row.due_date);
        const now = new Date();

        if (now > dueDate) {
            return res.status(400).json({ error: "Deadline has passed. Submission rejected." }); 
        }
        
        //insert submission
        const query = `INSERT INTO submissions (assignment_id, student_id, submission_text) VALUES (?, ?, ?)`;
        const params = [assignmentId, req.user.id, submissionText];

        db.run(query, params, function(err) {
            if (err) return res.status(500).json({ error: "Database error or already submitted" });
            res.status(201).json({ message: "Assignment submitted successfully", submissionId: this.lastID });
        });
    });
};

//staff view submission 
const getSubmissions = (req, res) => {
    if (req.user.role !== 'staff')
        return res.status(403).json({ error: "Access denied" });

    const { assignmentId } = req.params;
    //student submission details
    const query = `
        SELECT s.*, u.first_name, u.last_name, u.email 
        FROM submissions s
        JOIN users u ON s.student_id = u.user_id
        WHERE s.assignment_id = ?
    `;

    db.all(query, [assignmentId], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.status(200).json({ submissions: rows });
    });
};

//grade submission and feedback 
const gradeSubmission = (req, res) => {
    if (req.user.role !== 'staff')
        return res.status(403).json({ error: "Access denied" });

    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    const query = `
        UPDATE submissions
        SET grade = ?, feedback = ?, status = 'graded'
        WHERE submission_id = ?
    `;

    db.run(query, [grade, feedback, submissionId], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });

        //if nothing was updated the submission Id doesn't exist
        if (this.changes === 0) return res.status(404).json({ error: "Submission not found" });

        res.status(200).json({ message: "Submission graded successfully" });
    });
};

module.exports = { submitAssignment, getSubmissions, gradeSubmission};
