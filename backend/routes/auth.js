const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
    const { studentId, password } = req.body;
    
    if (!studentId || !password) {
        return res.status(400).json({ message: 'Student ID and password are required' });
    }
    
    const query = 'SELECT * FROM students WHERE id = ? AND password = ?';
    db.query(query, [studentId, password], (err, results) => {
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