document.addEventListener('DOMContentLoaded', function() {
    const studentId = localStorage.getItem('studentId');
    
    if (!studentId) {
        window.location.href = 'login.html';
        return;
    }
    
    // Fetch student profile
    fetchStudentProfile(studentId);
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('studentId');
            window.location.href = 'index.html';
        });
    }
});

async function fetchStudentProfile(studentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/student/${studentId}`);
        const student = await response.json();
        
        if (response.ok) {
            // Populate form fields
            document.getElementById('name').value = student.name || '';
            document.getElementById('email').value = student.email || '';
            document.getElementById('course').value = student.course || '';
            document.getElementById('year').value = student.year || '';
            document.getElementById('skills').value = student.skills || '';
            document.getElementById('preferences').value = student.preferences || '';
        } else {
            console.error('Failed to fetch student profile');
        }
    } catch (error) {
        console.error('Error fetching student profile:', error);
    }
}