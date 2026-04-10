# AutoApply Backend

Flask backend for the AutoApply job application automation system.

## Setup

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Create and activate virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file (from `.env.example`):
```bash
cp .env.example .env
# Edit .env and add your Gemini API key
```

### LLM/AI Configuration

The backend now supports provider-based LLM configuration for agent workflows.

Set these in `.env`:

```bash
LLM_ENABLED=true
LLM_PROVIDER=gemini   # gemini | openai | anthropic
GEMINI_API_KEY=...
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
LLM_MODEL_GENERAL=gemini-1.5-flash
LLM_MODEL_RESUME_PARSER=gemini-1.5-flash
LLM_MODEL_COVER_LETTER=gemini-1.5-pro
GOOGLE_APPLICATION_CREDENTIALS=C:/path/to/your-service-account.json
```

AI-required features in the agent:
- Resume parsing/enrichment
- Cover letter personalization
- Application reasoning/ranking refinement

Implementation files:
- `Backend/config/llm_config.py`
- `Backend/agent/orchestrator.py`

If `LLM_ENABLED=false`, agent flow still runs with non-LLM fallbacks.

## Running the Application

Start the Flask server:
```bash
python run.py
```

Server will be available at `http://localhost:5000`

## API Endpoints

### Applications
- `GET /api/applications` - Get all applications (supports `?status=` filter)
- `GET /api/applications/<id>` - Get specific application
- `POST /api/applications` - Create new application
- `PUT /api/applications/<id>` - Update application
- `DELETE /api/applications/<id>` - Delete application

### Settings
- `GET /api/settings` - Get current settings
- `POST /api/settings/api-key` - Set Gemini API key
- `POST /api/settings/resume` - Set resume text
- `POST /api/settings/cover-letter` - Set cover letter template
- `GET /api/settings/preferences` - Get preferences
- `POST /api/settings/preferences` - Update preferences

### Analytics
- `GET /api/analytics` - Get overall statistics
- `GET /api/analytics/status-breakdown` - Breakdown by application status
- `GET /api/analytics/companies-breakdown` - Breakdown by company
- `GET /api/analytics/recent` - Get recent applications

### Dashboard
- `GET /api/dashboard` - Get dashboard overview
- `GET /api/dashboard/summary` - Get summary statistics

### Setup
- `GET /api/setup/status` - Check if setup is complete
- `POST /api/setup/complete` - Complete initial setup

## Resume Parser

The resume parser extracts structured data from PDF and DOCX resume files.

### Usage

Run the test to parse a resume:
```bash
python tests/test_parser.py <path_to_resume.pdf>
```

Example:
```bash
python tests/test_parser.py C:\Users\ami05\Downloads\resume.pdf
```

### Supported Formats
- **.pdf** - PDF resumes
- **.docx** - Microsoft Word documents
- **.doc** - Legacy Word documents

### Extracted Data
The parser extracts:
- **Name** - Candidate's full name
- **Email** - Contact email address
- **Phone** - Phone number
- **LinkedIn** - LinkedIn profile URL
- **GitHub** - GitHub profile URL
- **Summary** - Professional summary/objective
- **Skills** - Technical and soft skills
- **Experience** - Work history with descriptions
- **Education** - Academic background
- **Projects** - Personal/academic projects
- **Certifications** - Relevant certifications

### Example Output
```python
from parsers import ResumeParser

parser = ResumeParser()
result = parser.parse("resume.pdf")

print(result.name)
print(result.email)
print(result.skills)
print(result.experience)
```

## Project Structure

```
Backend/
├── run.py                    # Flask app entry point
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
│
├── models/
│   ├── __init__.py
│   └── application.py       # Data models (JobApplication, UserSettings, Analytics)
│
├── controllers/
│   ├── __init__.py
│   ├── application_controller.py  # Job application logic
│   ├── settings_controller.py      # User settings logic
│   └── analytics_controller.py     # Analytics logic
│
├── routes/
│   ├── __init__.py
│   ├── applications.py      # Application endpoints
│   ├── settings.py          # Settings endpoints
│   ├── analytics.py         # Analytics endpoints
│   ├── dashboard.py         # Dashboard endpoints
│   └── setup.py             # Setup endpoints
│
├── parsers/
│   ├── __init__.py
│   ├── resume_parser.py     # Resume parsing logic
│   └── schemas.py           # Data schemas
│
└── tests/
    └── test_parser.py       # Resume parser tests
```

## Technologies

- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **pdfplumber** - PDF text extraction
- **python-docx** - DOCX parsing
- **google-generativeai** - Gemini AI integration

## Security Notes

Sensitive files are ignored by git at repository root:
- `Backend/.env`
- `Backend/policyagent-*.json`
- service-account credential files

Do not commit API keys or service-account JSON files.

## Development

For development, set `FLASK_ENV=development` in `.env`:
```bash
FLASK_ENV=development
```

This enables debug mode and auto-reload when files change.
