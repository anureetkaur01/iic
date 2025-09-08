const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Get recommended internships
router.get('/recommend/:student_id', (req, res) => {
    const studentId = req.params.student_id;
    const { location, mode, stipend } = req.query;
    
    // First get student profile
    const studentQuery = 'SELECT skills, course, year, cgpa, passing_year FROM students WHERE id = ?';
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
            WHERE status = 'Active'
        `;
        let queryParams = [];
        
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
                
                // Check eligibility criteria
                let eligibilityScore = 0;
                if (internship.eligibility) {
                    const eligibilityCriteria = internship.eligibility.toLowerCase();
                    
                    // Check if student's course is mentioned in eligibility
                    if (student.course && eligibilityCriteria.includes(student.course.toLowerCase())) {
                        eligibilityScore += 2;
                    }
                    
                    // Check if student's year is mentioned in eligibility
                    if (student.year && eligibilityCriteria.includes(`year ${student.year}`)) {
                        eligibilityScore += 1;
                    }
                    
                    // Check if student's CGPA meets requirements
                    if (student.cgpa && eligibilityCriteria.includes('cgpa')) {
                        const cgpaMatch = eligibilityCriteria.match(/cgpa[\s\S]*?(\d+\.\d+)/);
                        if (cgpaMatch && student.cgpa >= parseFloat(cgpaMatch[1])) {
                            eligibilityScore += 2;
                        }
                    }
                }
                
                // Calculate total score
                const score = skillOverlap + eligibilityScore;
                
                return { ...internship, score };
            });
            
            // Sort by score (descending) and get top recommendations
            const recommendedInternships = scoredInternships
                .sort((a, b) => b.score - a.score);
            
            res.json(recommendedInternships);
        });
    });
});

module.exports = router;