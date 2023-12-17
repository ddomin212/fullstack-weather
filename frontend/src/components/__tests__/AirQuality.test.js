import React from "react";
import { render } from "@testing-library/react";
import AirQuality from "../AirQuality";

function buildAirQuality() {
  return {
    "2022-02-01": [10, 20, 30],
    "2022-02-02": [15, 25, 35],
  };
}

describe("AirQuality", () => {
  const airQuality = buildAirQuality();
  const timezone = 3600;
  const timestamp = 1643798400;

  it("renders the component with the correct props", () => {
    const { getAllByText } = render(
      <AirQuality
        airQuality={airQuality}
        timezone={timezone}
        timestamp={timestamp}
      />
    );

    for (let item in airQuality["2022-02-02"]) {
      expect(getAllByText(airQuality["2022-02-02"][item])).toHaveLength(1);
    }
  });

  it("handles errors gracefully", () => {
    const { getByText } = render(
      <AirQuality
        airQuality={undefined}
        timezone={timezone}
        timestamp={timestamp}
      />
    );

    getByText("Air quality data not found.");
  });
});
