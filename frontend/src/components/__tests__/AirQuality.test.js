import React from "react";
import { render } from "@testing-library/react";
import AirQuality from "../AirQuality";

describe("AirQuality", () => {
  const airQuality = {
    "2022-02-01": [10, 20, 30],
    "2022-02-02": [15, 25, 35],
  };
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

    expect(getAllByText("15")).toHaveLength(1);
    expect(getAllByText("25")).toHaveLength(1);
    expect(getAllByText("35")).toHaveLength(1);
  });
});
