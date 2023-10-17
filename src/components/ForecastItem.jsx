import React from "react";
import { iconUrlFromCode } from "../utils/parsingUtils";

function ForecastItem({ item, index }) {
  return (
    <div key={index} className="flex flex-col items-center justify-center">
      <p className="font-light text-sm">{item.title}</p>
      <img src={iconUrlFromCode(item.icon)} className="w-12 my-1" alt="" />
      <p className="font-medium">{`${item.temp.toFixed()}°`}</p>
    </div>
  );
}

export default ForecastItem;
