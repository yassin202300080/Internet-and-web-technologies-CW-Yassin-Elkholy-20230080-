const db_access = require('../models/db.js');
const db = db_access.db;

const createClassroom = (req, res) => {
    //Check only Staff can create classes
    if (req.user.role !== 'staff') {
        return res.status(403).json({ error: "Access denied. Only Staff can create classrooms." });
    }

    const { name, description, schedule } = req.body;

    
    if (!name) {
        return res.status(400).json({ error: "Classroom name is required" });
    }

    //Generate class code 
    
    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    
    const query = `INSERT INTO classrooms (teacher_id, name, description, class_code, schedule) VALUES (?, ?, ?, ?, ?)`;
    const params = [req.user.id, name, description, classCode, JSON.stringify(schedule)];

    db.run(query, params, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error while creating classroom" });
        }

        
        res.status(201).json({
            message: "Classroom created successfully",
            classroom: {
                id: this.lastID,
                teacher_id: req.user.id,
                name: name,
                class_code: classCode
            }
        });
    });
};

//viewing classrooms 
const listClassrooms = (req, res) => {
    let query = "";
    let params = [];

    if (req.user.role === 'staff') {
        //staff views created classes
        query = `SELECT * FROM classrooms WHERE teacher_id = ?`;
        params = [req.user.id];
    } else {
        // Student views classes
        query = `SELECT c.* FROM classrooms c 
                 JOIN enrollments e ON c.classroom_id = e.classroom_id 
                 WHERE e.student_id = ?`;
        params = [req.user.id];
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json({ classrooms: rows });
    });
};
   
//join classroom for students 
const joinClassroom = (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: "Only students can join classrooms" });
    }

    const { classCode } = req.body;
    if (!classCode) return res.status(400).json({ error: "Class code is required" });

    //finding the classroom id using the code
    db.get(`SELECT classroom_id FROM classrooms WHERE class_code = ?`, [classCode], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(404).json({ error: "Invalid class code" });

        const classroomId = row.classroom_id;

        //enroll student
        const enrollQuery = `INSERT INTO enrollments (classroom_id, student_id) VALUES (?, ?)`;
        db.run(enrollQuery, [classroomId, req.user.id], function(err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ error: "You are already enrolled in this class" });
                }
                return res.status(500).json({ error: "Error joining class" });
            }
            res.status(200).json({ message: "Joined classroom successfully", classroomId: classroomId });
        });
    });
};

//get classroom details by id 
const getClassroomById = (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM classrooms WHERE classroom_id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(404).json({ error: "Classroom not found" });
        
        res.status(200).json(row);
    });
};

//update classroom 
 const updateClassroom = (req, res) => {
    if (req.user.role !== 'staff') return res.status(403).json({ error: "Access denied" });

    const { id } = req.params;
    const { name, description, schedule } = req.body;

    //ensure staff own the class before updating
    const query = `UPDATE classrooms SET name = ?, description = ?, schedule = ? WHERE classroom_id = ? AND teacher_id = ?`;
    const params = [name, description, JSON.stringify(schedule), id, req.user.id];

    db.run(query, params, function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        if (this.changes === 0) return res.status(404).json({ error: "Classroom not found or you are not the owner" });
        
        res.status(200).json({ message: "Classroom updated successfully" });
    });
};

//Delete classroom
const deleteClassroom = (req, res) => {
    if (req.user.role !== 'staff') return res.status(403).json({ error: "Access denied" });

    const { id } = req.params;

    //remove assignments and enrollments
    const query = `DELETE FROM classrooms WHERE classroom_id = ? AND teacher_id = ?`;

    db.run(query, [id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        if (this.changes === 0) return res.status(404).json({ error: "Classroom not found or you are not the owner" });

        res.status(200).json({ message: "Classroom deleted successfully" });
    });
};

module.exports = { createClassroom, joinClassroom,listClassrooms, getClassroomById, updateClassroom, deleteClassroom };