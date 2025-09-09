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
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            document.getElementById('location').value = '';
            document.getElementById('mode').value = '';
            document.getElementById('stipend').value = '';
            loadInternships(studentId);
        });
    }
    
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
        const resultsCount = document.getElementById('resultsCount');
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        if (internships.length > 0) {
            noResults.classList.add('d-none');
            resultsCount.textContent = `${internships.length} internships found`;
            resultsCount.classList.remove('d-none');
            
            // Display internships
            internships.forEach(internship => {
                const card = createInternshipCard(internship);
                resultsContainer.appendChild(card);
            });
        } else {
            noResults.classList.remove('d-none');
            resultsCount.classList.add('d-none');
        }
    } catch (error) {
        console.error('Error loading internships:', error);
    }
}

function createInternshipCard(internship) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    const card = document.createElement('div');
    card.className = 'card h-100 internship-card';
    
    // Determine badge classes based on internship properties
    const modeBadgeClass = internship.mode === 'Remote' ? 'bg-info' : 
                          internship.mode === 'Hybrid' ? 'bg-warning' : 'bg-secondary';
    
    const stipendBadgeClass = internship.stipend === 'Paid' ? 'bg-success' : 'bg-secondary';
    
    // Format deadline date
    const deadlineDate = new Date(internship.deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    let deadlineText = deadlineDate.toLocaleDateString();
    
    if (daysUntilDeadline < 0) {
        deadlineText += ' (Expired)';
    } else if (daysUntilDeadline < 7) {
        deadlineText += ` (${daysUntilDeadline} days left)`;
    }
    
    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${internship.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${internship.company}</h6>
            <div class="d-flex justify-content-between mb-2">
                <span class="badge ${stipendBadgeClass}">${internship.stipend}</span>
                <span class="badge ${modeBadgeClass}">${internship.mode}</span>
            </div>
            <p class="card-text">${internship.description || 'No description available'}</p>
            <p class="card-text"><strong>Skills Required:</strong> ${internship.skills_required || 'Not specified'}</p>
            <p class="card-text"><strong>Eligibility:</strong> ${internship.eligibility || 'Not specified'}</p>
            <p class="card-text"><strong>Location:</strong> ${internship.location}</p>
            <p class="card-text"><strong>Duration:</strong> ${internship.duration || 'Not specified'}</p>
            <p class="card-text"><strong>Deadline:</strong> ${deadlineText}</p>
        </div>
        <div class="card-footer bg-transparent">
            <a href="${internship.url}" target="_blank" class="btn btn-primary w-100">Apply Now</a>
        </div>
    `;
    
    return col;
}
// Add to your dashboard.js and other pages
/*document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('studentId');
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
});*/