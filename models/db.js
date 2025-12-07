const sqlite = require('sqlite3').verbose();
const { table } = require('console');
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
const CreateClassroomTable = `CREATE TABLE IF NOT EXISTS classrooms (
    classroom_id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    class_code TEXT UNIQUE NOT NULL,
    schedule TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE
)`;

//enrollment table
const CreateEnrollmentTable = `CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    classroom_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(classroom_id, student_id)
)`;

//Assignments
const CreateAssignmentTable = `CREATE TABLE IF NOT EXISTS assignments (
    assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    classroom_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    max_points INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id) ON DELETE CASCADE
)`;

//Submissions 
const CreateSubmissionTable = `CREATE TABLE IF NOT EXISTS submissions (
    submission_id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    submission_text TEXT,
    status TEXT DEFAULT 'submitted', -- 'submitted', 'graded'
    grade INTEGER,
    feedback TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
)`;

module.exports = { 
    db, 
    CreateUserTable,
    CreateClassroomTable,
    CreateEnrollmentTable,
    CreateAssignmentTable,
    CreateSubmissionTable 
};