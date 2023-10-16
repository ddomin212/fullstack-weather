import React from "react";
import { formatToLocalTime } from "../utils/timeUtils";
import { AIR_QUALITY_METRICS } from "../utils/settings";
import { useEffect, useState } from "react";

/**
 * Renders a forecast component.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the forecast.
 * @param {Array} props.items - The forecast data items to display.
 * @returns {JSX.Element} - The rendered forecast component.
 */
function AirQuality({ airQuality, timezone, timestamp }) {
  const time = formatToLocalTime(timestamp, timezone, "yyyy-MM-dd");

  return (
    <div className="">
      <div className="flex items-center justify-start mt-6">
        <p className="text-white font-medium uppercase">Air quality</p>
      </div>
      <hr className="my-2" />

      <div className="flex flex-row items-center justify-between text-white flex-wrap">
        {airQuality[time].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <p className="font-light text-sm">{AIR_QUALITY_METRICS[index]}</p>
            <p className="font-medium">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AirQuality;
