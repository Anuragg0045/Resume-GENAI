require("dotenv").config();

console.log("========== TEMP TEST STARTED ==========");

const { generateInterviewReport } = require("./ai.service");

console.log("1. AI service imported successfully");

const resume = ` 
 
Shivam Sharma 
anuragg0045@gmail.com | +91 7459845667 | Delhi 
CAREER OBJECTIVE 
Aspiring Backend Developer with strong knowledge of Node.js, Express.js, MongoDB, and REST APIs. Looking for an internship to apply 
my skills, learn from experienced developers, and contribute to real-world projects. 
EDUCATION 
B.Tech, Computer Science 2023 - 2027 
KIET Group Of Institutions 
Senior Secondary (XII), CBSE 
Science 
2022 
S.R Global School 
Percentage: 79.00% 
Secondary (X), CBSE 2020 
S.R Global School 
Percentage: 90.40% 
TRAININGS / CERTIFICATIONS 
SQL 
Feb 2026 
Oracle Certified SQL Developer, Virtual 
PROJECTS 
AI-Powered Resume & Career Intelligence Platform 
Aug 2026 
Built a full-stack AI-powered application that analyzes resumes 
and job descriptions, identifies skill gaps, generates personalized 
interview questions, and creates ATS-optimized resumes. 
Integrated Gemini AI, JWT authentication, and Puppeteer for 
dynamic PDF generation. 
Complete Backend of Banking System 
Jun 2026 
Developed a secure backend banking system using Node.js, 
Express.js, MongoDB, and JWT authentication, featuring user 
registration, login, account management, money transfers, 
transaction history, and email notification using Nodemailer. 
SKILLS 
• C++ Programming • JavaScript • SQL 
• Node.js • Express.js • MongoDB 
• Data Structures • HTML • CSS 
• GitHub • Postman • JWT 
• REST API • Model View Controller(MVC) 
EXTRA CURRICULAR ACTIVITIES 
Actively participate in cricket and table tennis, which have helped me develop teamwork, discipline, strategic thinking, and effective 
decision-making skills. 
ADDITIONAL DETAILS 
Solved 250+ coding problems on platforms like LeetCode and GeeksforGeeks, strengthening problem-solving and algorithmic skills. 
Page - 1/1 
`;

console.log("2. Resume loaded");


const selfDescription = `
I am a backend-focused developer skilled in Node.js, Express.js, MongoDB, SQL, JWT authentication, REST APIs, 
Gemini API integration, file handling, and Puppeteer. I have built projects involving resume analysis,  
skill extraction, AI-based skill-gap detection, and ATS-optimized resume generation. I also have experience with React.js, Git, and Postman.
`;

console.log("3. Self description loaded");


const jobDescription = `
Job Title: Backend Developer 
Experience: 0–2 Years 
Employment Type: Full-time 
 
Job Description: 
 
We are looking for a motivated Backend Developer to join our engineering team. The ideal candidate should have strong knowledge of server-side development and experience building scalable RESTful APIs. 
 
Responsibilities: 
 
Design, develop, and maintain backend applications using Node.js and Express.js. 
Build and integrate REST APIs for web and mobile applications. 
Work with MongoDB and SQL databases to design and manage data. 
Implement secure authentication and authorization using JWT and role-based access control. 
Integrate third-party APIs and external services into backend applications. 
Write clean, reusable, and maintainable JavaScript code. 
Perform API testing and debugging using Postman. 
Collaborate with frontend developers to integrate backend services. 
Use Git and GitHub for version control and collaborative development. 
Optimize application performance and troubleshoot production issues. 
 
Required Skills: 
 
JavaScript 
Node.js 
Express.js 
REST API development 
MongoDB 
SQL 
JWT Authentication 
Git/GitHub 
Postman 
Basic knowledge of Docker 
Understanding of Redis and caching 
Knowledge of unit testing with Jest 
Good understanding of data structures and algorithms 
 
Preferred Skills: 
 
Experience with AWS 
Knowledge of CI/CD pipelines 
Familiarity with microservices architecture 
Experience with Redis, Docker, and cloud deployment 
Understanding of system design principles 
 
Education: Bachelor's degree in Computer Science, Information Technology, or a related field is preferred. 
 
What We Offer: 
 
Opportunity to work on real-world backend systems 
Exposure to cloud technologies and modern development practices 
Collaborative and learning-focused environment 
Opportunities for professional growth
`;

console.log("4. Job description loaded");


// ===============================
// TEST GEMINI API
// ===============================

async function testInterviewReport() {

    console.log("\n5. Starting interview report generation...");

    try {

        console.log("6. Calling generateInterviewReport()...");

        const result = await generateInterviewReport({
            resume,
            selfDescription,
            jobDescription
        });

        console.log("\n7. Gemini response received successfully!");

        console.log("\n========== INTERVIEW REPORT ==========\n");

        console.log(
            JSON.stringify(result, null, 2)
        );

        console.log("\n========== TEST COMPLETED ==========");

    } catch (error) {

        console.log("\n========== ERROR ==========");

        console.error(error);

        console.log("\n========== TEST FAILED ==========");
    }
}

testInterviewReport();