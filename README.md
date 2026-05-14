# Prelegal

Professional legal document creation platform with AI-powered assistance.

## About

Prelegal helps users create professional legal documents quickly and easily. Choose from 12+ pre-built templates, customize through an intuitive form, and generate PDF documents.

## Features

- 📋 12+ legal document templates (NDAs, Agreements, Service Level Agreements, etc.)
- 🔐 User authentication with secure JWT tokens
- 💾 Save and manage your documents
- ✏️ Dynamic form generation from templates
- 📄 Real-time preview and PDF export
- 🎨 Modern, responsive UI with Tailwind CSS
- 📱 Mobile-friendly design
- 🐳 Docker containerization for easy deployment

## Tech Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, SQLite, WeasyPrint
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Database**: SQLite (auto-initialized on startup)
- **Authentication**: JWT tokens in HttpOnly cookies
- **Containerization**: Docker with multi-stage build

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Local Development (Recommended)

```bash
# Clone the project
git clone https://github.com/Fiialkovskyi/prelegal.git
cd prelegal

# Start both backend and frontend
# macOS
bash scripts/start-mac.sh

# Linux
bash scripts/start-linux.sh

# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File scripts/start-windows.ps1
```

This will:
1. Create a Python virtual environment
2. Install dependencies for both backend and frontend
3. Start FastAPI backend on `http://localhost:8000`
4. Start Next.js dev server on `http://localhost:3000`
5. Redirect to auth page (sign up or sign in)

### Docker Deployment

```bash
# Build the Docker image
docker build -t prelegal:latest .

# Run the container
docker run -p 8000:8000 prelegal:latest
```

The application will be available at `http://localhost:8000`

### Manual Setup

**Backend only:**
```bash
cd backend
python3 -m venv ../venv
source ../venv/bin/activate  # On Windows: ..\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend only:**
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

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in with email/password
- `POST /api/auth/signout` - Sign out (clear auth cookie)
- `GET /api/auth/me` - Get current user info

### Templates
- `GET /api/v1/templates` - List all templates
- `GET /api/v1/templates/{id}/schema` - Get template schema (form fields)
- `GET /api/v1/templates/{id}/content` - Get raw template markdown
- `POST /api/v1/templates/{id}/pdf` - Generate PDF

### Documents (Authenticated)
- `GET /api/documents` - List user's documents
- `POST /api/documents` - Create new document
- `GET /api/documents/{id}` - Get specific document
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document

### Health
- `GET /health` - Health check

## License

All rights reserved.