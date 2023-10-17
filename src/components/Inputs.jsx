import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import SignInButton from "./SignInButton";
import QueryInput from "./QueryInput";
import UnitsInput from "./UnitsInput";

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
      <QueryInput
        city={city}
        setCity={setCity}
        handleLocationClick={handleLocationClick}
        handleSearchClick={handleSearchClick}
      />

      <UnitsInput handleUnitsChange={handleUnitsChange} />

      <SignInButton setUserData={setUserData} userData={userData} />
    </div>
  );
}

export default Inputs;
