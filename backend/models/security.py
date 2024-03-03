# pylint: disable=E0401

import os
from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class AuthToken(BaseModel):
    """Pydantic model for authentication token data validation"""
    token: str
    refreshToken: Optional[str] = None


class CsrfSettings(BaseModel):
    """Pydantic model for CSRF settings data validation"""
    secret_key: str = os.getenv("CSRF_SECRET_KEY")
