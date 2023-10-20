import unittest

from models.weather import CurrentWeather, Forecast, ThreeHourWeather
from utils.parsers.open_weather import OpenWeatherParser


class TestOpenWeatherParser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.parser = OpenWeatherParser()
        cls.mocked_current_weather_response = response = {
            "dt": 1631870400,
            "timezone": 3600,
            "main": {
                "temp": 20.0,
                "temp_min": 18.0,
                "temp_max": 22.0,
                "feels_like": 19.0,
                "pressure": 1013,
                "humidity": 50,
            },
            "coord": {"lat": 51.5074, "lon": 0.1278},
            "clouds": {"all": 75},
            "wind": {"speed": 5.0},
            "visibility": 10000,
            "weather": [
                {"main": "Clouds", "description": "broken clouds", "icon": "04d"}
            ],
            "sys": {"sunrise": 1631840000, "sunset": 1631880000},
        }
        cls.mocked_forecast_response = {
            "city": {
                "name": "London",
                "country": "GB",
                "coord": {"lat": 51.5074, "lon": 0.1278},
            },
            "list": [
                {
                    "dt": 1631870400,
                    "main": {
                        "temp": 20.0,
                        "temp_min": 18.0,
                        "temp_max": 22.0,
                        "feels_like": 19.0,
                        "pressure": 1013,
                        "humidity": 50,
                    },
                    "clouds": {"all": 75},
                    "wind": {"speed": 5.0},
                    "visibility": 10000,
                    "weather": [
                        {
                            "main": "Clouds",
                            "description": "broken clouds",
                            "icon": "04d",
                        }
                    ],
                    "sys": {"pod": "d"},
                    "pop": 0.0,
                    "dt_txt": "2021-09-17 12:00:00",
                },
                {
                    "dt": 1631956800,
                    "main": {
                        "temp": 22.0,
                        "temp_min": 20.0,
                        "temp_max": 24.0,
                        "feels_like": 21.0,
                        "pressure": 1012,
                        "humidity": 55,
                    },
                    "clouds": {"all": 50},
                    "wind": {"speed": 6.0},
                    "visibility": 10000,
                    "weather": [
                        {
                            "main": "Clouds",
                            "description": "scattered clouds",
                            "icon": "03d",
                        }
                    ],
                    "sys": {"pod": "d"},
                    "pop": 0.0,
                    "dt_txt": "2021-09-18 12:00:00",
                },
            ],
        }

    def test_current_weather(self):
        current_weather = self.parser.current_weather(
            self.mocked_current_weather_response
        )

        expected_current_weather = CurrentWeather(
            dt=1631870400,
            timezone=3600,
            temp=20.0,
            feels_like=19.0,
            temp_min=18.0,
            temp_max=22.0,
            pressure=1013,
            humidity=50,
            lat=51.5074,
            lon=0.1278,
            wind_speed=5.0,
            rain=0,
            clouds=75,
            weather_main="Clouds",
            weather_description="broken clouds",
            weather_icon="04d",
            sunrise=1631840000,
            sunset=1631880000,
            visibility=10000,
            description="broken clouds",
            icon="04d",
        )
        self.assertEqual(current_weather, expected_current_weather)

    def test_forecast(self):
        forecast = self.parser.forecast(self.mocked_forecast_response)

        self.assertIsInstance(forecast, Forecast)

        expected_forecast = ThreeHourWeather(
            dt=1631870400,
            temp=20.0,
            feels_like=19.0,
            temp_min=18.0,
            temp_max=22.0,
            pressure=1013,
            humidity=50,
            wind_speed=5.0,
            rain=0,
            clouds=75,
            weather_main="Clouds",
            weather_description="broken clouds",
            weather_icon="04d",
            pod="d",
            rain_prob=0.0,
            dt_txt="2021-09-17 12:00:00",
            visibility=10000,
        )

        self.assertEqual(forecast.forecasts[0], expected_forecast)


if __name__ == "__main__":
    unittest.main()
