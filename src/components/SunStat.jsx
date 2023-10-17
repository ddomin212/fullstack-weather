import React, { useMemo } from "react";
import { UilSun, UilSunset } from "@iconscout/react-unicons";

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

export default SunStat;
