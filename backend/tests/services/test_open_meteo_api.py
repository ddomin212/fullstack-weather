import unittest

from fastapi import HTTPException
from models.weather import AirQuality, ClimateStats
from services.open_meteo import OpenMeteoAPI


class TestOpenMeteoAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.api = OpenMeteoAPI()

    def test_get_air_quality(self):
        query_params = {"latitude": 51.5074, "longitude": 0.1278}
        response = self.api.get_air_quality(query_params)

        self.assertIsInstance(response, AirQuality)

    def test_get_historical_data(self):
        query_params = {"latitude": 51.5074, "longitude": 0.1278, "units": "metric"}
        response = self.api.get_historical_data(query_params)

        self.assertIsInstance(response, ClimateStats)

    def test_get_api_response_climate(self):
        query_params = {"latitude": 51.5074, "longitude": 0.1278, "units": "metric"}
        additional_params = "start_date=2000-01-01&end_date=2001-01-01&models=EC_Earth3P_HR&daily=temperature_2m_mean"
        response = self.api.get_api_response("climate", additional_params, query_params)

        self.assertIsInstance(response, dict)
        self.assertIn("daily", response)
        self.assertIn("temperature_2m_mean", response["daily"])

    def test_get_api_response_error(self):
        query_params = {"lat": 51.5074, "lon": 0.1278, "units": "metric"}
        additional_params = "start_date=2000-01-01&end_date=2001-01-01&models=EC_Earth3P_HR&daily=temperature_2m_mean"

        with self.assertRaises(HTTPException) as cm:
            response = self.api.get_api_response(
                "climate", additional_params, query_params
            )

        self.assertEqual(cm.exception.status_code, 400)
        self.assertEqual(cm.exception.detail, "Could not fetch data from OpenMeteo API")

    def test_get_api_response_missing(self):
        query_params = {"latitude": 51.5074, "longitude": 0.1278, "units": "metric"}
        additional_params = "start_date=2000-01-01&end_date=2001-01-01&models=EC_Earth3P_HR&hourly=temperature_2m_mean"
        response = self.api.get_api_response("climate", additional_params, query_params)
        self.assertIsInstance(response, dict)
        self.assertNotIn("hourly", response)


if __name__ == "__main__":
    unittest.main()
