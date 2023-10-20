import React from "react";

/**
 * Renders a select component.
 * @param {Object} props - The component props.
 * @param {string} props.value - The currently selected value.
 * @param {Function} props.onChange - The function to call when the selected value changes.
 * @param {Array} props.options - The options to display in the select.
 * @returns {JSX.Element} - The rendered select component.
 */
function SelectItem({
  value,
  handleSelectChange,
  options,
  setter,
  data_testid,
}) {
  /**
   * Renders the select component.
   * @returns {JSX.Element} - The rendered select component.
   */
  return (
    <select
      className="custom-select"
      value={value}
      onChange={(e) => handleSelectChange(e, setter)}
      data-testid={data_testid}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SelectItem;
