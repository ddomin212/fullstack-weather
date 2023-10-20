import { authRequest, signInUser, signOutUser } from "../authService";
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();

describe("authRequest", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("should make a POST request to the specified route with the user's token and refresh token", () => {
    const setUserData = jest.fn();
    fetch.mockResponseOnce(JSON.stringify({ tier: "paid" }));

    authRequest("auth", "abc123", "def456", "johndoe", setUserData);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("http://0.0.0.0:8000/auth");
    expect(fetch.mock.calls[0][1].method).toEqual("POST");
    expect(fetch.mock.calls[0][1].headers).toEqual({
      "Content-Type": "application/json",
      "X-CSRF-Token": "test",
    });
    expect(fetch.mock.calls[0][1].body).toEqual(
      JSON.stringify({ token: "abc123", refreshToken: "def456" })
    );
  });
});

describe("signOutUser", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("should make a GET request to the logout endpoint with the user's CSRF token", () => {
    const setUserData = jest.fn();
    fetch.mockResponseOnce(JSON.stringify({}), { status: 200 });

    signOutUser({ setUserData });

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("http://0.0.0.0:8000/logout");
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
    expect(fetch.mock.calls[0][1].headers).toEqual({
      "X-CSRFToken": "test",
    });
  });
});

describe("signInUser", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("should call authRequest with the user's token, refresh token, and display name", () => {
    const setUserData = jest.fn();
    const result = {
      _tokenResponse: { idToken: "abc123", refreshToken: "def456" },
      user: { displayName: "johndoe" },
    };
    fetch.mockResponseOnce(JSON.stringify({}), { status: 200 });

    signInUser({ result, setUserData });

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("http://0.0.0.0:8000/login");
    expect(fetch.mock.calls[0][1].method).toEqual("POST");
    expect(fetch.mock.calls[0][1].headers).toEqual({
      "Content-Type": "application/json",
      "X-CSRF-Token": "test",
    });
    expect(fetch.mock.calls[0][1].body).toEqual(
      JSON.stringify({ token: "abc123", refreshToken: "def456" })
    );
  });
});
