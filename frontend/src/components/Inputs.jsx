import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import SignInButton from "./SignInButton";
import QueryInput from "./QueryInput";
import UnitsInput from "./UnitsInput";
import { auth, provider } from "../services/firebaseService";
import { signInWithPopup, signOut } from "firebase/auth";
import { signOutUser, signInUser } from "../services/authService";

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
   * Handles the sign-in process when the user clicks the sign-in button.
   * @param {Object} options - The options object.
   * @param {Function} options.setUserData - The function to set the user data in state variables.
   */
  const handleSignIn = useCallback(() => {
    signInWithPopup(auth, provider).then((result) =>
      signInUser({ result, setUserData })
    );
  }, [userData]);

  /**
   * Handles the sign-out process when the user clicks the sign-out button.
   * @param {Object} options - The options object.
   * @param {Function} options.setUserData - The function to set the user data in state variables.
   */
  const handleSignOut = useCallback(() => {
    signOut(auth).then(() => {
      signOutUser({ setUserData });
    });
  }, [userData]);

  /**
   * Handles a change in the selected units.
   * @param {Object} e - The event object.
   */
  const handleUnitsChange = useCallback(
    (selectedUnit) => {
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
   * Renders the inputs component.
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

      <SignInButton
        handleSignIn={handleSignIn}
        handleSignOut={handleSignOut}
        userData={userData}
      />
    </div>
  );
}

export default Inputs;
