document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const studentId = document.getElementById('studentId').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ studentId, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Login successful
                localStorage.setItem('studentId', studentId);
                window.location.href = 'dashboard.html';
            } else {
                // Login failed
                loginError.textContent = data.message || 'Login failed';
                loginError.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Login error:', error);
            loginError.textContent = 'An error occurred during login';
            loginError.classList.remove('d-none');
        }
    });
});
// Add to your dashboard.js and other pages
/*
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('studentId');
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
});*/