import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UnitsInput from "../UnitsInput";

describe("UnitsInput", () => {
  const handleUnitsChange = jest.fn();

  it("calls the handleUnitsChange function when the metric button is clicked", () => {
    render(<UnitsInput handleUnitsChange={handleUnitsChange} />);

    const metricButton = screen.getByTestId("metric-switch");
    fireEvent.click(metricButton);

    expect(handleUnitsChange).toHaveBeenCalledWith("metric");
  });

  it("calls the handleUnitsChange function when the imperial button is clicked", () => {
    render(<UnitsInput handleUnitsChange={handleUnitsChange} />);

    const imperialButton = screen.getByTestId("imperial-switch");
    fireEvent.click(imperialButton);

    expect(handleUnitsChange).toHaveBeenCalledWith("imperial");
  });
});
