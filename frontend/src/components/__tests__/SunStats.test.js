import React from "react";
import { render, screen } from "@testing-library/react";
import SunStats from "../SunStats";

describe("SunStats", () => {
  const sunrise = 1641016800;
  const sunset = 1641060000;
  const temp_min = 10;
  const temp_max = 20;
  const timezone = 3600;

  it("renders the sun stats component with the correct values", () => {
    render(
      <SunStats
        sunrise={sunrise}
        sunset={sunset}
        temp_min={temp_min}
        temp_max={temp_max}
        timezone={timezone}
      />
    );

    const sunriseElement = screen.getByText("07:00");
    const sunsetElement = screen.getByText("19:00");
    const tempMinElement = screen.getByText("10°");
    const tempMaxElement = screen.getByText("20°");

    expect(sunriseElement);
    expect(sunsetElement);
    expect(tempMinElement);
    expect(tempMaxElement);
  });
});
