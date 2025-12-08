const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const db_access = require('./models/db.js');
const db = db_access.db;

//import routes 
const authRoutes = require('./routes/authRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/userRoutes');

// load config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//creating tables for database 
db.serialize(() => {
    db.run(db_access.CreateUserTable, (err) => {
        if (err) console.log("error creating users table:", err.message);
        else console.log("users table ready");
    });
    
    db.run(db_access.CreateClassroomTable, (err) => {
        if (err) console.log("error creating classrooms table:", err.message);
        else console.log("classrooms table ready");
    });

    db.run(db_access.CreateEnrollmentTable, (err) => {
        if (err) console.log("error creating enrollments table:", err.message);
        else console.log("enrollments table ready");
    });

    db.run(db_access.CreateAssignmentTable, (err) => {
        if (err) console.log("Error creating Assignments table:", err.message);
        else console.log("Assignments Table Ready");

        db.run(db_access.CreateSubmissionTable, (err) => {
        if (err) console.log("Error creating Submissions table:", err.message);
        else console.log("Submissions Table Ready");
    });
    });
});

//use routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/classrooms', classroomRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/submissions', submissionRoutes);

app.get('/', (req, res) => {
    res.send('FlashEdu backend  running');
});

// starting server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});