import os
from dataclasses import dataclass

import requests
import requests_cache
from fastapi import HTTPException
from models.weather import CurrentWeather, Forecast
from utils.parsers.open_weather import OpenWeatherParser
from utils.services import parse_query


@dataclass
class OpenWeatherAPI:
    """Fetches weather data from OpenWeatherMap API"""

    api_key: str = os.getenv("OPEN_WEATHER_API_KEY")
    parser = OpenWeatherParser()

    def get_weather(self, query_params: dict[str, float | str]) -> CurrentWeather:
        """Get current weather data for a city

        Args:
            query_params: Query params for the API call

        Returns:
            CurrentWeather: Current weather data for the city
        """
        response = self.get_api_response("weather", query_params)
        return self.parser.current_weather(response)

    def get_forecast(self, query_params: dict[str, float | str]) -> Forecast:
        """Get forecast data for a city

        Args:
            query_params: Query params for the API call

        Returns:
            Forecast: 5 day forecast data for the city (in 3 hour intervals)
        """
        response = self.get_api_response("forecast", query_params)
        return self.parser.forecast(response)

    def get_api_response(self, type: str, query_params: dict[str, float | str]) -> dict:
        """Get response from OpenWeatherMap API

        Args:
            type: Type of API call
            query_params: Query params for the API call

        Returns:
            dict: Response from OpenWeatherMap API

        Raises:
            HTTPException: If the API call returns an error, propage the error to the client
        """
        query_params = parse_query(query_params)
        url = f"https://api.openweathermap.org/data/2.5/{type}?appid={self.api_key}&{query_params}"
        cache_expire_after = 3600 if type == "forecast" else 600
        session = requests_cache.CachedSession(
            "demo_cache", expire_after=cache_expire_after
        )
        response = session.get(url).json()
        if int(response["cod"]) >= 400 and int(response["cod"]) < 600:
            raise HTTPException(
                status_code=int(response["cod"]), detail=response["message"]
            )
        return response
