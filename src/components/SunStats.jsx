import React from "react";
import { formatToLocalTime } from "../utils/timeUtils";
import SunStat from "./SunStat";

/**
 * Renders a sun stats component.
 * @param {Object} props - The component props.
 * @param {number} props.sunrise - The sunrise time in Unix timestamp format.
 * @param {number} props.sunset - The sunset time in Unix timestamp format.
 * @param {number} props.temp_min - The minimum temperature for the day.
 * @param {number} props.temp_max - The maximum temperature for the day.
 * @param {string} props.timezone - The timezone to use for the time values.
 * @returns {JSX.Element} - The rendered sun stats component.
 */
function SunStats({ sunrise, sunset, temp_min, temp_max, timezone }) {
  /**
   * Renders the sun stats component.
   * @returns {JSX.Element} - The rendered sun stats component.
   */
  return (
    <>
      <div className="flex flex-row items-center justify-center space-x-2 text-white text-sm py-3">
        <SunStat
          icon="sunrise"
          label="Rise"
          value={formatToLocalTime(sunrise, timezone, "HH:mm")}
        />
        <SunStat
          icon="sunset"
          label="Set"
          value={formatToLocalTime(sunset, timezone, "HH:mm")}
        />

        <p className="font-light">|</p>

        <SunStat icon="sunrise" label="Min" value={`${temp_min.toFixed()}°`} />

        <SunStat icon="sunset" label="Max" value={`${temp_max.toFixed()}°`} />
      </div>
    </>
  );
}

export default SunStats;
