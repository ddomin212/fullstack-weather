import React, { useState, useEffect, useCallback } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import {
  createChartData,
  chartOptions,
  setXYValues,
} from "../utils/chartUtils";
import SelectOptions from "./SelectOptions";

/**
 * Renders a weather chart component.
 * @param {Object} props - The component props.
 * @param {Array} props.items - The weather data items to display on the chart.
 * @param {Array} props.daily - The daily weather data items to display on the chart.
 * @param {Object} props.units - The units to use for the weather data.
 * @returns {JSX.Element} - The rendered weather chart component.
 */
function WeatherChart({ items, daily, yearly, units }) {
  /**
   * The currently selected option for the chart.
   * @type {string}
   */
  const [selectedOption, setSelectedOption] = useState("rain_prob");

  /**
   * The time interval to display on the chart.
   * @type {string}
   */
  const [timeInterval, setTimeInterval] = useState("8");

  /**
   * The Y-axis values for the chart.
   * @type {Array}
   */
  const [yValues, setYValues] = useState(null);

  /**
   * The X-axis values for the chart.
   * @type {Array}
   */
  const [xValues, setXValues] = useState(null);

  /**
   * Sets the X and Y axis values for the chart.
   * @param {Object} params - The function parameters.
   * @param {Array} params.items - The weather data items to display on the chart.
   * @param {string} params.selectedOption - The currently selected option for the chart.
   * @param {Function} params.setXValues - The function to set the X-axis values for the chart.
   * @param {Function} params.setYValues - The function to set the Y-axis values for the chart.
   */
  const setXYValuesCallback = useCallback(
    ({ items, selectedOption, setXValues, setYValues }) => {
      setXYValues({
        items,
        selectedOption,
        setXValues,
        setYValues,
      });
    },
    []
  );

  /**
   * Sets the X and Y axis values for the chart when the component mounts or updates.
   */
  useEffect(() => {
    let chartValues;

    if (timeInterval === "yearly") {
      chartValues = yearly;
    } else if (timeInterval === "daily") {
      chartValues = daily;
    } else {
      chartValues = items.slice(0, Number(timeInterval));
    }

    setXYValuesCallback({
      items: chartValues,
      selectedOption,
      setXValues,
      setYValues,
    });
  }, [selectedOption, timeInterval, units]);

  /**
   * Renders the weather chart component.
   * @returns {JSX.Element} - The rendered weather chart component with option select.
   */
  return (
    yearly && (
      <div
        className="mt-10 items-center justify-center"
        data-testid="chart-view"
      >
        <div className="items-center justify-start mt-6">
          <p className="text-white font-medium uppercase">Chart View</p>
        </div>

        <hr className="my-2" />

        <SelectOptions
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          timeInterval={timeInterval}
          setTimeInterval={setTimeInterval}
          units={units}
        />

        <div className="mt-2">
          <Line
            data-testid="chart-js"
            data={createChartData(xValues, yValues, selectedOption)}
            options={chartOptions}
          />
        </div>
      </div>
    )
  );
}

export default WeatherChart;
