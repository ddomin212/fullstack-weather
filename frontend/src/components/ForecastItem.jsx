import React from "react";
import { iconUrlFromCode } from "../utils/parsingUtils";
/**
 * Renders a single item in the forecast list.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.item - The forecast item to render.
 * @param {string} props.item.title - The title of the forecast item.
 * @param {string} props.item.icon - The code for the weather icon.
 * @param {number} props.item.temp - The temperature in degrees.
 * @param {number} props.index - The index of the item in the list.
 * @returns {JSX.Element} - The rendered component.
 */
function ForecastItem({ item, index }) {
  return (
    <div
      key={index}
      className="flex flex-col items-center justify-center"
      data-testid="forecast-item"
    >
      <p className="font-light text-sm">{item.title}</p>
      <img src={iconUrlFromCode(item.icon)} className="w-12 my-1" alt="" />
      <p className="font-medium">{`${item.temp.toFixed()}°`}</p>
    </div>
  );
}

export default ForecastItem;
