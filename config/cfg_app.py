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


def initialize_middleware(app: FastAPI) -> None:
    origins = ["http://localhost:3000", "http://192.168.50.47:3000"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[
            os.getenv("SECRET_HOST_HEADER"),
            "192.168.50.47",
            "*.sentry.io",
        ],
    )

    @CsrfProtect.load_config
    def get_csrf_config():
        return CsrfSettings()

    @app.on_event("startup")
    async def startup():
        redis = await aioredis.from_url(
            f"redis://default:{os.getenv('REDIS_PASSWORD')}@{os.getenv('REDIS_URL')}:{os.getenv('REDIS_PORT')}"
        )
        await FastAPILimiter.init(redis)


def initialize_app() -> FastAPI:
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
    )

    app = FastAPI()

    # Capture HTTP errors and send them to Sentry
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request, exc):
        sentry_sdk.capture_exception(exc)
        return JSONResponse(
            status_code=exc.status_code,
            content={"message": exc.detail},
        )

    @app.exception_handler(CsrfProtectError)
    def csrf_protect_exception_handler(request: Request, exc: CsrfProtectError):
        return JSONResponse(
            status_code=exc.status_code, content={"detail": exc.message}
        )

    initialize_middleware(app)

    return app
