import React from "react";

/**
 * The weather info data to display.
 * @property {JSX.Element} icon - The icon to display for the info.
 * @property {string} label - The label for the info.
 * @property {string} value - The value for the info.
 */
function WeatherInfo({ icon, label, value }) {
  return (
    <div
      data-testid={`weather-info-${label.toLowerCase()}`}
      className="flex font-light text-sm items-center justify-start"
    >
      {icon}
      {label}:<span className="font-medium ml-1">{value}</span>
    </div>
  );
}

export default WeatherInfo;
