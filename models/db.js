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
const CreateUserTable = `CREATE TABLE 
`;

//Classroom Table
const CreateClassroomTable = `CREATE TABLE
`;



module.exports = { 
    db, 
    CreateUserTable,
    CreateClassroomTable,
    
};