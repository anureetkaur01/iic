USE internship_recommendation;

-- Insert sample students
INSERT INTO students (id, name, email, password, course, year, skills, preferences) VALUES
(1, 'Rahul Sharma', 'rahul.sharma@example.com', 'password123', 'Computer Science', '3rd Year', 'Python, Java, Machine Learning, Data Analysis', 'Remote, Paid, Machine Learning projects'),
(2, 'Priya Patel', 'priya.patel@example.com', 'password123', 'Electrical Engineering', '2nd Year', 'Circuit Design, MATLAB, Python, IoT', 'On-site, Hardware projects'),
(3, 'Amit Kumar', 'amit.kumar@example.com', 'password123', 'Mechanical Engineering', '4th Year', 'CAD, Thermodynamics, MATLAB, Python', 'Hybrid, Automotive projects'),
(4, 'Sneha Singh', 'sneha.singh@example.com', 'password123', 'Computer Science', '3rd Year', 'Web Development, JavaScript, React, Node.js', 'Remote, Startup environment'),
(5, 'Vikram Malhotra', 'vikram.malhotra@example.com', 'password123', 'Business Administration', '2nd Year', 'Marketing, Excel, PowerPoint, Communication', 'On-site, Marketing projects');

-- Insert sample internships
INSERT INTO internships (type, company, stipend, duration, eligibility, course_year, skills_required, deadline, start_date, location, mode, workload, status, url) VALUES
('Software Development', 'Tech Solutions Inc.', 'Paid', '3 months', 'Computer Science students with programming experience', '2nd Year,3rd Year,4th Year', 'Python, Java, SQL, Data Structures', '2023-12-15', '2024-01-10', 'Bangalore', 'On-site', 'Full-time', 'Active', 'https://example.com/apply/1'),
('Data Science', 'Data Analytics Corp', 'Paid', '6 months', 'Students with statistics and programming background', '3rd Year,4th Year', 'Python, Machine Learning, Statistics, SQL', '2023-11-30', '2024-01-15', 'Remote', 'Remote', 'Full-time', 'Active', 'https://example.com/apply/2'),
('Web Development', 'WebCraft Studios', 'Paid', '4 months', 'Computer Science or related field', '2nd Year,3rd Year,4th Year', 'JavaScript, HTML, CSS, React, Node.js', '2023-12-20', '2024-02-01', 'Hyderabad', 'Hybrid', 'Part-time', 'Active', 'https://example.com/apply/3'),
('Marketing', 'BrandBoost Media', 'Unpaid', '3 months', 'Business or Marketing students', '1st Year,2nd Year,3rd Year,4th Year', 'Marketing, Social Media, Communication, Content Writing', '2023-12-10', '2024-01-05', 'Mumbai', 'On-site', 'Part-time', 'Active', 'https://example.com/apply/4'),
('Electrical Engineering', 'PowerGrid Solutions', 'Paid', '5 months', 'Electrical Engineering students', '3rd Year,4th Year', 'Circuit Design, MATLAB, Power Systems, IoT', '2023-12-05', '2024-01-20', 'Pune', 'On-site', 'Full-time', 'Active', 'https://example.com/apply/5'),
('Mechanical Design', 'AutoTech Innovations', 'Paid', '6 months', 'Mechanical Engineering students', '3rd Year,4th Year', 'CAD, SolidWorks, Thermodynamics, MATLAB', '2023-12-25', '2024-02-10', 'Chennai', 'Hybrid', 'Full-time', 'Active', 'https://example.com/apply/6'),
('AI Research', 'IntelliSystems', 'Paid', '4 months', 'Computer Science with AI specialization', '4th Year', 'Python, Machine Learning, Deep Learning, TensorFlow', '2023-11-25', '2024-01-08', 'Remote', 'Remote', 'Full-time', 'Active', 'https://example.com/apply/7'),
('Content Writing', 'ContentKing', 'Unpaid', '3 months', 'Any discipline with good writing skills', '1st Year,2nd Year,3rd Year,4th Year', 'Writing, Research, SEO, Communication', '2023-12-18', '2024-01-15', 'Remote', 'Remote', 'Part-time', 'Active', 'https://example.com/apply/8'),
('IoT Development', 'SmartDevices Co.', 'Paid', '5 months', 'ECE or CS students with embedded systems knowledge', '3rd Year,4th Year', 'C++, Embedded Systems, IoT, Python', '2023-12-08', '2024-01-25', 'Bangalore', 'On-site', 'Full-time', 'Active', 'https://example.com/apply/9'),
('Business Analysis', 'StrategyPlus', 'Paid', '4 months', 'Business or Economics students', '3rd Year,4th Year', 'Excel, PowerPoint, Data Analysis, Communication', '2023-12-28', '2024-02-05', 'Delhi', 'Hybrid', 'Full-time', 'Active', 'https://example.com/apply/10');

