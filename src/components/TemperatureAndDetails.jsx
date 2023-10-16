import React from "react";
import { iconUrlFromCode } from "../utils/parsingUtils";
import WeatherStats from "./WeatherStats";
import SunStats from "./SunStats";

/**
 * Renders a temperature and details component.
 * @param {Object} props - The component props.
 * @param {Object} props.weather - The weather data to display.
 * @param {string} props.weather.weather_main - The main weather description.
 * @param {string} props.weather.weather_icon - The weather icon code.
 * @param {number} props.weather.temp - The current temperature.
 * @param {number} props.weather.temp_min - The minimum temperature for the day.
 * @param {number} props.weather.temp_max - The maximum temperature for the day.
 * @param {number} props.weather.sunrise - The sunrise time in Unix timestamp format.
 * @param {number} props.weather.sunset - The sunset time in Unix timestamp format.
 * @param {number} props.weather.wind_speed - The wind speed.
 * @param {number} props.weather.humidity - The humidity.
 * @param {number} props.weather.feels_like - The "feels like" temperature.
 * @param {string} props.weather.timezone - The timezone to use for the time values.
 * @param {number} props.weather.pressure - The atmospheric pressure.
 * @param {number} props.weather.visibility - The visibility.
 * @param {number} props.weather.rain - The amount of rain.
 * @param {Object} props.weather.units - The units to use for the weather data.
 * @returns {JSX.Element} - The rendered temperature and details component.
 */
function TemperatureAndDetails({
  weather: {
    weather_main,
    weather_icon,
    temp,
    temp_min,
    temp_max,
    sunrise,
    sunset,
    wind_speed,
    humidity,
    feels_like,
    timezone,
    pressure,
    visibility,
    rain,
    units,
  },
}) {
  /**
   * Renders the temperature and details component.
   * @returns {JSX.Element} - The rendered temperature and details component.
   */
  return (
    <div>
      <div className="flex items-center justify-center py-6 text-xl text-cyan-300">
        <p>{weather_main}</p>
      </div>

      <div className="flex flex-row items-center justify-between text-white py-3">
        <img src={iconUrlFromCode(weather_icon)} alt="" className="w-20" />
        <p className="text-5xl">{`${temp.toFixed()}°`}</p>
        <WeatherStats
          stats={{
            wind_speed,
            humidity,
            feels_like,
            pressure,
            visibility,
            rain,
            units,
          }}
        />
      </div>

      <SunStats
        sunrise={sunrise}
        sunset={sunset}
        temp_min={temp_min}
        temp_max={temp_max}
        timezone={timezone}
      />
    </div>
  );
}

export default TemperatureAndDetails;
