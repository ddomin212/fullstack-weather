import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QueryInput from "../QueryInput";

describe("QueryInput", () => {
  const setCity = jest.fn();
  const handleSearchClick = jest.fn();
  const handleLocationClick = jest.fn();

  it("calls the setCity function when the input value changes", () => {
    render(
      <QueryInput
        city=""
        setCity={setCity}
        handleSearchClick={handleSearchClick}
        handleLocationClick={handleLocationClick}
      />
    );

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "New York" } });

    expect(setCity).toHaveBeenCalledWith("New York");
  });

  it("calls the handleSearchClick function when the search button is clicked", () => {
    render(
      <QueryInput
        city=""
        setCity={setCity}
        handleSearchClick={handleSearchClick}
        handleLocationClick={handleLocationClick}
      />
    );

    const searchButton = screen.getByTestId("search-button");
    fireEvent.click(searchButton);

    expect(handleSearchClick).toHaveBeenCalled();
  });

  it("calls the handleLocationClick function when the location button is clicked", () => {
    render(
      <QueryInput
        city=""
        setCity={setCity}
        handleSearchClick={handleSearchClick}
        handleLocationClick={handleLocationClick}
      />
    );

    const locationButton = screen.getByTestId("location-button");
    fireEvent.click(locationButton);

    expect(handleLocationClick).toHaveBeenCalled();
  });
});
