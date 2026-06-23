# Resume Analyzer Pro - Backend

AI-Powered Resume Analysis and Optimization Platform

## Features

- 🤖 AI-powered resume analysis using Google Gemini
- 📊 Comprehensive scoring (ATS, Keywords, Skills, Experience)
- 💼 Job description matching and comparison
- 🏢 Company-specific customization
- ✨ Smart improvement suggestions
- 📈 Multi-resume management
- 🔄 Background processing with Celery
- 📧 Email notifications

## Tech Stack

- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL with AsyncPG
- **ORM**: SQLAlchemy 2.0 (Async)
- **AI**: Google Gemini 1.5 Pro
- **Caching**: Redis
- **Task Queue**: Celery
- **Authentication**: JWT
- **Document Processing**: pdfplumber, python-docx

## Quick Start

### 1. Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### 2. Installation

```bash
# Clone repository
git clone <repository-url>
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your configuration