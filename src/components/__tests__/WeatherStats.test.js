import React from "react";
import { render } from "@testing-library/react";
import WeatherStats from "../WeatherStats";

describe("WeatherStats", () => {
  const stats = {
    feels_like: 20,
    humidity: 50,
    wind_speed: 10,
    units: {
      temperature: "C",
      wind_speed: "km/h",
      pressure: "hPa",
      distance: "km",
    },
    pressure: 1013,
    visibility: 10000,
    rain: 0,
  };

  it("renders the weather stats", () => {
    const { getByText } = render(<WeatherStats stats={stats} />);
    expect(getByText("RealFeel:"));
    expect(getByText("20°"));
    expect(getByText("Rain:"));
    expect(getByText("0 mm"));
    expect(getByText("Humidity:"));
    expect(getByText("50%"));
    expect(getByText("Wind:"));
    expect(getByText("10 km/h"));
    expect(getByText("Pressure:"));
    expect(getByText("1013 hPa"));
    expect(getByText("Visibility:"));
    expect(getByText("10 km"));
  });
});
