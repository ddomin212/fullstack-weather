from models.weather import CurrentWeather, Forecast


class OpenWeatherParser:
    @staticmethod
    def current_weather(
        response: dict[str, int | list[dict[str, str]] | dict[str, float | int]]
    ) -> CurrentWeather:
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

    @staticmethod
    def forecast(
        response: dict[
            str,
            dict[str, str]
            | list[dict[str, int | list[dict[str, str]] | dict[str, float | int]]],
        ],
    ) -> Forecast:
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
