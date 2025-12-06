const db_access = require('../models/db.js');
const db = db_access.db;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//generate jwt token with user ID and role
const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
        });
};

//register user
const register = (req, res) => {
    const { email, password, first_name, last_name, role } = req.body;

    // Hash the password 
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: "Error hashing password" });
        }

        const query = `INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)`;
        const params = [email, hash, first_name, last_name, role];

        db.run(query, params, function(err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({ error: "Email already exists" });
                }
                return res.status(500).json({ error: "Database error during registration" });
            }

            // Create token immediately to log in
            const token = signToken(this.lastID, role);

            // Set Cookie 
            res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

            res.status(201).json({
                message: "User registered successfully",
                token: token,
                user: { id: this.lastID, email, first_name, last_name, role }
            });
        });
    });
};