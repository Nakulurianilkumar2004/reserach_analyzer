AI Research Assistant

An AI-powered platform for research paper analysis using FastAPI, React + Vite, Tailwind CSS, and Gemini API.
Users can register, upload research papers, ask questions, and get AI-driven insights. Admins can view all uploaded papers.

Features

User registration and login with JWT authentication (cookie-based)

Role-based dashboards: User and Admin

Upload research papers (PDF)

Ask AI questions about uploaded papers

Admin view of all uploaded papers

Mobile-responsive UI with Tailwind CSS and Lucide icons

Tech Stack

Backend: FastAPI, Python, MongoDB

Frontend: React, Vite, Tailwind CSS, Lucide React Icons

Authentication: JWT (HTTP-only cookies)

Containerization: Docker

Project Structure
project-root/
│
├── backend/                 # FastAPI backend
│   ├── app/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
│
├── frontend/                # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
Setup Instructions
Backend

Navigate to backend folder:

cd backend

Install dependencies:

pip install -r requirements.txt

Run backend locally:

uvicorn main:app --reload

API documentation is available at:
http://localhost:8000/docs

Frontend

Navigate to frontend folder:

cd frontend

Install dependencies:

npm install

Run frontend locally:

npm run dev

Frontend will be available at:
http://localhost:5173

Docker (Backend Only)

Build Docker image:

docker build -t ai-backend ./backend

Run container:

docker run -d --name ai-backend -p 8000:8000 --env-file ./backend/.env ai-backend

Stop container:

docker stop ai-backend
docker rm ai-backend
Environment Variables

Backend .env:

MONGO_URI=mongodb://localhost:27017
DB_NAME=ai_research
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_jwt_secret_key

Frontend .env:

VITE_API_BASE_URL=http://localhost:8000/api
VITE_FRONTEND_BASE_URL=http://localhost:5173
Usage

Register as a user.

Login and access your dashboard.

Upload PDFs to analyze research papers.

Ask AI questions about uploaded papers.

Admin users can view all uploaded papers.