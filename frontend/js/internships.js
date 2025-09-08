document.addEventListener('DOMContentLoaded', function() {
    const studentId = localStorage.getItem('studentId');
    
    if (!studentId) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load internships on page load
    loadInternships(studentId);
    
    // Filter form submission
    const filterForm = document.getElementById('filterForm');
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        loadInternships(studentId);
    });
    
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

async function loadInternships(studentId) {
    const location = document.getElementById('location').value;
    const mode = document.getElementById('mode').value;
    const stipend = document.getElementById('stipend').value;
    
    // Build query string
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (mode) params.append('mode', mode);
    if (stipend) params.append('stipend', stipend);
    
    try {
        const response = await fetch(`http://localhost:3000/api/recommend/${studentId}?${params}`);
        const internships = await response.json();
        
        const resultsContainer = document.getElementById('internshipResults');
        const noResults = document.getElementById('noResults');
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        if (internships.length > 0) {
            noResults.classList.add('d-none');
            
            // Display internships
            internships.forEach(internship => {
                const card = createInternshipCard(internship);
                resultsContainer.appendChild(card);
            });
        } else {
            noResults.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error loading internships:', error);
    }
}

function createInternshipCard(internship) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    const card = document.createElement('div');
    card.className = 'card internship-card h-100';
    
    const badgeClass = internship.stipend === 'Paid' ? 'bg-success' : 'bg-secondary';
    
    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${internship.company}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${internship.type}</h6>
            <div class="d-flex justify-content-between mb-2">
                <span class="badge ${badgeClass}">${internship.stipend}</span>
                <span class="badge bg-info">${internship.mode}</span>
            </div>
            <p class="card-text"><strong>Duration:</strong> ${internship.duration}</p>
            <p class="card-text"><strong>Skills Required:</strong> ${internship.skills_required}</p>
            <p class="card-text"><strong>Location:</strong> ${internship.location}</p>
            <p class="card-text"><strong>Deadline:</strong> ${new Date(internship.deadline).toLocaleDateString()}</p>
        </div>
        <div class="card-footer bg-transparent">
            <a href="${internship.url}" target="_blank" class="btn btn-primary w-100">Apply Now</a>
        </div>
    `;
    
    col.appendChild(card);
    return col;
}