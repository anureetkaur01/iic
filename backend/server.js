const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');

// Import route files
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const internshipRoutes = require('./routes/internship');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', authRoutes);
app.use('/api', studentRoutes);
app.use('/api', internshipRoutes);

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + db.threadId);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});