import React from "react";
import { render } from "@testing-library/react";
import WeatherInfo from "../WeatherInfo";
import { UilCompress } from "@iconscout/react-unicons";

describe("WeatherInfo", () => {
  it("renders the weather information", () => {
    const label = "Temperature";
    const value = "20 C";
    const icon = <UilCompress size={18} className="mr-1" data-testid="icon" />;
    const { getByText, getByTestId } = render(
      <WeatherInfo icon={icon} value={value} label={label} />
    );
    expect(getByText("Temperature:"));
    expect(getByText("20 C"));
    expect(getByTestId("icon").getAttribute("xmlns")).toBe(
      "http://www.w3.org/2000/svg"
    );
  });
});
