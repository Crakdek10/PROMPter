from __future__ import annotations
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, stt_ws
from app.core.config import get_settings
from app.core.logging import setup_logging
from app.api.providers import router as providers_router
from app.api.llm import router as llm_router

def create_app() -> FastAPI:
    settings = get_settings()
    setup_logging(settings.LOG_LEVEL)

    app = FastAPI(title=settings.APP_NAME)

    if settings.CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.CORS_ORIGINS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
    app.include_router(health.router)
    app.include_router(stt_ws.router)
    app.include_router(providers_router)
    app.include_router(llm_router)

    return app

app = create_app()
