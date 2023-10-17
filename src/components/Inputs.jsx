import React, { useState, useCallback } from "react";
import { UilSearch, UilLocationPoint } from "@iconscout/react-unicons";
import { toast } from "react-toastify";
import SignInButton from "./SignInButton";

/**
 * Renders an inputs component.
 * @param {Object} props - The component props.
 * @param {Function} props.setQuery - The function to call when the query changes.
 * @param {string} props.units - The units to use for the weather data.
 * @param {Function} props.setUnits - The function to call when the units change.
 * @param {Function} props.setUserData - The function to call when the logged in state changes.
 * @param {string} props.userData - The user data.
 * @returns {JSX.Element} - The rendered inputs component.
 */
function Inputs({ setQuery, units, setUnits, setUserData, userData }) {
  const [city, setCity] = useState("");

  /**
   * Handles a change in the selected units.
   * @param {Object} e - The event object.
   */
  const handleUnitsChange = useCallback(
    (e) => {
      const selectedUnit = e.currentTarget.name;
      if (units !== selectedUnit) setUnits(selectedUnit);
    },
    [units]
  );

  /**
   * Handles a click on the search button.
   */
  const handleSearchClick = useCallback(() => {
    if (city !== "") setQuery({ city });
  }, [city]);

  /**
   * Handles a click on the location button.
   */
  const handleLocationClick = useCallback(() => {
    if (navigator.geolocation) {
      toast.info("Fetching users location.");
      navigator.geolocation.getCurrentPosition((position) => {
        toast.success("Location fetched!");
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        setQuery({
          lat,
          lon,
        });
      });
    }
  }, [setQuery]);

  /**
   * Renders the inputs component. TODO: tidy up the styling.
   * @returns {JSX.Element} - The rendered inputs component.
   */
  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-2">
        <input
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          type="text"
          placeholder="Search for city...."
          className="text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase"
        />
        <UilSearch
          size={25}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
          onClick={handleSearchClick}
        />
        <UilLocationPoint
          size={25}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
          onClick={handleLocationClick}
        />
      </div>

      <div className="flex flex-row w-1/4 items-center justify-center">
        <button
          name="metric"
          className="text-xl text-white font-light transition ease-out hover:scale-125"
          onClick={handleUnitsChange}
        >
          °C
        </button>
        <p className="text-xl text-white mx-3">|</p>
        <button
          name="imperial"
          className="text-xl text-white font-light transition ease-out hover:scale-125"
          onClick={handleUnitsChange}
        >
          °F
        </button>
      </div>

      <SignInButton setUserData={setUserData} userData={userData} />
    </div>
  );
}

export default Inputs;
