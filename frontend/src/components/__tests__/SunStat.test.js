import React from "react";
import { render, screen } from "@testing-library/react";
import SunStat from "../SunStat";

describe("SunStat", () => {
  const icon = "sunrise";
  const label = "Sunrise";
  const value = "6:00 AM";

  it("renders the sun stat component with the correct icon, label, and value", () => {
    render(<SunStat icon={icon} label={label} value={value} />);

    const iconComponent = screen.getByTestId("sunrise-icon");
    const labelElement = screen.getByText("Sunrise:");
    const valueElement = screen.getByText("6:00 AM");

    expect(iconComponent);
    expect(labelElement);
    expect(valueElement);
  });
});
