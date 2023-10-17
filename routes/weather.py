import os

from config.firebase import auth, db
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from fastapi_limiter.depends import RateLimiter
from models.security import AuthToken
from requests.exceptions import HTTPError
from services.open_meteo import OpenMeteoAPI
from services.open_weather_api import OpenWeatherAPI
from utils.errors import handle_exception, handle_pyrebase
from utils.settings import UNITS

router = APIRouter()

load_dotenv()

api = OpenWeatherAPI(api_key=os.getenv("OPEN_WEATHER_API_KEY"))
alt_api = OpenMeteoAPI()


def call_api(query: str, tier: str = "free") -> dict:
    """Call the OpenWeatherMap API

    Args:
        query: query params for the API call

    Returns:
        dict: weather data for query params
    """
    weather = api.get_weather(query)
    forecast = api.get_forecast(query)

    if tier == "paid":
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
    else:
        return {
            "weather": weather,
            "forecast": forecast,
            "units": UNITS[query["units"]],
        }


@handle_exception
@router.post("/weather/city", dependencies=[Depends(RateLimiter(times=5, seconds=60))])
async def weather_by_city(authToken: AuthToken, city: str, units: str = "metric"):
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
        if authToken.token == "empty":
            return call_api({"q": city, "units": units})
        user = auth.get_account_info(authToken.token)
        g_uid = user["users"][0]["localId"]
        tier = db.child("users").child(g_uid).get().val()["tier"]
        return call_api({"q": city, "units": units}, tier)
    except HTTPError as e:
        response = handle_pyrebase(e)
        raise HTTPException(
            detail=f"Error in firebase: {response[0]['error']}", status_code=response[1]
        )


@handle_exception
@router.post(
    "/weather/coordinates", dependencies=[Depends(RateLimiter(times=5, seconds=60))]
)
async def weather_by_coordinates(
    authToken: AuthToken, lat: float, lon: float, units: str = "metric"
):
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
        if authToken.token == "empty":
            return call_api({"lat": lat, "lon": lon, "units": units})
        user = auth.get_account_info(authToken.token)
        g_uid = user["users"][0]["localId"]
        tier = db.child("users").child(g_uid).get().val()["tier"]
        return call_api({"lat": lat, "lon": lon, "units": units}, tier)
    except HTTPError as e:
        response = handle_pyrebase(e)
        raise HTTPException(
            detail=f"Error in firebase: {response[0]['error']}", status_code=response[1]
        )
