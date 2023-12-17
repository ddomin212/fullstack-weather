import { getCSRFToken } from "../utils/parsingUtils";
import { BACKEND_URL } from "../utils/settings";

/**
 * Sends a payment request to the server to buy a premium account for the user.
 * @param {Object} userData - The user data object containing the user's token.
 * @throws {Error} If the payment request fails or the response status is not 200.
 */
const buyPremium = ({ userData }) => {
  const token = userData.token;
  fetch(BACKEND_URL + "/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": getCSRFToken(),
    },
    body: JSON.stringify({ token }),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error("Error authenticating user.");
      }
    })
    .then((data) => {
      if (data.status_code === 200) {
        window.location.href = data.url;
      }
    });
};

export { buyPremium };
