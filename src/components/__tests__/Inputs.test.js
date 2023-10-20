import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Inputs from "../Inputs";

describe("Inputs", () => {
  const units = {
    rain_prob: "%",
    temp: "°C",
    rain: "mm",
    snow: "cm",
    wind_speed: "m/s",
    pressure: "hPa",
    humidity: "%",
  };
  const setQuery = jest.fn();
  const setUnits = jest.fn();
  const setCity = jest.fn();
  const setUserData = jest.fn();
  const userData = null;

  it("renders the component with the correct props", () => {
    render(
      <Inputs
        setQuery={setQuery}
        units={units}
        setUnits={setUnits}
        setUserData={setUserData}
        userData={userData}
      />
    );

    expect(screen.getAllByTestId("sign-in-button")).toHaveLength(1);
    expect(screen.getAllByTestId("search-input")).toHaveLength(1);
    expect(screen.getAllByTestId("search-button")).toHaveLength(1);
    expect(screen.getAllByTestId("location-button")).toHaveLength(1);
    expect(screen.getAllByTestId("imperial-switch")).toHaveLength(1);
    expect(screen.getAllByTestId("metric-switch")).toHaveLength(1);
    expect(screen.queryAllByTestId("sign-out-button")).toHaveLength(0);
  });

  it("calls the setQuery function when the city input changes and button for search is clicked", () => {
    render(
      <Inputs
        setQuery={setQuery}
        setCity={setCity}
        units={units}
        setUnits={setUnits}
        setUserData={setUserData}
        userData={userData}
      />
    );

    const cityInput = screen.getByTestId("search-input");
    fireEvent.change(cityInput, { target: { value: "London" } });
    const cityButton = screen.getByTestId("search-button");
    fireEvent.click(cityButton);

    expect(setQuery).toHaveBeenCalledWith({ city: "London" });
  });

  it("calls the setQuery function when the location button is clicked", () => {
    navigator.geolocation = {
      getCurrentPosition: jest.fn((callback) =>
        callback({
          coords: {
            latitude: 51.5074,
            longitude: -0.1278,
          },
        })
      ),
    };

    render(
      <Inputs
        setQuery={setQuery}
        units={units}
        setUnits={setUnits}
        setUserData={setUserData}
        userData={userData}
      />
    );

    const locationButton = screen.getByTestId("location-button");
    fireEvent.click(locationButton);

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    expect(setQuery).toHaveBeenCalledWith({
      lat: 51.5074,
      lon: -0.1278,
    });
  });
});
