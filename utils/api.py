import os
from dataclasses import dataclass
from datetime import date

import numpy as np
import requests
from fastapi import HTTPException
from utils.models import AirQuality, ClimateStats, CurrentWeather, Forecast


@dataclass
class OpenWeatherAPI:
    """Fetches weather data from OpenWeatherMap API"""

    api_key: str = os.getenv("OPEN_WEATHER_API_KEY")

    def get_weather(self, query_params: dict[str, float | str]) -> CurrentWeather:
        """Get current weather data for a city

        Args:
            query_params: Query params for the API call

        Returns:
            CurrentWeather: Current weather data for the city
        """
        response = self.get_api_response("weather", query_params)
        return self.parse_weather(response)

    def get_forecast(self, query_params: dict[str, float | str]) -> Forecast:
        """Get forecast data for a city

        Args:
            query_params: Query params for the API call

        Returns:
            Forecast: 5 day forecast data for the city (in 3 hour intervals)
        """
        response = self.get_api_response("forecast", query_params)
        return self.parse_forecast(response)

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
        query_params = self.parse_query(query_params)
        url = f"https://api.openweathermap.org/data/2.5/{type}?appid={self.api_key}&{query_params}"
        response = requests.get(url).json()
        if self.is_error_message(response):
            raise HTTPException(
                status_code=int(response["cod"]), detail=response["message"]
            )
        return response

    def parse_query(self, params) -> str:
        """Convert a dict of query params to a string that can be used in a URL

        Args:
            params: Query params for the API call

        Returns:
            str: Query params as a string
        """
        return "&".join([f"{key}={value}" for key, value in params.items()])

    def is_error_message(self, response: dict) -> bool:
        """Returns True if the response is an error message (i.e. the API call failed)

        Args:
            response: Response from OpenWeatherMap API

        Returns:
            bool: True if the response is an error message, False otherwise
        """
        return int(response["cod"]) >= 400 and int(response["cod"]) < 600

    def parse_weather(self, response: dict) -> CurrentWeather:
        """Parse the response from the API call to get the current weather data

        Args:
            response: Response from OpenWeatherMap API

        Returns:
            CurrentWeather: Current weather data for the city
        """
        data = {
            "dt": response["dt"],
            "timezone": response["timezone"],
            "temp": response["main"]["temp"],
            "temp_min": response["main"]["temp_min"],
            "temp_max": response["main"]["temp_max"],
            "lat": response["coord"]["lat"],
            "lon": response["coord"]["lon"],
            "feels_like": response["main"]["feels_like"],
            "pressure": response["main"]["pressure"],
            "humidity": response["main"]["humidity"],
            "clouds": response["clouds"]["all"],
            "wind_speed": response["wind"]["speed"],
            "visibility": response["visibility"],
            "rain": response.get("rain", {}).get("1h", 0),
            "weather_main": response["weather"][0]["main"],
            "weather_description": response["weather"][0]["description"],
            "weather_icon": response["weather"][0]["icon"],
            "sunrise": response["sys"]["sunrise"],
            "sunset": response["sys"]["sunset"],
        }
        return CurrentWeather(**data)

    def parse_forecast(self, response: dict) -> Forecast:
        """Parse the response from the API call to get the forecast data

        Args:
            response: Response from OpenWeatherMap API

        Returns:
            Forecast: 5 day forecast data for the city (in 3 hour intervals)
        """
        data = {
            "name": response["city"]["name"],
            "country": response["city"]["country"],
            "lat": response["city"]["coord"]["lat"],
            "lon": response["city"]["coord"]["lon"],
            "forecasts": [
                {
                    "dt": weather["dt"],
                    "temp": weather["main"]["temp"],
                    "temp_min": weather["main"]["temp_min"],
                    "temp_max": weather["main"]["temp_max"],
                    "feels_like": weather["main"]["feels_like"],
                    "pressure": weather["main"]["pressure"],
                    "humidity": weather["main"]["humidity"],
                    "clouds": weather["clouds"]["all"],
                    "wind_speed": weather["wind"]["speed"],
                    "visibility": weather["visibility"],
                    "rain": round(weather.get("rain", {}).get("3h", 0) / 3, 2),
                    "weather_main": weather["weather"][0]["main"],
                    "weather_description": weather["weather"][0]["description"],
                    "weather_icon": weather["weather"][0]["icon"],
                    "pod": weather["sys"]["pod"],
                    "rain_prob": weather["pop"],
                    "dt_txt": weather["dt_txt"],
                }
                for weather in response["list"]
            ],
        }
        return Forecast(**data)


