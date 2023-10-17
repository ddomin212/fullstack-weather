/**
 * @file SignInButton.jsx is a React component that displays a sign-in button
 * and handles user authentication using Firebase Authentication.
 * @module SignInButton
 */

import React, { useEffect } from "react";
import { auth, provider } from "../services/firebaseService";
import { signInWithPopup, signOut } from "firebase/auth";
import { UilGoogle, UilUserMinus } from "@iconscout/react-unicons";
import { signOutUser, signInUser } from "../services/authService";

/**
 * Handles the sign-in process when the user clicks the sign-in button.
 * @param {Object} options - The options object.
 * @param {Function} options.setUserData - The function to set the user data in state variables.
 */
const handleSignIn = ({ setUserData }) => {
  signInWithPopup(auth, provider).then((result) =>
    signInUser({ result, setUserData })
  );
};

/**
 * Handles the sign-out process when the user clicks the sign-out button.
 * @param {Object} options - The options object.
 * @param {Function} options.setUserData - The function to set the user data in state variables.
 */
const handleSignOut = ({ setUserData }) => {
  signOut(auth).then(() => {
    signOutUser({ setUserData });
  });
};

/**
 * The SignInButton component.
 * @param {Object} props - The component props.
 * @param {Function} props.setUserData - The function to set the user data in state variables.
 * @param {Object} props.userData - The user data in state variables.
 * @returns {JSX.Element} - The SignInButton component.
 */
function SignInButton({ setUserData, userData }) {
  /**
   * Refreshes the user token on mount and returns an unsubscribe function.
   * @returns {Function} - The unsubscribe function.
   */

  return userData ? (
    <button
      className="text-red-300 transition ease-out hover:scale-125"
      onClick={(e) => handleSignOut({ e, setUserData })}
    >
      <UilUserMinus></UilUserMinus>
    </button>
  ) : (
    <button
      className="text-cyan-300 transition ease-out hover:scale-125"
      onClick={() => handleSignIn({ setUserData })}
    >
      <UilGoogle></UilGoogle>
    </button>
  );
}

export default SignInButton;
