from typing import Optional

from pydantic import BaseModel


class BaseWeather(BaseModel):
    """Pydantic model for weather data validation"""

    dt: int
    temp: float
    temp_min: float
    temp_max: float
    feels_like: float
    pressure: int
    humidity: int
    clouds: int
    wind_speed: float
    visibility: int
    rain: float
    weather_main: str
    weather_description: str
    weather_icon: str


class ClimateStats(BaseModel):
    climate: list[dict[str, float | int]]


class AirQuality(BaseModel):
    aqi: dict[str, list[int]]


class CurrentWeather(BaseWeather):
    """Pydantic model for current weather data validation"""

    lat: float
    lon: float
    sunrise: int
    sunset: int
    timezone: int


class ThreeHourWeather(BaseWeather):
    """Pydantic model for 3 hour weather data validation"""

    pod: str
    rain_prob: float
    dt_txt: str


class Forecast(BaseModel):
    """Pydantic model for forecast data validation"""

    name: str
    country: str
    lat: float
    lon: float
    forecasts: list[ThreeHourWeather]


class AuthToken(BaseModel):
    token: str
    refreshToken: Optional[str] = None
