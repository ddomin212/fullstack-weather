import React, { useMemo } from "react";
import { UilSun, UilSunset } from "@iconscout/react-unicons";
import { formatToLocalTime } from "../utils/timeUtils";

/**
 * Renders a sun stat component.
 * @param {Object} props - The component props.
 * @param {string} props.icon - The icon to display for the stat.
 * @param {string} props.label - The label for the stat.
 * @param {string} props.value - The value for the stat.
 * @returns {JSX.Element} - The rendered sun stat component.
 */
function SunStat({ icon, label, value }) {
  const iconComponents = useMemo(
    () => ({
      sunrise: <UilSun className="hidden sm:flex" />,
      sunset: <UilSunset className="hidden sm:flex" />,
    }),
    []
  );

  /**
   * Renders the sun stat component.
   * @returns {JSX.Element} - The rendered sun stat component.
   */
  return (
    <>
      {iconComponents[icon]}
      <p className="font-light">
        {label}: <span className="font-medium md:ml-1">{value}</span>
      </p>
    </>
  );
}

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
