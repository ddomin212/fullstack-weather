from datetime import date

from models.weather import AirQuality, ClimateStats


class OpenMeteoParser:
    @staticmethod
    def historical_data(
        response: dict[str, list[float | int | str] | float | int | str]
    ) -> ClimateStats:
        """Parses the historical data to only get the same day throughout the years

        Args:
            response: response from API call (daily weather data for a location)

        Returns:
            dict: yearly data for the same day
        """
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

    @staticmethod
    def air_quality(
        response: dict[str, list[float | int | str] | float | int | str]
    ) -> AirQuality:
        """Gets the air quality data and parses it to get the highest AQI for each day (5 day forecast)

        Args:
            response: response from API call (hourly air quality data for a location)

        Returns:
            air_quality: highest AQI for each day
        """
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
