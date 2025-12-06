const sqlite = require('sqlite3').verbose();
const path = require('path');

// Connecting to flash edu database
const db = new sqlite.Database(path.resolve(__dirname, '../flashedu.db'), (err) => {
    if (err) {
        console.error("error connecting to the database:", err.message);
    } else {
        console.log("Connected to the SQ Lite database.");
    }
});

//User Table 
const CreateUserTable = `CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

//Classroom Table
const CreateClassroomTable = `CREATE TABLE
`;



module.exports = { 
    db, 
    CreateUserTable,
    CreateClassroomTable,
    
};