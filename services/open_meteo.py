from dataclasses import dataclass

import requests
from fastapi import HTTPException
from models.weather import AirQuality, ClimateStats
from utils.parsers.open_meteo import OpenMeteoParser
from utils.services import parse_query


@dataclass
class OpenMeteoAPI:
    AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality?"
    CLIMATE_URL = "https://climate-api.open-meteo.com/v1/climate?"
    parser = OpenMeteoParser()

    def parse_query(self, params) -> str:
        """Convert a dict of query params to a string that can be used in a URL

        Args:
            params: Query params for the API call

        Returns:
            str: Query params as a string
        """
        return "&".join([f"{key}={value}" for key, value in params.items()])

    def get_air_quality(self, query_params: dict[str, float | str]) -> AirQuality:
        """Get the air quality for a location (latitude, longitude)

        Args:
            query_params: params for the API call

        Raises:
            HTTPException: API returns an error

        Returns:
            AirQuality: air quality data for the location according to European AQI
        """
        url = (
            self.AIR_QUALITY_URL
            + parse_query(query_params)
            + "&hourly=european_aqi,european_aqi_pm2_5,european_aqi_pm10,european_aqi_no2,european_aqi_o3,european_aqi_so2"
        )
        response = requests.get(url).json()
        if "error" in response:
            raise HTTPException(
                status_code=400,
                detail="Cannot fetch air quality data for this location",
            )
        return self.parser.air_quality(response)

    def units_appendix(self, units: str) -> str:
        """Append units to the URL for the API call according to query

        Args:
            units: units of measurement, can be metric or imperial. Defaults to "metric".

        Returns:
            str: units of measurement for the API call
        """
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
        units = self.units_appendix(query_params.pop("units"))
        url = (
            self.CLIMATE_URL
            + parse_query(query_params)
            + f"&start_date={start}&end_date={end}&models=EC_Earth3P_HR&daily=temperature_2m_mean,windspeed_10m_mean,relative_humidity_2m_mean,precipitation_sum,cloudcover_mean,pressure_msl_mean"
            + units
        )
        response = requests.get(url).json()
        if "error" in response:
            raise HTTPException(
                status_code=400,
                detail="Cannot fetch historical data for this location",
            )
        return self.parser.historical_data(response)
