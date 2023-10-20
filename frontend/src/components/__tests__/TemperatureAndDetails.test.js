import React from "react";
import { render } from "@testing-library/react";
import TemperatureAndDetails from "../TemperatureAndDetails";

describe("TemperatureAndDetails", () => {
  const weatherData = {
    weather_main: "Sunny",
    weather_icon: "01d",
    temp: 20,
    temp_min: 15,
    temp_max: 25,
    sunrise: 1627850400,
    sunset: 1627900800,
    wind_speed: 10,
    humidity: 50,
    feels_like: 22,
    timezone: 3600,
    pressure: 1013,
    visibility: 10,
    rain: 0,
    units: {
      temperature: "C",
      speed: "km/h",
      pressure: "hPa",
      distance: "km",
    },
  };

  it("renders the temperature and details", () => {
    const { getByText, getByAltText } = render(
      <TemperatureAndDetails weather={weatherData} />
    );
    expect(getByText("Sunny"));
    expect(getByText("20°"));
    expect(getByAltText("").getAttribute("src")).toBe(
      "http://openweathermap.org/img/wn/01d@2x.png"
    );
  });
});