-- Add more internships to reach 20+ (repeating with variations)
INSERT INTO internships (type, company, stipend, duration, eligibility, course_year, skills_required, deadline, start_date, location, mode, workload, status, url)
SELECT 
    type, 
    CONCAT(company, ' ', FLOOR(RAND() * 100)), 
    stipend, 
    duration, 
    eligibility, 
    course_year, 
    skills_required, 
    DATE_ADD(deadline, INTERVAL FLOOR(RAND() * 30) DAY), 
    DATE_ADD(start_date, INTERVAL FLOOR(RAND() * 30) DAY), 
    location, 
    mode, 
    workload, 
    status, 
    CONCAT('https://example.com/apply/', id + 10)
FROM internships;

-- Continue adding more until we have sufficient data
INSERT INTO internships (type, company, stipend, duration, eligibility, course_year, skills_required, deadline, start_date, location, mode, workload, status, url)
SELECT 
    CASE 
        WHEN RAND() < 0.2 THEN 'Software Development'
        WHEN RAND() < 0.4 THEN 'Data Science'
        WHEN RAND() < 0.6 THEN 'Web Development'
        WHEN RAND() < 0.8 THEN 'Marketing'
        ELSE 'Electrical Engineering'
    END,
    CONCAT('Company ', FLOOR(RAND() * 1000)),
    IF(RAND() < 0.7, 'Paid', 'Unpaid'),
    CONCAT(FLOOR(3 + RAND() * 4), ' months'),
    'Various eligibility requirements',
    '2nd Year,3rd Year,4th Year',
    CASE 
        WHEN RAND() < 0.2 THEN 'Python, Java, SQL'
        WHEN RAND() < 0.4 THEN 'JavaScript, HTML, CSS'
        WHEN RAND() < 0.6 THEN 'Marketing, Communication'
        WHEN RAND() < 0.8 THEN 'Circuit Design, MATLAB'
        ELSE 'CAD, Mechanical Design'
    END,
    DATE_ADD('2023-12-01', INTERVAL FLOOR(RAND() * 60) DAY),
    DATE_ADD('2024-01-01', INTERVAL FLOOR(RAND() * 60) DAY),
    CASE 
        WHEN RAND() < 0.3 THEN 'Remote'
        WHEN RAND() < 0.6 THEN 'Bangalore'
        ELSE 'Hyderabad'
    END,
    CASE 
        WHEN RAND() < 0.3 THEN 'Remote'
        WHEN RAND() < 0.6 THEN 'On-site'
        ELSE 'Hybrid'
    END,
    IF(RAND() < 0.5, 'Full-time', 'Part-time'),
    'Active',
    CONCAT('https://example.com/apply/', FLOOR(RAND() * 1000))
FROM (
    SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
    SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) AS numbers
CROSS JOIN (
    SELECT 1 AS m UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
    SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) AS multipliers
LIMIT 3000;