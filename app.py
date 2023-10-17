import os

import stripe
from config.cfg_app import initialize_app
from config.firebase import auth, db
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi_csrf_protect import CsrfProtect
from fastapi_limiter.depends import RateLimiter
from models.security import AuthToken
from requests.exceptions import HTTPError
from services.open_meteo import OpenMeteoAPI
from services.open_weather_api import OpenWeatherAPI
from stripe.error import StripeError
from utils.errors import handle_exception, handle_pyrebase
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
        "air_quality": air_quality.aqi,
        "historical": historical.climate,
    }


@app.get("/csrftoken/")
async def get_csrf_token(csrf_protect: CsrfProtect = Depends()):
    response = JSONResponse(status_code=200, content={"csrf_token": "cookie"})
    csrf_protect.set_csrf_cookie(response)
    return response


@handle_exception
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
    return call_api({"q": city, "units": units})


@handle_exception
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
    return call_api({"lat": lat, "lon": lon, "units": units})


@handle_exception
@app.post("/login")
async def login(
    authToken: AuthToken,
    request: Request,
    response: Response,
    csrf_protect: CsrfProtect = Depends(),
):
    """login user via firebase

    Args:
        authToken: firebase JWT token

    Raises:
        HTTPException: if login fails

    Returns:
        dict: user details, including if the are a free or paid user
    """
    csrf_protect.validate_csrf(request)
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
    except HTTPError as e:
        response = handle_pyrebase(e)
        raise HTTPException(detail=response[0]["error"], status_code=response[1])


@handle_exception
@app.post("/refresh")
async def refresh(
    authToken: AuthToken,
    request: Request,
    response: Response,
    csrf_protect: CsrfProtect = Depends(),
):
    """refresh firebase JWT token

    Args:
        authToken: old firebase JWT token, including the refresh token

    Returns:
        dict: success or not, including if the user is a free or paid user
    """
    csrf_protect.validate_csrf(request)
    try:
        user = auth.refresh(authToken.refreshToken)
        response.set_cookie(key="token", value=user["idToken"])
        tier = db.child("users").child(user["userId"]).get().val()["tier"]
        return {"detail": "Refresh successful", "status_code": 200, "tier": tier}
    except HTTPError as e:
        response = handle_pyrebase(e)
        raise HTTPException(detail=response[0]["error"], status_code=response[1])


@handle_exception
@app.get("/logout")
async def logout():
    """logout user from firebase"""
    return {"message": "Logout successful"}


@handle_exception
@app.post("/payment")
async def create_checkout_session(
    authToken: AuthToken,
    request: Request,
    response: Response,
    csrf_protect: CsrfProtect = Depends(),
):
    csrf_protect.validate_csrf(request)
    try:
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
        return {
            "id": payment_session.id,
            "url": payment_session.url,
            "status_code": 200,
        }
    except HTTPError as e:
        response = handle_pyrebase(e)
        raise HTTPException(detail=response[0]["error"], status_code=response[1])
    except StripeError as e:
        raise HTTPException(detail=e.user_message, status_code=e.http_status)


@handle_exception
@app.get("/payment-success")
async def payment_success(session_id: str, guid: str):
    try:
        verification_token = (
            db.child("users").child(guid).get().val()["verificationToken"]
        )
        if session_id == verification_token:
            db.child("users").child(guid).update({"tier": "paid"})
            return RedirectResponse(url=f"http://localhost:3000/")
        else:
            raise HTTPException(
                detail="Verification token does not match", status_code=401
            )
    except HTTPError as e:
        response = handle_pyrebase(e)
        raise HTTPException(detail=response[0]["error"], status_code=response[1])
    except KeyError:
        raise HTTPException(detail="Verification token not found", status_code=400)
