# Resume Analyzer Pro

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> AI-powered resume optimization platform — Get instant ATS compatibility scores, job description matching, and personalized improvement suggestions to land more interviews.

---

## Overview

**Resume Analyzer Pro** is a full-stack web application that leverages artificial intelligence to help job seekers optimize their resumes. Think of it as having a personal career coach that analyzes your resume, compares it against job requirements, and delivers actionable insights — all in under 10 seconds.

### Why This Matters

- **75%** of resumes are rejected by ATS before reaching a human recruiter
- Job seekers lack tools to optimize for specific positions
- Manual resume review is time-consuming and subjective
- No easy way exists to track improvements over time

**Our solution:** AI-driven analysis, automated ATS checks, job-specific matching, and prioritized recommendations — all in one platform.

---

## Key Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Resume Upload & Parsing** | Drag-and-drop PDF/DOCX files. AI automatically extracts skills, experience, education, and contact information. |
| 2 | **AI-Powered Analysis** | Comprehensive scoring (0–100) across six dimensions: ATS compatibility, keyword match, skills match, experience, education, and formatting. |
| 3 | **Job Description Matching** | Paste any job description and instantly see skill gaps, match percentages, and missing keywords. |
| 4 | **Smart Suggestions** | Prioritized recommendations (high/medium/low) categorized by content, formatting, keywords, skills, and ATS compatibility. |
| 5 | **ATS Optimization** | Checks resume formatting for applicant tracking systems — identifies problematic tables, images, fonts, and complex layouts. |
| 6 | **Visual Dashboards** | Radar charts, score breakdowns, and skill comparison visualizations using Recharts. |
| 7 | **Resume Versioning** | Create and compare multiple resume versions to A/B test different approaches. |
| 8 | **Secure Authentication** | JWT-based auth with refresh tokens, bcrypt password hashing, and role-based access control. |

---

## Architecture

```
+-------------------------------------------------------------+
|                        FRONTEND                              |
|  React 18 + TypeScript + Vite + Tailwind CSS                |
|  +--------------+  +--------------+  +--------------+       |
|  |   UI Layer   |  |  State Mgmt  |  |  API Client  |       |
|  |  (Components)|  |   (Zustand)  |  |   (Axios)    |       |
|  +--------------+  +--------------+  +--------------+       |
+-------------------------------------------------------------+
                            | HTTP/REST
+-------------------------------------------------------------+
|                        BACKEND                               |
|  FastAPI + Python + PostgreSQL + Redis + Celery             |
|  +--------------+  +--------------+  +--------------+       |
|  |   Routers    |  |   Services   |  |   Database   |       |
|  | (Endpoints)  |  |  (Business)  |  | (PostgreSQL) |       |
|  +--------------+  +--------------+  +--------------+       |
|  +--------------+  +--------------+  +--------------+       |
|  |  AI Engine   |  |    Celery    |  |    Redis     |       |
|  | (Groq/Gemini)|  |   (Tasks)    |  |   (Cache)    |       |
|  +--------------+  +--------------+  +--------------+       |
+-------------------------------------------------------------+
```

---

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework — component-based, virtual DOM |
| **TypeScript 5** | Type safety — compile-time error catching |
| **Vite 5** | Build tool — lightning-fast HMR |
| **Tailwind CSS 3** | Styling — utility-first, responsive design |
| **Shadcn/UI** | Component library — accessible, customizable |
| **Zustand** | State management — lightweight (1KB), simple API |
| **React Query 5** | Server state — caching, auto-refetch |
| **Recharts** | Data visualization — responsive charts |
| **React Dropzone** | File upload — drag-and-drop with validation |

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI 0.104+** | Web framework — async, auto API docs |
| **Python 3.11+** | Language — rich AI/ML ecosystem |
| **PostgreSQL 15+** | Database — ACID compliant, JSON support |
| **SQLAlchemy 2.0+** | ORM — async support, parameterized queries |
| **Redis 7+** | Cache & queue — in-memory, pub/sub |
| **Celery 5.3+** | Task queue — background jobs, distributed tasks |
| **Groq API** | LLM — fast inference, structured output |
| **pdfplumber** | PDF parsing — text extraction |
| **JWT + Bcrypt** | Authentication — stateless, secure |

---

## User Workflow

```
 1. REGISTRATION / LOGIN
            |
 2. UPLOAD RESUME (PDF/DOCX)
            |
 3. AUTOMATIC PARSING (Background)
    +-- Text Extraction
    +-- Skills Identification (AI)
    +-- Contact Info Extraction
    +-- Structure Analysis
            |
 4. DASHBOARD VIEW
    +-- Resume List
    +-- Quick Stats
    +-- Recent Analyses
            |
 5. RUN ANALYSIS
    +-- General Analysis (Resume only)
    +-- Job-Specific Analysis (Resume + Job)
            |
 6. VIEW RESULTS
    +-- Score Breakdown (Radar Chart)
    +-- Skills Match (Visual comparison)
    +-- Strengths / Weaknesses
    +-- AI Summary
    +-- Prioritized Suggestions
            |
 7. TAKE ACTION
    +-- Download Report
    +-- Apply Suggestions
    +-- Create Resume Version
    +-- Reanalyze
```

---

## Scoring Algorithm

The overall score is a weighted average of five dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| **ATS Score** | 20% | Formatting compatibility with applicant tracking systems |
| **Keyword Match** | 25% | Alignment of keywords with job description |
| **Skills Match** | 30% | Technical and soft skills against requirements |
| **Experience Match** | 15% | Years and relevance of experience |
| **Education Match** | 10% | Degree level and field relevance |

