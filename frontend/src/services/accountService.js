import { getCSRFToken } from "../utils/parsingUtils";

const buyPremium = ({ userData }) => {
  const token = userData?.token;
  fetch("http://0.0.0.0:8000/payment", {
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
