const db_access = require('../models/db.js');
const db = db_access.db;

//create Assignment
const createAssignment = (req, res) => {
    if (req.user.role !== 'staff') {
        return res.status(403).json({ error: "Access denied. Only staff can create assignments." });
    }

    const { classroomId, title, description, dueDate, maxPoints } = req.body;

    if (!classroomId || !title || !dueDate) {
        return res.status(400).json({ error: "Missing required fields (classroomId, title, dueDate)" });
    }

    //Verify teacher owns classroom
    db.get(`SELECT * FROM classrooms WHERE classroom_id = ? AND teacher_id = ?`, [classroomId, req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(403).json({ error: "You do not own this classroom" });

        const query = `INSERT INTO assignments (classroom_id, title, description, due_date, max_points) VALUES (?, ?, ?, ?, ?)`;
        const params = [classroomId, title, description, dueDate, maxPoints || 100];

        db.run(query, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Assignment created successfully", assignmentId: this.lastID });
        });
    });
};

//list assignments by classroom Id
const listAssignments = (req, res) => {
    const classroomId = req.params.classroomId;

    //check if the classroom exists
    db.get(`SELECT * FROM classrooms WHERE classroom_id = ?`, [classroomId], (err, classroom) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!classroom) return res.status(404).json({ error: "Classroom not found" });

        //get all assignments for this class
        const query = `SELECT * FROM assignments WHERE classroom_id = ? ORDER BY created_at DESC`;
        db.all(query, [classroomId], (err, rows) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.status(200).json({ assignments: rows });
        });
    });
};

//Update assignment
const updateAssignment = (req, res) => {
    if (req.user.role !== 'staff') return res.status(403).json({ error: "Access denied" });

    const assignmentId = req.params.id;
    const { title, description, dueDate } = req.body;

    const query = `UPDATE assignments SET title = ?, description = ?, due_date = ? WHERE assignment_id = ?`;
    const params = [title, description, dueDate, assignmentId];

    db.run(query, params, function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        if (this.changes === 0) return res.status(404).json({ error: "Assignment not found" });
        
        res.status(200).json({ message: "Assignment updated successfully" });
    });
};

module.exports = { createAssignment, listAssignments, updateAssignment };