---

## Database Schema (Key Tables)

```
users
+-- id (UUID)
+-- email (unique)
+-- username (unique)
+-- hashed_password
+-- is_premium
+-- created_at

resumes
+-- id (UUID)
+-- user_id (FK -> users)
+-- title
+-- file_path
+-- raw_text
+-- skills (JSON)
+-- structured_data (JSON)
+-- parent_resume_id (FK -> resumes, self-reference)

jobs
+-- id (UUID)
+-- user_id (FK -> users)
+-- title
+-- company_name
+-- description
+-- required_skills (JSON)

analyses
+-- id (UUID)
+-- user_id (FK -> users)
+-- resume_id (FK -> resumes)
+-- job_id (FK -> jobs, nullable)
+-- overall_score
+-- ats_score
+-- matched_skills (JSON)
+-- missing_skills (JSON)
+-- suggestions (JSON)
+-- created_at
```

---

## API Endpoints

### Authentication
```
POST   /api/v1/auth/register    — Register new user
POST   /api/v1/auth/login       — Login user
GET    /api/v1/auth/me          — Get current user
POST   /api/v1/auth/refresh     — Refresh access token
```

### Resumes
```
POST   /api/v1/resumes/              — Upload resume
GET    /api/v1/resumes/              — List all resumes
GET    /api/v1/resumes/{id}          — Get resume detail
PUT    /api/v1/resumes/{id}          — Update resume metadata
DELETE /api/v1/resumes/{id}          — Delete resume
POST   /api/v1/resumes/{id}/set-primary  — Set as primary resume
```

### Analysis
```
POST   /api/v1/analysis/         — Create new analysis
GET    /api/v1/analysis/         — List all analyses
GET    /api/v1/analysis/{id}     — Get analysis detail
```

### Jobs
```
POST   /api/v1/jobs/             — Add job description
GET    /api/v1/jobs/             — List saved jobs
GET    /api/v1/jobs/{id}         — Get job detail
PUT    /api/v1/jobs/{id}         — Update job
DELETE /api/v1/jobs/{id}         — Delete job
GET    /api/v1/jobs/search       — Search jobs
```

### Suggestions
```
GET    /api/v1/suggestions/resume/{id}              — Get resume suggestions
GET    /api/v1/suggestions/company/{id}/{cid}       — Company-specific suggestions
POST   /api/v1/suggestions/compare                  — Compare resume vs job
GET    /api/v1/suggestions/ats/{id}                 — ATS optimization tips
```

---

## Security

| Feature | Implementation |
|---------|----------------|
| Password Hashing | Bcrypt with salt |
| Authentication | JWT access + refresh tokens |
| CORS Protection | Configured allowed origins |
| Rate Limiting | Redis-based request limiter |
| Input Validation | Pydantic schemas |
| File Validation | Extension + MIME type checks |
| SQL Injection Prevention | SQLAlchemy parameterized queries |
| XSS Protection | React auto-escaping |

---

## Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| Lazy Loading | React Router code-splitting |
| Caching | React Query (client) + Redis (server) |
| Background Jobs | Celery task queue |
| Database Indexing | PostgreSQL indexes on FK columns |
| Asset Optimization | Vite build minification |
| Connection Pooling | SQLAlchemy async pool |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ & npm/yarn
- **Python** 3.11+
- **PostgreSQL** 15+
- **Redis** 7+
- **Groq API key** ([get one here](https://console.groq.com))

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/resume-analyzer-pro.git
cd resume-analyzer-pro
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database URL, Redis URL, Groq API key, etc.

# Run migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --port 8000
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your backend API URL

# Start development server
npm run dev
```

#### 4. Start Celery Worker (separate terminal)

```bash
cd backend
celery -A app.celery_app worker --loglevel=info
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (Swagger UI)
- **Alternative Docs:** http://localhost:8000/redoc (ReDoc)

---

## UI/UX Highlights

- **Toast Notifications:** Real-time feedback via Sonner
- **Loading States:** Skeleton screens and spinners
- **Error Handling:** User-friendly error messages with recovery actions
- **Empty States:** Guided prompts when no data exists
- **Progressive Disclosure:** Details shown on demand
- **Responsive Design:** Mobile-first with 8px grid system
- **Accessibility:** ARIA labels and keyboard navigation

---

## Deployment

### Development
```
Frontend:  localhost:3000 (Vite dev server)
Backend:   localhost:8000 (Uvicorn)
Database:  localhost:5432 (PostgreSQL)
Redis:     localhost:6379
```

### Production (Recommended)
```
Frontend:  Vercel / Netlify (static hosting)
Backend:   Railway / Render / AWS ECS (container deployment)
Database:  AWS RDS / Supabase (managed PostgreSQL)
Redis:     Redis Cloud / Upstash (managed Redis)
Storage:   AWS S3 / Cloudinary (file uploads)
```

---

## Future Roadmap

| Priority | Feature | Description |
|----------|---------|-------------|
| **High** | LinkedIn Integration | Import profile data and analyze job postings directly from LinkedIn |
| **High** | Multi-language Support | Extend resume parsing and analysis to support multiple languages |
| **Medium** | Chrome Extension | One-click analysis of job postings on LinkedIn, Indeed, and other job boards |

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Built with React, FastAPI, and AI</b><br>
  <sub>Helping job seekers land their dream jobs, one optimized resume at a time.</sub>
</p>