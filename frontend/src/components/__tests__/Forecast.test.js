import React from "react";
import { render, screen } from "@testing-library/react";
import Forecast from "../Forecast";

describe("Forecast", () => {
  const title = "Test Forecast";
  const items = [
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

  it("renders the component with the correct props", () => {
    const { getAllByText } = render(<Forecast title={title} items={items} />);

    expect(screen.getByText(title));

    const forecastItems = screen.getAllByTestId("forecast-item");
    expect(forecastItems).toHaveLength(6);

    expect(screen.getAllByText("00:00")).toHaveLength(1);
    expect(screen.getAllByText("01:00")).toHaveLength(1);
    expect(screen.getAllByText("02:00")).toHaveLength(1);
    expect(screen.getAllByText("03:00")).toHaveLength(1);
    expect(screen.getAllByText("04:00")).toHaveLength(1);
    expect(screen.getAllByText("05:00")).toHaveLength(1);

    expect(screen.queryAllByText("06:00")).toHaveLength(0);
  });
});
