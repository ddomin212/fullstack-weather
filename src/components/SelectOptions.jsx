import React, { useCallback } from "react";
import SelectItem from "./SelectItem";

/**
 * Renders a select options component.
 * @param {Object} props - The component props.
 * @param {string} props.selectedOption - The currently selected option.
 * @param {Function} props.setSelectedOption - The function to call when the selected option changes.
 * @param {string} props.timeInterval - The currently selected time interval.
 * @param {Function} props.setTimeInterval - The function to call when the selected time interval changes.
 * @param {Object} props.units - The units to use for the weather data.
 * @param {Function} props.handleSelectChange - The function to call when a select option changes.
 * @returns {JSX.Element} - The rendered select options component.
 */
function SelectOptions({
  selectedOption,
  setSelectedOption,
  timeInterval,
  setTimeInterval,
  units,
}) {
  const handleSelectChange = useCallback((event, setter) => {
    setter(event.target.value);
  }, []);

  const options = [
    { value: "rain_prob", label: "Rain probability (%)" },
    { value: "rain", label: "Rain amount (mm/h)" },
    { value: "pressure", label: "Pressure (hPa)" },
    { value: "humidity", label: "Humidity (%)" },
    { value: "clouds", label: "Clouds (%)" },
    { value: "wind_speed", label: `Wind (${units.wind_speed})` },
  ];

  const timeIntervalOptions = [
    { value: "8", label: "24h" },
    { value: "16", label: "48h" },
    { value: "daily", label: "Daily" },
    { value: "yearly", label: "Yearly" },
  ];

  /**
   * Renders the select options component.
   * @returns {JSX.Element} - The rendered select options component.
   */
  return (
    <>
      <div className="flex items-center justify-between mt-6">
        <SelectItem
          value={selectedOption}
          handleSelectChange={handleSelectChange}
          options={options}
          setter={setSelectedOption}
          data_testid={"select-option"}
        />
        <SelectItem
          value={timeInterval}
          handleSelectChange={handleSelectChange}
          options={timeIntervalOptions}
          setter={setTimeInterval}
          data_testid={"select-time-interval"}
        />
      </div>
    </>
  );
}

export default SelectOptions;
