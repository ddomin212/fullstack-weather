import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App component", () => {
  //   test("renders the main component of the weather app", () => {
  //     render(<App />);
  //     const bodyComponent = screen.getByRole("body");
  //     expect(bodyComponent).toBeInTheDocument();
  //   });

  test("fails to fetch the weather data because backend is not running", async () => {
    render(<App />);
    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    await act(async () => {
      userEvent.type(searchInput, "London");
      userEvent.click(searchButton);
    });
    const errorMessage = await screen.findAllByText(
      "Error fetching weather data."
    );

    expect(errorMessage);
  });

  test("failed fetch testing", async () => {
    render(<App />);
    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    await act(async () => {
      userEvent.type(searchInput, "London");
      userEvent.click(searchButton);
    });
    const errorMessage = await screen.findAllByText(
      "Error fetching weather data."
    );

    expect(errorMessage);
  });
});
