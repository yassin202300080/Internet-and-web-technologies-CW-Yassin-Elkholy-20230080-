const validateRegister = (req, res, next) => {
    const { email, password, first_name, last_name, role } = req.body;

    // check missing fields
    if (!email || !password || !first_name || !last_name || !role) {
        return res.status(400).json({ error: "All fields are required (email, password, first_name, last_name, role)" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    //Validate password by atleast 6 characters
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Validate role student or staff
    if (role !== 'student' && role !== 'staff') {
        return res.status(400).json({ error: "Role must be either student or staff" });
    }

    next(); 
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    next();
};

module.exports = { validateRegister, validateLogin };