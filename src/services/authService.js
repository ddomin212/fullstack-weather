/**
 * @file authService.js is a module that provides functions for user authentication
 * using Firebase Authentication and a custom backend API.
 * @module authService
 */
import { BACKEND_URL } from "../utils/settings";
import { auth } from "../services/firebaseService";

/**
 * Sends a request to the backend API to verify the user token and sets the user data state variable.
 * @param {string} route - The route to send the request to.
 * @param {string} token - The user token.
 * @param {string} refreshToken - The user refresh token.
 * @param {string} user - The user name.
 * @param {Function} setUserData - The function to set the user data.
 */
const authRequest = (route, token, refreshToken, user, setUserData) => {
  fetch(BACKEND_URL + "/" + route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, refreshToken }),
  })
    .then((res) => res.json())
    .then((data) => {
      setUserData({
        user,
        tier: data.tier,
        token,
        refreshToken,
      });
    });
};

/**
 * Signs in the user using Firebase Authentication and sends the user token and
 * refresh token to the backend API for verification.
 * @param {Object} options - The options object.
 * @param {Object} options.result - The result object from Firebase Authentication.
 * @param {Function} options.setUserData - The function to set the user data.
 */
const signInUser = ({ result, setUserData }) => {
  const { idToken: token, refreshToken } = result._tokenResponse;
  const user = result.user.displayName;
  authRequest("login", token, refreshToken, user, setUserData);
};

/**
 * Signs out the user and sends a request to the backend API to invalidate the user token.
 * @param {Object} options - The options object.
 * @param {Function} options.setUserData - The function to set the user data.
 */
const signOutUser = ({ setUserData }) => {
  fetch(BACKEND_URL + "/logout").then((res) => {
    setUserData(null);
    console.log("Logged out!");
  });
};

/**
 * Refreshes the user token by sending a request to the backend API to refresh the token.
 * @param {Object} options - The options object.
 * @param {Function} options.setUserData - The function to set the user data.
 * @returns {Function} - The unsubscribe function.
 */
const refreshUserToken = ({ setUserData }) =>
  auth.onIdTokenChanged((user) => {
    if (user) {
      const refreshToken = user.refreshToken;
      user.getIdToken().then((token) => {
        authRequest(
          "refresh",
          token,
          refreshToken,
          user.displayName,
          setUserData
        );
      });
    } else {
      // User is signed out
      setUserData(null);
    }
  });

export { signInUser, signOutUser, refreshUserToken };
