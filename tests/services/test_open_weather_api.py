import unittest

from dotenv import load_dotenv
from fastapi import HTTPException
from models.weather import CurrentWeather, Forecast
from services.open_weather_api import OpenWeatherAPI

load_dotenv()


class TestOpenWeatherAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.api = OpenWeatherAPI()

    def test_get_weather(self):
        query_params = {"q": "London", "units": "metric"}
        response = self.api.get_weather(query_params)

        self.assertIsInstance(response, CurrentWeather)

    def test_get_forecast(self):
        query_params = {"q": "London", "units": "metric"}
        response = self.api.get_forecast(query_params)

        self.assertIsInstance(response, Forecast)

    def test_get_api_response(self):
        query_params = {"q": "London", "units": "metric"}
        response = self.api.get_api_response("weather", query_params)

        self.assertIn("name", response)
        self.assertIn("main", response)
        self.assertIn("weather", response)

    def test_get_api_error(self):
        query_params = {"q": "InvalidCityName", "units": "metric"}

        with self.assertRaises(HTTPException) as cm:
            self.api.get_api_response("weather", query_params)

        self.assertEqual(cm.exception.status_code, 404)
        self.assertEqual(cm.exception.detail, "city not found")
