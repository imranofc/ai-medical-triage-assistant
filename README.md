# MediAI --- AI-Powered Health Information & Triage Assistant

MediAI is a full-stack web application that helps users structure their
symptoms, provide relevant health information, highlight warning signs,
and generate an AI-powered triage assessment.

> **Live Demo:** https://mediai.imranofc.com
> **Repository:**
> https://github.com/imranofc/ai-medical-triage-assistant

## ⚠️ Medical Disclaimer

MediAI is an educational and informational technology project. It is
**not a medical professional, diagnostic system, or substitute for
professional medical advice**. Users should contact a qualified
healthcare professional for medical concerns and seek emergency care
when appropriate.

## ✨ Features

-   🩺 Guided symptom assessment
-   🤖 AI-powered health analysis using Google Gemini
-   🚦 Triage recommendations based on the information provided
-   🔎 Possible explanations for reported symptoms
-   ⚠️ Warning signs users should watch for
-   💚 Self-care suggestions
-   👤 User registration and login
-   🔐 JWT-based authentication
-   📋 Consultation history
-   ⭐ Favourite consultations
-   📝 Draft and completed consultations
-   👤 Patient profile and health details
-   📄 Downloadable medical reports in PDF format
-   📱 Responsive, healthcare-focused user interface

## 🛠️ Tech Stack

### Frontend

-   React 19
-   React Router
-   Create React App
-   Font Awesome
-   JavaScript / CSS

### Backend

-   Python
-   Django 5.2
-   Django REST Framework
-   Simple JWT
-   Django CORS Headers
-   SQLite for the default local database
-   PostgreSQL support through `psycopg`

### AI & Services

-   Google Gemini API
-   Google GenAI Python SDK
-   Python dotenv for environment variables

### Deployment

-   Frontend: Vercel
-   Backend: Cloud deployment
-   Custom domain: `mediai.imranofc.com`

## 🏗️ Architecture

``` text
                    ┌──────────────────────┐
                    │      User / Browser  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │   medi-ai-frontend   │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Django Backend     │
                    │     Django REST      │
                    └───────┬───────┬──────┘
                            │       │
                 ┌──────────┘       └──────────┐
                 ▼                             ▼
        ┌─────────────────┐          ┌─────────────────┐
        │ Database        │          │ Gemini AI       │
        │ SQLite/Postgres │          │ Analysis        │
        └─────────────────┘          └─────────────────┘
```

## 📁 Project Structure

``` text
ai-medical-triage-assistant/
│
├── medi-ai-frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── mediaibackend/
│   ├── mediai/
│   │   ├── ai/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── ...
│   ├── mediaibackend/
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have:

-   Python 3.10+
-   Node.js and npm
-   Git
-   A Google Gemini API key

### 1. Clone the repository

``` bash
git clone https://github.com/imranofc/ai-medical-triage-assistant.git
cd ai-medical-triage-assistant
```

### 2. Backend setup

``` bash
cd mediaibackend

python -m venv venv
```

Activate the virtual environment.

**Windows:**

``` bash
venv\Scripts\activate
```

**macOS/Linux:**

``` bash
source venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

For PDF report generation, make sure ReportLab is installed:

``` bash
pip install reportlab
```

### 3. Configure environment variables

Create a `.env` file inside `mediaibackend/`:

``` env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Never commit your real API key or other secrets to GitHub.**

### 4. Apply database migrations

``` bash
python manage.py migrate
```

### 5. Start the Django backend

``` bash
python manage.py runserver
```

The backend will normally be available at:

``` text
http://127.0.0.1:8000/
```

### 6. Frontend setup

Open another terminal:

``` bash
cd medi-ai-frontend
npm install
npm start
```

The React application will normally run at:

``` text
http://localhost:3000/
```

## 🔐 Authentication

MediAI uses JWT authentication through Django REST Framework Simple JWT.

The application supports:

-   User registration
-   Login
-   Access tokens
-   Refresh tokens
-   Token rotation
-   Refresh-token blacklisting
-   Authenticated consultation access

## 🤖 AI Analysis Flow

The core assessment flow is:

``` text
User Symptoms
     ↓
Consultation Details
     ↓
Patient Details
     ↓
Review
     ↓
Gemini AI Analysis
     ↓
Structured Result
     ├── Triage Level
     ├── Possible Explanations
     ├── Warning Signs
     └── Self-Care Suggestions
```

The backend validates that the consultation contains the required
information before generating an analysis.

## 📄 PDF Reports

Completed consultations can be exported as PDF reports.

Reports can include:

-   Consultation information
-   Patient details
-   Symptoms
-   Duration
-   Severity
-   Description
-   AI analysis information

## 🔒 Security Notes

For production deployments:

-   Keep `GEMINI_API_KEY` in environment variables.
-   Do not commit `.env` files.
-   Replace Django's development `SECRET_KEY`.
-   Set `DEBUG = False`.
-   Configure `ALLOWED_HOSTS`.
-   Configure production `CORS_ALLOWED_ORIGINS`.
-   Configure production `CSRF_TRUSTED_ORIGINS`.
-   Use HTTPS.
-   Use a production database such as PostgreSQL.
-   Review Django's deployment security checklist before going live.

## 🌐 Live Application

**MediAI:** https://mediai.imranofc.com

## 💻 Repository

**GitHub:** https://github.com/imranofc/ai-medical-triage-assistant

## 🔮 Future Improvements

Potential improvements include:

-   Better AI safety and evaluation
-   More robust validation and error handling
-   Automated testing
-   Rate limiting for AI endpoints
-   Improved production logging and monitoring
-   More detailed accessibility support
-   Multi-language support
-   Improved medical-content validation
-   Stronger privacy and data-retention controls

------------------------------------------------------------------------

Built with React, Django, REST APIs, and Google Gemini AI.