const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// load config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('FlashEdu backend  running');
});

// starting server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});