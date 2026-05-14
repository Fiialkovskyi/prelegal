from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.core import catalog
from app.database import init_db
from app.api.routes import templates, auth, documents, chat

# Load .env from project root when running locally (not needed in Docker with env vars)
_env_path = Path(__file__).resolve().parents[2] / ".env"
if _env_path.exists():
    load_dotenv(_env_path)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    catalog.load_catalog()
    yield
    # Shutdown
    pass


app = FastAPI(
    title="Prelegal API",
    description="API for legal document template management and PDF generation",
    version="0.1.0",
    lifespan=lifespan,
)

# Add CORS middleware
# In production, replace ["*"] with specific origins like ["https://yourdomain.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(templates.router)
app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(chat.router)


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
