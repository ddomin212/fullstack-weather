import React from "react";
import ForecastItem from "./ForecastItem";
/**
 * Renders a forecast component.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the forecast.
 * @param {Array} props.items - The forecast data items to display.
 * @returns {JSX.Element} - The rendered forecast component.
 */
function Forecast({ title, items }) {
  return items ? (
    <div className="">
      <div className="flex items-center justify-start mt-6">
        <p className="text-white font-medium uppercase">{title}</p>
      </div>
      <hr className="my-2" />

      <div className="flex flex-row items-center justify-between text-white flex-wrap">
        {items?.slice(0, 6).map((item, index) => (
          <ForecastItem key={index} item={item} />
        ))}
      </div>
    </div>
  ) : (
    <p>Forecast data not found.</p>
  );
}

export default Forecast;
