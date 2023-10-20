import React from "react";
import { render, screen } from "@testing-library/react";
import ForecastItem from "../ForecastItem";

describe("ForecastItem", () => {
  const item = {
    title: "Monday",
    icon: "01d",
    temp: 20,
  };
  const index = 0;

  it("renders the title, icon, and temperature of the forecast item", () => {
    render(<ForecastItem item={item} index={index} />);

    const title = screen.getByText("Monday");
    const icon = screen.getByAltText("");
    const temperature = screen.getByText("20°");

    expect(title);
    expect(icon);
    expect(temperature);
    expect(icon.getAttribute("src")).toBe(
      "http://openweathermap.org/img/wn/01d@2x.png"
    );
  });
});
