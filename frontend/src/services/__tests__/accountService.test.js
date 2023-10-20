import { buyPremium } from "../accountService";
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();

describe("buyPremium", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("should make a POST request to the payment endpoint with the user's token", async () => {
    const userData = { token: "abc123" };
    fetch.mockResponseOnce(
      JSON.stringify({ status_code: 200, url: "http://localhost:8000/payment" })
    );

    buyPremium({ userData });

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("http://0.0.0.0:8000/payment");
    expect(fetch.mock.calls[0][1].method).toEqual("POST");
    expect(fetch.mock.calls[0][1].headers).toEqual({
      "Content-Type": "application/json",
      "X-CSRF-Token": expect.any(String),
    });
    expect(fetch.mock.calls[0][1].body).toEqual(
      JSON.stringify({ token: "abc123" })
    );
  });

  it("should redirect the user to the payment URL if the request is successful", async () => {
    const userData = { token: "abc123" };
    fetchMock.mockResponseOnce(
      JSON.stringify({ status_code: 200, url: "http://localhost/" })
    );

    buyPremium({ userData });

    expect(window.location.href).toEqual("http://localhost/");
  });
});
