import os
import re

import aioredis
import sentry_sdk
import stripe
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
from piccolo_api.csp.middleware import CSPMiddleware
from piccolo_api.csrf.middleware import CSRFMiddleware
from requests.exceptions import HTTPError
from starlette.middleware import Middleware
from utils.api import OpenMeteoAPI, OpenWeatherAPI
from utils.config import initialize_app
from utils.firebase import auth, db
from utils.models import AuthToken
from utils.settings import UNITS

load_dotenv()

app = initialize_app()

# ROUTES
# ====================

api = OpenWeatherAPI(api_key=os.getenv("OPEN_WEATHER_API_KEY"))
alt_api = OpenMeteoAPI()
stripe.api_key = os.getenv("STRIPE_API_KEY")


def call_api(query: str) -> dict:
    """Call the OpenWeatherMap API

    Args:
        query: query params for the API call

    Returns:
        dict: weather data for query params
    """
    weather = api.get_weather(query)
    forecast = api.get_forecast(query)
    air_quality = alt_api.get_air_quality(
        {"latitude": weather.lat, "longitude": weather.lon}
    )
    historical = alt_api.get_historical_data(
        {"latitude": weather.lat, "longitude": weather.lon, "units": query["units"]}
    )
    return {
        "weather": weather,
        "forecast": forecast,
        "units": UNITS[query["units"]],
        "air_quality": air_quality,
        "historical": historical.climate,
    }


@app.get("/weather/city", dependencies=[Depends(RateLimiter(times=5, seconds=60))])
async def weather_by_city(city: str, units: str = "metric"):
    """Get weather data for a city

    Args:
        city: city name
        units: units of measurement, can be metric or imperial. Defaults to "metric".

    Raises:
        e: Python exception
        HTTPException: API call failed

    Returns:
        dict: weather data for the city
    """
    try:
        return call_api({"q": city, "units": units})
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/weather/coordinates", dependencies=[Depends(RateLimiter(times=5, seconds=60))]
)
async def weather_by_coordinates(lat: float, lon: float, units: str = "metric"):
    """Get weather data for a set of coordinates

    Args:
        lat: latitude
        lon: longitude
        units: units of measurement, can be metric or imperial. Defaults to "metric".

    Raises:
        e: Python exception
        HTTPException: API call failed

    Returns:
        dict: weather data for the set of coordinates
    """
    try:
        return call_api({"lat": lat, "lon": lon, "units": units})
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/login")
async def login(authToken: AuthToken, response: Response):
    """login user via firebase

    Args:
        authToken: firebase JWT token

    Raises:
        HTTPException: if login fails

    Returns:
        dict: user details, including if the are a free or paid user
    """
    try:
        user = auth.get_account_info(authToken.token)
        g_uid = user["users"][0]["localId"]
        response.set_cookie(key="token", value=authToken.token)
        user_db = db.child("users").child(g_uid).get().val()
        tier = None

        if not user_db:
            db.child("users").child(g_uid).update({"tier": "free"})
            tier = "free"
        else:
            tier = user_db["tier"]

        return {
            "detail": "Login successful",
            "status_code": 200,
            "user": user["users"][0]["displayName"],
            "tier": tier,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/refresh")
async def refresh(authToken: AuthToken, response: Response):
    """refresh firebase JWT token

    Args:
        authToken: old firebase JWT token, including the refresh token

    Returns:
        dict: success or not, including if the user is a free or paid user
    """
    try:
        user = auth.refresh(authToken.refreshToken)
        response.set_cookie(key="token", value=user["idToken"])
        tier = db.child("users").child(user["userId"]).get().val()["tier"]
        return {"detail": "Refresh successful", "status_code": 200, "tier": tier}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/logout")
async def logout():
    """logout user from firebase"""
    return {"message": "Logout successful"}


@app.post("/payment")
async def create_checkout_session(authToken: AuthToken):
    user = auth.get_account_info(authToken.token)
    payment_session = stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],
        line_items=[
            {
                "price": "price_1O1XLGIkzhBkf9zarOv31qM0",
                "quantity": 1,
            },
        ],
        success_url=f"""http://localhost:8000/payment-success?session_id={"{CHECKOUT_SESSION_ID}"}&guid={user["users"][0]['localId']}""",
        cancel_url=f"http://localhost:8000/cancel",
    )
    db.child("users").child(user["users"][0]["localId"]).update(
        {"verificationToken": payment_session.id}
    )
    return {"id": payment_session.id, "url": payment_session.url, "status_code": 200}


@app.get("/payment-success")
async def payment_success(session_id: str, guid: str):
    verification_token = db.child("users").child(guid).get().val()["verificationToken"]
    if session_id == verification_token:
        db.child("users").child(guid).update({"tier": "paid"})
        return RedirectResponse(url=f"http://localhost:3000/")


# except HTTPError as e:
#     message_regex = re.compile(r'"message": "([^"]+)"')
#     match = message_regex.search(str(e))

#     if match:
#         firebase_error = match.group(1)
#         print(firebase_error)

#     raise HTTPException(status_code=400, detail=firebase_error)
