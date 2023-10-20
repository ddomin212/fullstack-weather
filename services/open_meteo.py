from dataclasses import dataclass

import requests
import requests_cache
from fastapi import HTTPException
from models.weather import AirQuality, ClimateStats
from utils.parsers.open_meteo import OpenMeteoParser
from utils.services import parse_query, units_appendix


@dataclass
class OpenMeteoAPI:
    AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality?"
    CLIMATE_URL = "https://climate-api.open-meteo.com/v1/climate?"
    parser = OpenMeteoParser()

    def get_api_response(
        self,
        type: str,
        additional_params: str,
        query_params: dict[str, float | str],
        units: str = "",
    ) -> dict:
        """Get response from OpenWeatherMap API

        Args:
            type: Type of API call
            query_params: Query params for the API call
            additional_params: Additional params for the API call
            units: Units of measurement for the API call

        Returns:
            dict: Response from OpenWeatherMap API

        Raises:
            HTTPException: If the API call returns an error, propage the error to the client
        """
        query_params = parse_query(query_params)
        url = f"https://{type}-api.open-meteo.com/v1/{type}?{query_params}&{additional_params}{units}"
        cache_expire_after = 3600 if type == "air-quality" else 86400
        session = requests_cache.CachedSession(
            "demo_cache", expire_after=cache_expire_after
        )
        response = session.get(url)
        data = response.json()
        if "error" in data and data["error"] == True:
            raise HTTPException(
                status_code=response.status_code,
                detail="Could not fetch data from OpenMeteo API",
            )
        return data

    def get_air_quality(self, query_params: dict[str, float | str]) -> AirQuality:
        """Get the air quality for a location (latitude, longitude)

        Args:
            query_params: params for the API call

        Raises:
            HTTPException: API returns an error

        Returns:
            AirQuality: air quality data for the location according to European AQI
        """
        response = self.get_api_response(
            "air-quality",
            "hourly=european_aqi,european_aqi_pm2_5,european_aqi_pm10,european_aqi_no2,european_aqi_o3,european_aqi_so2",
            query_params,
        )
        return self.parser.air_quality(response)

    def get_historical_data(
        self,
        query_params: dict[str, float | str],
        start: str = "2000-01-01",
        end: str = "2025-12-31",
    ) -> ClimateStats:
        """Gets the historical data for a same day in a given range of years and location (latitude, longitude)

        Args:
            query_params: the location (latitude, longitude) for the API call, along with the units of measurement
            start: Defaults to "2000-01-01".
            end: Defaults to "2025-12-31".

        Raises:
            HTTPException: API returns an error

        Returns:
            ClimateStats: historical data for the location
        """
        units = units_appendix(query_params.pop("units"))
        response = self.get_api_response(
            "climate",
            f"start_date={start}&end_date={end}&models=EC_Earth3P_HR&daily=temperature_2m_mean,windspeed_10m_mean,relative_humidity_2m_mean,precipitation_sum,cloudcover_mean,pressure_msl_mean",
            query_params,
            units,
        )
        return self.parser.historical_data(response)
