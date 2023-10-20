import React from "react";
import { UilSearch, UilLocationPoint } from "@iconscout/react-unicons";

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
