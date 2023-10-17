import os
from dataclasses import dataclass

import requests
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
        response = requests.get(url).json()
        if self.is_error_message(response):
            raise HTTPException(
                status_code=int(response["cod"]), detail=response["message"]
            )
        return response

    def parse_query(self, params: dict[str, float | str]) -> str:
        """Convert a dict of query params to a string that can be used in a URL

        Args:
            params: Query params for the API call

        Returns:
            str: Query params as a string
        """
        return "&".join([f"{key}={value}" for key, value in params.items()])

    def is_error_message(
        self, response: dict[str, int | list[dict[str, str]] | dict[str, float | int]]
    ) -> bool:
        """Returns True if the response is an error message (i.e. the API call failed)

        Args:
            response: Response from OpenWeatherMap API

        Returns:
            bool: True if the response is an error message, False otherwise
        """
        return int(response["cod"]) >= 400 and int(response["cod"]) < 600
