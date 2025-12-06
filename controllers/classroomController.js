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



module.exports = { createClassroom };