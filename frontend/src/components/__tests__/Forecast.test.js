import React from "react";
import { render, screen } from "@testing-library/react";
import Forecast from "../Forecast";

function forecastBuilder() {
  return [
    { title: "00:00", temp: 10, icon: "01d" },
    { title: "01:00", temp: 11, icon: "01d" },
    { title: "02:00", temp: 12, icon: "01d" },
    { title: "03:00", temp: 13, icon: "01d" },
    { title: "04:00", temp: 14, icon: "01d" },
    { title: "05:00", temp: 15, icon: "01d" },
    { title: "06:00", temp: 16, icon: "01d" },
    { title: "07:00", temp: 17, icon: "01d" },
    { title: "08:00", temp: 18, icon: "01d" },
    { title: "09:00", temp: 19, icon: "01d" },
  ];
}

describe("Forecast", () => {
  const title = "Test Forecast";
  const items = forecastBuilder();

  it("renders the component with the correct props", () => {
    const { getAllByText } = render(<Forecast title={title} items={items} />);

    expect(screen.getByText(title));

    const forecastItems = screen.getAllByTestId("forecast-item");
    expect(forecastItems).toHaveLength(6);

    for (let obj of items) {
      if (obj.temp < 16) {
        expect(screen.getByText(obj.title));
      }
    }
  });

  it("handles errors gracefully", () => {
    const { getByText } = render(
      <Forecast title={undefined} items={undefined} />
    );

    getByText("Forecast data not found.");
  });
});