@dataclass
class OpenMeteoAPI:
    AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality?"
    CLIMATE_URL = "https://climate-api.open-meteo.com/v1/climate?"

    def parse_query(self, params) -> str:
        """Convert a dict of query params to a string that can be used in a URL

        Args:
            params: Query params for the API call

        Returns:
            str: Query params as a string
        """
        return "&".join([f"{key}={value}" for key, value in params.items()])

    def get_air_quality(
        self, query_params: dict[str, float | str]
    ):  # TODO: take the median instead of the max
        url = (
            self.AIR_QUALITY_URL
            + self.parse_query(query_params)
            + "&hourly=european_aqi,european_aqi_pm2_5,european_aqi_pm10,european_aqi_no2,european_aqi_o3,european_aqi_so2"
        )
        response = requests.get(url).json()
        air_quality = {}
        for x, *params in zip(
            response["hourly"]["time"],
            response["hourly"]["european_aqi"],
            response["hourly"]["european_aqi_pm2_5"],
            response["hourly"]["european_aqi_pm10"],
            response["hourly"]["european_aqi_no2"],
            response["hourly"]["european_aqi_o3"],
            response["hourly"]["european_aqi_so2"],
        ):
            if x.split("T")[0] not in air_quality:
                air_quality[x.split("T")[0]] = [0] * len(params)
            for idx, aqi in enumerate(params):
                if aqi:
                    air_quality[x.split("T")[0]][idx] = (
                        aqi
                        if air_quality[x.split("T")[0]][idx] < aqi
                        else air_quality[x.split("T")[0]][idx]
                    )
        return AirQuality(aqi=air_quality)

    def units_appendix(self, units) -> str:
        return (
            "&temperature_unit=fahrenheit&windspeed_unit=mph"
            if units == "imperial"
            else "&windspeed_unit=ms"
        )

    def get_historical_data(
        self,
        query_params: dict[str, float | str],
        start: str = "2000-01-01",
        end: str = "2025-12-31",
    ):
        units = self.units_appendix(query_params.pop("units"))
        url = (
            self.CLIMATE_URL
            + self.parse_query(query_params)
            + f"&start_date={start}&end_date={end}&models=EC_Earth3P_HR&daily=temperature_2m_mean,windspeed_10m_mean,relative_humidity_2m_mean,precipitation_sum,cloudcover_mean,pressure_msl_mean"
            + units
        )
        response = requests.get(url).json()
        climate_stats = []
        new_keys = [
            "temp",
            "wind_speed",
            "humidity",
            "rain",
            "clouds",
            "pressure",
            "title",
        ]
        today = date.today().strftime("%m-%d")
        for x, *params in zip(
            response["daily"]["time"],
            response["daily"]["temperature_2m_mean"],
            response["daily"]["windspeed_10m_mean"],
            response["daily"]["relative_humidity_2m_mean"],
            response["daily"]["precipitation_sum"],
            response["daily"]["cloudcover_mean"],
            response["daily"]["pressure_msl_mean"],
        ):
            temp_dict = {}
            year, month_day = x.split("-", 1)
            all_params = params + [year]
            if month_day == today:
                for metric, key in zip(all_params, new_keys):
                    if metric:
                        temp_dict[key] = metric
                    else:
                        temp_dict[key] = 0
                climate_stats.append(temp_dict)
        return ClimateStats(climate=climate_stats)


if __name__ == "__main__":
    api = OpenMeteoAPI()
    api.get_historical_data(
        {
            "latitude": 52.52,
            "longitude": 13.41,
            "units": "imperial",
        },
        "2000-01-01",
        "2025-12-31",
    )
