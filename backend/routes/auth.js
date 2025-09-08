const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
    const { studentId, password } = req.body;
    
    if (!studentId || !password) {
        return res.status(400).json({ message: 'Student ID and password are required' });
    }
    
    // Default password for all students
    const defaultPassword = 'pass@123';
    //const actualPassword = password === defaultPassword ? defaultPassword : password;
    
    const query = 'SELECT student_id,age, degree, year_of_study, passing_year, cgpa, skills, location FROM students WHERE student_id = ?';
    db.query(query, [studentId, defaultPassword], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        if (results.length > 0) {
            res.json({ message: 'Login successful', student: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

module.exports = router;