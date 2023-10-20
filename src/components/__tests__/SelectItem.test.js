import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectItem from "../SelectItem";

describe("SelectItem", () => {
  const value = "option1";
  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];
  const handleSelectChange = jest.fn();
  const setTimeInterval = jest.fn();

  it("renders the select component with the correct options and value", () => {
    render(
      <SelectItem
        value={value}
        handleSelectChange={handleSelectChange}
        setter={setTimeInterval}
        options={options}
      />
    );

    const select = screen.getByRole("combobox");
    const option1 = screen.getByText("Option 1");
    const option2 = screen.getByText("Option 2");
    const option3 = screen.getByText("Option 3");

    expect(select);
    expect(option1);
    expect(option2);
    expect(option3);
    expect(select.value).toBe("option1");
  });

  it("calls the handleSelectChange function when the selected value changes", () => {
    render(
      <SelectItem
        value={value}
        handleSelectChange={handleSelectChange}
        setter={setTimeInterval}
        options={options}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "option2" } });
    console.log(select.value);

    expect(handleSelectChange).toHaveBeenCalled();
  });
});
