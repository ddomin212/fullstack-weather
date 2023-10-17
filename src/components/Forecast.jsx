import React from "react";
import { iconUrlFromCode } from "../utils/parsingUtils";
import { useEffect, useState } from "react";

/**
 * Renders a forecast component.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the forecast.
 * @param {Array} props.items - The forecast data items to display.
 * @returns {JSX.Element} - The rendered forecast component.
 */
function Forecast({ title, items }) {
  return (
    <div className="">
      <div className="flex items-center justify-start mt-6">
        <p className="text-white font-medium uppercase">{title}</p>
      </div>
      <hr className="my-2" />

      <div className="flex flex-row items-center justify-between text-white flex-wrap">
        {items.slice(0, 6).map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <p className="font-light text-sm">{item.title}</p>
            <img
              src={iconUrlFromCode(item.icon)}
              className="w-12 my-1"
              alt=""
            />
            <p className="font-medium">{`${item.temp.toFixed()}°`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
