import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectOptions from "../SelectOptions";

describe("SelectOptions", () => {
  const setSelectedOption = jest.fn();
  const setTimeInterval = jest.fn();
  const units = {
    rain_prob: "%",
    temp: "°C",
    rain: "mm",
    snow: "cm",
    wind_speed: "m/s",
    pressure: "hPa",
    humidity: "%",
  };

  it("renders the select options components with the correct options and values", () => {
    render(
      <SelectOptions
        selectedOption="rain_prob"
        timeInterval="8"
        setSelectedOption={setSelectedOption}
        setTimeInterval={setTimeInterval}
        units={units}
      />
    );

    const select1 = screen.getByTestId("select-option");
    const select2 = screen.getByTestId("select-time-interval");
    const option1 = screen.getByText("Rain probability (%)");
    const option2 = screen.getByText("Rain amount (mm/h)");
    const option3 = screen.getByText("Pressure (hPa)");
    const timeInterval1 = screen.getByText("24h");
    const timeInterval2 = screen.getByText("48h");
    const timeInterval3 = screen.getByText("Daily");
    const timeInterval4 = screen.getByText("Yearly");

    expect(select1);
    expect(select2);
    expect(option1);
    expect(option2);
    expect(option3);
    expect(timeInterval1);
    expect(timeInterval2);
    expect(timeInterval3);
    expect(timeInterval4);
    expect(select1.value).toBe("rain_prob");
    expect(select2.value).toBe("8");
  });

  it("calls the handleSelectChange function when the selected value changes", () => {
    render(
      <SelectOptions
        selectedOption="rain_prob"
        timeInterval="8"
        setSelectedOption={setSelectedOption}
        setTimeInterval={setTimeInterval}
        units={units}
      />
    );

    const select1 = screen.getByTestId("select-option");
    const select2 = screen.getByTestId("select-time-interval");
    fireEvent.change(select1, { target: { value: "humidity" } });
    fireEvent.change(select2, { target: { value: "16" } });

    expect(setTimeInterval).toHaveBeenCalledWith("16");
    expect(setSelectedOption).toHaveBeenCalledWith("humidity");
  });
});
