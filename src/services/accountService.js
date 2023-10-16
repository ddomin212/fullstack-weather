const buyPremium = ({ userData, setUserData }) => {
  const token = userData?.token;
  fetch("http://192.168.50.47:8000/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status_code === 200) {
        window.location.href = data.url;
      }
    });
};

export { buyPremium };
