import "resize-observer-polyfill";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Line } from "react-chartjs-2";
import ChartView from "../ChartView";

jest.mock("react-chartjs-2", () => ({
  Line: jest.fn(() => null),
}));

describe("ChartView", () => {
  const items = [
    { title: "00:00", rain_prob: 0.1, temp: 10 },
    { title: "01:00", rain_prob: 0.2, temp: 11 },
    { title: "02:00", rain_prob: 0.3, temp: 12 },
  ];
  const daily = [
    { title: "00:00", rain_prob: 0.1, temp: 10 },
    { title: "01:00", rain_prob: 0.2, temp: 11 },
    { title: "02:00", rain_prob: 0.3, temp: 12 },
  ];
  const yearly = [
    { title: "January", rain_prob: 0.1, rain: 10, snow: 20 },
    { title: "February", rain_prob: 0.1, rain: 15, snow: 25 },
    { title: "March", rain_prob: 0.1, rain: 20, snow: 30 },
  ];
  const units = {
    rain_prob: "%",
    temp: "°C",
    rain: "mm",
    snow: "cm",
    wind_speed: "m/s",
    pressure: "hPa",
    humidity: "%",
  };

  it("renders the component with the correct props", async () => {
    const { getByText } = render(
      <ChartView items={items} daily={daily} yearly={yearly} units={units} />
    );

    expect(getByText("Rain probability (%)"));
    expect(getByText("Rain amount (mm/h)"));
    expect(getByText("Pressure (hPa)"));
    expect(getByText("Humidity (%)"));

    await waitFor(() => {
      const chartData = Line.mock.calls[0][0].data;

      expect(chartData.datasets[0].data).toEqual(null);
      expect(chartData.labels).toEqual(null);
    });
  });

  it("graceful when undefined", async () => {
    const { getByText } = render(
      <ChartView
        items={undefined}
        daily={undefined}
        yearly={undefined}
        units={undefined}
      />
    );
  });
});
