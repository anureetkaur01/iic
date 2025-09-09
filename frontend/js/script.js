// General scripts for the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const studentId = localStorage.getItem('studentId');
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    const logoutLinks = document.querySelectorAll('#logoutBtn');
    
    if (studentId) {
        // User is logged in
        loginLinks.forEach(link => {
            link.textContent = 'Dashboard';
            link.href = 'dashboard.html';
        });
    }
    
    // Logout functionality
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('studentId');
            window.location.href = 'index.html';
        });
    });
});
// Add to your dashboard.js and other pages
/*document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('studentId');
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
});*/