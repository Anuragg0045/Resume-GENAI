# 🚀 Resume-GENAI

**Resume-GENAI** is an AI-powered job preparation platform that analyzes a candidate's resume against a target job description and generates personalized interview preparation material.

The application uses **Google Gemini AI** to generate technical and behavioral interview questions, identify skill gaps, create a preparation plan, and generate an ATS-friendly resume tailored to the target job.

---

## ✨ Features

* 📄 Upload resume in PDF format
* 🤖 AI-powered resume and job-description analysis
* 📊 Generate a resume-to-job **match score**
* 💻 Generate **technical interview questions**
* 🧑‍💼 Generate **behavioral interview questions**
* 🔍 Identify important **skill gaps**
* 📚 Generate a **7-day interview preparation plan**
* 📑 Generate an **AI-tailored ATS-friendly resume**
* 🔐 User authentication using JWT
* 🍪 Secure authentication using HTTP-only cookies
* 👤 User-specific interview reports
* 💾 Store interview reports in MongoDB
* 📋 View previous interview reports
* 📥 Download generated resume as PDF

---

# 🏗️ Project Architecture

```text
Resume-GENAI/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── file.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── blacklist.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   │
│   │   └── services/
│   │       └── ai.service.js
│   │
│   ├── server.js
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── features/
    │   │   ├── auth/
    │   │   └── interview/
    │   │
    │   ├── App.jsx
    │   ├── App.css
    │   └── app.routes.jsx
    │
    ├── public/
    ├── index.html
    └── package.json
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* React Router
* Axios
* Sass

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* PDF Parse

## AI & PDF Generation

* Google Gemini API
* `@google/genai`
* Zod
* Puppeteer

---

# 🤖 How AI Works

The core AI functionality is implemented using **Google Gemini**.

The application takes three major inputs:

```text
Resume PDF
     +
Self Description
     +
Job Description
     ↓
Google Gemini
     ↓
AI Interview Report
```

The AI generates:

```text
                    AI Report
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Match Score    Interview Qs    Skill Gaps
                       │
              ┌────────┴────────┐
              ↓                 ↓
         Technical          Behavioral
          Questions          Questions

                       +
                7-Day Plan
```

---

# 📊 AI Interview Report

For every analysis, the application generates:

### Match Score

A score between **0 and 100** based on the provided resume, self-description, and job description.

### Technical Questions

The AI generates **8 technical interview questions**.

Each question contains:

* Question
* Intention
* Suggested answer

### Behavioral Questions

The AI generates **5 behavioral interview questions**.

Each question contains:

* Question
* Intention
* Suggested answer

### Skill Gaps

The application identifies **5 skill gaps** and assigns each a severity:

* Low
* Medium
* High

### Preparation Plan

The AI generates a **7-day preparation plan** containing:

* Day
* Focus
* Tasks

---

# 📄 AI Resume Generation

Resume-GENAI can generate a job-specific resume from the interview report.

The AI is instructed to:

* Tailor the resume according to the target job
* Highlight relevant skills and projects
* Keep the resume concise
* Follow ATS-friendly formatting
* Use standard resume sections
* Avoid inventing experience, education, projects, certifications, technologies, or achievements

The generated HTML resume is converted into a PDF using **Puppeteer**.

```text
Interview Report
       ↓
Resume + Job Description
       ↓
Google Gemini
       ↓
ATS-Friendly HTML Resume
       ↓
Puppeteer
       ↓
PDF Resume
```

---

# 🔐 Authentication

The application implements JWT-based authentication.

### Registration

```text
User
 ↓
Register
 ↓
Password hashed using bcrypt
 ↓
User stored in MongoDB
 ↓
JWT generated
 ↓
JWT stored in HTTP-only cookie
```

### Login

```text
Email + Password
       ↓
Find User
       ↓
bcrypt password verification
       ↓
JWT generated
       ↓
Authentication Cookie
```

### Protected Routes

Protected API requests use the authentication middleware.

The middleware:

1. Reads the JWT from the cookie
2. Checks whether the token is blacklisted
3. Verifies the JWT
4. Attaches authenticated user information to `req.user`

---

# 🚪 Logout & Token Blacklisting

When a user logs out:

```text
JWT Cookie
    ↓
Logout
    ↓
Token added to blacklist
    ↓
