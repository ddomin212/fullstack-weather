/**
 * @file authService.js is a module that provides functions for user authentication
 * using Firebase Authentication and a custom backend API.
 * @module authService
 */
import { BACKEND_URL } from "../utils/settings";
import { auth } from "../services/firebaseService";
import { getCSRFToken } from "../utils/parsingUtils";

/**
 * Sends a request to the backend API to verify the user token and sets the user data state variable.
 * @param {string} route - The route to send the request to.
 * @param {string} token - The user token.
 * @param {string} refreshToken - The user refresh token.
 * @param {string} user - The user name.
 * @param {Function} setUserData - The function to set the user data.
 */
const authRequest = (route, token, refreshToken, user, setUserData) => {
  const csrf_token = getCSRFToken();
  fetch(BACKEND_URL + "/" + route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrf_token,
    },
    body: JSON.stringify({ token, refreshToken }),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error("Error authenticating user.");
      }
    })
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
  fetch(BACKEND_URL + "/logout", {
    method: "GET",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
  }).then((res) => {
    if (res.status === 200) {
      setUserData(null);
      console.log("Logged out!");
    } else {
      throw new Error("Error authenticating user.");
    }
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
      user
        .getIdToken()
        .then((token) => {
          authRequest(
            "refresh",
            token,
            refreshToken,
            user.displayName,
            setUserData
          );
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    } else {
      // User is signed out
      setUserData(null);
    }
  });

export { signInUser, signOutUser, refreshUserToken };
