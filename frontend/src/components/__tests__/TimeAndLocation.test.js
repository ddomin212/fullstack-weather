import React from "react";
import { render, screen } from "@testing-library/react";
import TimeAndLocation from "../TimeAndLocation";

describe("TimeAndLocation", () => {
  const weather = {
    dt: 1641016800,
    timezone: 3600,
    name: "New York",
  };
  const username = "John Doe";

  it("renders the time and location component with the correct values", () => {
    render(<TimeAndLocation weather={weather} username={username} />);

    const timeElement = screen.getByText("07:00");
    const locationElement = screen.getByText("New York");
    const usernameElement = screen.getByText("Welcome, John");

    expect(timeElement);
    expect(locationElement);
    expect(usernameElement);
  });
});
