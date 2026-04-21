Synco – AI Job Preparation Platform

Synco is a full stack AI-powered web application built to help users prepare for job opportunities in a structured and practical way. It analyzes resumes, detects missing skills, generates interview questions, and helps users improve their chances of getting selected.

Features

* Resume Upload and Analysis – Upload a resume and receive insights based on skills, experience, and overall profile.
* Skill Gap Detection – Compare the resume with target job roles or job descriptions and identify missing skills.
* AI Interview Questions – Generate personalized interview questions based on resume content and selected roles.
* ATS-Friendly Resume Generation – Create resumes optimized for Applicant Tracking Systems.
* Secure Authentication – User login and session management using JWT authentication.

Tech Stack

* Frontend: React.js
* Backend: Node.js, Express.js
* Database: MongoDB
* AI Integration: Gemini API
* Additional Tools: Multer, Puppeteer

Setup Instructions

Clone the Repository

```bash
git clone https://github.com/your-username/synco.git
cd synco
```

Install Dependencies

```bash
npm install
cd client
npm install
```

Configure Environment Variables

Create a `.env` file in the root folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the Application

```bash
npm run server
npm run client
```

Project Goal

The goal of Synco is to simplify job preparation using AI. Instead of manually reviewing resumes and searching for preparation material, users get a personalized roadmap based on their current profile and target role.

Future Improvements

* Job match score system
* Personalized learning roadmap
* Real-time mock interviews
* Dashboard for progress tracking
* Resume version management

Author

Developed as a full stack GenAI project using the MERN stack.
