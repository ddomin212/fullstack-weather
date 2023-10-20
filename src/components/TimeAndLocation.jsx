import React from "react";
import { formatToLocalTime } from "../utils/timeUtils";

/**
 * Renders a time and location component.
 * @param {Object} props - The component props.
 * @param {Object} props.weather - The weather data to display.
 * @param {number} props.weather.dt - The current time in Unix timestamp format.
 * @param {string} props.weather.timezone - The timezone to use for the time value.
 * @param {string} props.weather.name - The name of the location.
 * @returns {JSX.Element} - The rendered time and location component.
 */
function TimeAndLocation({ weather: { dt, timezone, name }, username }) {
  /**
   * Renders the time and location component.
   * @returns {JSX.Element} - The rendered time and location component.
   */
  return (
    <div>
      <div
        data-testid="welcome-message"
        className="flex items-center justify-center text-center my-3"
      >
        <p className="text-cyan-200 text-xl font-extralight">{`Welcome, ${
          username ? username.split(" ")[0] : "User"
        }`}</p>
      </div>
      <div
        data-testid="local-time"
        className="flex items-center justify-center my-6"
      >
        <p className="text-white text-xl font-extralight">
          {formatToLocalTime(dt, timezone)}
        </p>
      </div>
      <div className="flex items-center justify-center text-center my-3">
        <p className="text-white text-3xl font-medium">{`${name}`}</p>
      </div>
    </div>
  );
}

export default TimeAndLocation;
