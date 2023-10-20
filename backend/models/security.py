import os
from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class AuthToken(BaseModel):
    token: str
    refreshToken: Optional[str] = None


class CsrfSettings(BaseModel):
    secret_key: str = os.getenv("CSRF_SECRET_KEY")
