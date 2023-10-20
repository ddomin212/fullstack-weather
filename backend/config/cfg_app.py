import os

import aioredis
import sentry_sdk
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi_csrf_protect import CsrfProtect
from fastapi_csrf_protect.exceptions import CsrfProtectError
from fastapi_limiter import FastAPILimiter
from models.security import CsrfSettings
from routes.auth import router as auth_router
from routes.payment import router as payment_router
from routes.weather import router as weather_router


def initialize_middleware(app: FastAPI) -> None:
    origins = ["http://localhost:3000", "http://0.0.0.0:3000"]

    # Set all CORS enabled origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Set trusted hosts
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[
            os.getenv("SECRET_HOST_HEADER"),
            "0.0.0.0",
            "*.sentry.io",
        ],
    )

    # Set CSRF protection
    @CsrfProtect.load_config
    def get_csrf_config():
        return CsrfSettings()

    # Set API rate limiting
    @app.on_event("startup")
    async def startup():
        redis = await aioredis.from_url(
            f"redis://default:{os.getenv('REDIS_PASSWORD')}@{os.getenv('REDIS_URL')}:{os.getenv('REDIS_PORT')}"
        )
        await FastAPILimiter.init(redis)


def initialize_app(app: FastAPI) -> None:
    """Initialize the FastAPI application with various middleware and settings."""

    # Initialize Sentry logging and monitoring
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
    )

    # Capture HTTP errors and send them to Sentry
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request, exc):
        sentry_sdk.capture_exception(exc)
        return JSONResponse(
            status_code=exc.status_code,
            content={"message": exc.detail},
        )

    # Capture CSRF errors and send them to Sentry
    @app.exception_handler(CsrfProtectError)
    def csrf_protect_exception_handler(request: Request, exc: CsrfProtectError):
        sentry_sdk.capture_exception(exc)
        return JSONResponse(status_code=419, content={"detail": exc.message})

    initialize_middleware(app)

    app.include_router(weather_router)
    app.include_router(auth_router)
    app.include_router(payment_router)

    return app
