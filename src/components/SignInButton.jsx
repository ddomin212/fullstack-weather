/**
 * @file SignInButton.jsx is a React component that displays a sign-in button
 * and handles user authentication using Firebase Authentication.
 * @module SignInButton
 */

import React, { useEffect } from "react";
import { UilGoogle, UilUserMinus } from "@iconscout/react-unicons";

/**
 * The SignInButton component.
 * @param {Object} props - The component props.
 * @param {Function} props.setUserData - The function to set the user data in state variables.
 * @param {Object} props.userData - The user data in state variables.
 * @returns {JSX.Element} - The SignInButton component.
 */
function SignInButton({ handleSignIn, handleSignOut, userData }) {
  /**
   * Refreshes the user token on mount and returns an unsubscribe function.
   * @returns {Function} - The unsubscribe function.
   */

  return userData ? (
    <button
      className="text-red-300 transition ease-out hover:scale-125"
      data-testid="sign-out-button"
      onClick={handleSignOut}
    >
      <UilUserMinus></UilUserMinus>
    </button>
  ) : (
    <button
      className="text-cyan-300 transition ease-out hover:scale-125"
      data-testid="sign-in-button"
      onClick={handleSignIn}
    >
      <UilGoogle></UilGoogle>
    </button>
  );
}

export default SignInButton;
