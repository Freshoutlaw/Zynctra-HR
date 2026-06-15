"""
/ai-services/app.py

Main FastAPI application for Zynctra AI Services.
Serves as the entry point for all AI-powered features:
- NLP assistance (summarization, classification, drafting)
- Anomaly detection (security, payroll, data integrity)
- Analytics (predictions, recommendations, insights)
- Multi-provider LLM support (Groq, OpenAI, Anthropic, Ollama)
"""

import logging
import os
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi
import uvicorn

from shared.config_loader import load_config
from shared.logging_config import setup_logging
from shared.metrics import init_metrics

# Import route modules
from nlp_assistant.api.routes import router as nlp_router
from anomaly_detector.api.routes import router as anomaly_router
from analytics.api.routes import router as analytics_router


# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Load configuration
config = load_config()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management"""
    # Startup
    logger.info("Starting Zynctra AI Services...")
    logger.info(f"LLM Provider: {os.getenv('LLM_PROVIDER', 'groq')}")
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    
    # Initialize metrics
    init_metrics()
    
    yield
    
    # Shutdown
    logger.info("Shutting down Zynctra AI Services...")


# Create FastAPI app
app = FastAPI(
    title="Zynctra AI Services",
    description="AI-powered HR analytics, NLP assistance, and anomaly detection",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Add request ID to all responses for tracing"""
    request_id = request.headers.get("X-Request-ID", f"req_{os.urandom(8).hex()}")
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


@app.middleware("http")
async def add_tenant_id(request: Request, call_next):
    """Extract and validate tenant ID from headers"""
    tenant_id = request.headers.get("X-Tenant-ID")
    if not tenant_id and request.url.path.startswith("/api/v1/"):
        # AI services always operate within a tenant context
        raise HTTPException(status_code=400, detail="Missing X-Tenant-ID header")
    request.state.tenant_id = tenant_id
    response = await call_next(request)
    return response


# Include routers
app.include_router(nlp_router, prefix="/api/v1/ai/nlp", tags=["NLP Assistant"])
app.include_router(anomaly_router, prefix="/api/v1/ai/anomalies", tags=["Anomaly Detection"])
app.include_router(analytics_router, prefix="/api/v1/ai/analytics", tags=["Analytics"])


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "UP",
        "service": "zynctra-ai-services",
        "version": "1.0.0",
    }


@app.get("/health/ready", tags=["Health"])
async def readiness_check():
    """Readiness check - validates backend connectivity"""
    try:
        # TODO: Add checks for:
        # - Backend API connectivity
        # - LLM provider connectivity
        # - Database connectivity
        return {
            "status": "READY",
            "service": "zynctra-ai-services",
        }
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service not ready")


@app.get("/config", tags=["Config"])
async def get_config():
    """Get current configuration (non-sensitive values only)"""
    return {
        "llm_provider": os.getenv("LLM_PROVIDER", "groq"),
        "environment": os.getenv("ENVIRONMENT", "development"),
        "backend_url": os.getenv("BACKEND_URL", "http://localhost:8000"),
        "version": "1.0.0",
    }


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """Handle ValueError exceptions"""
    return JSONResponse(
        status_code=400,
        content={
            "detail": str(exc),
            "error_type": "ValueError",
            "request_id": getattr(request.state, "request_id", None),
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error_type": type(exc).__name__,
            "request_id": getattr(request.state, "request_id", None),
        },
    )


def custom_openapi():
    """Customize OpenAPI schema"""
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Zynctra AI Services",
        version="1.0.0",
        description="AI-powered HR analytics, NLP assistance, and anomaly detection",
        routes=app.routes,
    )
    
    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT token from authentication service",
        }
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8010))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=os.getenv("ENVIRONMENT") == "development",
        log_level="info",
    )
