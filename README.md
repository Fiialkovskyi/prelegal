# Prelegal Company

A comprehensive resource for prelegal services and documentation.

## About

Prelegal Company provides professional prelegal support and services to assist with legal documentation, case preparation, and administrative legal processes.

## Features

- 📋 Legal document template library (12+ templates from CommonPaper)
- ✏️ Dynamic form generator for document customization
- 📄 PDF generation and download
- 🎨 Responsive web interface
- 📱 Mobile-friendly design
- ⚡ Real-time document preview

## Tech Stack

- **Backend**: Python FastAPI, Markdown parsing, WeasyPrint
- **Frontend**: Next.js, React, Tailwind CSS, TypeScript
- **Database**: JSON-based template catalog

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Run Both Backend and Frontend

```bash
# Clone and navigate to the project
git clone https://github.com/Fiialkovskyi/prelegal.git
cd prelegal

# Start both servers with one command
npm run dev
# or
bash start.sh
```

This will:
1. Create a Python virtual environment
2. Install backend dependencies
3. Install frontend dependencies
4. Start FastAPI backend on `http://localhost:8000`
5. Start Next.js frontend on `http://localhost:3000`

### Run Individually

**Backend only:**
```bash
npm run backend
```

**Frontend only:**
```bash
npm run frontend
```

### Manual Setup

**Backend:**
```bash
cd backend
python3 -m venv ../venv
source ../venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
.
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── core/        # Template parsing and rendering
│   │   ├── services/    # Business logic
│   │   ├── api/         # REST endpoints
│   │   └── models/      # Data models
│   └── requirements.txt
├── frontend/            # Next.js application
│   ├── src/
│   │   ├── app/        # Pages and layout
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utilities and API client
│   │   └── types/      # TypeScript types
│   └── package.json
├── templates/          # Legal document templates
└── catalog.json        # Template index
```

## API Endpoints

- `GET /api/v1/templates` - List all templates
- `GET /api/v1/templates/{id}/schema` - Get template schema (form fields)
- `GET /api/v1/templates/{id}/content` - Get raw template markdown
- `POST /api/v1/templates/{id}/pdf` - Generate PDF

## License

All rights reserved.