Cookie cleared
```

The blacklist prevents a previously issued token from being accepted after logout.

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new user            |
| POST   | `/api/auth/login`    | Login user                     |
| POST   | `/api/auth/logout`   | Logout user                    |
| GET    | `/api/auth/me`       | Get current authenticated user |

## Interview

| Method | Endpoint                                       | Description                     |
| ------ | ---------------------------------------------- | ------------------------------- |
| POST   | `/api/interview/`                              | Generate interview report       |
| GET    | `/api/interview/`                              | Get user's interview reports    |
| GET    | `/api/interview/report/:interviewId`           | Get a specific interview report |
| POST   | `/api/interview/resume/pdf/:interviewReportId` | Generate tailored resume PDF    |

### Generate Interview Report

The interview generation endpoint accepts:

```text
resume       → PDF file
jobDescription
selfDescription
```

The backend extracts the resume text and sends the required information to Gemini.

---

# 🗄️ Database Structure

MongoDB is used for storing application data.

## User

Stores authenticated user information such as:

* Username
* Email
* Password hash

## Interview Report

Stores:

* User reference
* Resume text
* Self description
* Job description
* Match score
* Technical questions
* Behavioral questions
* Skill gaps
* Preparation plan
* Report title
* Created/updated timestamps

---

# 🛡️ AI Response Validation

The application does not blindly trust the AI response.

The generated response is validated using **Zod**.

The expected structure contains:

```text
matchScore
technicalQuestions
behavioralQuestions
skillGaps
preparationPlan
title
```

The backend also checks that the AI returns:

```text
8 Technical Questions
5 Behavioral Questions
5 Skill Gaps
7 Preparation Days
```

This helps maintain a predictable response structure between the AI service and frontend.

---

# 🔄 Complete Application Workflow

```text
                    USER
                      │
                      ↓
                 Register/Login
                      │
                      ↓
                 Upload Resume
                    (PDF)
                      │
                      ↓
              Enter Job Description
                      │
                      ↓
               Enter Self Description
                      │
                      ↓
                Backend API
                      │
                      ↓
              Extract PDF Text
                      │
                      ↓
               Google Gemini AI
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   Match Score    Interview      Skill Gaps
                  Questions
        │             │             │
        └─────────────┼─────────────┘
                      ↓
               7-Day Preparation
                      │
                      ↓
               Store in MongoDB
                      │
                      ↓
                 Frontend
                      │
                      ↓
             Interview Dashboard
                      │
                      ↓
              Generate Resume
                      │
                      ↓
                Gemini AI
                      │
                      ↓
             ATS-Friendly HTML
                      │
                      ↓
                 Puppeteer
                      │
                      ↓
                  PDF Resume
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Anuragg0045/Resume-GENAI.git

cd Resume-GENAI
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
```

Start the development server:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

---

# 🔑 Environment Variables

The backend requires the following environment variables:

| Variable               | Purpose                            |
| ---------------------- | ---------------------------------- |
| `PORT`                 | Backend server port                |
| `MONGO_URI`            | MongoDB connection string          |
| `JWT_SECRET`           | Secret used for JWT authentication |
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key              |

> Never commit your `.env` file or API keys to GitHub.

---

# 🧪 Development Commands

## Backend

```bash
npm run dev
```

Runs the backend using Nodemon.

```bash
npm start
```

Starts the backend using Node.js.

## Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run lint
```

Runs the frontend linter.

```bash
npm run preview
```

Previews the production build locally.

---

# 📌 Important Implementation Details

### PDF Resume Upload

Multer is used to handle the uploaded resume file.

### PDF Text Extraction

`pdf-parse` is used to extract text from the uploaded PDF.

### Password Security

Passwords are hashed using `bcryptjs` before being stored.

### Authentication

JWT is used for authentication and is stored in an HTTP-only cookie.

### Database

Mongoose provides the MongoDB data layer.

### AI

Google Gemini is used for interview analysis and resume generation.

### Validation

Zod validates the AI-generated structured response.

### PDF Generation

Puppeteer converts generated resume HTML into a PDF document.

---

# 🎯 Why I Built This Project

Resume-GENAI was built to solve a common problem faced by job seekers:

> Understanding whether their resume matches a particular job and knowing what to prepare for the interview.

Instead of only generating a resume, the application combines:

```text
Resume Analysis
       +
Job Description
       +
Interview Preparation
       +
Skill Gap Detection
       +
Preparation Plan
       +
Resume Generation
```

into a single platform.

---

# 🚀 Future Improvements

Some possible improvements include:

* 📈 Resume version comparison
* 🎤 AI-powered mock interviews
* 🗣️ Voice-based interview practice
