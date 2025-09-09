document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const studentId = localStorage.getItem('studentId');
    const studentData = localStorage.getItem('studentData');
    
    if (!studentId) {
        window.location.href = 'login.html';
        return;
    }
    
    // Parse student data if available
    let student = null;
    if (studentData) {
        try {
            student = JSON.parse(studentData);
            updateProfileUI(student);
        } catch (e) {
            console.error('Error parsing student data:', e);
        }
    }
    
    // Fetch student profile from server if needed
    fetchStudentProfile(studentId);
    fetchInternshipStats();
    fetchRecommendedInternships(studentId);
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('studentId');
            localStorage.removeItem('studentData');
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        });
    }
});

function updateProfileUI(student) {
    if (!student) return;
    
    // Update student name in welcome message
    document.getElementById('studentName').textContent = student.name;
    
    // Populate profile fields
    document.getElementById('profileId').textContent = student.id || 'N/A';
    document.getElementById('profileName').textContent = student.name || 'N/A';
    document.getElementById('profileEmail').textContent = student.email || 'N/A';
    document.getElementById('profileAge').textContent = student.age || 'N/A';
    document.getElementById('profileCourse').textContent = student.course || 'N/A';
    document.getElementById('profileYear').textContent = student.year || 'N/A';
    document.getElementById('profilePassingYear').textContent = student.passing_year || 'N/A';
    document.getElementById('profileCgpa').textContent = student.cgpa || 'N/A';
    document.getElementById('profileSkills').textContent = student.skills || 'N/A';
    document.getElementById('profileLocation').textContent = student.location || 'N/A';
    
    // Handle resume link
    const resumeElement = document.getElementById('profileResume');
    if (student.resume_path) {
        resumeElement.innerHTML = `<a href="${student.resume_path}" target="_blank">View Resume</a>`;
    } else {
        resumeElement.textContent = 'Not uploaded';
    }
}

async function fetchStudentProfile(studentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/student/${studentId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const student = await response.json();
        
        // Update UI with student data
        updateProfileUI(student);
        
        // Store student data in localStorage
        localStorage.setItem('studentData', JSON.stringify(student));
    } catch (error) {
        console.error('Error fetching student profile:', error);
    }
}

async function fetchInternshipStats() {
    try {
        // In a real application, you would fetch these stats from the backend
        // For now, we'll use mock data
        document.getElementById('totalInternships').textContent = '127';
        document.getElementById('activeInternships').textContent = '89';
        document.getElementById('remoteInternships').textContent = '45';
        document.getElementById('paidInternships').textContent = '67';
    } catch (error) {
        console.error('Error fetching internship stats:', error);
    }
}

async function fetchRecommendedInternships(studentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/recommend/${studentId}?limit=3`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const internships = await response.json();
        
        displayRecommendedInternships(internships);
    } catch (error) {
        console.error('Error fetching recommended internships:', error);
        document.getElementById('recommendedPreview').innerHTML = `
            <div class="col-12 text-center py-4">
                <i class="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
                <p>Unable to load recommendations at this time.</p>
            </div>
        `;
    }
}

function displayRecommendedInternships(internships) {
    const container = document.getElementById('recommendedPreview');
    
    if (!internships || internships.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-4">
                <i class="fas fa-info-circle fa-2x text-info mb-3"></i>
                <p>No recommendations available at this time.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    internships.slice(0, 3).forEach(internship => {
        const modeBadgeClass = internship.mode === 'Remote' ? 'bg-info' : 
                              internship.mode === 'Hybrid' ? 'bg-warning' : 'bg-secondary';
        
        const stipendBadgeClass = internship.stipend === 'Paid' ? 'bg-success' : 'bg-secondary';
        
        html += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${internship.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${internship.company}</h6>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="badge ${stipendBadgeClass}">${internship.stipend}</span>
                            <span class="badge ${modeBadgeClass}">${internship.mode}</span>
                        </div>
                        <p class="card-text"><small class="text-muted">${internship.location}</small></p>
                    </div>
                    <div class="card-footer bg-transparent">
                        <a href="internships.html" class="btn btn-outline-primary btn-sm">View Details</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}