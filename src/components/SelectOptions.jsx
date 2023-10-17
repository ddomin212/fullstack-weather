import React from "react";

/**
 * Renders a select component.
 * @param {Object} props - The component props.
 * @param {string} props.value - The currently selected value.
 * @param {Function} props.onChange - The function to call when the selected value changes.
 * @param {Array} props.options - The options to display in the select.
 * @returns {JSX.Element} - The rendered select component.
 */
function Select({ value, onChange, options }) {
  /**
   * Renders the select component.
   * @returns {JSX.Element} - The rendered select component.
   */
  return (
    <select className="custom-select" value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

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
  handleSelectChange,
}) {
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
        <Select
          value={selectedOption}
          onChange={(e) => handleSelectChange(e, setSelectedOption)}
          options={options}
        />
        <Select
          value={timeInterval}
          onChange={(e) => handleSelectChange(e, setTimeInterval)}
          options={timeIntervalOptions}
        />
      </div>
    </>
  );
}

export default SelectOptions;
