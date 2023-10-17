import React from "react";
import {
  UilTemperature,
  UilWater,
  UilWind,
  UilCompress,
  UilEye,
  UilRaindrops,
} from "@iconscout/react-unicons";

/**
 * Renders a weather stats component.
 * @param {Object} props - The component props.
 * @param {Object} props.stats - The weather stats to display.
 * @param {number} props.stats.feels_like - The "feels like" temperature.
 * @param {number} props.stats.humidity - The humidity.
 * @param {number} props.stats.wind_speed - The wind speed.
 * @param {Object} props.stats.units - The units to use for the weather data.
 * @param {number} props.stats.pressure - The atmospheric pressure.
 * @param {number} props.stats.visibility - The visibility.
 * @param {number} props.stats.rain - The amount of rain.
 * @returns {JSX.Element} - The rendered weather stats component.
 */
function WeatherStats({
  stats: {
    feels_like,
    humidity,
    wind_speed,
    units,
    pressure,
    rain,
    visibility,
  },
}) {
  const weatherInfoData = [
    [
      {
        icon: <UilTemperature size={18} className="mr-1" />,
        label: "RealFeel",
        value: `${feels_like.toFixed()}°`,
      },
      {
        icon: <UilWater size={18} className="mr-1" />,
        label: "Humidity",
        value: `${humidity.toFixed()}%`,
      },
      {
        icon: <UilWind size={18} className="mr-1" />,
        label: "Wind",
        value: `${wind_speed.toFixed()} ${units.wind_speed}`,
      },
    ],
    [
      {
        icon: <UilCompress size={18} className="mr-1" />,
        label: "Pressure",
        value: `${pressure.toFixed()} hPa`,
      },
      {
        icon: <UilRaindrops size={18} className="mr-1" />,
        label: "Rain",
        value: `${rain.toFixed()} mm`,
      },
      {
        icon: <UilEye size={18} className="mr-1" />,
        label: "Visibility",
        value: `${visibility.toFixed() / 1000} km`,
      },
    ],
  ];

  /**
   * The weather info data to display.
   * @property {JSX.Element} icon - The icon to display for the info.
   * @property {string} label - The label for the info.
   * @property {string} value - The value for the info.
   */
  function WeatherInfo({ icon, label, value }) {
    return (
      <div className="flex font-light text-sm items-center justify-start">
        {icon}
        {label}:<span className="font-medium ml-1">{value}</span>
      </div>
    );
  }

  /**
   * Renders the weather stats component.
   * @returns {JSX.Element} - The rendered weather stats component.
   */
  return (
    <>
      {weatherInfoData.map((col, idx1) => (
        <div
          className={`flex flex-col space-y-2 ${
            idx1 == 1 ? "hidden xs:flex" : ""
          }`}
        >
          {col.map((item, idx2) => (
            <WeatherInfo
              key={idx1 * 3 + idx2}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default WeatherStats;
