import React from "react";
import { formatToLocalTime } from "../utils/timeUtils";
import { AIR_QUALITY_METRICS } from "../utils/settings";

/**
 * The component for displaying air quality data.
 * @param {object} props - The component props.
 * @param {object} props.airQuality - The air quality data.
 * @param {string} props.timezone - The timezone of the location.
 * @param {number} props.timestamp - The timestamp of the data.
 * @returns {JSX.Element} - The air quality component.
 */
function AirQuality({ airQuality, timezone, timestamp }) {
  const time = formatToLocalTime(timestamp, timezone, "yyyy-MM-dd");

  return airQuality ? (
    <div className="" data-testid="air-quality">
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
  ) : (
    <p>Air quality data not found.</p>
  );
}

export default AirQuality;
