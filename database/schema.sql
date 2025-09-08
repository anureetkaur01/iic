CREATE DATABASE IF NOT EXISTS internship_recommendation;
USE internship_recommendation;

-- Students table
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    course VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL,
    skills TEXT,
    preferences TEXT
);

-- Internships table
CREATE TABLE internships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    stipend ENUM('Paid', 'Unpaid') NOT NULL,
    duration VARCHAR(50) NOT NULL,
    eligibility TEXT,
    course_year VARCHAR(200) NOT NULL,
    skills_required TEXT NOT NULL,
    deadline DATE NOT NULL,
    start_date DATE,
    location VARCHAR(100) NOT NULL,
    mode ENUM('Remote', 'Hybrid', 'On-site') NOT NULL,
    workload VARCHAR(50),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    url VARCHAR(500) NOT NULL
);