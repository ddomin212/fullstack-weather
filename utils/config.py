import os
import aioredis
import sentry_sdk

from fastapi_limiter import FastAPILimiter
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware import Middleware
from piccolo_api.csrf.middleware import CSRFMiddleware
from piccolo_api.csp.middleware import CSPMiddleware

def initialize_middleware(app:FastAPI) -> None:
    origins = [
        "http://localhost:3000",
        "http://192.168.50.47:3000"
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # app.add_middleware(
    #     TrustedHostMiddleware,
    #     allowed_hosts=["localhost", "192.168.50.47", "41e5864773fe7b01babdfdba354b0144@o4506049525514240.ingest.sentry.io"],
    # )

    @app.on_event("startup")
    async def startup():
        redis = await aioredis.from_url(f"redis://default:{os.getenv('REDIS_PASSWORD')}@{os.getenv('REDIS_URL')}:{os.getenv('REDIS_PORT')}")
        await FastAPILimiter.init(redis)

def initialize_app() -> FastAPI:

    # Initialize Sentry
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
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
    
    initialize_middleware(app)

    return app