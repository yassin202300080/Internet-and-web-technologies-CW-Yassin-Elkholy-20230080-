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