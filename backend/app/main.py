from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core import catalog
from app.api.routes import templates


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this based on your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(templates.router)


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
