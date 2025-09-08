const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Get recommended internships
router.get('/recommend/:student_id', (req, res) => {
    const studentId = req.params.student_id;
    const { location, mode, stipend } = req.query;
    
    // First get student profile
    const studentQuery = 'SELECT skills, course, year FROM students WHERE id = ?';
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
        
        // Build base query for internships
        let internshipQuery = `
            SELECT * FROM internships 
            WHERE course_year LIKE ? AND status = 'Active'
        `;
        let queryParams = [`%${student.course}%`];
        
        // Add filters
        if (location) {
            internshipQuery += ' AND location = ?';
            queryParams.push(location);
        }
        
        if (mode) {
            internshipQuery += ' AND mode = ?';
            queryParams.push(mode);
        }
        
        if (stipend) {
            internshipQuery += ' AND stipend = ?';
            queryParams.push(stipend);
        }
        
        // Get internships
        db.query(internshipQuery, queryParams, (err, internshipResults) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            
            // Calculate similarity score for each internship
            const scoredInternships = internshipResults.map(internship => {
                const internshipSkills = internship.skills_required ? 
                    internship.skills_required.split(',').map(s => s.trim().toLowerCase()) : [];
                
                // Calculate skill overlap
                const skillOverlap = studentSkills.filter(skill => 
                    internshipSkills.some(is => is.includes(skill) || skill.includes(is))
                ).length;
                
                // Check year eligibility
                const yearEligible = internship.course_year.includes(student.year);
                
                // Calculate total score (skill overlap + year eligibility)
                const score = skillOverlap + (yearEligible ? 1 : 0);
                
                return { ...internship, score };
            });
            
            // Sort by score (descending) and get top 5
            const recommendedInternships = scoredInternships
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);
            
            res.json(recommendedInternships);
        });
    });
});

module.exports = router;