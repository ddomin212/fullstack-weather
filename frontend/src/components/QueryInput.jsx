import React from "react";
import { UilSearch, UilLocationPoint } from "@iconscout/react-unicons";

/**
 * A component that allows the user to search for a city and get its weather information.
 *
 * @param {string} city - The name of the city to search for.
 * @param {function} setCity - A function that sets the value of the city input field.
 * @param {function} handleSearchClick - A function that is called when the search button is clicked.
 * @param {function} handleLocationClick - A function that is called when the location button is clicked.
 * @returns {JSX.Element} - The QueryInput component.
 */
function QueryInput({ city, setCity, handleSearchClick, handleLocationClick }) {
  return (
    <div className="flex flex-row w-3/4 items-center justify-center space-x-2">
      <input
        value={city}
        data-testid="search-input"
        onChange={(e) => setCity(e.currentTarget.value)}
        type="text"
        placeholder="Search for city...."
        className="text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase"
      />
      <UilSearch
        size={25}
        data-testid="search-button"
        className="text-white cursor-pointer transition ease-out hover:scale-125"
        onClick={handleSearchClick}
      />
      <UilLocationPoint
        size={25}
        data-testid="location-button"
        className="text-white cursor-pointer transition ease-out hover:scale-125"
        onClick={handleLocationClick}
      />
    </div>
  );
}

export default QueryInput;
