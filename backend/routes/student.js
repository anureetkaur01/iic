const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Get student profile
router.get('/student/:id', (req, res) => {
    const studentId = req.params.id;
    
    const query = 'SELECT id, name, email, age, course, year, passing_year, cgpa, skills, location, preferences, resume_path FROM students WHERE id = ?';
    db.query(query, [studentId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    });
});

module.exports = router;