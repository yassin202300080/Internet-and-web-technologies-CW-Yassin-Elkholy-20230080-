const db_access = require('../models/db.js');
const db = db_access.db;

//get Current User Profile 
const getMe = (req, res) => {
    const userId = req.user.id; 

    db.get(`SELECT user_id, email, first_name, last_name, role, created_at FROM users WHERE user_id = ?`, [userId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(404).json({ error: "User not found" });
        
        res.status(200).json({ user: row });
    });
};

//Update Profile 
const updateMe = (req, res) => {
    const userId = req.user.id;
    const { first_name, last_name } = req.body;

    const query = `UPDATE users SET first_name = ?, last_name = ? WHERE user_id = ?`;
    
    db.run(query, [first_name, last_name, userId], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json({ message: "Profile updated successfully" });
    });
};

module.exports = { getMe, updateMe };