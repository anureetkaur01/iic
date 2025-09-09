const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Get recommended internships
router.get('/recommend/:student_id', (req, res) => {
    const studentId = req.params.student_id;
    // Get the new filters from the query string
    const { location, sector, type } = req.query; 
    
    const studentQuery = 'SELECT skills FROM students WHERE student_id = ?';
    db.query(studentQuery, [studentId], (err, studentResults) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        if (studentResults.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        const student = studentResults[0];
        const studentSkills = student.skills ? student.skills.split(',').map(s => s.trim().toLowerCase()) : [];
        
        let internshipQuery = 'SELECT * FROM internships WHERE 1=1';
        let queryParams = [];
        
        // Add location filter if provided
        if (location) {
            internshipQuery += ' AND location LIKE ?';
            queryParams.push(`%${location}%`);
        }

        // Add sector filter if provided
        if (sector) {
            internshipQuery += ' AND sector LIKE ?';
            queryParams.push(`%${sector}%`);
        }

        // Add type filter (for remote_allowed boolean)
        if (type === 'Remote') {
            internshipQuery += ' AND remote_allowed = ?';
            queryParams.push(true);
        } else if (type === 'On-site') {
            internshipQuery += ' AND remote_allowed = ?';
            queryParams.push(false);
        }
        
        db.query(internshipQuery, queryParams, (err, internshipResults) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            
            const scoredInternships = internshipResults.map(internship => {
                const internshipSkills = internship.required_skills ?
                    internship.required_skills.split(',').map(s => s.trim().toLowerCase()) : [];
                
                const skillOverlap = studentSkills.filter(skill =>
                    internshipSkills.includes(skill)
                ).length;
                
                return { ...internship, score: skillOverlap };
            });
            
            const recommendedInternships = scoredInternships.sort((a, b) => b.score - a.score);
            
            res.json(recommendedInternships);
        });
    });
});

module.exports = router;