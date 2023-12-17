import unittest
from datetime import date

from models.weather import AirQuality, ClimateStats
from services.open_meteo import OpenMeteoParser


class TestOpenMeteoParser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.parser = OpenMeteoParser()
        cls.today = date.today().strftime("%Y-%m-%d")
        cls.mocked_climate_response = {
            "daily": {
                "time": [f"{cls.today}", "2010-05-01", "2015-05-01"],
                "temperature_2m_mean": [5.0, 6.0, 7.0],
                "windspeed_10m_mean": [10.0, 11.0, 12.0],
                "relative_humidity_2m_mean": [50.0, 60.0, 70.0],
                "precipitation_sum": [0.0, 0.0, 0.0],
                "cloud_cover_mean": [0.0, 0.0, 0.0],
                "pressure_msl_mean": [1000.0, 1001.0, 1002.0],
            }
        }
        cls.mocked_AQI_response = {
            "hourly": {
                "time": [
                    f"{cls.today}T00:00",
                    f"{cls.today}T01:00",
                    f"{cls.today}T02:00",
                ],
                "european_aqi": [5.0, 6.0, 7.0],
                "european_aqi_pm2_5": [10.0, 11.0, 12.0],
                "european_aqi_pm10": [50.0, 60.0, 70.0],
                "european_aqi_no2": [0.0, 0.0, 1.0],
                "european_aqi_o3": [0.0, 0.0, 1.0],
                "european_aqi_so2": [3.0, 4.0, 5.0],
            }
        }

    def test_historical_data(self):
        climate_stats = self.parser.historical_data(self.mocked_climate_response)

        expected_climate = {
            "temp": 5.0,
            "wind_speed": 10.0,
            "humidity": 50.0,
            "rain": 0.0,
            "clouds": 0.0,
            "pressure": 1000.0,
            "title": int(self.today.split("-")[0]),
        }

        self.assertDictEqual(climate_stats.climate[0], expected_climate)

    def test_parse_air_quality(self):
        air_quality = self.parser.air_quality(self.mocked_AQI_response)

        self.assertIsInstance(air_quality, AirQuality)
        self.assertEqual(air_quality.aqi[self.today], [7, 12, 70, 1, 1, 5])


if __name__ == "__main__":
    unittest.main()
